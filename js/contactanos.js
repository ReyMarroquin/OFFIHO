/**
 * contactanos.js - Funcionalidades específicas para la página de contacto
 */

// Inicializar formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    console.log('Inicializando formulario de contacto...');
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener elementos del formulario
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const formData = new FormData(this);
        
        // Validar formulario
        if (!validateContactForm(formData)) {
            return;
        }
        
        // Mostrar estado de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envío (en producción sería una petición real a tu backend)
        try {
            await simulateFormSubmission(formData);
            
            // Mostrar mensaje de éxito
            showNotification(
                '<span class="es-lang">¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.</span>' +
                '<span class="en-lang">Message sent successfully! We will contact you soon.</span>',
                'success'
            );
            
            // Resetear formulario
            this.reset();
            
        } catch (error) {
            // Mostrar mensaje de error
            showNotification(
                '<span class="es-lang">Error al enviar el mensaje. Por favor, inténtalo de nuevo.</span>' +
                '<span class="en-lang">Error sending message. Please try again.</span>',
                'error'
            );
            console.error('Error en envío:', error);
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Validación en tiempo real
    setupRealTimeValidation();
}

// Validar formulario
function validateContactForm(formData) {
    const errors = [];
    const isEnglish = document.body.classList.contains('lang-en');
    
    // Validar nombre
    const nombre = formData.get('nombre');
    if (!nombre || nombre.trim().length < 2) {
        errors.push(isEnglish ? 'Full name is required' : 'El nombre completo es requerido');
    }
    
    // Validar email
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push(isEnglish ? 'Valid email is required' : 'Email válido es requerido');
    }
    
    // Validar teléfono
    const telefono = formData.get('telefono');
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!telefono || !phoneRegex.test(telefono) || telefono.replace(/\D/g, '').length < 7) {
        errors.push(isEnglish ? 'Valid phone number is required' : 'Número de teléfono válido es requerido');
    }
    
    // Validar asunto
    const asunto = formData.get('asunto');
    if (!asunto) {
        errors.push(isEnglish ? 'Subject is required' : 'El asunto es requerido');
    }
    
    // Validar mensaje
    const mensaje = formData.get('mensaje');
    if (!mensaje || mensaje.trim().length < 10) {
        errors.push(isEnglish ? 'Message must be at least 10 characters' : 'El mensaje debe tener al menos 10 caracteres');
    }
    
    // Validar política de privacidad
    const privacidad = formData.get('privacidad');
    if (!privacidad) {
        errors.push(isEnglish ? 'You must accept the privacy policy' : 'Debes aceptar la política de privacidad');
    }
    
    // Mostrar errores si existen
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Configurar validación en tiempo real
function setupRealTimeValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validar al perder el foco
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Remover error al empezar a escribir
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(field.name) {
        case 'nombre':
            isValid = value.length >= 2;
            errorMessage = document.body.classList.contains('lang-en') 
                ? 'Name must be at least 2 characters' 
                : 'El nombre debe tener al menos 2 caracteres';
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            errorMessage = document.body.classList.contains('lang-en')
                ? 'Enter a valid email'
                : 'Ingresa un email válido';
            break;
            
        case 'telefono':
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            isValid = phoneRegex.test(value) && value.replace(/\D/g, '').length >= 7;
            errorMessage = document.body.classList.contains('lang-en')
                ? 'Enter a valid phone number'
                : 'Ingresa un número de teléfono válido';
            break;
            
        case 'mensaje':
            isValid = value.length >= 10;
            errorMessage = document.body.classList.contains('lang-en')
                ? 'Message must be at least 10 characters'
                : 'El mensaje debe tener al menos 10 caracteres';
            break;
    }
    
    if (!isValid && value !== '') {
        showFieldError(field, errorMessage);
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Mostrar error en campo
function showFieldError(field, message) {
    // Remover error anterior
    clearFieldError(field);
    
    // Añadir clase de error
    field.classList.add('error');
    
    // Crear elemento de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Insertar después del campo
    field.parentNode.appendChild(errorDiv);
}

// Limpiar error de campo
function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Simular envío de formulario
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simular éxito 95% de las veces
            Math.random() > 0.05 ? resolve() : reject(new Error('Simulated server error'));
        }, 1500);
    });
}

// Inicializar FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar item actual
            item.classList.toggle('active');
        });
    });
}

// Inicializar mapa interactivo
function initMap() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (!mapPlaceholder) return;
    
    // Añadir evento de clic para abrir Google Maps
    const mapLink = mapPlaceholder.querySelector('a');
    if (mapLink) {
        mapLink.addEventListener('click', function(e) {
            // Puedes añadir tracking aquí si es necesario
            console.log('Usuario abrió mapa');
        });
    }
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

// Inicializar página de contacto
function initContactPage() {
    console.log('Inicializando página de contacto...');
    
    // Inicializar funcionalidades
    initContactForm();
    initFAQ();
    initMap();
    
    // Añadir estilos para validación
    addValidationStyles();
    
    // Configurar botón de WhatsApp
    setupWhatsAppButton();
    
    console.log('Página de contacto inicializada correctamente');
}

// Añadir estilos CSS para validación
function addValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .field-error {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .field-error i {
            font-size: 0.9rem;
        }
        
        input.error,
        select.error,
        textarea.error {
            border-color: #e74c3c !important;
        }
        
        input.error:focus,
        select.error:focus,
        textarea.error:focus {
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
        }
        
        .dark-mode .field-error {
            color: #ff6b6b;
        }
    `;
    document.head.appendChild(style);
}

// Configurar botón de WhatsApp
function setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (!whatsappBtn) return;
    
    // Añadir número de teléfono dinámico según idioma
    const isEnglish = document.body.classList.contains('lang-en');
    const phoneNumber = isEnglish ? '+51912345678' : '+51912345678';
    whatsappBtn.href = `https://wa.me/${phoneNumber}`;
    
    // Añadir mensaje predeterminado
    const message = isEnglish 
        ? 'Hello OFFIHO, I would like to get more information about your products.'
        : 'Hola OFFIHO, me gustaría obtener más información sobre sus productos.';
    
    whatsappBtn.href += `?text=${encodeURIComponent(message)}`;
}

// Esperar a que carguen los componentes
document.addEventListener('componentsLoaded', initContactPage);

// Si los componentes ya están cargados, inicializar inmediatamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initContactPage, 500);
    });
} else {
    setTimeout(initContactPage, 500);
}