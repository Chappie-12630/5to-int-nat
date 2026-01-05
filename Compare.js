// --- LÓGICA DE COMPARACIÓN ---
window.compareSwimmers = async () => {
    const s1 = document.getElementById('swimmer1').value;
    const s2 = document.getElementById('swimmer2').value;
    
    if (s1 === s2) {
        alert("Selecciona dos nadadores diferentes");
        return;
    }

    const querySnapshot = await getDocs(collection(db, "swims"));
    const data = [];
    querySnapshot.forEach(doc => data.push(doc.data()));

    // Obtener mejores tiempos de cada uno
    const getBests = (name) => {
        const bests = {};
        data.filter(d => d.swimmer === name).forEach(d => {
            const key = `${d.distance} ${d.style}`;
            const totalMs = (d.minutes * 60000) + (d.seconds * 1000) + d.ms;
            if (!bests[key] || totalMs < bests[key].totalMs) {
                bests[key] = { timeStr: `${d.minutes}:${d.seconds}.${d.ms}`, totalMs };
            }
        });
        return bests;
    };

    const bests1 = getBests(s1);
    const bests2 = getBests(s2);
    const allEvents = [...new Set([...Object.keys(bests1), ...Object.keys(bests2)])];

    const container = document.getElementById('compare-results');
    container.innerHTML = allEvents.map(event => {
        const time1 = bests1[event];
        const time2 = bests2[event];
        
        // Lógica para resaltar el ganador en verde
        const win1 = time1 && (!time2 || time1.totalMs < time2.totalMs);
        const win2 = time2 && (!time1 || time2.totalMs < time1.totalMs);

        return `
            <div class="mb-4 bg-gray-50 p-3 rounded-2xl border">
                <p class="text-center text-[10px] font-bold text-gray-400 uppercase mb-2">${event}</p>
                <div class="flex justify-between items-center px-4">
                    <div class="text-center">
                        <p class="text-xs text-gray-500">${s1}</p>
                        <p class="font-mono font-bold ${win1 ? 'text-green-600' : 'text-slate-400'}">${time1 ? time1.timeStr : '--:--'}</p>
                    </div>
                    <div class="text-gray-300 font-black italic text-xl">VS</div>
                    <div class="text-center">
                        <p class="text-xs text-gray-500">${s2}</p>
                        <p class="font-mono font-bold ${win2 ? 'text-green-600' : 'text-slate-400'}">${time2 ? time2.timeStr : '--:--'}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};
