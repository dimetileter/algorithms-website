/* ============================================
   DİJKSTRA ALGORİTMASI (dijkstra.js)
   Ağırlıklı ve yönsüz/yönlü graflarda en kısa yol bulur.
   Bağımlılıklar: Graph (structures/graph.js),
                  PriorityQueue (structures/priority-queue.js)
   ============================================ */

const Dijkstra = {

    /**
     * Dijkstra algoritmasını çalıştırır.
     * Hem sonucu hem de görselleştirici için adım listesini döndürür.
     *
     * @param {Graph}  graph     - Üzerinde çalışılacak graf
     * @param {string} startId   - Başlangıç node id'si
     * @param {string} endId     - Bitiş node id'si (opsiyonel)
     * @returns {{ shortestPath, totalDistance, distances, steps }}
     */
    run(graph, startId, endId = null) {

        // Hata kontrolü: başlangıç node var mı?
        if (!graph.nodes[startId]) {
            console.error(`Dijkstra Hatası: '${startId}' node bulunamadı.`);
            return null;
        }

        const nodeIds = graph.getNodeIds();

        // ─── Başlangıç durumu ────────────────────────────────────────

        // Tüm mesafeleri sonsuz olarak başlat
        const distances = {};
        // Her node'un önceki node'u (yolu geri izlemek için)
        const previous  = {};
        // Ziyaret edilen node'lar kümesi
        const visited   = new Set();
        // Adım kayıtları (görselleştirici için)
        const steps     = [];

        for (const id of nodeIds) {
            distances[id] = Infinity;
            previous[id]  = null;
        }
        distances[startId] = 0;

        // Öncelik kuyruğunu başlangıç node ile başlat
        const pq = new PriorityQueue();
        pq.enqueue(startId, 0);

        // Başlangıç adımını kaydet
        steps.push({
            type: 'init',
            activeNode:   startId,
            activeEdge:   null,
            visitedNodes: [],
            distances:    { ...distances },
            description:  `Başlangıç: '${startId}' node'u kuyruğa eklendi, mesafe = 0.`
        });

        // ─── Ana Döngü ────────────────────────────────────────────────

        while (!pq.isEmpty()) {

            // En düşük mesafeli node'u al
            const { value: currentId, priority: currentDist } = pq.dequeue();

            // Zaten ziyaret edildiyse atla
            if (visited.has(currentId)) continue;
            visited.add(currentId);

            // Bitiş node'una ulaşıldıysa dur
            if (endId && currentId === endId) {
                steps.push({
                    type: 'finish',
                    activeNode:   currentId,
                    activeEdge:   null,
                    visitedNodes: [...visited],
                    distances:    { ...distances },
                    description:  `Hedef '${endId}' node'una ulaşıldı. Algoritma tamamlandı.`
                });
                break;
            }

            // Mevcut node ziyaret edildi adımı
            steps.push({
                type: 'visit',
                activeNode:   currentId,
                activeEdge:   null,
                visitedNodes: [...visited],
                distances:    { ...distances },
                description:  `'${currentId}' node'u ziyaret ediliyor (mesafe: ${currentDist}).`
            });

            // ─── Komşuları gez ───────────────────────────────────────

            const neighbors = graph.getNeighbors(currentId);

            for (const { to: neighborId, weight } of neighbors) {

                // Ziyaret edilmiş komşuyu atla
                if (visited.has(neighborId)) continue;

                const newDist = distances[currentId] + weight;

                // Daha kısa yol bulunduysa güncelle
                if (newDist < distances[neighborId]) {
                    distances[neighborId] = newDist;
                    previous[neighborId]  = currentId;
                    pq.enqueue(neighborId, newDist);

                    // Kenar güncelleme adımı
                    steps.push({
                        type: 'relax',
                        activeNode:   neighborId,
                        activeEdge:   { from: currentId, to: neighborId, weight },
                        visitedNodes: [...visited],
                        distances:    { ...distances },
                        description:  `'${currentId}' → '${neighborId}' kenarı gevşetildi. Yeni mesafe: ${newDist}.`
                    });
                }
            }
        }

        // ─── Sonuç: En kısa yolu geri iz ─────────────────────────────

        const shortestPath = this._buildPath(previous, startId, endId);
        const totalDistance = endId ? distances[endId] : null;

        return { shortestPath, totalDistance, distances, steps };
    },

    // ─── YARDIMCI FONKSİYON ───────────────────────────────────────────

    /**
     * 'previous' tablosundan en kısa yolu geri izleyerek dizi olarak döndürür.
     * @param {Object} previous  - Her node'un önceki node'u
     * @param {string} startId   - Başlangıç node id'si
     * @param {string} endId     - Bitiş node id'si
     * @returns {string[]} - ['A', 'C', 'B', 'D'] gibi
     */
    _buildPath(previous, startId, endId) {
        if (!endId) return [];

        const path = [];
        let current = endId;

        // endId'den geriye doğru başlangıca ulaş
        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }

        // Yol başlangıç node'undan başlamıyorsa ulaşılamaz demektir
        if (path[0] !== startId) return [];

        return path;
    }

};
