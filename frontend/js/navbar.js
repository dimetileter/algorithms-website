/* ============================================
   NAVBAR ETKİLEŞİMLERİ (navbar.js)
   Arama kutusu açma/kapama mantığı
   ============================================ */

/**
 * Navbar etkileşim modülü
 * - Arama kutusunu açıp kapatır
 * - Dışarı tıklanınca arama kutusunu kapatır
 */
const NavbarManager = {

    // DOM elemanlarını tut
    searchBox: null,
    searchToggle: null,
    searchInput: null,

    /**
     * Navbar etkileşimlerini başlat
     */
    init: function () {
        // Elemanları DOM'dan al
        this.searchBox = document.getElementById('search-box');
        this.searchToggle = document.getElementById('search-toggle');
        this.searchInput = document.getElementById('search-input');

        // Arama butonuna tıklama olayı
        this.searchToggle.addEventListener('click', () => {
            this.toggleSearch();
        });

        // Sayfa herhangi bir yerine tıklanınca arama kutusunu kapat
        document.addEventListener('click', (e) => {
            // Tıklanan yer arama kutusu içinde değilse kapat
            if (!this.searchBox.contains(e.target)) {
                this.closeSearch();
            }
        });

        // ESC tuşu ile arama kutusunu kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
    },

    /**
     * Arama kutusunu aç/kapat
     */
    toggleSearch: function () {
        // 'active' sınıfını ekle/kaldır
        this.searchBox.classList.toggle('active');

        // Açıldıysa input'a odaklan
        if (this.searchBox.classList.contains('active')) {
            this.searchInput.focus();
        }
    },

    /**
     * Arama kutusunu kapat
     */
    closeSearch: function () {
        this.searchBox.classList.remove('active');
        this.searchInput.value = '';   // İçeriği temizle
    }
};

/* Sayfa yüklendiğinde navbar etkileşimlerini başlat */
document.addEventListener('DOMContentLoaded', () => {
    NavbarManager.init();
});
