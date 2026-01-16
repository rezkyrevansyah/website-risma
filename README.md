# Website Risma

A modern, high-performance portfolio website with a fully integrated Content Management System (CMS), built using Next.js 16, Supabase, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **State Management & Forms:** React Hook Form, Zod
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Editor:** [TipTap](https://tiptap.dev/)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- npm, yarn, pnpm, or bun

## 📦 Installation Guide

Follow these steps to set up the project on your local machine:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd website-risma
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials.
You can copy the example file:
```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
```
> **Note:** Ensure you use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` as configured in the project source, not just `ANON_KEY`.

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.

## 📂 Project Structure

- `src/app`: App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and Supabase configuration.
- `public`: Static assets.
