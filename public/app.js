(() => {
    // 1. Configuración y Estado
    const STORAGE_KEYS = {
        TASKS: 'taskflow_tasks',
        COLOR: 'taskflow_color',
        THEME: 'taskflow_theme'
    };

    const PRIORITY_MAP = {
        alta: { class: "border-l-red-500 bg-red-50/40 dark:bg-red-950/20", label: "Alta" },
        media: { class: "border-l-orange-700 bg-orange-70/50 dark:bg-orange-800/20", label: "Media" },
        baja: { class: "border-l-green-500 bg-green-50/40 dark:bg-green-950/20", label: "Baja" }
    };

    let tasks = []; 
    let userColor = localStorage.getItem(STORAGE_KEYS.COLOR) || '#4f46e5';
    let currentFilter = 'all';
    let searchQuery = ''; 

    // 2. Motor de Color Dinámico
    function applyThemeColor(hex) {
        userColor = hex;
        localStorage.setItem(STORAGE_KEYS.COLOR, hex);
        
        const picker = document.getElementById('custom-color-picker');
        const preview = document.getElementById('color-preview');
        
        if (picker) picker.value = hex;
        if (preview) preview.style.backgroundColor = hex;

        let styleTag = document.getElementById('dynamic-brand-styles') || document.createElement('style');
        styleTag.id = 'dynamic-brand-styles';
        if (!styleTag.parentNode) document.head.appendChild(styleTag);

        styleTag.innerHTML = `
            :root { --brand-primary: ${hex}; }
            header, #main-header { background-color: ${hex} !important; }
            #color-preview { background-color: ${hex} !important; }
            #add-btn, button[type="submit"] { background-color: ${hex} !important; }
            .active-filter { background-color: ${hex} !important; color: white !important; }
            .task-check:checked { background-color: ${hex} !important; border-color: ${hex} !important; }
            input:focus { border-color: ${hex} !important; }
        `;
    }

    // 3. Gestión de estados de red
    async function syncTasks() {
        const list = document.getElementById('task-list');
        list.classList.add('opacity-40', 'pointer-events-none', 'transition-opacity');

        try {
            if (typeof taskApi !== 'undefined') {
                tasks = await taskApi.getAll();
                renderTaskList();
            }
        } catch (e) {
            console.error("Error de conexión:", e);
            showNetworkStatus("Sin conexión - Modo Local", "bg-orange-500");
            tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
            renderTaskList();
        } finally {
            list.classList.remove('opacity-40', 'pointer-events-none');
        }
    }

    function showNetworkStatus(msg, colorClass) {
        const status = document.createElement('div');
        status.className = `fixed bottom-6 right-6 ${colorClass} text-white px-6 py-3 rounded-2xl shadow-2xl z-50 font-bold animate-bounce text-sm`;
        status.innerHTML = `<span>${msg}</span>`;
        document.body.appendChild(status);
        setTimeout(() => status.remove(), 4000);
    }

    // 4. Renderizado (CON LÓGICA DE FECHA SIN LÍMITE)
    function renderTaskList() {
        const list = document.getElementById('task-list');
        const emptyState = document.getElementById('empty-state');
        if (!list) return;

        const filtered = tasks.filter(t => {
            const matchesFilter = currentFilter === 'all' || t.category === currentFilter;
            const matchesSearch = (t.title || "").toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
        
        list.innerHTML = '';
        if (emptyState) emptyState.classList.toggle('hidden', filtered.length > 0);

        filtered.sort((a, b) => b.id - a.id).forEach(task => {
            const priorityData = PRIORITY_MAP[task.priority] || PRIORITY_MAP.media;
            const taskEl = document.createElement('div');
            taskEl.dataset.id = task.id;
            taskEl.className = `flex items-center justify-between p-5 rounded-[2rem] border-l-4 transition-all shadow-sm mb-4 ${priorityData.class} ${task.completed ? 'opacity-50' : ''}`;
            
            // Lógica Senior: Validar fecha vacía
            const dateDisplay = task.dueDate && task.dueDate !== "" 
                ? ` • ${task.dueDate}` 
                : " • Sin límite";

            taskEl.innerHTML = `
                <div class="flex items-center gap-4 pointer-events-none">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-check pointer-events-auto w-5 h-5 cursor-pointer appearance-none border-2 rounded-full transition-all">
                    <div>
                        <h3 class="task-title-display font-bold text-slate-800 dark:text-slate-100 ${task.completed ? 'line-through text-slate-400' : ''}"></h3>
                        <p class="text-[10px] text-slate-500 uppercase font-black">${task.category} • ${priorityData.label}${dateDisplay}</p>
                    </div>
                </div>
                <button class="delete-btn text-slate-400 hover:text-red-500 p-2 transition-colors">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            `;
            taskEl.querySelector('.task-title-display').textContent = task.title;
            list.appendChild(taskEl);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 5. Inicialización y Eventos
    function init() {
        const form = document.getElementById('task-form');
        const taskInput = document.getElementById('task-input');
        const addBtn = document.getElementById('add-btn');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = taskInput.value.trim();

            if (title.length < 3) {
                const msg = title.length === 0 ? "El título es obligatorio" : "Mínimo 3 caracteres";
                taskInput.classList.add('border-red-500', 'animate-shake');
                const prevPlaceholder = taskInput.placeholder;
                taskInput.placeholder = msg;
                taskInput.value = '';
                setTimeout(() => {
                    taskInput.classList.remove('border-red-500', 'animate-shake');
                    taskInput.placeholder = prevPlaceholder;
                }, 2000);
                return;
            }

            const originalHTML = addBtn.innerHTML;
            addBtn.innerHTML = `<i data-lucide="loader-2" class="w-6 h-6 animate-spin"></i>`;
            addBtn.disabled = true;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            try {
                await taskApi.create({
                    title: title,
                    category: document.getElementById('task-category-select').value,
                    priority: document.getElementById('task-priority-select').value,
                    dueDate: document.getElementById('task-date-input').value
                });
                
                taskInput.value = '';
                document.getElementById('task-date-input').value = '';
                await syncTasks();
                showNetworkStatus("Tarea sincronizada", "bg-green-600");
            } catch (err) {
                showNetworkStatus("Error al guardar en servidor", "bg-red-600");
            } finally {
                addBtn.innerHTML = originalHTML;
                addBtn.disabled = false;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });

        document.getElementById('search-input')?.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderTaskList();
        });

        document.getElementById('task-list')?.addEventListener('click', async (e) => {
            const taskEl = e.target.closest('[data-id]');
            if (!taskEl) return;
            const id = taskEl.dataset.id;

            if (e.target.closest('.delete-btn')) {
                await taskApi.delete(id);
                await syncTasks();
            }

            if (e.target.classList.contains('task-check')) {
                await taskApi.update(id, { completed: e.target.checked });
                await syncTasks();
            }
        });

        document.querySelectorAll('.barra-lateral li').forEach(li => {
            li.addEventListener('click', function() {
                document.querySelectorAll('.barra-lateral li').forEach(l => {
                    l.className = "filter-btn flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all";
                });
                this.className = "filter-btn flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl text-white font-bold shadow-lg active-filter transition-all";
                currentFilter = this.dataset.filter || 'all';
                renderTaskList();
            });
        });

        document.getElementById('custom-color-picker')?.addEventListener('input', (e) => {
            applyThemeColor(e.target.value);
        });

        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const isDark = localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');

        applyThemeColor(userColor);
        init();
        syncTasks();
    });
})();