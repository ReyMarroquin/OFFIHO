/**
 * marcas.js - Funcionalidades específicas para la página de marcas
 */

// Inicializar página de marcas
function initMarcasPage() {
    console.log('Inicializando página de marcas...');
    
    // Inicializar funcionalidades
    initBrandComparison();
    initBrandFilters();
    initStatsAnimation();
    initBrandHoverEffects();
    initBrandSelector();
    
    // Añadir interactividad adicional
    addBrandInteractivity();
    
    console.log('Página de marcas inicializada correctamente');
}

// Inicializar comparador de marcas
function initBrandComparison() {
    const comparisonRows = document.querySelectorAll('.comparison-table tbody tr');
    
    comparisonRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remover selección anterior
            comparisonRows.forEach(r => r.classList.remove('selected'));
            
            // Añadir selección actual
            this.classList.add('selected');
            
            // Mostrar detalles de la característica
            const featureName = this.querySelector('td:first-child').textContent.trim();
            console.log('Característica seleccionada:', featureName);
        });
    });
}

// Inicializar filtros de marcas
function initBrandFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Actualizar botón activo
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar marcas
            filterBrandsByCategory(category);
        });
    });
}

// Filtrar marcas por categoría
function filterBrandsByCategory(category) {
    const brandCards = document.querySelectorAll('.brand-card');
    const featuredBrands = document.querySelectorAll('.featured-brand-card');
    const allCards = [...brandCards, ...featuredBrands];
    
    allCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            const cardCategory = card.getAttribute('data-category') || 
                                card.querySelector('.brand-category')?.textContent.toLowerCase();
            
            if (cardCategory && cardCategory.includes(category)) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }
    });
}

// Inicializar animación de estadísticas
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target;
                const finalValue = parseInt(statValue.textContent);
                const suffix = statValue.textContent.replace(/\d/g, '');
                
                animateCounter(statValue, 0, finalValue, suffix);
                observer.unobserve(statValue);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// Animación de contador
function animateCounter(element, start, end, suffix = '') {
    const duration = 1500;
    const startTime = Date.now();
    
    function updateCounter() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Usar easeOutCubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (end - start) * easeProgress);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// Efectos hover en marcas
function initBrandHoverEffects() {
    const brandCards = document.querySelectorAll('.brand-card, .featured-brand-card');
    
    brandCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const logoCircle = this.querySelector('.brand-logo-circle, .brand-logo-small');
            if (logoCircle) {
                logoCircle.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const logoCircle = this.querySelector('.brand-logo-circle, .brand-logo-small');
            if (logoCircle) {
                logoCircle.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Selector de marca interactivo
function initBrandSelector() {
    const brandSelector = document.createElement('div');
    brandSelector.className = 'brand-selector-modal';
    brandSelector.innerHTML = `
        <div class="modal-content">
            <h3>
                <span class="es-lang">Selecciona una Marca</span>
                <span class="en-lang">Select a Brand</span>
            </h3>
            <div class="brand-selector-grid"></div>
            <button class="btn btn-secondary close-selector">
                <span class="es-lang">Cerrar</span>
                <span class="en-lang">Close</span>
            </button>
        </div>
    `;
    
    document.body.appendChild(brandSelector);
    
    // Añadir evento al botón de selector
    const selectorBtn = document.querySelector('.brand-selector-btn');
    if (selectorBtn) {
        selectorBtn.addEventListener('click', () => {
            brandSelector.classList.add('active');
            populateBrandSelector();
        });
    }
    
    // Cerrar selector
    brandSelector.querySelector('.close-selector').addEventListener('click', () => {
        brandSelector.classList.remove('active');
    });
    
    // Cerrar al hacer clic fuera
    brandSelector.addEventListener('click', (e) => {
        if (e.target === brandSelector) {
            brandSelector.classList.remove('active');
        }
    });
}

// Poblar selector de marcas
function populateBrandSelector() {
    const selectorGrid = document.querySelector('.brand-selector-grid');
    if (!selectorGrid) return;
    
    selectorGrid.innerHTML = '';
    
    const brands = [
        { name: 'Econosillas', logo: 'ECONO', color: '#3498db' },
        { name: 'OffihoBlack', logo: 'BLACK', color: '#2c3e50' },
        { name: 'COLOS', logo: 'COLOS', color: '#9b59b6' },
        { name: 'Luke', logo: 'LUKE', color: '#e74c3c' },
        { name: 'Teksi', logo: 'TEKSI', color: '#1abc9c' },
        { name: 'Kipali', logo: 'KIPALI', color: '#f39c12' },
        { name: 'Tonnati', logo: 'TONNATI', color: '#34495e' },
        { name: 'Gamer Pro', logo: 'GPRO', color: '#e84393' },
        { name: 'Eco Furn', logo: 'ECO', color: '#27ae60' }
    ];
    
    brands.forEach(brand => {
        const brandOption = document.createElement('div');
        brandOption.className = 'brand-selector-option';
        brandOption.innerHTML = `
            <div class="selector-logo" style="background: ${brand.color}">${brand.logo}</div>
            <span>${brand.name}</span>
        `;
        
        brandOption.addEventListener('click', () => {
            window.location.href = `catalogo.html?marca=${brand.name.toLowerCase().replace(/\s+/g, '')}`;
        });
        
        selectorGrid.appendChild(brandOption);
    });
}

// Añadir interactividad adicional


// Mostrar notificación
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Añadir estilos CSS dinámicos
function addBrandStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .comparison-table tr.selected {
            background: rgba(41, 128, 185, 0.1) !important;
        }
        
        .brand-selector-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        .brand-selector-modal.active {
            display: flex;
        }
        
        .brand-selector-modal .modal-content {
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .brand-selector-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .brand-selector-option {
            background: var(--bg-light);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .brand-selector-option:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .selector-logo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 1.2rem;
            margin: 0 auto 10px;
        }
        
        .brand-tooltip {
            position: fixed;
            background: var(--dark-color);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            z-index: 10000;
            pointer-events: none;
            transform: translateX(-50%);
            white-space: nowrap;
        }
        
        .brand-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 6px solid transparent;
            border-top-color: var(--dark-color);
        }
        
        .dark-mode .brand-selector-modal .modal-content {
            background: var(--bg-dark);
            color: var(--text-light);
        }
        
        .dark-mode .brand-selector-option {
            background: var(--bg-dark-secondary);
        }
        
        .dark-mode .brand-tooltip {
            background: var(--bg-dark-secondary);
        }
        
        .dark-mode .brand-tooltip::after {
            border-top-color: var(--bg-dark-secondary);
        }
    `;
    document.head.appendChild(style);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    addBrandStyles();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initMarcasPage, 500);
        });
    } else {
        setTimeout(initMarcasPage, 500);
    }
});

// Esperar a que carguen los componentes
document.addEventListener('componentsLoaded', initMarcasPage);