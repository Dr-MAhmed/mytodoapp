# Task: Implement Todify PWA Todo List Application

## Plan
- [x] Initialize Project Structure and Types
  - [x] Define `Todo` type in `@/types/todo.ts`
  - [x] Create `use-todos` hook for local storage persistence
- [x] Create Core Components
  - [x] `TodoLayout`: Main layout with App Bar and responsive design
  - [x] `TodoInput`: Task creation area with expandability
  - [x] `TodoList`: Drag-and-drop enabled task list
  - [x] `TodoItem`: Individual task card with completion, priority, and actions
  - [x] `TodoFilters`: Filtering and sorting logic
  - [x] `TodoEditDialog`: Modal for editing task details
- [x] Implement Business Logic
  - [x] Task completion and strikethrough animation
  - [x] Color-coded due date urgency
  - [x] Drag-and-drop reordering
  - [x] Undo deletion snackbar
  - [x] Bulk actions
- [x] PWA Configuration
  - [x] Create `public/manifest.webmanifest`
  - [x] Add Service Worker for offline support
  - [x] Update `vite.config.ts` if possible (though I might manually register SW)
- [x] Final Polishing
  - [x] Add empty state illustration
  - [x] Ensure dark mode works seamlessly
  - [x] Responsive design check (Mobile Adaptive)
  - [x] Run `npm run lint` and fix issues

## Notes
- Persistence: Using `localStorage` as requested.
- DND: Use `@dnd-kit`.
- Animations: Use `framer-motion` (already in `motion` package).
- Due Date: Urgency logic (Overdue = red, Today = amber, Future = neutral).
