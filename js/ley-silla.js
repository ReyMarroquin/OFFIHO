/**
 * ley-silla.js - Funcionalidades específicas para la página de Ley Silla
 */

// Inicializar página de Ley Silla
function initLeySillaPage() {
    console.log('Inicializando página de Ley Silla...');
    
    // Inicializar funcionalidades
    initChecklistInteraction();
    initLawFacts();
    initComplianceCalculator();
    initLawTimeline();
    initExternalLinkHandler();
    initLawPrint();
    
    // Añadir efectos visuales
    addLawVisualEffects();
    
    console.log('Página de Ley Silla inicializada correctamente');
}

// Inicializar interacción del checklist
function initChecklistInteraction() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    
    checklistItems.forEach(item => {
        item.addEventListener('click', function() {
            const isCompleted = this.getAttribute('data-completed') === 'true';
            const newStatus = !isCompleted;
            
            this.setAttribute('data-completed', newStatus);
            const checkbox = this.querySelector('.checklist-checkbox');
            const checkIcon = checkbox.querySelector('i');
            
            if (newStatus) {
                checkbox.style.background = 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))';
                checkIcon.className = 'fas fa-check';
                checkIcon.style.opacity = '1';
            } else {
                checkbox.style.background = 'var(--gray-color)';
                checkIcon.style.opacity = '0.3';
            }
            
            // Actualizar resultado del checklist
            updateChecklistResult();
        });
    });
}

// Actualizar resultado del checklist
function updateChecklistResult() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    const completedItems = Array.from(checklistItems).filter(item => 
        item.getAttribute('data-completed') === 'true'
    );
    
    const completionRate = Math.round((completedItems.length / checklistItems.length) * 100);
    const resultElement = document.querySelector('.checklist-result h3');
    const resultText = document.querySelector('.checklist-result p');
    const isEnglish = document.body.classList.contains('lang-en');
    
    if (resultElement && resultText) {
        if (completionRate === 100) {
            resultElement.innerHTML = isEnglish 
                ? 'Your furniture is 100% compliant!'
                : '¡Tu mobiliario cumple al 100%!';
            resultText.innerHTML = isEnglish
                ? 'All requirements are met. Your workplace is ergonomically optimized.'
                : 'Todos los requisitos están cumplidos. Tu espacio de trabajo está optimizado ergonómicamente.';
        } else {
            resultElement.innerHTML = isEnglish
                ? `Compliance: ${completionRate}%`
                : `Cumplimiento: ${completionRate}%`;
            resultText.innerHTML = isEnglish
                ? `${checklistItems.length - completedItems.length} requirements pending. Update your furniture for full compliance.`
                : `${checklistItems.length - completedItems.length} requisitos pendientes. Actualiza tu mobiliario para cumplimiento total.`;
        }
    }
}

// Inicializar datos y hechos de la ley
function initLawFacts() {
    const lawFacts = [
        {
            fact: '2005',
            description: {
                es: 'Año de promulgación de la Ley 27571',
                en: 'Year of enactment of Law 27571'
            },
            icon: 'fas fa-calendar-alt'
        },
        {
            fact: '85%',
            description: {
                es: 'Empresas que no cumplían inicialmente',
                en: 'Companies that initially did not comply'
            },
            icon: 'fas fa-chart-line'
        },
        {
            fact: '40%',
            description: {
                es: 'Reducción de lesiones lumbares',
                en: 'Reduction in lumbar injuries'
            },
            icon: 'fas fa-heartbeat'
        },
        {
            fact: 'S/ 5,000',
            description: {
                es: 'Multa mínima por incumplimiento',
                en: 'Minimum fine for non-compliance'
            },
            icon: 'fas fa-money-bill-wave'
        }
    ];
    
    // Crear contenedor de hechos si no existe
    let factsContainer = document.querySelector('.law-facts-container');
    if (!factsContainer) {
        factsContainer = document.createElement('div');
        factsContainer.className = 'law-facts-container';
        factsContainer.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">
                    <span class="es-lang">Datos Importantes</span>
                    <span class="en-lang">Important Facts</span>
                </h2>
            </div>
            <div class="law-facts-grid"></div>
        `;
        
        // Insertar después de la sección de introducción
        const introSection = document.querySelector('.law-introduction');
        if (introSection) {
            introSection.parentNode.insertBefore(factsContainer, introSection.nextSibling);
        }
    }
    
    // Poblar hechos
    const factsGrid = factsContainer.querySelector('.law-facts-grid');
    if (factsGrid) {
        factsGrid.innerHTML = '';
        
        lawFacts.forEach(fact => {
            const factElement = document.createElement('div');
            factElement.className = 'law-fact-card';
            factElement.innerHTML = `
                <div class="fact-icon">
                    <i class="${fact.icon}"></i>
                </div>
                <div class="fact-content">
                    <h3 class="fact-number">${fact.fact}</h3>
                    <p class="fact-description">
                        <span class="es-lang">${fact.description.es}</span>
                        <span class="en-lang">${fact.description.en}</span>
                    </p>
                </div>
            `;
            
            factsGrid.appendChild(factElement);
        });
    }
}

// Calculadora de cumplimiento
function initComplianceCalculator() {
    // Crear calculadora si no existe
    let calculator = document.querySelector('.compliance-calculator');
    if (!calculator) {
        calculator = document.createElement('div');
        calculator.className = 'compliance-calculator';
        calculator.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">
                    <span class="es-lang">Calculadora de Cumplimiento</span>
                    <span class="en-lang">Compliance Calculator</span>
                </h2>
                <p class="section-description">
                    <span class="es-lang">Calcula el costo de no cumplir con la Ley de la Silla</span>
                    <span class="en-lang">Calculate the cost of not complying with the Chair Law</span>
                </p>
            </div>
            <div class="calculator-container">
                <div class="calculator-inputs">
                    <div class="form-group">
                        <label>
                            <span class="es-lang">Número de empleados:</span>
                            <span class="en-lang">Number of employees:</span>
                        </label>
                        <input type="range" id="employeeCount" min="1" max="100" value="10">
                        <span id="employeeCountValue">10</span>
                    </div>
                    <div class="calculator-results">
                        <div class="result-item">
                            <h4>
                                <span class="es-lang">Costo de multas potenciales:</span>
                                <span class="en-lang">Potential fine cost:</span>
                            </h4>
                            <p id="fineCost">S/ 50,000</p>
                        </div>
                        <div class="result-item">
                            <h4>
                                <span class="es-lang">Costo de implementación:</span>
                                <span class="en-lang">Implementation cost:</span>
                            </h4>
                            <p id="implementationCost">S/ 15,000</p>
                        </div>
                        <div class="result-item highlight">
                            <h4>
                                <span class="es-lang">Ahorro al cumplir:</span>
                                <span class="en-lang">Savings by complying:</span>
                            </h4>
                            <p id="savings">S/ 35,000</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar antes de la sección de certificación
        const certificationSection = document.querySelector('.law-certification');
        if (certificationSection) {
            certificationSection.parentNode.insertBefore(calculator, certificationSection);
        }
    }
    
    // Configurar calculadora
    const employeeCount = document.getElementById('employeeCount');
    const employeeCountValue = document.getElementById('employeeCountValue');
    const fineCost = document.getElementById('fineCost');
    const implementationCost = document.getElementById('implementationCost');
    const savings = document.getElementById('savings');
    
    if (employeeCount && employeeCountValue) {
        // Actualizar valor inicial
        employeeCountValue.textContent = employeeCount.value;
        
        // Actualizar al mover el slider
        employeeCount.addEventListener('input', function() {
            const count = parseInt(this.value);
            employeeCountValue.textContent = count;
            
            // Calcular costos
            const fine = count * 5000; // S/ 5,000 por empleado
            const implementation = count * 1500; // S/ 1,500 por silla
            const saving = fine - implementation;
            
            // Actualizar resultados
            if (fineCost) fineCost.textContent = `S/ ${fine.toLocaleString()}`;
            if (implementationCost) implementationCost.textContent = `S/ ${implementation.toLocaleString()}`;
            if (savings) savings.textContent = `S/ ${saving.toLocaleString()}`;
        });
    }
}

// Línea de tiempo de la ley
function initLawTimeline() {
    const timeline = [
        {
            year: '2005',
            title: {
                es: 'Promulgación de la Ley',
                en: 'Law Enactment'
            },
            description: {
                es: 'Se promulga la Ley N° 27571, conocida como "Ley de la Silla"',
                en: 'Law N° 27571, known as the "Chair Law", is enacted'
            }
        },
        {
            year: '2006',
            title: {
                es: 'Reglamento Técnico',
                en: 'Technical Regulation'
            },
            description: {
                es: 'Se publican las especificaciones técnicas mínimas',
                en: 'Minimum technical specifications are published'
            }
        },
        {
            year: '2010',
            title: {
                es: 'Primeras Inspecciones',
                en: 'First Inspections'
            },
            description: {
                es: 'Comienzan las inspecciones masivas a empresas',
                en: 'Massive company inspections begin'
            }
        },
        {
            year: '2020',
            title: {
                es: 'Actualización Normativa',
                en: 'Regulatory Update'
            },
            description: {
                es: 'Se incluyen requisitos para teletrabajo',
                en: 'Telework requirements are included'
            }
        }
    ];
    
    
    
    // Poblar línea de tiempo
    const timelineElement = timelineContainer.querySelector('.law-timeline');
    if (timelineElement) {
        timelineElement.innerHTML = '';
        
        timeline.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
            timelineItem.innerHTML = `
                <div class="timeline-year">${item.year}</div>
                <div class="timeline-content">
                    <h4 class="timeline-title">
                        <span class="es-lang">${item.title.es}</span>
                        <span class="en-lang">${item.title.en}</span>
                    </h4>
                    <p class="timeline-description">
                        <span class="es-lang">${item.description.es}</span>
                        <span class="en-lang">${item.description.en}</span>
                    </p>
                </div>
            `;
            
            timelineElement.appendChild(timelineItem);
        });
    }
}

// Manejar enlace externo
function initExternalLinkHandler() {
    const externalLink = document.querySelector('a[href*="ley-silla.com"]');
    if (externalLink) {
        externalLink.addEventListener('click', function(e) {
            // Confirmar antes de salir del sitio
            const isEnglish = document.body.classList.contains('lang-en');
            const message = isEnglish
                ? 'You are about to leave OFFIHO and visit an external website. Do you want to continue?'
                : 'Estás a punto de salir de OFFIHO y visitar un sitio web externo. ¿Deseas continuar?';
            
            if (!confirm(message)) {
                e.preventDefault();
            } else {
                // Opcional: track la salida
                console.log('Usuario salió a ley-silla.com');
            }
        });
    }
}

// Inicializar funcionalidad de impresión
function initLawPrint() {
    const printBtn = document.createElement('button');
    printBtn.className = 'print-law-btn';
    printBtn.innerHTML = `
        <i class="fas fa-print"></i>
        <span class="es-lang">Imprimir Guía</span>
        <span class="en-lang">Print Guide</span>
    `;
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Añadir botón al final del contenido principal
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const printContainer = document.createElement('div');
        printContainer.className = 'print-container';
        printContainer.appendChild(printBtn);
        mainContent.appendChild(printContainer);
    }
}

// Añadir efectos visuales
function addLawVisualEffects() {
    // Efecto de aparición para secciones
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Contador animado para estadísticas
    const counters = document.querySelectorAll('.fact-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        
        animateCounter(counter, 0, target, suffix);
    });
}

// Animación de contador
function animateCounter(element, start, end, suffix = '') {
    const duration = 2000;
    const startTime = Date.now();
    
    function updateCounter() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (end - start) * easeProgress);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// Añadir estilos CSS dinámicos
function addLawStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .law-facts-container,
        .compliance-calculator,
        .law-timeline-container {
            padding: 80px 0;
            background: white;
            width: 85%;
            margin-left:7.5%;
        }
        
        .dark-mode .law-facts-container,
        .dark-mode .compliance-calculator,
        .dark-mode .law-timeline-container {
            background: var(--bg-dark);
        }
        
        .law-facts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        
        .law-fact-card {
            background: var(--bg-light);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .law-fact-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-color);
        }
        
        .fact-icon {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 20px;
        }
        
        .fact-number {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--dark-color);
            margin-bottom: 10px;
        }
        
        .fact-description {
            color: var(--gray-color);
            line-height: 1.5;
            margin: 0;
            font-size: 0.95rem;
        }
        
        .compliance-calculator {
            background: var(--bg-light) !important;
        }
        
        .calculator-container {
            max-width: 600px;
            margin: 40px auto 0;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
        }
        
        .calculator-inputs {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: var(--dark-color);
        }
        
        .form-group input[type="range"] {
            width: 100%;
            height: 10px;
            -webkit-appearance: none;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-radius: 5px;
            outline: none;
        }
        
        .form-group input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 25px;
            height: 25px;
            background: white;
            border: 3px solid var(--primary-color);
            border-radius: 50%;
            cursor: pointer;
        }
        
        #employeeCountValue {
            display: inline-block;
            margin-left: 15px;
            font-weight: 700;
            font-size: 1.2rem;
            color: var(--primary-color);
        }
        
        .calculator-results {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .result-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: var(--bg-light);
            border-radius: 12px;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .result-item.highlight {
            background: linear-gradient(135deg, rgba(41, 128, 185, 0.1), rgba(39, 174, 96, 0.1));
            border-color: var(--secondary-color);
        }
        
        .result-item h4 {
            font-size: 1rem;
            color: var(--dark-color);
            margin: 0;
            font-weight: 600;
        }
        
        .result-item p {
            font-size: 1.4rem;
            font-weight: 800;
            color: var(--primary-color);
            margin: 0;
        }
        
        .result-item.highlight p {
            color: var(--secondary-color);
        }
        
        .law-timeline {
            position: relative;
            max-width: 800px;
            margin: 40px auto 0;
            padding: 20px 0;
        }
        
        .law-timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
            transform: translateX(-50%);
        }
        
        .timeline-item {
            position: relative;
            width: 45%;
            margin-bottom: 40px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .timeline-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .timeline-item.left {
            left: 0;
            text-align: right;
            padding-right: 60px;
        }
        
        .timeline-item.right {
            left: 55%;
            text-align: left;
            padding-left: 60px;
        }
        
        .timeline-year {
            position: absolute;
            top: 0;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.3rem;
            font-weight: 800;
            box-shadow: 0 10px 25px rgba(41, 128, 185, 0.3);
            z-index: 2;
        }
        
        .timeline-item.left .timeline-year {
            right: -40px;
        }
        
        .timeline-item.right .timeline-year {
            left: -40px;
        }
        
        .timeline-content {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .timeline-title {
            font-size: 1.2rem;
            color: var(--dark-color);
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .timeline-description {
            color: var(--gray-color);
            line-height: 1.6;
            margin: 0;
            font-size: 0.95rem;
        }
        
        .print-container {
            text-align: center;
            padding: 40px 0;
        }
        
        .print-law-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: var(--primary-color);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            border: none;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .print-law-btn:hover {
            background: var(--secondary-color);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(41, 128, 185, 0.3);
        }
        
        .dark-mode .law-fact-card {
            background: var(--bg-dark-secondary);
            border-color: rgba(255, 255, 255, 0.05);
        }
        
        .dark-mode .law-fact-card:hover {
            border-color: var(--secondary-color);
        }
        
        .dark-mode .fact-number {
            color: var(--text-light);
        }
        
        .dark-mode .fact-description {
            color: var(--text-light-secondary);
        }
        
        .dark-mode .compliance-calculator {
            background: var(--bg-dark-secondary) !important;
        }
        
        .dark-mode .calculator-container {
            background: var(--bg-dark);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        
        .dark-mode .form-group label {
            color: var(--text-light);
        }
        
        .dark-mode .result-item {
            background: var(--bg-dark-secondary);
            border-color: rgba(255, 255, 255, 0.05);
        }
        
        .dark-mode .result-item.highlight {
            background: linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(39, 174, 96, 0.15));
        }
        
        .dark-mode .result-item h4 {
            color: var(--text-light);
        }
        
        .dark-mode .timeline-content {
            background: var(--bg-dark);
            border-color: rgba(255, 255, 255, 0.05);
        }
        
        .dark-mode .timeline-title {
            color: var(--text-light);
        }
        
        .dark-mode .timeline-description {
            color: var(--text-light-secondary);
        }
        
        @media print {
            .main-header,
            .main-footer,
            .whatsapp-float,
            .print-law-btn,
            .mobile-menu-btn {
                display: none !important;
            }
            
            body {
                background: white !important;
                color: black !important;
            }
            
            .law-hero {
                background: white !important;
                color: black !important;
                padding: 50px 0 !important;
            }
            
            .law-hero-title {
                color: black !important;
            }
            
            section {
                page-break-inside: avoid;
            }
            
            .btn {
                display: none !important;
            }
        }
        
        @media (max-width: 768px) {
            .law-facts-container,
            .compliance-calculator,
            .law-timeline-container {
                padding: 60px 0;
            }
            
            .law-facts-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .calculator-container {
                padding: 30px 20px;
            }
            
            .result-item {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
            
            .law-timeline::before {
                left: 30px;
            }
            
            .timeline-item {
                width: 100%;
                left: 0 !important;
                text-align: left !important;
                padding-left: 80px !important;
                padding-right: 20px !important;
            }
            
            .timeline-item .timeline-year {
                left: 0 !important;
                right: auto !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    addLawStyles();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initLeySillaPage, 500);
        });
    } else {
        setTimeout(initLeySillaPage, 500);
    }
});

// Esperar a que carguen los componentes
document.addEventListener('componentsLoaded', initLeySillaPage);