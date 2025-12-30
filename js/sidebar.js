// Sidebar Navigation Script - Versión responsiva
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const sidebar = document.getElementById('sidebarNav');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const body = document.body;
    
    // Verificar si estamos en un dispositivo móvil/tablet
    function isMobileDevice() {
        return window.innerWidth <= 1024;
    }
    
    // Abrir el menú
    function openSidebar() {
        if (!isMobileDevice()) return; // Solo funciona en móvil/tablet
        
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        menuToggle.classList.add('active');
        body.classList.add('sidebar-open');
    }
    
    // Cerrar el menú
    function closeSidebarFunc() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('sidebar-open');
    }
    
    // Event Listeners
    menuToggle.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeSidebarFunc);
    sidebarOverlay.addEventListener('click', closeSidebarFunc);
    
    // Cerrar menú al hacer clic en un enlace
    const menuLinks = document.querySelectorAll('.sidebar-menu .menu-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeSidebarFunc();
        });
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebarFunc();
        }
    });
    
    // Ajustar visibilidad del botón de menú según el tamaño de pantalla
    function adjustMenuVisibility() {
        if (isMobileDevice()) {
            menuToggle.style.opacity = '1';
            menuToggle.style.visibility = 'visible';
        } else {
            menuToggle.style.opacity = '0';
            menuToggle.style.visibility = 'hidden';
            // Asegurarse de que el menú esté cerrado en escritorio
            closeSidebarFunc();
        }
    }
    
    // Llamar al cargar y al redimensionar
    adjustMenuVisibility();
    window.addEventListener('resize', adjustMenuVisibility);
    
    // Efecto de animación en los items del menú al cargar
    setTimeout(() => {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 * index);
        });
    }, 300);
    
    // Añadir efecto visual al hacer scroll en el menú
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu) {
        sidebarMenu.addEventListener('scroll', function() {
            const scrollPosition = sidebarMenu.scrollTop;
            const header = document.querySelector('.sidebar-header');
            
            if (scrollPosition > 10) {
                header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }
});