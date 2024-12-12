### run commands:

```bash
pnpm create vite@latest
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


# add these to src/index.css

@tailwind base;
@tailwind components;
@tailwind utilities;

# add these to tailwind.config.js

  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],

# Edit tsconfig.json file
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }


# Edit tsconfig.json and tsconfig.app.json

"compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }


# install types
pnpm i -D @types/node

# Update vite.config.ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

pnpm i lucide-react

# run cli shadcn

pnpm dlx shadcn@latest init

# to add component
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add --all

```