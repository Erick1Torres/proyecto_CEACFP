function renderList() {
    const list = document.getElementById('attack-list');
    const attacks = AttackStore.readAll();
    const empty = document.getElementById('empty-state');

    if (attacks.length === 0) {
        empty.classList.remove('hidden');
        list.querySelectorAll('.attack-entry').forEach(e => e.remove());
        updateStats(0, 0);
        return;
    }

    empty.classList.add('hidden');
    let highCount = 0;

    list.querySelectorAll('.attack-entry').forEach(e => e.remove());

    attacks.forEach(a => {
        if (a.severity === 'high') highCount++;
        const div = document.createElement('div');
        div.className = `attack-entry p-6 severity-${a.severity}`;
        div.innerHTML = `
            <div class="flex justify-between mb-4">
                <span class="text-xs font-mono font-bold text-slate-500 uppercase">${a.at} | SRC: ${a.source}</span>
                <span class="text-xs font-black uppercase tracking-widest px-2 py-1 rounded bg-white border border-slate-200">${a.severity}</span>
            </div>
            <h3 class="text-lg font-black text-slate-800 mb-4 italic">${a.type}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div class="bg-white/60 p-3 rounded border border-blue-100">
                    <p class="font-bold text-blue-600 mb-1 uppercase tracking-tighter">1. Capa IDS (Snort)</p>
                    <p class="text-slate-700">${a.ids}</p>
                </div>
                <div class="bg-white/60 p-3 rounded border border-purple-100">
                    <p class="font-bold text-purple-600 mb-1 uppercase tracking-tighter">2. Firewall (pfSense)</p>
                    <p class="text-slate-700 font-medium">${a.fw}</p>
                </div>
                <div class="bg-white/60 p-3 rounded border border-amber-100">
                    <p class="font-bold text-amber-700 mb-1 uppercase tracking-tighter">3. Auditoría/Refuerzo</p>
                    <p class="text-slate-700 italic">${a.audit}</p>
                </div>
            </div>
        `;
        list.appendChild(div);
    });

    updateStats(attacks.length, highCount);
}

function updateStats(total, high) {
    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-high').innerText = high;
}

function onRandom() {
    const keys = Object.keys(AttackStore.types);
    const key = keys[Math.floor(Math.random() * keys.length)];
    AttackStore.addAttack(key);
    renderList();
}

function onClear() {
    if(confirm("¿Seguro que quieres borrar la evidencia de los ataques?")) {
        AttackStore.clear();
        renderList();
    }
}

// Inicializar
window.onload = renderList;