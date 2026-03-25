# Requirements Document

## 1. Application Overview
- **App Name:** Todify
- **Description:** A modern, Progressive Web App (PWA) todo list application that allows users to create, manage, and track their tasks with a clean and intuitive interface. The app supports offline usage, home screen installation, and delivers a native-app-like experience across devices.

---

## 2. Users & Use Cases
- **Target Users:** Individuals looking for a fast, modern task management tool accessible from any device.
- **Core Use Cases:**
  - Create and manage daily todos
  - Track task completion status
  - Organize tasks by priority or category
  - Access todos offline via PWA capabilities

---

## 3. Page Structure & Core Features

### 3.1 Page Overview
```
Todify (PWA)
├── Main Page (Todo Dashboard)
│   ├── Header / App Bar
│   ├── Task Input Area
│   ├── Filter & Sort Bar
│   └── Task List
└── Task Detail / Edit Panel (slide-in or modal)
```

### 3.2 Main Page — Todo Dashboard

**Header / App Bar**
- Display app name/logo
- Show current date
- Toggle between light and dark mode

**Task Input Area**
- Prominent input field with placeholder text (e.g., \"Add a new task...\")
- Optional fields on expand: due date picker, priority selector (Low / Medium / High), category/tag label
- Submit via Enter key or a styled Add button
- Smooth animation on task creation

**Filter & Sort Bar**
- Filter tabs: All / Active / Completed
- Sort options: By creation date, due date, priority
- Task count badge per filter tab

**Task List**
- Each task card displays:
  - Checkbox to toggle completion (with strikethrough animation on completion)
  - Task title
  - Due date (if set), shown with color-coded urgency (overdue = red, today = amber, future = neutral)
  - Priority badge (color-coded: Low = green, Medium = blue, High = red)
  - Category/tag chip (if set)
  - Edit icon and Delete icon
- Drag-and-drop reordering of tasks
- Empty state illustration when no tasks exist
- Bulk action: select multiple tasks to delete or mark complete

### 3.3 Task Detail / Edit Panel
- Slide-in side panel or modal triggered by clicking the edit icon
- Editable fields: title, due date, priority, category/tag, optional notes field
- Save and Cancel actions
- Delete task option within panel

---

## 4. Business Rules & Logic

- **Task Completion:** Checking a task marks it complete; unchecking restores it to active. Completed tasks move to the bottom of the list or remain in place depending on sort order.
- **Due Date Urgency Logic:**
  - Overdue (past due date, not completed): highlighted in red
  - Due today: highlighted in amber
  - Future due date: neutral styling
- **Priority Ordering:** When sorted by priority, High > Medium > Low.
- **Persistence:** All tasks are persisted in the browser's local storage to ensure data survives page refreshes and is available offline.
- **Dark Mode:** User's theme preference is saved and restored on next visit.
- **PWA Behavior:**
  - Service worker caches app shell and task data for full offline functionality
  - Web App Manifest configured with app name, icons, theme color, and display mode (standalone)
  - Install prompt shown to eligible users (Add to Home Screen)

---

## 5. Exceptions & Edge Cases

| Scenario | Handling |
|---|---|
| Empty task title on submit | Prevent submission; show inline validation message |
| Task title exceeds 200 characters | Truncate input at 200 characters; show character counter |
| No tasks in current filter view | Display empty state illustration with contextual message |
| Deleting a task | Show brief undo snackbar (5-second window to reverse deletion) |
| Offline state | App fully functional via service worker cache; no network error shown |
| Duplicate task title | Allow duplicates; no restriction |

---

## 6. Acceptance Criteria

- Users can create a task with a title and optional due date, priority, and category
- Tasks persist across page refreshes via local storage
- Completed tasks display with strikethrough styling and are filterable
- Filter tabs (All / Active / Completed) correctly segment the task list
- Sort by date and priority functions correctly
- Dark mode toggle works and preference is saved
- App is installable as a PWA with a valid Web App Manifest and service worker
- App loads and functions fully offline after first visit
- Drag-and-drop reordering updates task order persistently
- Undo deletion snackbar appears and successfully restores the task within 5 seconds
- Due date urgency color coding renders correctly based on current date

---

## 7. Out of Scope (This Release)

- User authentication or multi-account support
- Cloud sync or backend data storage
- Recurring tasks or reminders/push notifications
- Subtasks or nested task hierarchies
- Collaboration or task sharing features
- Calendar view
- Mobile native app (iOS/Android)