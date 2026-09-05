/**
 * Todo List Life Dashboard - Vanilla JavaScript
 * A productivity dashboard with clock, focus timer, tasks, and quick links
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const STORAGE_KEYS = {
    TASKS: 'dashboard_tasks',
    QUICK_LINKS: 'dashboard_quick_links',
    TIMER_STATE: 'dashboard_timer_state',
    THEME: 'dashboard_theme',
    USER_NAME: 'dashboard_user_name',
    TIMER_DURATION: 'dashboard_timer_duration'
};

const StateManager = {
    // Load data from Local Storage
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading:', error);
            return null;
        }
    },

    // Save data to Local Storage
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving:', error);
        }
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// ============================================
// CLOCK MODULE
// ============================================

const ClockModule = {
    init() {
        this.updateTime();
        this.updateDate();
        // Update every second
        setInterval(() => {
            this.updateTime();
            this.updateDate();
        }, 1000);
    },

    // Format time in HH:MM:SS format (24-hour)
    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },

    // Format date in human-readable format
    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    },

    updateTime() {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = this.formatTime(now);
        }
    },

    updateDate() {
        const now = new Date();
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = this.formatDate(now);
        }
    }
};

// ============================================
// GREETING MODULE
// ============================================

const GreetingModule = {
    userName: null,

    init() {
        // Load user name from localStorage
        this.userName = StateManager.load(STORAGE_KEYS.USER_NAME);
        
        this.updateGreeting();
        // Check every minute for hour changes
        setInterval(() => this.updateGreeting(), 60000);
        
        // Add double-click handler for editing name
        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            greetingElement.addEventListener('dblclick', () => this.editName());
        }
    },

    getGreeting(hour) {
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        if (hour >= 17 && hour < 21) return 'Good Evening';
        return 'Good Night';
    },

    updateGreeting() {
        const hour = new Date().getHours();
        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            const greeting = this.getGreeting(hour);
            if (this.userName) {
                greetingElement.textContent = `${greeting}, ${this.userName}`;
            } else {
                greetingElement.textContent = greeting;
            }
        }
    },

    editName() {
        const greetingElement = document.getElementById('greeting');
        if (!greetingElement) return;

        const newName = prompt('Enter your name:', this.userName || '');
        if (newName !== null && newName.trim()) {
            this.userName = newName.trim();
            StateManager.save(STORAGE_KEYS.USER_NAME, this.userName);
            this.updateGreeting();
        } else if (newName === '') {
            // If user clears the name, remove it
            this.userName = null;
            localStorage.removeItem(STORAGE_KEYS.USER_NAME);
            this.updateGreeting();
        }
    }
};

// ============================================
// THEME MODULE
// ============================================

const ThemeModule = {
    themes: ['bright', 'dark', 'neutral'],
    currentTheme: 'bright',

    init() {
        // Load saved theme or use default
        const savedTheme = StateManager.load(STORAGE_KEYS.THEME);
        this.currentTheme = savedTheme || 'bright';
        this.applyTheme(this.currentTheme);
        this.updateButtonStates();
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        StateManager.save(STORAGE_KEYS.THEME, theme);
    },

    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.applyTheme(theme);
            this.updateButtonStates();
        }
    },

    updateButtonStates() {
        this.themes.forEach(theme => {
            const btn = document.getElementById(`theme-${theme}`);
            if (btn) {
                btn.classList.toggle('active', theme === this.currentTheme);
            }
        });
    }
};

// ============================================
// TIMER MODULE
// ============================================

const TimerModule = {
    DEFAULT_DURATION: 25, // Default duration in minutes
    currentDuration: 25,
    timeRemaining: 25 * 60,
    isRunning: false,
    intervalId: null,

    init() {
        // Load saved timer duration
        const savedDuration = StateManager.load(STORAGE_KEYS.TIMER_DURATION);
        this.currentDuration = savedDuration || this.DEFAULT_DURATION;
        this.timeRemaining = this.currentDuration * 60;
        
        // Set the dropdown value
        const durationSelect = document.getElementById('timer-duration');
        if (durationSelect) {
            durationSelect.value = this.currentDuration.toString();
        }
        
        this.updateDisplay();
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    },

    updateDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.formatTime(this.timeRemaining);
        }
    },

    setDuration(minutes) {
        // Stop timer if running
        this.stop();
        
        // Update duration
        this.currentDuration = minutes;
        this.timeRemaining = minutes * 60;
        
        // Save to localStorage
        StateManager.save(STORAGE_KEYS.TIMER_DURATION, minutes);
        
        // Update display
        this.updateDisplay();
    },

    saveState() {
        StateManager.save(STORAGE_KEYS.TIMER_STATE, {
            timeRemaining: this.timeRemaining,
            isRunning: this.isRunning
        });
    },

    start() {
        if (this.isRunning || this.timeRemaining <= 0) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateDisplay();
                this.saveState();
            } else {
                this.stop();
            }
        }, 1000);
    },

    stop() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.saveState();
    },

    reset() {
        this.stop();
        this.timeRemaining = this.currentDuration * 60;
        this.updateDisplay();
        this.saveState();
    }
};

// ============================================
// TASKS MODULE
// ============================================

const TasksModule = {
    tasks: [],

    init() {
        this.loadTasks();
        this.renderTasks();
    },

    loadTasks() {
        const saved = StateManager.load(STORAGE_KEYS.TASKS);
        this.tasks = Array.isArray(saved) ? saved : [];
    },

    saveTasks() {
        StateManager.save(STORAGE_KEYS.TASKS, this.tasks);
    },

    addTask(text) {
        if (!text.trim()) return;
        
        // Check for duplicate task (case-insensitive)
        const existingTask = this.tasks.find(t => t.text.toLowerCase() === text.trim().toLowerCase());
        if (existingTask) {
            // Show visual feedback for duplicate
            const taskInput = document.getElementById('task-input');
            if (taskInput) {
                taskInput.classList.add('task-duplicate');
                setTimeout(() => taskInput.classList.remove('task-duplicate'), 500);
            }
            alert('This task already exists!');
            return;
        }
        
        const task = {
            id: StateManager.generateId(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now()
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    },

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    },

    editTask(id) {
        const taskElement = document.querySelector(`[data-task-id="${id}"]`);
        if (!taskElement) return;

        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const textSpan = taskElement.querySelector('.task-text');
        if (!textSpan) return;

        // Create edit input
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'task-input-edit';
        editInput.value = task.text;

        // Create save button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-success btn-small';
        saveBtn.textContent = 'Save';

        // Create cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary btn-small';
        cancelBtn.textContent = 'Cancel';

        // Create actions container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        // Replace text with input
        textSpan.replaceWith(editInput);
        actionsDiv.appendChild(saveBtn);
        actionsDiv.appendChild(cancelBtn);

        // Find old actions and replace
        const oldActions = taskElement.querySelector('.task-actions');
        if (oldActions) {
            oldActions.replaceWith(actionsDiv);
        } else {
            taskElement.appendChild(actionsDiv);
        }

        // Focus the input
        editInput.focus();
        editInput.select();

        // Save handler
        saveBtn.onclick = () => {
            const newText = editInput.value.trim();
            if (newText) {
                task.text = newText;
                this.saveTasks();
                this.renderTasks();
            }
        };

        // Cancel handler
        cancelBtn.onclick = () => {
            this.renderTasks();
        };

        // Enter key to save
        editInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            } else if (e.key === 'Escape') {
                cancelBtn.click();
            }
        };
    },

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
        }
    },

    renderTasks() {
        const listElement = document.getElementById('task-list');
        const emptyElement = document.getElementById('empty-tasks');
        
        if (!listElement) return;

        listElement.innerHTML = '';

        if (this.tasks.length === 0) {
            if (emptyElement) emptyElement.style.display = 'block';
        } else {
            if (emptyElement) emptyElement.style.display = 'none';
            
            this.tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task-item';
                li.setAttribute('data-task-id', task.id);

                // Checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'task-checkbox';
                checkbox.checked = task.completed;
                checkbox.onchange = () => this.toggleTask(task.id);

                // Task text
                const textSpan = document.createElement('span');
                textSpan.className = 'task-text';
                textSpan.textContent = task.text;

                // Actions
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'task-actions';

                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-secondary btn-small';
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => this.editTask(task.id);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-danger btn-small';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => this.deleteTask(task.id);

                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(deleteBtn);

                li.appendChild(checkbox);
                li.appendChild(textSpan);
                li.appendChild(actionsDiv);

                listElement.appendChild(li);
            });
        }
    }
};

// ============================================
// QUICK LINKS MODULE
// ============================================

const QuickLinksModule = {
    links: [],

    init() {
        this.loadLinks();
        this.renderLinks();
    },

    loadLinks() {
        const saved = StateManager.load(STORAGE_KEYS.QUICK_LINKS);
        this.links = Array.isArray(saved) ? saved : [];
    },

    saveLinks() {
        StateManager.save(STORAGE_KEYS.QUICK_LINKS, this.links);
    },

    isValidUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    },

    addLink(url, label) {
        if (!url.trim()) {
            alert('Please enter a URL');
            return false;
        }
        
        let normalizedUrl = url.trim();
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
            normalizedUrl = 'https://' + normalizedUrl;
        }
        
        if (!this.isValidUrl(normalizedUrl)) {
            alert('Please enter a valid URL');
            return false;
        }
        
        if (!label.trim()) {
            alert('Please enter a label');
            return false;
        }

        const link = {
            id: StateManager.generateId(),
            url: normalizedUrl,
            label: label.trim()
        };

        this.links.push(link);
        this.saveLinks();
        this.renderLinks();
        return true;
    },

    openLink(url) {
        if (url) {
            window.open(url, '_blank');
        }
    },

    deleteLink(id) {
        if (confirm('Are you sure you want to delete this link?')) {
            this.links = this.links.filter(l => l.id !== id);
            this.saveLinks();
            this.renderLinks();
        }
    },

    renderLinks() {
        const container = document.getElementById('quick-links');
        const emptyElement = document.getElementById('empty-links');
        
        if (!container) return;

        container.innerHTML = '';

        if (this.links.length === 0) {
            if (emptyElement) emptyElement.style.display = 'block';
        } else {
            if (emptyElement) emptyElement.style.display = 'none';
            
            this.links.forEach(link => {
                const div = document.createElement('div');
                div.className = 'quick-link-item';

                const btn = document.createElement('a');
                btn.className = 'quick-link-btn';
                btn.href = link.url;
                btn.target = '_blank';
                btn.rel = 'noopener noreferrer';
                btn.textContent = link.label;
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.openLink(link.url);
                };

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'quick-link-delete';
                deleteBtn.textContent = 'Remove';
                deleteBtn.onclick = () => this.deleteLink(link.id);

                div.appendChild(btn);
                div.appendChild(deleteBtn);

                container.appendChild(div);
            });
        }
    }
};

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
    // Timer controls
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timerDurationSelect = document.getElementById('timer-duration');

    if (startBtn) startBtn.onclick = () => TimerModule.start();
    if (stopBtn) stopBtn.onclick = () => TimerModule.stop();
    if (resetBtn) resetBtn.onclick = () => TimerModule.reset();
    
    // Timer duration dropdown
    if (timerDurationSelect) {
        timerDurationSelect.onchange = (e) => {
            const minutes = parseInt(e.target.value, 10);
            TimerModule.setDuration(minutes);
        };
    }

    // Task input
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');

    if (addTaskBtn) {
        addTaskBtn.onclick = () => {
            if (taskInput) {
                TasksModule.addTask(taskInput.value);
                taskInput.value = '';
                taskInput.focus();
            }
        };
    }

    if (taskInput) {
        taskInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                TasksModule.addTask(taskInput.value);
                taskInput.value = '';
            }
        };
    }

    // Quick Links input
    const linkUrl = document.getElementById('link-url');
    const linkLabel = document.getElementById('link-label');
    const addLinkBtn = document.getElementById('add-link-btn');

    if (addLinkBtn) {
        addLinkBtn.onclick = () => {
            if (linkUrl && linkLabel) {
                QuickLinksModule.addLink(linkUrl.value, linkLabel.value);
                linkUrl.value = '';
                linkLabel.value = '';
                linkUrl.focus();
            }
        };
    }

    // Theme toggle buttons
    document.getElementById('theme-bright').addEventListener('click', () => ThemeModule.setTheme('bright'));
    document.getElementById('theme-dark').addEventListener('click', () => ThemeModule.setTheme('dark'));
    document.getElementById('theme-neutral').addEventListener('click', () => ThemeModule.setTheme('neutral'));
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Initialize all modules
    ClockModule.init();
    GreetingModule.init();
    ThemeModule.init();
    TimerModule.init();
    TasksModule.init();
    QuickLinksModule.init();
    
    // Attach event listeners
    attachEventListeners();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}