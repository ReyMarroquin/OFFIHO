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

// Textos en diferentes idiomas
const Translations = {
    es: {
        // Navegación
        home: 'Inicio',
        brands: 'Marcas',
        catalog: 'Catálogo',
        chairLaw: 'Ley Silla',
        contact: 'Contáctanos',
        quote: 'Cotizar',
        
        // Tema
        theme: 'Tema',
        light: 'Claro',
        dark: 'Oscuro',
        lightTheme: 'Tema Claro',
        darkTheme: 'Tema Oscuro',
        
        // Idioma
        language: 'Idioma',
        spanish: 'Español',
        english: 'English',
        
        // Sidebar
        navigation: 'Navegación',
        contactInfo: 'Contacto',
        
        // Footer
        quickLinks: 'Enlaces Rápidos',
        categories: 'Categorías',
        address: 'Dirección',
        phone: 'Teléfono',
        email: 'Email',
        schedule: 'Horario',
        rights: 'Todos los derechos reservados',
        privacy: 'Política de Privacidad',
        terms: 'Términos y Condiciones',
        
        // Contenido
        heroTitle: 'Soluciones Ergonómicas para tu Oficina',
        heroSubtitle: 'Ofrecemos las mejores sillas y mobiliario de oficina diseñados para maximizar el confort y la productividad en el espacio de trabajo. Cumplimos con todas las normativas de la Ley Silla.',
        
        // Productos
        executiveChairs: 'Sillas Ejecutivas',
        executiveDesc: 'Diseño premium para ejecutivos. Confort superior y materiales de alta calidad que combinan elegancia y ergonomía.',
        ergonomicChairs: 'Sillas Ergonómicas',
        ergonomicDesc: 'Diseñadas por especialistas en salud ocupacional. Previenen lesiones y mejoran la postura durante largas jornadas.',
        gamingChairs: 'Sillas Gamer',
        gamingDesc: 'Máximo confort para sesiones extendidas. Diseño futurista con soporte lumbar ajustable y materiales transpirables.',
        desks: 'Escritorios',
        desksDesc: 'Mobiliario de oficina funcional y moderno. Escritorios ajustables en altura con almacenamiento inteligente.',
        warranty: 'Garantía Extendida',
        warrantyDesc: 'Todos nuestros productos incluyen garantía de 2 años y servicio técnico especializado en todo el país.',
        fastDelivery: 'Entrega Rápida',
        deliveryDesc: 'Servicio de entrega en 24-48 horas en Lima Metropolitana. Instalación profesional incluida.'
    },
    en: {
        // Navigation
        home: 'Home',
        brands: 'Brands',
        catalog: 'Catalog',
        chairLaw: 'Chair Law',
        contact: 'Contact Us',
        quote: 'Get Quote',
        
        // Theme
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        lightTheme: 'Light Theme',
        darkTheme: 'Dark Theme',
        
        // Language
        language: 'Language',
        spanish: 'Español',
        english: 'English',
        
        // Sidebar
        navigation: 'Navigation',
        contactInfo: 'Contact',
        
        // Footer
        quickLinks: 'Quick Links',
        categories: 'Categories',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        schedule: 'Schedule',
        rights: 'All rights reserved',
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions',
        
        // Content
        heroTitle: 'Ergonomic Solutions for Your Office',
        heroSubtitle: 'We offer the best chairs and office furniture designed to maximize comfort and productivity in the workspace. We comply with all Chair Law regulations.',
        
        // Products
        executiveChairs: 'Executive Chairs',
        executiveDesc: 'Premium design for executives. Superior comfort and high-quality materials combining elegance and ergonomics.',
        ergonomicChairs: 'Ergonomic Chairs',
        ergonomicDesc: 'Designed by occupational health specialists. Prevent injuries and improve posture during long workdays.',
        gamingChairs: 'Gaming Chairs',
        gamingDesc: 'Maximum comfort for extended sessions. Futuristic design with adjustable lumbar support and breathable materials.',
        desks: 'Desks',
        desksDesc: 'Functional and modern office furniture. Height-adjustable desks with smart storage.',
        warranty: 'Extended Warranty',
        warrantyDesc: 'All our products include a 2-year warranty and specialized technical service throughout the country.',
        fastDelivery: 'Fast Delivery',
        deliveryDesc: 'Delivery service in 24-48 hours in Metropolitan Lima. Professional installation included.'
    }
};

/**
 * Manejo del tema
 */
const ThemeManager = {
    // Inicializar tema
    init: () => {
        // Cargar tema guardado o usar 'light' por defecto
        const savedTheme = localStorage.getItem(AppConfig.themeKey);
        AppState.currentTheme = savedTheme || 'light';
        
        // Aplicar tema inmediatamente
        ThemeManager.applyTheme(AppState.currentTheme);
        
        // Configurar botones de tema
        ThemeManager.setupThemeButtons();
        
        console.log('Tema inicializado:', AppState.currentTheme);
    },
    
    // Aplicar tema
    applyTheme: (theme) => {
        // Remover ambas clases primero
        document.body.classList.remove('dark-mode', 'light-mode');
        
        // Aplicar clase correspondiente
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.add('light-mode');
        }
        
        // Actualizar estado
        AppState.currentTheme = theme;
        
        // Guardar en localStorage
        localStorage.setItem(AppConfig.themeKey, theme);
        
        // Actualizar botones de tema
        ThemeManager.updateThemeButtons();
        
        // Disparar evento
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
        
        console.log('Tema aplicado:', theme);
    },
    
    // Alternar tema
    toggleTheme: () => {
        const newTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
        ThemeManager.applyTheme(newTheme);
        return newTheme;
    },
    
    // Configurar botones de tema
    setupThemeButtons: () => {
        // Botón en header
        const headerThemeBtn = document.getElementById('themeToggle');
        if (headerThemeBtn) {
            headerThemeBtn.addEventListener('click', () => {
                const newTheme = ThemeManager.toggleTheme();
                
                // Actualizar ícono y texto
                const icon = headerThemeBtn.querySelector('i');
                const text = headerThemeBtn.querySelector('.theme-text');
                
                if (icon) {
                    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
                
                if (text) {
                    text.textContent = newTheme === 'dark' ? 'Claro' : 'Oscuro';
                }
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
    
    // Actualizar estado de botones de tema
    updateThemeButtons: () => {
        // Actualizar botón en header
        const headerThemeBtn = document.getElementById('themeToggle');
        if (headerThemeBtn) {
            const icon = headerThemeBtn.querySelector('i');
            const text = headerThemeBtn.querySelector('.theme-text');
            
            if (icon) {
                icon.className = AppState.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            if (text) {
                text.textContent = AppState.currentTheme === 'dark' ? 'Claro' : 'Oscuro';
            }
        }
        
        // Actualizar botones en sidebar
        const sidebarThemeBtns = document.querySelectorAll('.theme-option-sidebar');
        sidebarThemeBtns.forEach(btn => {
            const theme = btn.getAttribute('data-theme');
            if (theme === AppState.currentTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    // Obtener tema actual
    getCurrentTheme: () => {
        return AppState.currentTheme;
    }
};

/**
 * Manejo del idioma
 */
const LanguageManager = {
    // Inicializar idioma
    init: () => {
        // Cargar idioma guardado o usar 'es' por defecto
        const savedLang = localStorage.getItem(AppConfig.languageKey);
        AppState.currentLanguage = savedLang || 'es';
        
        // Aplicar idioma inmediatamente
        LanguageManager.applyLanguage(AppState.currentLanguage);
        
        // Configurar botones de idioma
        LanguageManager.setupLanguageButtons();
        
        console.log('Idioma inicializado:', AppState.currentLanguage);
    },
    
    // Aplicar idioma
    applyLanguage: (lang) => {
        // Actualizar estado
        AppState.currentLanguage = lang;
        
        // Guardar en localStorage
        localStorage.setItem(AppConfig.languageKey, lang);
        
        // Actualizar contenido
        LanguageManager.updateContent(lang);
        
        // Actualizar botones de idioma
        LanguageManager.updateLanguageButtons();
        
        // Actualizar atributo lang del html
        document.documentElement.lang = lang;
        
        // Disparar evento
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
        
        console.log('Idioma aplicado:', lang);
    },
    
    // Cambiar idioma
    changeLanguage: (lang) => {
        if (Translations[lang]) {
            LanguageManager.applyLanguage(lang);
            return true;
        }
        return false;
    },
    
    // Configurar botones de idioma
    setupLanguageButtons: () => {
        // Botón en header
        const headerLangBtns = document.querySelectorAll('.language-option');
        headerLangBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                LanguageManager.changeLanguage(lang);
                
                // Cerrar dropdown
                const dropdown = document.getElementById('languageDropdown');
                if (dropdown) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                }
            });
        });
        
        // Botones en sidebar
        const sidebarLangBtns = document.querySelectorAll('.language-option-sidebar');
        sidebarLangBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                LanguageManager.changeLanguage(lang);
            });
        });
    },
    
    // Actualizar estado de botones de idioma
    updateLanguageButtons: () => {
        const currentLang = AppState.currentLanguage;
        
        // Actualizar botón principal en header
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            const flag = languageToggle.querySelector('.language-flag');
            const code = languageToggle.querySelector('.language-code');
            
            if (flag) {
                flag.textContent = currentLang === 'es' ? '🇪🇸' : '🇺🇸';
            }
            
            if (code) {
                code.textContent = currentLang.toUpperCase();
            }
        }
        
        // Actualizar botones en dropdown
        const headerLangBtns = document.querySelectorAll('.language-option');
        headerLangBtns.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLang) {
                btn.style.fontWeight = '600';
                btn.style.backgroundColor = 'var(--bg-light)';
            } else {
                btn.style.fontWeight = '400';
                btn.style.backgroundColor = 'transparent';
            }
        });
        
        // Actualizar botones en sidebar
        const sidebarLangBtns = document.querySelectorAll('.language-option-sidebar');
        sidebarLangBtns.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    // Actualizar contenido con traducciones
    updateContent: (lang) => {
        const texts = Translations[lang];
        if (!texts) return;
        
        // Actualizar navegación
        document.querySelectorAll('[data-translate="home"]').forEach(el => {
            el.textContent = texts.home;
        });
        document.querySelectorAll('[data-translate="brands"]').forEach(el => {
            el.textContent = texts.brands;
        });
        document.querySelectorAll('[data-translate="catalog"]').forEach(el => {
            el.textContent = texts.catalog;
        });
        document.querySelectorAll('[data-translate="chairLaw"]').forEach(el => {
            el.textContent = texts.chairLaw;
        });
        document.querySelectorAll('[data-translate="contact"]').forEach(el => {
            el.textContent = texts.contact;
        });
        document.querySelectorAll('[data-translate="quote"]').forEach(el => {
            el.textContent = texts.quote;
        });
        
        // Actualizar tema
        document.querySelectorAll('[data-translate="theme"]').forEach(el => {
            el.textContent = texts.theme;
        });
        document.querySelectorAll('[data-translate="light"]').forEach(el => {
            el.textContent = texts.light;
        });
        document.querySelectorAll('[data-translate="dark"]').forEach(el => {
            el.textContent = texts.dark;
        });
        
        // Actualizar idioma
        document.querySelectorAll('[data-translate="language"]').forEach(el => {
            el.textContent = texts.language;
        });
        document.querySelectorAll('[data-translate="spanish"]').forEach(el => {
            el.textContent = texts.spanish;
        });
        document.querySelectorAll('[data-translate="english"]').forEach(el => {
            el.textContent = texts.english;
        });
        
        // Actualizar sidebar
        document.querySelectorAll('[data-translate="navigation"]').forEach(el => {
            el.textContent = texts.navigation;
        });
        document.querySelectorAll('[data-translate="contactInfo"]').forEach(el => {
            el.textContent = texts.contactInfo;
        });
        
        // Actualizar footer (si existe)
        document.querySelectorAll('[data-translate="quickLinks"]').forEach(el => {
            el.textContent = texts.quickLinks;
        });
        document.querySelectorAll('[data-translate="categories"]').forEach(el => {
            el.textContent = texts.categories;
        });
        
        // Actualizar contenido de la página
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        if (heroTitle && !heroTitle.hasAttribute('data-no-translate')) {
            heroTitle.textContent = texts.heroTitle;
        }
        
        if (heroSubtitle && !heroSubtitle.hasAttribute('data-no-translate')) {
            heroSubtitle.textContent = texts.heroSubtitle;
        }
        
        // Actualizar tarjetas de productos (solo en index.html)
        const updateCard = (selector, titleKey, descKey) => {
            const card = document.querySelector(selector);
            if (card && !card.hasAttribute('data-no-translate')) {
                const title = card.querySelector('.card-title');
                const desc = card.querySelector('.card-text');
                
                if (title) title.textContent = texts[titleKey];
                if (desc) desc.textContent = texts[descKey];
            }
        };
        
        updateCard('.content-card:nth-child(1)', 'executiveChairs', 'executiveDesc');
        updateCard('.content-card:nth-child(2)', 'ergonomicChairs', 'ergonomicDesc');
        updateCard('.content-card:nth-child(3)', 'gamingChairs', 'gamingDesc');
        updateCard('.content-card:nth-child(4)', 'desks', 'desksDesc');
        updateCard('.content-card:nth-child(5)', 'warranty', 'warrantyDesc');
        updateCard('.content-card:nth-child(6)', 'fastDelivery', 'deliveryDesc');
    },
    
    // Obtener idioma actual
    getCurrentLanguage: () => {
        return AppState.currentLanguage;
    },
    
    // Obtener texto traducido
    t: (key) => {
        return Translations[AppState.currentLanguage]?.[key] || key;
    }
};

/**
 * Manejo del sidebar
 */
const SidebarManager = {
    init: () => {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (!sidebarToggle || !sidebar) return;
        
        function toggleSidebar() {
            const isActive = sidebar.classList.toggle('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active');
            }
            document.body.classList.toggle('sidebar-active');
            
            // Cambiar ícono del botón
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
            }
            
            // Prevenir scroll del body cuando el sidebar está abierto
            document.body.style.overflow = isActive ? 'hidden' : '';
        }
        
        // Abrir/cerrar sidebar con el botón
        sidebarToggle.addEventListener('click', toggleSidebar);
        
        // Cerrar sidebar con el botón de cerrar
        if (sidebarClose) {
            sidebarClose.addEventListener('click', toggleSidebar);
        }
        
        // Cerrar sidebar con el overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', toggleSidebar);
        }
        
        // Cerrar sidebar con la tecla ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
        
        // Cerrar sidebar al hacer clic en un enlace (en móviles)
        const menuLinks = document.querySelectorAll('.menu-link, .nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                    toggleSidebar();
                }
            });
        });
        
        // Cerrar sidebar en redimensionamiento a escritorio
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
    }
};

/**
 * Inicialización de la aplicación
 */
function initMainApp() {
    // Verificar si estamos en móvil
    AppState.isMobile = window.innerWidth <= 768;
    
    // Inicializar managers
    ThemeManager.init();
    LanguageManager.init();
    SidebarManager.init();
    
    // Event listeners para cambios de tamaño
    window.addEventListener('resize', () => {
        AppState.isMobile = window.innerWidth <= 768;
    });
    
    // Marcar enlace activo
    updateActiveLink();
    
    console.log('Aplicación OFFIHO inicializada');
    console.log('Tema:', ThemeManager.getCurrentTheme());
    console.log('Idioma:', LanguageManager.getCurrentLanguage());
}

/**
 * Actualizar enlace activo en la navegación
 */
function updateActiveLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Actualizar enlaces del menú principal
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
    
    // Actualizar enlaces del sidebar
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

// Escuchar cuando los componentes estén cargados
document.addEventListener('componentsLoaded', () => {
    // Re-inicializar managers después de cargar componentes
    ThemeManager.init();
    LanguageManager.init();
    SidebarManager.init();
    updateActiveLink();
});

// Exportar para uso global
window.OffihoApp = {
    config: AppConfig,
    state: AppState,
    theme: ThemeManager,
    language: LanguageManager,
    t: LanguageManager.t
};

// Manejo de errores global
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    if (AppConfig.debug) {
        // Mostrar notificación de error si es necesario
    }
});