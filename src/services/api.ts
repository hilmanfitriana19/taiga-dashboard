import axios, { AxiosRequestConfig } from 'axios';
import { Project, UserStory, Task, ApiResponse, Status, Priority } from '../types';

// Create axios instance
const createApiClient = (baseURL: string, authToken: string) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });

  // Intercept responses
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle token expiration
      if (error.response && error.response.status === 401) {
        // Clear local storage and redirect to login
        localStorage.removeItem('taiga_token');
        localStorage.removeItem('taiga_user');
        localStorage.removeItem('taiga_url');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// API Service class
export class TaigaApiService {
  private apiClient: ReturnType<typeof createApiClient>;
  
  constructor(baseURL: string, authToken: string) {
    this.apiClient = createApiClient(baseURL, authToken);
  }

  // Projects
  async getProjects(): Promise<Project[]> {

    const savedUser = localStorage.getItem('taiga_user');
    const userId = JSON.parse(savedUser || '{}').id;
    let url = '/api/v1/projects';
    if (userId){
      url += `?member=${userId}`;
    }
    const response = await this.apiClient.get(url);
    return response.data.map((project: any) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description || '',
      isPrivate: project.is_private,
      createdDate: project.created_date,
      logoUrl: project.logo_big_url,
    }));
  }

  async getProject(id: number): Promise<Project> {
    const response = await this.apiClient.get(`/api/v1/projects/${id}`);
    const project = response.data;
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description || '',
      isPrivate: project.is_private,
      createdDate: project.created_date,
      logoUrl: project.logo_big_url,
    };
  }

  // User Stories
  async getProjectUserStories(projectId: number, ownerId = null): Promise<UserStory[]> {
    let url = `/api/v1/userstories?project=${projectId}&order_by=-created_date`;
    if (ownerId) {
      url += `&owner=${ownerId}`;
    }
    const response = await this.apiClient.get(url);

    return response.data.map((story: any) => ({
      id: story.id,
      ref: story.ref,
      title: story.subject,
      description: story.description || '',
      status: story.status_extra_info?.name || '',
      statusId: story.status,
      projectId: story.project,
      projectName: story.project_extra_info?.name,
      createdDate: story.created_date,
      modifiedDate: story.modified_date,
      assignedTo: story.assigned_to,
      assignedToName: story.assigned_to_extra_info?.full_name_display,
      priority: story.priority,
      priorityName: story.priority_extra_info?.name,
      totalPoints: story.total_points,
      startDate: story.start_date,
      finishDate: story.finish_date,
      versionStory: story.version || 1,
      versionAttribute: story.custom_attributes_version || 1,
    }));
  }

  async getUserStory(id: number): Promise<UserStory> {
    const [storyResponse, customAttributesResponse] = await Promise.all([
      this.apiClient.get(`/api/v1/userstories/${id}`),
      this.apiClient.get(`/api/v1/userstories/custom-attributes-values/${id}`)
    ]);

    const story = storyResponse.data;
    const customAttributes = customAttributesResponse.data;

    return {
      id: story.id,
      ref: story.ref,
      title: story.subject,
      description: story.description || '',
      status: story.status_extra_info?.name || '',
      statusId: story.status,
      projectId: story.project,
      projectName: story.project_extra_info?.name,
      createdDate: story.created_date,
      modifiedDate: story.modified_date,
      assignedTo: story.assigned_to,
      assignedToName: story.assigned_to_extra_info?.full_name_display,
      priority: story.priority ?? 439, // Default priority if not set
      priorityName: story.priority_extra_info?.name,
      customAttributes: customAttributes.attributes_values,
      timestamps: parseInt(customAttributes.attributes_values?.['1338'] || '0', 10),
      startDate: customAttributes.attributes_values?.['1339'] || null,
      finishDate: customAttributes.attributes_values?.['1340'] || null,
      versionStory: story.version || 1,
      versionAttribute: customAttributes.version || 1,
    };
  }

  async createUserStory(story: Partial<UserStory>): Promise<UserStory> {
    const response = await this.apiClient.post('/api/v1/userstories', {
      subject: story.title,
      description: story.description,
      project: story.projectId,
      status: story.statusId,
      assigned_to: story.assignedTo,
      priority: story.priority,
    });
    
    // Update custom attributes if provided
    if (story.timestamps || story.startDate || story.finishDate) {
      await this.apiClient.patch(`/api/v1/userstories/custom-attributes-values/${response.data.id}`, {
        attributes_values: {
          '1338': story.timestamps || 0,
          '1339': story.startDate || null,
          '1340': story.finishDate || null,
        },
      });
    }
    
    return this.getUserStory(response.data.id);
  }

  async updateUserStory(id: number, story: Partial<UserStory>): Promise<UserStory> {
    // Update story details
    await this.apiClient.patch(`/api/v1/userstories/${id}`, {
      subject: story.title,
      description: story.description,
      status: story.statusId,
      assigned_users: [story.assignedTo],
      priority: story.priority,
      version: (story.versionStory) ? story.versionStory : 1,
    });

    // Update custom attributes
    const payloadAttribute = {
      attributes_values: {
        '1338': story.timestamps || 0,
      },
      version: (story.versionAttribute) ? story.versionAttribute : 1,
    };

    // Add start date if available
    if (story.startDate) {
      payloadAttribute.attributes_values['1339'] = story.startDate;
    }
    
    if (story.finishDate) {
      payloadAttribute.attributes_values['1340'] = story.finishDate;
    }

    await this.apiClient.patch(`/api/v1/userstories/custom-attributes-values/${id}`, payloadAttribute);
    
    return this.getUserStory(id);
  }

  // Tasks
  async getProjectTasks(projectId: number): Promise<Task[]> {
    const response = await this.apiClient.get(`/api/v1/tasks?project=${projectId}`);
    return response.data.map((task: any) => ({
      id: task.id,
      ref: task.ref,
      title: task.subject,
      description: task.description || '',
      status: task.status_extra_info?.name || '',
      statusId: task.status,
      projectId: task.project,
      userStoryId: task.user_story,
      userStoryTitle: task.user_story_extra_info?.subject,
      createdDate: task.created_date,
      modifiedDate: task.modified_date,
      dueDate: task.due_date,
      assignedTo: task.assigned_to,
      assignedToName: task.assigned_to_extra_info?.full_name_display,
    }));
  }

  async getTask(id: number): Promise<Task> {
    const response = await this.apiClient.get(`/api/v1/tasks/${id}`);
    const task = response.data;
    return {
      id: task.id,
      ref: task.ref,
      title: task.subject,
      description: task.description || '',
      status: task.status_extra_info?.name || '',
      statusId: task.status,
      projectId: task.project,
      userStoryId: task.user_story,
      userStoryTitle: task.user_story_extra_info?.subject,
      createdDate: task.created_date,
      modifiedDate: task.modified_date,
      dueDate: task.due_date,
      assignedTo: task.assigned_to,
      assignedToName: task.assigned_to_extra_info?.full_name_display,
    };
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await this.apiClient.post('/api/v1/tasks', {
      subject: task.title,
      description: task.description,
      project: task.projectId,
      status: task.statusId,
      user_story: task.userStoryId,
      assigned_to: task.assignedTo,
      due_date: task.dueDate,
    });
    
    return this.getTask(response.data.id);
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const response = await this.apiClient.patch(`/api/v1/tasks/${id}`, {
      subject: task.title,
      description: task.description,
      status: task.statusId,
      user_story: task.userStoryId,
      assigned_to: task.assignedTo,
      due_date: task.dueDate,
    });
    
    return this.getTask(response.data.id);
  }

  // Status and Priorities
  async getProjectUserStoryStatuses(projectId: number): Promise<Status[]> {
    const response = await this.apiClient.get(`/api/v1/userstory-statuses?project=${projectId}`);
    return response.data.map((status: any) => ({
      id: status.id,
      name: status.name,
      color: status.color,
      order: status.order,
    }));
  }

  async getProjectTaskStatuses(projectId: number): Promise<Status[]> {
    const response = await this.apiClient.get(`/api/v1/task-statuses?project=${projectId}`);
    return response.data.map((status: any) => ({
      id: status.id,
      name: status.name,
      color: status.color,
      order: status.order,
    }));
  }

  async getProjectPriorities(projectId: number): Promise<Priority[]> {
    const response = await this.apiClient.get(`/api/v1/priorities?project=${projectId}`);
    return response.data.map((priority: any) => ({
      id: priority.id,
      name: priority.name,
      color: priority.color,
      order: priority.order,
    }));
  }

  // Project members
  async getProjectMembers(projectId: number): Promise<any[]> {
    const response = await this.apiClient.get(`/api/v1/memberships?project=${projectId}`);
    return response.data.map((member: any) => ({
      id: member.user,
      fullName: member.full_name || member.user_extra_info?.full_name_display || member.user_extra_info?.username,
      username: member.user_extra_info?.username,
      email: member.user_extra_info?.email,
      role: member.role_name,
    }));
  }
}

// Helper function to create API service
export const createTaigaApiService = () => {
  const token = localStorage.getItem('taiga_token');
  const taigaUrl = localStorage.getItem('taiga_url');
  
  if (!token || !taigaUrl) {
    throw new Error('No authentication token or Taiga URL found');
  }
  
  return new TaigaApiService(taigaUrl, token);
};