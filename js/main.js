/**
 * main.js - Funcionalidades principales de OFFIHO
 */

// Configuración global
const AppConfig = {
    debug: true,
    apiBaseUrl: '',
    cartKey: 'offiho_cart',
    themeKey: 'offiho_theme',
    languageKey: 'offiho_language'
};

// Estado de la aplicación
const AppState = {
    cart: [],
    currentTheme: 'light',
    currentLanguage: 'es',
    isMobile: false,
    isLoading: false
};

/**
 * Manejo del tema (MANTENIDO - funciona bien)
 */
const ThemeManager = {
    init: () => {
        const savedTheme = localStorage.getItem(AppConfig.themeKey);
        AppState.currentTheme = savedTheme || 'light';
        ThemeManager.applyTheme(AppState.currentTheme);
        ThemeManager.setupThemeButtons();
        console.log('Tema inicializado:', AppState.currentTheme);
    },
    
    applyTheme: (theme) => {
        document.body.classList.remove('dark-mode', 'light-mode');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.add('light-mode');
        }
        
        AppState.currentTheme = theme;
        localStorage.setItem(AppConfig.themeKey, theme);
        ThemeManager.updateThemeButtons();
        
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    },
    
    toggleTheme: () => {
        const newTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
        ThemeManager.applyTheme(newTheme);
        return newTheme;
    },
    
    setupThemeButtons: () => {
        // Botón en header
        const headerThemeBtn = document.getElementById('themeToggle');
        if (headerThemeBtn) {
            headerThemeBtn.addEventListener('click', () => {
                ThemeManager.toggleTheme();
            });
        }
        
        // Botones en sidebar
        const sidebarThemeBtns = document.querySelectorAll('.theme-option-sidebar');
        sidebarThemeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                ThemeManager.applyTheme(theme);
            });
        });
    },
    
    updateThemeButtons: () => {
        const headerThemeBtn = document.getElementById('themeToggle');
        if (headerThemeBtn) {
            const icon = headerThemeBtn.querySelector('i');
            const text = headerThemeBtn.querySelector('.theme-text');
            
            if (icon) {
                icon.className = AppState.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        const sidebarThemeBtns = document.querySelectorAll('.theme-option-sidebar');
        sidebarThemeBtns.forEach(btn => {
            const theme = btn.getAttribute('data-theme');
            btn.classList.toggle('active', theme === AppState.currentTheme);
        });
    }
};

/**
 * NUEVO: Manejo del idioma (sistema de spans)
 */
const LanguageManager = {
    init: () => {
        const savedLang = localStorage.getItem(AppConfig.languageKey) || 'es';
        AppState.currentLanguage = savedLang;
        LanguageManager.applyLanguage(savedLang);
        LanguageManager.setupLanguageButtons();
        console.log('Idioma inicializado:', AppState.currentLanguage);
    },
    
    applyLanguage: (lang) => {
        AppState.currentLanguage = lang;
        localStorage.setItem(AppConfig.languageKey, lang);
        
        // Aplicar clase al body
        if (lang === 'en') {
            document.body.classList.add('lang-en');
        } else {
            document.body.classList.remove('lang-en');
        }
        
        // Actualizar título de la página
        LanguageManager.updatePageTitle();
        
        // Actualizar botones de idioma
        LanguageManager.updateLanguageButtons();
        
        // Actualizar atributo lang del html
        document.documentElement.lang = lang;
        
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    },
    
    toggleLanguage: () => {
        const newLang = AppState.currentLanguage === 'es' ? 'en' : 'es';
        LanguageManager.applyLanguage(newLang);
        return newLang;
    },
    
    setupLanguageButtons: () => {
        // Botón en header
        const headerLangBtn = document.getElementById('languageToggle');
        if (headerLangBtn) {
            headerLangBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                LanguageManager.toggleLanguage();
            });
        }
        
        // Botón en sidebar
        const sidebarLangBtn = document.getElementById('languageToggleSidebar');
        if (sidebarLangBtn) {
            sidebarLangBtn.addEventListener('click', () => {
                LanguageManager.toggleLanguage();
            });
        }
    },
    
    updateLanguageButtons: () => {
        const isEnglish = AppState.currentLanguage === 'en';
        
        // Botón en header
        const headerLangBtn = document.getElementById('languageToggle');
        if (headerLangBtn) {
            const flag = headerLangBtn.querySelector('.language-flag');
            const code = headerLangBtn.querySelector('.language-code');
            
            if (flag) {
                flag.textContent = isEnglish ? '🇺🇸' : '🇪🇸';
            }
            if (code) {
                code.textContent = isEnglish ? 'EN' : 'ES';
            }
        }
        
        // Botón en sidebar
        const sidebarLangBtn = document.getElementById('languageToggleSidebar');
        if (sidebarLangBtn) {
            const flag = sidebarLangBtn.querySelector('.language-flag-sidebar');
            const text = sidebarLangBtn.querySelector('.language-text-sidebar');
            const switchText = sidebarLangBtn.querySelector('.language-switch-text');
            
            if (flag) {
                flag.textContent = isEnglish ? '🇺🇸' : '🇪🇸';
            }
        }
    },
    
    updatePageTitle: () => {
        const isEnglish = AppState.currentLanguage === 'en';
        document.title = isEnglish 
            ? 'OFFIHO - Ergonomic Office Solutions'
            : 'OFFIHO - Soluciones Ergonómicas para Oficina';
    }
};

/**
 * Manejo del sidebar (CORREGIDO)
 */
const SidebarManager = {
    init: () => {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (!sidebarToggle || !sidebar) {
            console.log('Elementos del sidebar no encontrados');
            return;
        }
        
        console.log('SidebarManager inicializando...');
        
        // Función para abrir/cerrar sidebar
        const toggleSidebar = (open = null) => {
            const isActive = open !== null ? open : !sidebar.classList.contains('active');
            
            if (isActive) {
                sidebar.classList.add('active');
                if (sidebarOverlay) sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Cambiar ícono a "X"
                const icon = sidebarToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-times';
            } else {
                sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Cambiar ícono a "bars"
                const icon = sidebarToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        };
        
        // Abrir sidebar
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Botón sidebar clickeado');
            toggleSidebar();
        });
        
        // Cerrar sidebar con botón de cerrar
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                console.log('Botón cerrar sidebar clickeado');
                toggleSidebar(false);
            });
        }
        
        // Cerrar sidebar con overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                console.log('Overlay clickeado');
                toggleSidebar(false);
            });
        }
        
        // Cerrar sidebar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                toggleSidebar(false);
            }
        });
        
        // Cerrar sidebar al hacer clic en un enlace (solo en móvil)
        const sidebarLinks = document.querySelectorAll('.sidebar .menu-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleSidebar(false);
                }
            });
        });
        
        // Cerrar sidebar cuando se redimensiona a escritorio
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
                toggleSidebar(false);
            }
        });
        
        console.log('SidebarManager inicializado correctamente');
    }
};

/**
 * CSS dinámico para manejar los idiomas
 */
function setupLanguageCSS() {
    // Crear o actualizar estilos para idiomas
    const styleId = 'language-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
        /* Español visible por defecto */
        .es-lang { display: inline !important; }
        .en-lang { display: none !important; }
        
        /* Inglés visible cuando body tiene clase lang-en */
        body.lang-en .es-lang { display: none !important; }
        body.lang-en .en-lang { display: inline !important; }
        
        /* Para elementos de bloque */
        p .es-lang, p .en-lang,
        .hero-subtitle .es-lang, .hero-subtitle .en-lang,
        .card-text .es-lang, .card-text .en-lang,
        .footer-description .es-lang, .footer-description .en-lang {
            display: block !important;
        }
        
        /* Ocultar sistema antiguo */
        [data-translate] { display: none !important; }
    `;
}

/**
 * Inicialización de la aplicación
 */
function initMainApp() {
    console.log('Iniciando aplicación OFFIHO...');
    
    // Verificar si estamos en móvil
    AppState.isMobile = window.innerWidth <= 768;
    console.log('Es móvil:', AppState.isMobile);
    
    // Configurar CSS para idiomas
    setupLanguageCSS();
    
    // Inicializar managers
    ThemeManager.init();
    LanguageManager.init();
    
    // Intentar inicializar sidebar inmediatamente
    setTimeout(() => {
        SidebarManager.init();
        console.log('Sidebar inicializado en timeout');
    }, 100);
    
    // Marcar enlace activo
    updateActiveLink();
    
    console.log('Aplicación OFFIHO inicializada');
}

/**
 * Actualizar enlace activo en la navegación
 */
function updateActiveLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else if (currentPath.endsWith('/') && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
    
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else if (currentPath.endsWith('/') && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMainApp);
} else {
    initMainApp();
}

// Re-inicializar cuando los componentes estén cargados
document.addEventListener('componentsLoaded', () => {
    console.log('Componentes cargados, reinicializando...');
    ThemeManager.init();
    LanguageManager.init();
    
    // Re-inicializar sidebar después de cargar componentes
    setTimeout(() => {
        SidebarManager.init();
        console.log('Sidebar reinicializado después de componentsLoaded');
    }, 300);
    
    updateActiveLink();
});

// Exportar para uso global
window.OffihoApp = {
    config: AppConfig,
    state: AppState,
    theme: ThemeManager,
    language: LanguageManager
};

// Manejo de errores
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});