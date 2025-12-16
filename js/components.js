/**
 * components.js - Carga dinámicamente el header y footer
 */

// Configuración
const CONFIG = {
    headerPath: 'partials/header.html',
    footerPath: 'partials/footer.html',
    cssPaths: {
        header: 'css/header.css',
        footer: 'css/footer.css'
    }
};

// Estado de la aplicación
const APP_STATE = {
    componentsLoaded: false,
    currentTheme: 'light',
    currentLanguage: 'es'
};

// Cache para componentes cargados
const COMPONENT_CACHE = new Map();

/**
 * Carga un componente HTML desde un archivo con cache
 */
async function loadComponent(path, elementId = null) {
    try {
        // Verificar cache primero
        if (COMPONENT_CACHE.has(path)) {
            console.log(`Usando caché para: ${path}`);
            const cachedHtml = COMPONENT_CACHE.get(path);
            insertHTML(cachedHtml, elementId);
            return cachedHtml;
        }
        
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar ${path}`);
        }
        
        const html = await response.text();
        
        // Guardar en cache
        COMPONENT_CACHE.set(path, html);
        
        // Insertar en el DOM
        insertHTML(html, elementId);
        
        return html;
    } catch (error) {
        console.error('Error cargando componente:', error);
        showErrorNotification(`Error cargando componente: ${path.split('/').pop()}`);
        return null;
    }
}

/**
 * Inserta HTML en el DOM
 */
function insertHTML(html, elementId) {
    if (elementId) {
        // Insertar en un elemento específico
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Elemento con ID ${elementId} no encontrado`);
        }
    } else {
        // Insertar al inicio del body para el header
        document.body.insertAdjacentHTML('afterbegin', html);
    }
}

/**
 * Muestra notificación de error
 */
function showErrorNotification(message) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Cerrar manualmente
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

/**
 * Carga una hoja de estilo CSS dinámicamente
 */
function loadCSS(path) {
    return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        if (isCSSLoaded(path)) {
            resolve();
            return;
        }
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        link.onload = () => {
            console.log(`CSS cargado: ${path}`);
            resolve();
        };
        link.onerror = () => {
            console.error(`Error cargando CSS: ${path}`);
            reject(new Error(`Error cargando CSS: ${path}`));
        };
        
        document.head.appendChild(link);
    });
}

/**
 * Verifica si un CSS ya está cargado
 */
function isCSSLoaded(path) {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    const fileName = path.split('/').pop();
    
    for (const link of links) {
        if (link.href.includes(fileName)) {
            return true;
        }
    }
    return false;
}

/**
 * Carga el header y sus dependencias
 */
async function loadHeader() {
    try {
        // Cargar CSS del header si no está cargado
        await loadCSS(CONFIG.cssPaths.header);
        
        // Cargar el HTML del header
        const headerHTML = await loadComponent(CONFIG.headerPath);
        
        if (headerHTML) {
            console.log('✅ Header cargado exitosamente');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error cargando header:', error);
        return false;
    }
}

/**
 * Carga el footer y sus dependencias
 */
async function loadFooter() {
    try {
        // Cargar CSS del footer si no está cargado
        await loadCSS(CONFIG.cssPaths.footer);
        
        // Cargar el HTML del footer
        const footerHTML = await loadComponent(CONFIG.footerPath, 'footer-container');
        
        if (footerHTML) {
            console.log('✅ Footer cargado exitosamente');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error cargando footer:', error);
        return false;
    }
}

/**
 * Crea un contenedor para el footer si no existe
 */
function createFooterContainer() {
    if (!document.getElementById('footer-container')) {
        const footerContainer = document.createElement('div');
        footerContainer.id = 'footer-container';
        document.body.appendChild(footerContainer);
        console.log('Contenedor del footer creado');
    }
}

/**
 * Actualiza los enlaces activos en el menú
 */
function updateActiveMenuLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentPath = window.location.pathname;
    
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
        // Actualizar enlaces del menú principal
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            link.classList.remove('active');
            
            if (linkPath === currentPage || 
                (currentPath.endsWith('/') && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
        
        // Actualizar enlaces del sidebar
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            link.classList.remove('active');
            
            if (linkPath === currentPage || 
                (currentPath.endsWith('/') && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
        
        console.log('Enlaces activos actualizados');
    }, 100);
}

/**
 * Inicializa funcionalidades básicas después de cargar componentes
 */
function initializeBasicFeatures() {
    console.log('Inicializando funcionalidades básicas...');
    
    // Cargar configuraciones guardadas
    loadSavedSettings();
    
    // Actualizar visibilidad de textos según idioma
    updateLanguageVisibility();
    
    // Actualizar enlaces del menú
    updateActiveMenuLinks();
    
    // Inicializar sidebar
    initializeSidebar();
    
    // Inicializar botones de idioma y tema
    initializeLanguageButtons();
    initializeThemeButtons();
    
    // Actualizar botones visualmente
    updateLanguageButtons();
    updateThemeButton();
    updateSidebarThemeButtons();
    
    console.log('Funcionalidades básicas inicializadas');
}

/**
 * Carga configuraciones guardadas
 */
function loadSavedSettings() {
    try {
        // Cargar tema
        const savedTheme = localStorage.getItem('offiho_theme');
        if (savedTheme) {
            APP_STATE.currentTheme = savedTheme;
            console.log(`Tema cargado desde localStorage: ${savedTheme}`);
        }
        
        // Cargar idioma
        const savedLanguage = localStorage.getItem('offiho_language');
        if (savedLanguage) {
            APP_STATE.currentLanguage = savedLanguage;
            console.log(`Idioma cargado desde localStorage: ${savedLanguage}`);
        }
        
        // Aplicar tema inmediatamente
        if (APP_STATE.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Actualizar atributo lang del html
        document.documentElement.lang = APP_STATE.currentLanguage;
        
        console.log(`Configuraciones cargadas - Tema: ${APP_STATE.currentTheme}, Idioma: ${APP_STATE.currentLanguage}`);
    } catch (error) {
        console.error('Error cargando configuraciones:', error);
        // Valores por defecto
        APP_STATE.currentTheme = 'light';
        APP_STATE.currentLanguage = 'es';
    }
}

/**
 * Muestra/oculta textos según el idioma seleccionado
 */
function updateLanguageVisibility() {
    const currentLang = APP_STATE.currentLanguage;
    console.log(`Actualizando visibilidad de idioma: ${currentLang}`);
    
    // Encontrar todos los elementos con clase de idioma
    const esElements = document.querySelectorAll('.es-lang');
    const enElements = document.querySelectorAll('.en-lang');
    
    console.log(`Elementos encontrados: ${esElements.length} ES, ${enElements.length} EN`);
    
    // Ocultar todos los elementos primero
    esElements.forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.style.position = 'absolute';
    });
    
    enElements.forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.style.position = 'absolute';
    });
    
    // Mostrar solo los del idioma actual
    const elementsToShow = currentLang === 'es' ? esElements : enElements;
    
    elementsToShow.forEach(el => {
        // Restaurar propiedades según el tipo de elemento
        const tagName = el.tagName.toLowerCase();
        const isInline = ['span', 'a', 'strong', 'em', 'i', 'b'].includes(tagName);
        
        el.style.display = isInline ? 'inline' : 'block';
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.position = 'static';
    });
    
    // También actualizar elementos que tienen data-lang
    const langElements = document.querySelectorAll('[data-lang]');
    langElements.forEach(el => {
        const lang = el.getAttribute('data-lang');
        if (lang === currentLang) {
            el.style.display = '';
            el.style.visibility = 'visible';
        } else {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        }
    });
    
    console.log(`✅ Visibilidad actualizada - Mostrando: ${currentLang.toUpperCase()}`);
}

/**
 * Inicializa los botones de tema
 */
function initializeThemeButtons() {
    // Botón de tema en header
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn && !themeBtn.dataset.listenerAdded) {
        themeBtn.addEventListener('click', toggleTheme);
        themeBtn.dataset.listenerAdded = 'true';
        console.log('Botón de tema del header inicializado');
    }
    
    // Botones de tema en sidebar
    const sidebarThemeButtons = document.querySelectorAll('.theme-option-sidebar');
    sidebarThemeButtons.forEach(button => {
        if (!button.dataset.listenerAdded) {
            button.addEventListener('click', () => {
                const theme = button.getAttribute('data-theme');
                changeTheme(theme);
            });
            button.dataset.listenerAdded = 'true';
        }
    });
    
    console.log('Botones de tema inicializados');
}

/**
 * Cambia el tema
 */
function changeTheme(theme) {
    if (!['light', 'dark'].includes(theme)) return;
    
    APP_STATE.currentTheme = theme;
    
    // Aplicar cambios visuales
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Guardar en localStorage
    try {
        localStorage.setItem('offiho_theme', theme);
    } catch (error) {
        console.error('Error guardando tema:', error);
    }
    
    // Actualizar botones
    updateThemeButton();
    updateSidebarThemeButtons();
    
    // Disparar evento
    document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme }
    }));
    
    console.log(`Tema cambiado a: ${theme}`);
}

/**
 * Alterna el tema
 */
function toggleTheme() {
    const newTheme = APP_STATE.currentTheme === 'dark' ? 'light' : 'dark';
    changeTheme(newTheme);
}

/**
 * Actualiza el botón de cambio de tema en el header
 */
function updateThemeButton() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) {
        console.warn('Botón de tema no encontrado');
        return;
    }
    
    const icon = themeBtn.querySelector('i');
    const text = themeBtn.querySelector('.theme-text');
    
    if (icon) {
        icon.className = APP_STATE.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    if (text) {
        text.textContent = APP_STATE.currentTheme === 'dark' ? 'Claro' : 'Oscuro';
    }
    
    console.log('Botón de tema actualizado');
}

/**
 * Actualiza los botones de tema en el sidebar
 */
function updateSidebarThemeButtons() {
    const themeButtons = document.querySelectorAll('.theme-option-sidebar');
    themeButtons.forEach(button => {
        const theme = button.getAttribute('data-theme');
        if (theme === APP_STATE.currentTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    console.log('Botones de tema del sidebar actualizados');
}

/**
 * Inicializa los botones de idioma
 */
function initializeLanguageButtons() {
    // Botón en header (OFFIHO)
    const headerLangBtn = document.getElementById('languageToggle');
    if (headerLangBtn && !headerLangBtn.dataset.listenerAdded) {
        headerLangBtn.addEventListener('click', toggleLanguage);
        headerLangBtn.dataset.listenerAdded = 'true';
        console.log('Botón de idioma del header inicializado');
    }
    
    // Botón en sidebar (OFFIHO)
    const sidebarLangBtn = document.getElementById('languageToggleSidebar');
    if (sidebarLangBtn && !sidebarLangBtn.dataset.listenerAdded) {
        sidebarLangBtn.addEventListener('click', toggleLanguage);
        sidebarLangBtn.dataset.listenerAdded = 'true';
        console.log('Botón de idioma del sidebar inicializado');
    }
    
    // Botón de Ley Silla (si existe en la página)
    const singleLangBtn = document.getElementById('singleLangToggle');
    if (singleLangBtn && !singleLangBtn.dataset.listenerAdded) {
        singleLangBtn.addEventListener('click', toggleLanguage);
        singleLangBtn.dataset.listenerAdded = 'true';
        console.log('Botón de idioma de Ley Silla inicializado');
    }
    
    console.log('Botones de idioma inicializados');
}

/**
 * Alterna entre español e inglés
 */
function toggleLanguage() {
    const newLang = APP_STATE.currentLanguage === 'es' ? 'en' : 'es';
    changeLanguage(newLang);
    
    // Efecto visual de cambio
    const headerBtn = document.getElementById('languageToggle');
    const sidebarBtn = document.getElementById('languageToggleSidebar');
    const singleBtn = document.getElementById('singleLangToggle');
    
    if (headerBtn) {
        headerBtn.classList.add('changing');
        setTimeout(() => {
            headerBtn.classList.remove('changing');
        }, 400);
    }
    
    if (sidebarBtn) {
        sidebarBtn.classList.add('changing');
        setTimeout(() => {
            sidebarBtn.classList.remove('changing');
        }, 400);
    }
    
    if (singleBtn) {
        singleBtn.classList.add('changing');
        setTimeout(() => {
            singleBtn.classList.remove('changing');
        }, 400);
    }
}

/**
 * Cambia el idioma
 */
function changeLanguage(lang) {
    console.log(`Cambiando idioma a: ${lang}`);
    
    if (!['es', 'en'].includes(lang)) {
        console.error('Idioma no válido:', lang);
        return;
    }
    
    APP_STATE.currentLanguage = lang;
    
    try {
        localStorage.setItem('offiho_language', lang);
        console.log('Idioma guardado en localStorage');
    } catch (error) {
        console.error('Error guardando idioma:', error);
    }
    
    // Actualizar atributo lang del html
    document.documentElement.lang = lang;
    console.log('Atributo lang del html actualizado a:', lang);
    
    // Actualizar visibilidad de textos
    updateLanguageVisibility();
    
    // Actualizar botones de idioma (ES/US)
    updateLanguageButtons();
    
    // Actualizar botón de Ley Silla (si existe)
    updateSingleLangButton();
    
    // Disparar evento
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { 
            language: lang,
            timestamp: Date.now()
        }
    }));
    
    console.log(`✅ Idioma cambiado a: ${lang}`);
}

/**
 * Actualiza estado de botones de idioma (para ES/US)
 */
function updateLanguageButtons() {
    const currentLang = APP_STATE.currentLanguage;
    console.log(`Actualizando botones de idioma a: ${currentLang}`);
    
    // Botón en header - OFFIHO
    const headerLangBtn = document.getElementById('languageToggle');
    if (headerLangBtn) {
        const flag = headerLangBtn.querySelector('.language-flag');
        const code = headerLangBtn.querySelector('.language-code');
        
        if (flag) {
            // Mostrar solo texto: ES o US
            flag.textContent = currentLang === 'es' ? 'ES' : 'US';
            flag.style.display = 'inline-block';
            flag.style.fontSize = '14px';
            flag.style.fontWeight = 'bold';
            console.log('Header button actualizado a:', flag.textContent);
        }
        
        if (code) {
            code.style.display = 'none';
        }
    }
    
    // Botón en sidebar - OFFIHO
    const sidebarLangBtn = document.getElementById('languageToggleSidebar');
    if (sidebarLangBtn) {
        const flag = sidebarLangBtn.querySelector('.language-flag-sidebar');
        const text = sidebarLangBtn.querySelector('.language-text-sidebar');
        const switchText = sidebarLangBtn.querySelector('.language-switch-text');
        
        if (flag) {
            // Mostrar solo texto: ES o US
            flag.textContent = currentLang === 'es' ? 'ES' : 'US';
            flag.style.display = 'inline-block';
            flag.style.fontSize = '16px';
            flag.style.fontWeight = 'bold';
            console.log('Sidebar button actualizado a:', flag.textContent);
        }
        
        if (text) {
            text.style.display = 'none';
        }
        
        if (switchText) {
            switchText.textContent = currentLang === 'es' ? 
                'Switch to English' : 'Cambiar a Español';
        }
    }
    
    console.log('Botones de idioma actualizados');
}

/**
 * Actualiza el botón de idioma de Ley Silla
 */
function updateSingleLangButton() {
    const singleLangBtn = document.getElementById('singleLangToggle');
    if (!singleLangBtn) return;
    
    const currentLang = APP_STATE.currentLanguage;
    const langText = singleLangBtn.querySelector('.lang-text');
    
    if (langText) {
        langText.textContent = currentLang === 'es' ? 'ES' : 'EN';
    }
    
    // Actualizar atributo data-lang
    singleLangBtn.setAttribute('data-lang', currentLang);
    
    console.log('Botón Ley Silla actualizado a:', currentLang);
}

/**
 * Inicializa el sidebar
 */
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (!sidebarToggle || !sidebar) {
        console.warn('Elementos del sidebar no encontrados');
        return;
    }
    
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
        
        console.log(`Sidebar ${isActive ? 'abierto' : 'cerrado'}`);
    }
    
    // Abrir/cerrar sidebar con el botón
    if (!sidebarToggle.dataset.listenerAdded) {
        sidebarToggle.addEventListener('click', toggleSidebar);
        sidebarToggle.dataset.listenerAdded = 'true';
    }
    
    // Cerrar sidebar con el botón de cerrar
    if (sidebarClose && !sidebarClose.dataset.listenerAdded) {
        sidebarClose.addEventListener('click', toggleSidebar);
        sidebarClose.dataset.listenerAdded = 'true';
    }
    
    // Cerrar sidebar con el overlay
    if (sidebarOverlay && !sidebarOverlay.dataset.listenerAdded) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
        sidebarOverlay.dataset.listenerAdded = 'true';
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
        if (!link.dataset.sidebarListener) {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                    toggleSidebar();
                }
            });
            link.dataset.sidebarListener = 'true';
        }
    });
    
    // Cerrar sidebar en redimensionamiento a escritorio
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
    
    // Configurar botones de tema en sidebar
    const sidebarThemeButtons = document.querySelectorAll('.theme-option-sidebar');
    sidebarThemeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            APP_STATE.currentTheme = theme;
            
            // Aplicar tema
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            
            // Guardar en localStorage
            localStorage.setItem('offiho_theme', theme);
            
            // Actualizar botones
            updateThemeButton();
            updateSidebarThemeButtons();
            
            // Disparar evento
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme }
            }));
            
            console.log(`Tema cambiado a: ${theme} desde sidebar`);
        });
    });
    
    // Inicializar estado de botones de tema en sidebar
    updateSidebarThemeButtons();
    
    console.log('Sidebar inicializado');
}

/**
 * Carga todos los componentes
 */
async function loadComponents() {
    try {
        console.log('🚀 Iniciando carga de componentes...');
        
        // Crear contenedor para el footer
        createFooterContainer();
        
        // Cargar componentes en paralelo para mejor rendimiento
        const [headerLoaded, footerLoaded] = await Promise.allSettled([
            loadHeader(),
            loadFooter()
        ]);
        
        const headerSuccess = headerLoaded.status === 'fulfilled' && headerLoaded.value;
        const footerSuccess = footerLoaded.status === 'fulfilled' && footerLoaded.value;
        
        if (headerSuccess && footerSuccess) {
            APP_STATE.componentsLoaded = true;
            
            // Inicializar funcionalidades básicas
            initializeBasicFeatures();
            
            // Disparar evento personalizado
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('componentsLoaded', {
                    detail: { 
                        components: ['header', 'footer'],
                        theme: APP_STATE.currentTheme,
                        language: APP_STATE.currentLanguage
                    }
                }));
            }, 100);
            
            console.log('🎉 Todos los componentes cargados exitosamente');
            
        } else {
            const errors = [];
            if (headerLoaded.status === 'rejected') errors.push('header');
            if (footerLoaded.status === 'rejected') errors.push('footer');
            
            throw new Error(`Error cargando componentes: ${errors.join(', ')}`);
        }
        
    } catch (error) {
        console.error('❌ Error al cargar componentes:', error);
        showErrorNotification('Error cargando algunos componentes. La página puede no mostrarse correctamente.');
        
        // Mostrar contenido principal incluso si falla la carga de componentes
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }
}

/**
 * Inicializa la aplicación
 */
function initApp() {
    // Verificar si estamos en el entorno correcto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOM completamente cargado');
            loadComponents();
        });
    } else {
        console.log('📄 DOM ya está cargado');
        loadComponents();
    }
    
    // Manejar errores no capturados
    window.addEventListener('error', (event) => {
        console.error('⚠️ Error no capturado:', event.error);
    });
    
    // Manejar promesas rechazadas no capturadas
    window.addEventListener('unhandledrejection', (event) => {
        console.error('⚠️ Promesa rechazada no capturada:', event.reason);
    });
}

// Inicializar la aplicación
initApp();

// Exportar funciones para uso externo
window.OffihoComponents = {
    reloadComponents: loadComponents,
    updateMenu: updateActiveMenuLinks,
    toggleTheme: toggleTheme,
    toggleLanguage: toggleLanguage,
    changeLanguage: changeLanguage,
    updateLanguageVisibility: updateLanguageVisibility,
    getCurrentTheme: () => APP_STATE.currentTheme,
    getCurrentLanguage: () => APP_STATE.currentLanguage
};

// Agregar estilos para la notificación de error
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 9999;
    }
    
    .error-notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 18px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .error-notification {
            min-width: auto;
            width: calc(100% - 40px);
            right: 20px;
            left: 20px;
        }
    }
`;

document.head.appendChild(errorStyles);