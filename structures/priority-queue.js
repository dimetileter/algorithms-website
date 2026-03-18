/* ============================================
   ÖNCELİK KUYRUĞU (priority-queue.js)
   Min-heap tabanlı öncelik kuyruğu.
   Dijkstra ve Prim algoritmaları tarafından kullanılır.
   ============================================ */

class PriorityQueue {

    constructor() {
        // İç dizi: her eleman { value, priority }
        this.heap = [];
    }

    // ─── ANA OPERASYONLAR ─────────────────────────────────────────────

    /**
     * Kuyruğa yeni eleman ekler ve heap'i düzenler.
     * @param {*}      value    - Eklenecek değer (node id vb.)
     * @param {number} priority - Öncelik değeri (küçük = önce çıkar)
     */
    enqueue(value, priority) {
        this.heap.push({ value, priority });
        this._bubbleUp();
    }

    /**
     * En düşük öncelikli elemanı kuyruktan çıkarır ve döndürür.
     * @returns {{ value, priority } | null}
     */
    dequeue() {
        if (this.isEmpty()) return null;

        // Kökteki minimum elemanı kaydet
        const min = this.heap[0];

        // Son elemanı köke taşı ve aşağı yukarı sırala
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._sinkDown();
        }

        return min;
    }

    /**
     * Kuyruğu boşaltmadan en düşük öncelikli elemanı gösterir.
     * @returns {{ value, priority } | null}
     */
    peek() {
        return this.heap[0] || null;
    }

    /**
     * Kuyruk boşsa true döndürür.
     * @returns {boolean}
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * Kuyruktaki eleman sayısını döndürür.
     * @returns {number}
     */
    size() {
        return this.heap.length;
    }

    // ─── HEAP YARDIMCI FONKSİYONLARI ─────────────────────────────────

    /**
     * Yeni eklenen elemanı doğru konuma taşır (yukarı kabarcık).
     */
    _bubbleUp() {
        let idx = this.heap.length - 1;

        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);

            // Ebeveyn daha büyükse yer değiştir
            if (this.heap[parentIdx].priority > this.heap[idx].priority) {
                this._swap(parentIdx, idx);
                idx = parentIdx;
            } else {
                break;
            }
        }
    }

    /**
     * Kök elemanı doğru konuma taşır (aşağı batırma).
     */
    _sinkDown() {
        let idx = 0;
        const length = this.heap.length;

        while (true) {
            const leftIdx  = 2 * idx + 1;
            const rightIdx = 2 * idx + 2;
            let smallest = idx;

            // Sol çocuk daha küçükse
            if (leftIdx < length &&
                this.heap[leftIdx].priority < this.heap[smallest].priority) {
                smallest = leftIdx;
            }

            // Sağ çocuk daha küçükse
            if (rightIdx < length &&
                this.heap[rightIdx].priority < this.heap[smallest].priority) {
                smallest = rightIdx;
            }

            // Yer değiştirme gerekmiyorsa dur
            if (smallest === idx) break;

            this._swap(idx, smallest);
            idx = smallest;
        }
    }

    /**
     * Heap'teki iki elemanın yerini değiştirir.
     * @param {number} i - Birinci indeks
     * @param {number} j - İkinci indeks
     */
    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}
