# Todify - Modern Todo List PWA

A modern, feature-rich Todo List Progressive Web App built with React, TypeScript, and Supabase. Supports offline access, drag-and-drop task management, bulk actions, and smooth animations.

## 🚀 Install as App

**Todify is now installable on all devices!**

- 📱 **Android**: Tap the "Install App" button in the header
- 🍎 **iPhone/iPad**: Tap Share → Add to Home Screen
- 💻 **Windows PC**: Tap the "Install App" button - creates a desktop app
- 🖥️ **Mac/Linux**: Tap the "Install App" button - adds to applications

Once installed, the app works completely offline with all your data stored locally!

[📖 PWA Setup Guide →](PWA_SETUP.md)

## ✨ Live Features

- ✅ Add, edit, and delete tasks
- ✅ Mark tasks as complete
- ✅ Urgency/priority styling per task
- ✅ Drag-and-drop task reordering
- ✅ Multi-select with bulk actions
- ✅ Filter tasks (All / Active / Completed)
- ✅ **🔌 Offline support via PWA service worker**
- ✅ Smooth animations powered by Framer Motion
- ✅ **📲 Install on mobile, tablet, or desktop**
- ✅ Responsive design for all screen sizes
- ✅ Dark/Light theme support

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | Radix UI + shadcn/ui |
| Animations | Framer Motion |
| Drag & Drop | dnd-kit |
| Backend / DB | Supabase |
| Forms | React Hook Form + Zod |
| PWA | vite-plugin-pwa |

## Project Structure

```
├── public/               # Static assets
├── src/
│   ├── components/
│   │   ├── todo/         # Todo-specific components
│   │   │   ├── BulkActions.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── TodoEditDialog.tsx
│   │   │   ├── TodoFilters.tsx
│   │   │   ├── TodoInput.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   └── TodoList.tsx
│   │   └── ui/           # Reusable UI components (shadcn/ui)
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom hooks (useTodos, etc.)
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components (Dashboard, NotFound)
│   ├── services/         # Supabase service layer
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Getting Started

### Requirements

- Node.js >= 20
- npm >= 10

### Installation

```bash
# Clone the repository
git clone https://github.com/Dr-MAhmed/mytodoapp.git
cd mytodoapp

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production

```bash
npm run build
```

## GitHub

[https://github.com/Dr-MAhmed/mytodoapp](https://github.com/Dr-MAhmed/mytodoapp)
