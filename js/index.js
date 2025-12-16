/**
 * index.js - Funcionalidades específicas para la página principal
 */

// Efectos de animación en scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animar
    document.querySelectorAll('.category-card, .brand-card, .resource-card').forEach(card => {
        observer.observe(card);
    });
}

// Contador de visitas (simulado)
function updateVisitorCount() {
    const visitorElements = document.querySelectorAll('.visitor-count');
    if (visitorElements.length > 0) {
        // Simular un número de visitas (en producción esto vendría de una API)
        const baseCount = 15234;
        const randomIncrement = Math.floor(Math.random() * 100);
        const totalCount = baseCount + randomIncrement;
        
        visitorElements.forEach(element => {
            element.textContent = totalCount.toLocaleString();
        });
    }
}

// Inicializar carrusel de productos destacados (si existe)
function initFeaturedProducts() {
    const productCarousel = document.getElementById('featuredProductsCarousel');
    if (!productCarousel) return;
    
    // Configurar carrusel simple
    let currentIndex = 0;
    const items = productCarousel.querySelectorAll('.product-item');
    const totalItems = items.length;
    
    function showNextProduct() {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % totalItems;
        items[currentIndex].classList.add('active');
    }
    
    // Rotar productos cada 5 segundos
    if (totalItems > 1) {
        setInterval(showNextProduct, 5000);
    }
}

// Manejar formulario de suscripción al newsletter
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Validación simple
        if (!email || !email.includes('@')) {
            showNotification('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }
        
        // Simular envío
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('¡Gracias por suscribirte! Te enviaremos nuestras novedades.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Eliminar notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Añadir al body
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Configurar cierre
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Inicializar funcionalidades específicas del index
function initIndexPage() {
    console.log('Inicializando página index...');
    
    // Inicializar animaciones
    initScrollAnimations();
    
    // Actualizar contador de visitas
    updateVisitorCount();
    
    // Inicializar carrusel de productos
    initFeaturedProducts();
    
    // Inicializar formulario de newsletter
    initNewsletterForm();
    
    // Efecto parallax para hero section
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.backgroundPosition = `center ${rate}px`;
        }
    });
    
    // Añadir clases para animación
    document.querySelectorAll('.category-card, .brand-card, .resource-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    console.log('Página index inicializada correctamente');
}

// Esperar a que carguen los componentes
document.addEventListener('componentsLoaded', initIndexPage);

// Si los componentes ya están cargados, inicializar inmediatamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initIndexPage, 500);
    });
} else {
    setTimeout(initIndexPage, 500);
}