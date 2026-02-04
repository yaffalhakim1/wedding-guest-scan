# Netlify Deployment Guide

This project is set up for automatic deployment to **Netlify** using GitHub Actions.

## 1. GitHub Secrets Setup

Go to your GitHub Repository Settings > Secrets and variables > Actions, and add the following **Repository secrets**:

| Secret Name          | Description                              | Where to find it?                                             |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| `NETLIFY_AUTH_TOKEN` | nfp_HYQKVGVQ9DX41H85p19ZWrabvztLjCeS7d0e | Netlify User Settings > Applications > Personal access tokens |
| `NETLIFY_SITE_ID`    | The unique ID of your site               | Netlify Site Settings > General > Site information > Site ID  |

## 2. SPA Routing (Already Handled)

I have created a `netlify.toml` file in the root directory. This tells Netlify to redirect all traffic to `index.html`, which is required for React Router (like `/guests` or `/invitation/:id`) to work without 404 errors.

## 3. How to Deploy

1. Create a new site on Netlify (you can do this by connecting your GitHub repo).
2. Get the `SITE_ID` and `AUTH_TOKEN` and add them to GitHub Secrets.
3. Simply push your changes to the `main` branch:

```bash
git add .
git commit -m "chore: switch to netlify deployment"
git push origin main
```

The GitHub Action will build and deploy your site automatically with HTTPS enabled.
