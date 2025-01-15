{
  "name": "virtual-pro-tour",
  "private": false,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && git add docs -f && git commit -m \"Deploy to GitHub Pages\" && git push"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "papaparse": "^5.4.1",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "gh-pages": "^5.0.0",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.3.2",
    "vite": "^4.3.2"
  }
}
