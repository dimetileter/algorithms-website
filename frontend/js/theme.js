/* ============================================
   TEMA YÖNETİMİ (theme.js)
   Gece/Gündüz modu değişimi
   Kullanıcının tercihini hatırlar
   ============================================ */

/**
 * Tema yönetim modülü
 * - Sistem temasını algılar (varsayılan)
 * - Kullanıcı tercihini localStorage'da saklar
 * - Tema butonunun ikonunu günceller
 */
const ThemeManager = {

    // Tema toggle butonunu seç
    toggleButton: null,

    /**
     * Tema yönetimini başlat
     * Sayfa yüklendiğinde çalışır
     */
    init: function () {
        // Butonu DOM'dan al
        this.toggleButton = document.getElementById('theme-toggle');

        // Kayıtlı tema tercihi var mı kontrol et
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            // Kullanıcının daha önce seçtiği tema varsa onu uygula
            this.applyTheme(savedTheme);
        } else {
            // Yoksa sistem temasını algıla
            this.detectSystemTheme();
        }

        // Butona tıklama olayını dinle
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });

        // Sistem teması değişirse otomatik güncelle
        // (Sadece kullanıcı henüz manuel seçim yapmadıysa)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    /**
     * Sistem temasını algıla ve uygula
     * İşletim sistemi gece modundaysa gece temasını uygular
     */
    detectSystemTheme: function () {
        // Tarayıcıdan sistem temasını oku
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.applyTheme(prefersDark ? 'dark' : 'light');
    },

    /**
     * Belirtilen temayı uygula
     * @param {string} theme - 'light' veya 'dark'
     */
    applyTheme: function (theme) {
        // HTML elemanına tema bilgisini ekle
        document.documentElement.setAttribute('data-theme', theme);

        // Buton ikonunu güncelle
        if (this.toggleButton) {
            this.toggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    },

    /**
     * Temayı değiştir (toggle)
     * Gündüzse geceye, geceyse gündüze geçir
     */
    toggle: function () {
        // Mevcut temayı oku
        const currentTheme = document.documentElement.getAttribute('data-theme');

        // Karşıt temaya geç
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Yeni temayı uygula
        this.applyTheme(newTheme);

        // Kullanıcı tercihini kaydet (tarayıcı kapansa bile hatırlansın)
        localStorage.setItem('theme', newTheme);
    }
};

/* Sayfa yüklendiğinde tema yönetimini başlat */
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
