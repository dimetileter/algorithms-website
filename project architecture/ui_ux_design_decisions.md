## UI/UX Tasarım Kararları

Bu dosya, proje arayüzü için alınan tasarım kararlarını ve beyin fırtınası sonuçlarını içerir.

---

### 1. Ana Sayfa (Dashboard) — Kart Tasarımı

- Kartlar **simetrik** bir şekilde ekrana yayılacak.
- Grid düzeni ile kartlar eşit aralıklarla dağıtılacak ve ekran boyutuna göre uyumlu (responsive) olacak.
- Her kartta:
  - Algoritmanın adı
  - Kısa bir açıklama
  - Ufak bir **loop animasyon** (her algoritmaya özgü):
    - **Dijkstra** → Küçük graph üzerinde en kısa yolun yanıp sönen animasyonu
    - **Bellman-Ford** → Negatif ağırlıklı kenarlarla yol bulma animasyonu
    - **Spanning Tree** → Ağacın dallanma animasyonu
    - **Kruskal** → Kenarların sırayla eklenmesi animasyonu
    - **Prim** → Bir node'dan dışarı doğru büyüyen ağaç animasyonu
- Kart hover efekti: Hafif **scale-up** + **gölge derinleşmesi** (Apple tarzı)

---

### 2. Navigasyon & Menü Yapısı

- **Üst menü (Navbar):** Sabit (sticky), minimal yapıda.
  - Sol: Logo / Proje adı (isim henüz belirlenmedi)
  - Orta: Algoritma sekmeleri (hızlı erişim)
  - Sağ: Arama kutusu + Tema toggle (gece/gündüz)
- **Arama kutusu:** Sağda 🔍 ikonu ile, tıklanınca sola doğru smooth animasyonla genişler. Algoritma isimlerinden otomatik öneri (autocomplete) sunar.
- **Geri butonu:** Sol tarafta, sadece algoritma sayfalarında görünür (ana sayfada gizli).
- Proje ismi henüz belirlenmedi, geçici bir placeholder kullanılacak.

---

### 3. Algoritma Sayfası Layout'u

- Sayfa **ikiye bölünmüş** olacak:
  - **Sol panel (~60-65%):** Graph görselleştirme alanı (Canvas/SVG)
  - **Sağ panel (~35-40%):** Bilgi & ilerleme paneli
- **Sağ panelin içeriği:**
  - Algoritmanın ne işe yaradığı, nasıl çalıştığı
  - Zaman ve mekan karmaşıklığı bilgileri
  - Algoritma çalışırken **eşzamanlı olarak** adım adım ilerleme bilgisi (döngü no, mevcut node, ziyaret edilen/edilmeyen node'lar, mesafeler vs.)
- Sağ panel **açılıp kapatılabilir (collapsible)**. Kullanıcı isterse graph'ı tam ekran görebilir.
- **Hız kontrolü:** Altta slider veya play/pause/step-forward butonları ile hız ayarlanabilir.

---

### 4. İnşaa Modu (Build Mode)

- **Sol kenar çubuğu (sidebar)** ile araç kutusu sunulacak:
  - Node ekleme aracı: Sidebar'dan seçip canvas'a sürükle-bırak
  - Kenar ekleme: Benzer sürükle-bırak mantığıyla iki node arası bağlantı çizimi
  - Silme ve düzenleme araçları
- Node'lara **isim** verilebilecek.
- Kenarlara **ağırlık** verilebilecek.
- Hazır şablon graph'lar sunulabilir (basit ve karmaşık örnekler).
- Algoritmaya özel gereksinimler (başlangıç/bitiş node seçimi vb.) için özel alanlar ve uyarılar bulunacak.

---

### 5. Tema (Gece / Gündüz Modu)

- **Varsayılan tema:** Sistem temasına göre otomatik algılanacak.
- Toggle butonu: Navbar sağ tarafında 🌙/☀️ ikonu.
- Geçiş **smooth transition** ile olacak (ani değişim yok).
- **Gündüz modu:**
  - Açık gri/beyaz tonlar
  - Soft shadows
  - Ana vurgu rengi: **Mavi (#007AFF)** — Apple klasik
- **Gece modu:**
  - **Antrasit** ve **koyu siyah** tonlar
  - Subtle glow efektleri
  - Ana vurgu rengi korunacak (mavi)

---

### 6. Renk Paleti

| Alan | Gündüz Modu | Gece Modu |
|------|------------|-----------|
| Arka plan | Beyaz / Açık gri | Koyu siyah / Antrasit |
| Metin | Koyu gri / Siyah | Açık gri / Beyaz |
| Vurgu rengi | Mavi (#007AFF) | Mavi (#007AFF) |
| Kartlar | Beyaz, soft shadow | Koyu gri, subtle glow |
| Navbar | Beyaz/Transparan | Koyu antrasit |

---

### 7. Algoritma Görselleştirme — Neon Efekti ✨

- Algoritma çalışırken ve yollar hesaplanırken:
  - Aktif olarak işlem yapılan **node** ve **kenarlar**, parlak **neon bir renk** ile aydınlanacak.
  - Bu sayede hangi node ve kenarlar üzerinde işlem yapıldığı görsel olarak net şekilde takip edilebilecek.
- Neon renk, tema vurgu rengiyle uyumlu olacak (örn. parlak mavi veya turkuaz glow).
- Ziyaret edilmiş ama aktif olmayan node'lar daha soft bir renkle işaretlenecek.
- Henüz ziyaret edilmemiş node'lar nötr renkte kalacak.

---

### 8. Teknik Notlar

- **Temel algoritma kodları** JavaScript ile yazılacak.
- Görselleştirme ve etkileşim için harici kütüphaneler kullanılabilir (örn. graph çizimi için D3.js, Cytoscape.js gibi).
- Proje modüler yapıda olacak, ileride yeni algoritmalar kolayca eklenebilecek.
