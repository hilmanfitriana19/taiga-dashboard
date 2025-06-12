# TAIGA DASHBOARD

This project was initially bootstrapped using [Bolt](https://bolt.new/) and has since been modified to fit specific system requirements and implementation scenarios within our environment.


## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Continuous Deployment

Changes merged into the `main` branch are automatically deployed to
GitHub Pages. The workflow defined in `.github/workflows/gh-pages.yml`
builds the site and pushes the contents of the `dist` directory to the
`gh-pages` branch whenever a pull request targeting `main` is merged or
when commits are pushed directly to `main`.
