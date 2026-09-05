# Design Document: Todo List Life Dashboard

## Overview

The Todo List Life Dashboard is a client-side only productivity web application that combines four main features into a single-page interface:

1. **Time Display & Greeting** — Real-time clock with time-based personalized greeting
2. **Focus Timer** — 25-minute Pomodoro timer with start/stop/reset controls
3. **Task Management** — Full CRUD operations for to-do items with local storage persistence
4. **Quick Links** — Save and organize favorite website URLs

The application runs entirely in the browser using HTML5, CSS3, and Vanilla JavaScript with no backend dependency. Data persistence is handled via the browser's Local Storage API.

---

## Architecture

### High-Level Architecture

The application follows a component-based architecture where each feature is isolated into logical modules that share a common state layer.

```
┌─────────────────────────────────────────────┐
│                  index.html                  │
│  (Container for all UI components)          │
└─────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌─────────┐   ┌──────────┐   ┌──────────┐
   │ Greeting│   │  Timer   │   │  Tasks   │
   │ Module  │   │  Module  │   │  Module  │
   └─────────┘   └──────────┘   └──────────┘
        │              │              │
        └──────────────┼──────────────┘
                       ▼
              ┌────────────────┐
              │  State Manager │
              │ (Local Storage)│
              └────────────────┘
```

### Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| **Greeting Module** | Determines time period, updates greeting text based on current hour |
| **Clock Module** | Updates time/date display every second |
| **Timer Module** | Manages 25-minute countdown, handles start/stop/reset logic |
| **Tasks Module** | CRUD operations for tasks, renders task list |
| **QuickLinks Module** | CRUD operations for URLs, renders clickable link buttons |
| **State Manager** | Abstracts Local Storage operations for all modules |

---

## Components and Interfaces

### UI Components

The Dashboard consists of five primary UI component groups, each with specific DOM elements and event handlers.

#### 1. Greeting Component

| Element ID | Type | Purpose |
|------------|------|---------|
| `greeting` | `<h1>` | Displays time-based greeting text |
| `date` | `<span>` | Shows current date |
| `time` | `<span>` | Shows current time |

**Event Handlers:**
- `ClockModule.startClock()` — Sets up 1-second interval to update time/date

#### 2. Timer Component

| Element ID | Type | Purpose |
|------------|------|---------|
| `timer-display` | `<div>` | Shows countdown in MM:SS format |
| `timer-start` | `<button>` | Starts the countdown |
| `timer-stop` | `<button>` | Pauses the countdown |
| `timer-reset` | `<button>` | Resets to 25:00 |

**Event Handlers:**
- `TimerModule.start()` — Starts countdown on click
- `TimerModule.stop()` — Pauses countdown on click
- `TimerModule.reset()` — Resets timer on click
- `TimerModule.tick()` — Internal handler called every second

#### 3. Task Input Component

| Element ID | Type | Purpose |
|------------|------|---------|
| `task-input` | `<input type="text">` | Text entry for new task |
| `task-add` | `<button>` | Adds task to list |
| `task-list` | `<ul>` | Container for task items |

**Event Handlers:**
- `TasksModule.addTask()` — Triggered by button click or Enter key
- `TasksModule.toggleTask()` — Triggered by checkbox/button click
- `TasksModule.editTask()` — Triggered by edit button click
- `TasksModule.saveTask()` — Triggered by save button click
- `TasksModule.deleteTask()` — Triggered by delete button click

#### 4. Quick Link Input Component

| Element ID | Type | Purpose |
|------------|------|---------|
| `link-label` | `<input type="text">` | Label text entry |
| `link-url` | `<input type="url">` | URL entry |
| `link-add` | `<button>` | Adds link to list |
| `quick-links` | `<div>` | Container for link buttons |

**Event Handlers:**
- `QuickLinksModule.addLink()` — Triggered by button click
- `QuickLinksModule.openLink()` — Triggered by link button click
- `QuickLinksModule.deleteLink()` — Triggered by delete button click

### Public Module APIs

#### StateManager Module

```javascript
class StateManager {
  // Load data from Local Storage
  // @param key: string - storage key
  // @returns: parsed data or null
  static load(key: string): any

  // Save data to Local Storage
  // @param key: string - storage key
  // @param data: any - data to stringify and store
  // @returns: void
  static save(key: string, data: any): void

  // Generate unique identifier
  // @returns: string - timestamp-based ID
  static generateId(): string
}
```

#### GreetingModule

```javascript
// Get greeting based on hour
// @param hour: number - hour of day (0-23)
// @returns: string - "Good Morning|Afternoon|Evening|Night"
getGreeting(hour: number): string

// Update greeting in DOM based on current time
updateGreeting(): void
```

#### ClockModule

```javascript
// Start real-time clock updates
// @param interval: number - update interval in ms (default: 1000)
// @returns: void
startClock(interval?: number): void

// Format date for display
// @param date: Date
// @returns: string - "Monday, January 15, 2024"
formatDate(date: Date): string

// Format time for display (12-hour with AM/PM)
// @param date: Date
// @returns: string - "2:30 PM"
formatTime(date: Date): string
```

#### TimerModule

```javascript
// Initialize timer display
init(): void

// Start countdown
start(): void

// Pause countdown
stop(): void

// Reset to 25:00
reset(): void

// Format seconds to MM:SS
// @param seconds: number
// @returns: string
formatTime(seconds: number): string

// Get current time remaining
// @returns: number - seconds remaining
getTimeRemaining(): number
```

#### TasksModule

```javascript
// Add new task
// @param text: string - task description
// @returns: void
addTask(text: string): void

// Toggle task completion
// @param id: string - task ID
// @returns: void
toggleTask(id: string): void

// Enter edit mode
// @param id: string - task ID
// @returns: void
editTask(id: string): void

// Save edited task
// @param id: string - task ID
// @param newText: string - updated text
// @returns: void
saveTask(id: string, newText: string): void

// Delete task
// @param id: string - task ID
// @returns: void
deleteTask(id: string): void

// Load tasks from storage
loadTasks(): Task[]

// Render tasks to DOM
renderTasks(): void
```

#### QuickLinksModule

```javascript
// Add new quick link
// @param label: string - display name
// @param url: string - target URL
// @returns: void
addLink(label: string, url: string): void

// Open URL in new tab
// @param url: string
// @returns: void
openLink(url: string): void

// Delete quick link
// @param id: string - link ID
// @returns: void
deleteLink(id: string): void

// Validate URL format
// @param url: string
// @returns: boolean
isValidUrl(url: string): boolean

// Load links from storage
loadLinks(): QuickLink[]

// Render links to DOM
renderLinks(): void
```

### Interface Contracts

| Contract | Description |
|----------|-------------|
| **State Manager ↔ Local Storage** | All modules use StateManager to persist data. Data is JSON-stringified before storage and parsed on retrieval. |
| **Tasks Module ↔ UI** | TasksModule provides renderTasks() which rebuilds the task list DOM. UI events call module methods to modify state. |
| **QuickLinks Module ↔ UI** | Similar to Tasks - renderLinks() rebuilds DOM, UI events trigger module methods. |
| **Timer ↔ Clock** | Timer uses setInterval internally. When timer reaches zero, it emits no further ticks. |
| **Greeting ↔ Clock** | GreetingModule.updateGreeting() is called within ClockModule's interval to check for hour changes. |

---

## Data Models

### Task Object

```javascript
{
  id: string,          // UUID or timestamp-based unique identifier
  text: string,        // Task description (1-500 characters)
  completed: boolean,  // Completion status
  createdAt: number    // Unix timestamp of creation
}
```

**Storage Key:** `dashboard_tasks`  
**Format:** JSON stringified array of Task objects

### Quick Link Object

```javascript
{
  id: string,      // UUID or timestamp-based unique identifier
  label: string,   // Display name for the link (1-100 characters)
  url: string      // Valid URL string (must start with http:// or https://)
}
```

**Storage Key:** `dashboard_quick_links`  
**Format:** JSON stringified array of Quick Link objects

### Timer State (Optional Persistence)

```javascript
{
  timeRemaining: number,  // Seconds remaining (0-1500)
  isRunning: boolean,     // Timer active state
  lastUpdated: number     // Unix timestamp for state validation
}
```

**Storage Key:** `dashboard_timer_state`

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the acceptance criteria analysis, this feature involves primarily UI rendering and simple CRUD operations. However, there are a few areas where universally quantifiable properties can be tested to ensure correctness.

### Property 1: Time-Based Greeting Coverage

*For any* hour value (0-23), the GreetingModule SHALL return exactly one of the four greeting messages: "Good Morning", "Good Afternoon", "Good Evening", or "Good Night"

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 2: Task Storage Round-Trip

*For any* valid task object (with id, text, completed, createdAt), when the task is saved to Local Storage using `StateManager.save('dashboard_tasks', tasks)` and then loaded using `StateManager.load('dashboard_tasks')`, the loaded task SHALL be equivalent to the original task.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4**

### Property 3: Quick Link Storage Round-Trip

*For any* valid quick link object (with id, label, url), when the link is saved to Local Storage using `StateManager.save('dashboard_quick_links', links)` and then loaded using `StateManager.load('dashboard_quick_links')`, the loaded link SHALL be equivalent to the original link.

**Validates: Requirements 15.1, 15.2, 15.3, 15.4**

### Property 4: Timer Format Preservation

*For any* number of seconds (0-1500), when formatted using `TimerModule.formatTime(seconds)`, the output SHALL match the pattern `^([0-9]{2}):([0-9]{2})$` where the first group is minutes (0-25) and the second group is seconds (00-59).

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: Task List Order Preservation

*For any* task list where tasks are added in sequence, rendering the list SHALL display tasks in the same order they were created (oldest first).

**Validates: Requirements 6.1, 6.2, 6.3**

---

## UI Component Structure

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Todo List Life Dashboard</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="dashboard-container">
    <!-- Header: Greeting & Clock -->
    <header class="dashboard-header">
      <h1 id="greeting">Good Morning</h1>
      <div id="datetime">
        <span id="date"></span>
        <span id="time"></span>
      </div>
    </header>

    <!-- Focus Timer Section -->
    <section class="timer-section">
      <h2>Focus Timer</h2>
      <div class="timer-display" id="timer-display">25:00</div>
      <div class="timer-controls">
        <button id="timer-start">Start</button>
        <button id="timer-stop">Stop</button>
        <button id="timer-reset">Reset</button>
      </div>
    </section>

    <!-- Tasks Section -->
    <section class="tasks-section">
      <h2>Tasks</h2>
      <div class="task-input">
        <input type="text" id="task-input" placeholder="Add a new task...">
        <button id="task-add">Add</button>
      </div>
      <ul id="task-list" class="task-list"></ul>
    </section>

    <!-- Quick Links Section -->
    <section class="links-section">
      <h2>Quick Links</h2>
      <div class="link-input">
        <input type="text" id="link-label" placeholder="Link label">
        <input type="url" id="link-url" placeholder="https://example.com">
        <button id="link-add">Add Link</button>
      </div>
      <div id="quick-links" class="quick-links-grid"></div>
    </section>
  </div>

  <script src="js/app.js"></script>
</body>
</html>
```

### CSS Structure (css/style.css)

| Section | Key Classes |
|---------|-------------|
| **Container** | `.dashboard-container` — Main wrapper, max-width, centered |
| **Header** | `.dashboard-header` — Flexbox for greeting/clock layout |
| **Timer** | `.timer-section`, `.timer-display`, `.timer-controls` |
| **Tasks** | `.tasks-section`, `.task-input`, `.task-list`, `.task-item`, `.task-completed` |
| **Quick Links** | `.links-section`, `.link-input`, `.quick-links-grid`, `.quick-link-btn` |

---

## Function Signatures and Logic Flow

### State Manager Functions

```javascript
// Load data from Local Storage
StateManager.load(key: string): any

// Save data to Local Storage
StateManager.save(key: string, data: any): void

// Generate unique ID
StateManager.generateId(): string
```

### Greeting Module Functions

```javascript
// Determine greeting based on hour (0-23)
GreetingModule.getGreeting(hour: number): string

// Update greeting text in DOM
GreetingModule.updateGreeting(): void
```

### Clock Module Functions

```javascript
// Format date for display
ClockModule.formatDate(date: Date): string

// Format time for display (12-hour with AM/PM)
ClockModule.formatTime(date: Date): string

// Start the clock update interval
ClockModule.startClock(updateInterval: number): void
```

### Timer Module Functions

```javascript
// Initialize timer display
TimerModule.init(): void

// Start countdown
TimerModule.start(): void

// Pause countdown
TimerModule.stop(): void

// Reset to 25:00
TimerModule.reset(): void

// Internal: decrement timer and update display
TimerModule.tick(): void

// Format seconds to MM:SS
TimerModule.formatTime(seconds: number): string
```

### Tasks Module Functions

```javascript
// Create new task from input
TasksModule.addTask(text: string): void

// Render all tasks to DOM
TasksModule.renderTasks(): void

// Toggle task completion status
TasksModule.toggleTask(id: string): void

// Enter edit mode for a task
TasksModule.editTask(id: string): void

// Save edited task text
TasksModule.saveTask(id: string, newText: string): void

// Delete a task
TasksModule.deleteTask(id: string): void

// Load tasks from storage
TasksModule.loadTasks(): Task[]

// Save tasks to storage
TasksModule.saveTasks(): void
```

### Quick Links Module Functions

```javascript
// Add new quick link
QuickLinksModule.addLink(label: string, url: string): void

// Render all links to DOM
QuickLinksModule.renderLinks(): void

// Open URL in new tab
QuickLinksModule.openLink(url: string): void

// Delete a quick link
QuickLinksModule.deleteLink(id: string): void

// Validate URL format
QuickLinksModule.isValidUrl(url: string): boolean

// Load links from storage
QuickLinksModule.loadLinks(): QuickLink[]

// Save links to storage
QuickLinksModule.saveLinks(): void
```

### Initialization Flow

```javascript
// app.js main initialization
function init() {
  // 1. Initialize clock (starts auto-updating)
  ClockModule.startClock(1000);

  // 2. Initialize greeting
  GreetingModule.updateGreeting();

  // 3. Initialize timer
  TimerModule.init();

  // 4. Load and render tasks
  TasksModule.loadTasks();
  TasksModule.renderTasks();

  // 5. Load and render quick links
  QuickLinksModule.loadLinks();
  QuickLinksModule.renderLinks();

  // 6. Attach event listeners
  attachEventListeners();
}
```

---

## Error Handling

### Input Validation

| Operation | Validation Rule | Error Handling |
|-----------|-----------------|----------------|
| **Add Task** | Text must be non-empty after trim | Show inline error, prevent add |
| **Edit Task** | Text must be non-empty after trim | Keep edit mode, show error |
| **Add Quick Link** | URL must be valid format | Show inline error, prevent add |
| **Add Quick Link** | Label must be non-empty | Show inline error, prevent add |

### Local Storage Errors

| Scenario | Handling |
|----------|----------|
| Storage quota exceeded | Show user-friendly alert, suggest clearing old data |
| Storage unavailable (private browsing) | Show warning, continue with in-memory only |
| Corrupted JSON data | Reset to empty array, log error |

### Timer Edge Cases

| Scenario | Handling |
|----------|----------|
| Tab becomes inactive | Continue countdown using timestamp comparison on focus |
| Browser throttles interval | Use performance.now() delta to ensure accurate time |

---

## Testing Strategy

### Why Property-Based Testing Does Not Apply

This feature is primarily a **UI rendering and simple CRUD application**. The main operations involve:

- DOM manipulation (rendering tasks, links, timer display)
- Simple create/read/update/delete operations on local arrays
- Event handling for user interactions

These are not suitable for property-based testing because:
1. **UI rendering** — Visual output cannot be meaningfully tested with PBT; snapshot tests are more appropriate
2. **Simple CRUD** — No transformation logic; example-based tests cover the functionality
3. **No complex input space** — The input variations don't reveal edge cases through randomization

### Testing Approach

#### Unit Tests (Example-Based)

| Component | Test Cases |
|-----------|------------|
| **Greeting Module** | Morning (9am), Afternoon (2pm), Evening (6pm), Night (10pm) |
| **Clock Module** | Format time shows AM/PM correctly, date formats correctly |
| **Timer Module** | Start initiates countdown, stop pauses, reset returns to 25:00, reaches 00:00 and stops |
| **Tasks Module** | Add task, toggle completion, edit task, delete task, persist to storage |
| **Quick Links Module** | Add valid link, add invalid URL, delete link, open link |
| **State Manager** | Save and load round-trip, handle missing keys |

#### Integration Tests

| Test | Description |
|------|-------------|
| **Full Task Flow** | Add task → verify in DOM → toggle complete → reload page → verify persistence |
| **Full Link Flow** | Add link → verify button → click → verify new tab → delete → verify removed |
| **Timer Persistence** | Start timer → wait 5 seconds → reload page → verify time remaining |

### Test Execution

Since this is a vanilla JavaScript project without a test framework, tests can be run using:

1. **Browser Console** — Manual testing via browser DevTools
2. **Simple Test Runner** — A minimal test harness in `js/test.js` using console assertions

For a production setup, consider adding a framework like **Vitest** or **Jest** for automated testing.

---

## Visual Design Guidelines

### Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Background | Off-white | `#f5f5f5` |
| Card Background | White | `#ffffff` |
| Primary Text | Dark Gray | `#333333` |
| Secondary Text | Medium Gray | `#666666` |
| Accent/Primary | Teal | `#008080` |
| Success/Done | Green | `#28a745` |
| Danger/Delete | Red | `#dc3545` |
| Border | Light Gray | `#ddd` |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Greeting | System Sans-Serif | 32px | Bold |
| Date/Time | System Sans-Serif | 18px | Normal |
| Timer Display | Monospace | 64px | Bold |
| Task Text | System Sans-Serif | 16px | Normal |
| Button Text | System Sans-Serif | 14px | Medium |

### Spacing

- Section padding: 24px
- Card margin: 16px
- Element gap: 12px
- Button padding: 8px 16px
- Input padding: 10px 12px
- Border radius: 8px

---

## Browser Compatibility

The application uses only standard web APIs with broad support:

| API | Browser Support |
|-----|-----------------|
| `localStorage` | All modern browsers (IE8+) |
| `JSON.parse/stringify` | All modern browsers (IE8+) |
| `setInterval` | All browsers |
| `document.getElementById` | All browsers |
| `addEventListener` | All modern browsers (IE9+) |
| `window.open` | All browsers |

For IE9 support, add EventListener polyfill.

---

## File Summary

| File | Purpose |
|------|---------|
| `index.html` | Main HTML structure with all UI components |
| `css/style.css` | All styling, responsive design, animations |
| `js/app.js` | Application logic, modules, event handling |

---

## Future Enhancements (Out of Scope)

The following features are not included in this version but could be added later:

- Task categories/tags
- Task due dates
- Multiple timer presets (Pomodoro, custom durations)
- Quick link categories/folders
- Theme switching (light/dark)
- Export/import data
- Keyboard shortcuts