// Variables globales
let currentSlide = 0;
let slides = [];
let totalSlides = 0;

// Tu número de WhatsApp (cambiar por tu número real)
const WHATSAPP_NUMBER = '50663620357'; 

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    slides = document.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
    
    if (slides.length > 0) {
        initCarousel();
    }
    initFilters();
    initMobileMenu();
    initOrderButtons();
    initContactForm();
});

// ========== CARRUSEL ==========
function initCarousel() {
    // Crear dots
    const dotsContainer = document.querySelector('.carousel-dots');
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Botones de navegación
    document.querySelector('.carousel-btn.prev').addEventListener('click', prevSlide);
    document.querySelector('.carousel-btn.next').addEventListener('click', nextSlide);

    // Auto-slide cada 5 segundos
    setInterval(nextSlide, 5000);
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });

    // Actualizar dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// ========== FILTROS DE LIGAS ==========
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const jerseyCards = document.querySelectorAll('.jersey-card[data-league]');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');

            const filterValue = this.getAttribute('data-league');

            // Filtrar tarjetas
            jerseyCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.display = 'block';
                    }, 10);
                } else {
                    if (card.getAttribute('data-league') === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.display = 'block';
                        }, 10);
                    } else {
                        card.classList.add('hidden');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// ========== MENÚ MÓVIL ==========
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animación del hamburger
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// ========== BOTONES DE ORDENAR ==========
function initOrderButtons() {
    // Usar evento de delegación para asegurar que funcione con todos los botones
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('order-btn') || e.target.closest('.order-btn')) {
            const button = e.target.classList.contains('order-btn') ? e.target : e.target.closest('.order-btn');
            const jerseyName = button.getAttribute('data-jersey');
            const jerseyInfo = button.closest('.jersey-info');
            const price = jerseyInfo ? jerseyInfo.querySelector('.price').textContent : '$79.99';
            
            // Crear mensaje para WhatsApp
            const message = `¡Hola! Estoy interesado en ordenar la camiseta de *${jerseyName}* con precio de ${price}. ¿Está disponible?`;
            
            // Codificar el mensaje para URL
            const encodedMessage = encodeURIComponent(message);
            
            // Crear URL de WhatsApp
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            
            // Abrir WhatsApp en nueva pestaña
            window.open(whatsappURL, '_blank');
        }
    });
}

// ========== FORMULARIO DE CONTACTO ==========
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtener valores del formulario
            const name = document.getElementById('name') ? document.getElementById('name').value : '';
            const email = document.getElementById('email') ? document.getElementById('email').value : '';
            const phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
            const message = document.getElementById('message') ? document.getElementById('message').value : '';

            // Crear mensaje para WhatsApp
            const whatsappMessage = `*Nuevo mensaje de contacto*

*Nombre:* ${name}
*Email:* ${email}
*Teléfono:* ${phone}

*Mensaje:*
${message}`;

            // Codificar el mensaje para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Crear URL de WhatsApp
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

            // Abrir WhatsApp en nueva pestaña
            window.open(whatsappURL, '_blank');

            // Limpiar formulario
            contactForm.reset();

            // Mostrar mensaje de confirmación
            alert('¡Gracias por tu mensaje! Te redirigiremos a WhatsApp.');
        });
    }
}

// ========== SCROLL SUAVE ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== ANIMACIÓN AL SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar tarjetas de camisetas
document.querySelectorAll('.jersey-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// ========== HEADER STICKY CON EFECTO ==========
let lastScroll = 0;
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        }

        lastScroll = currentScroll;
    });
}

// ========== BOTONES DE VISTA RÁPIDA ==========
// Usar delegación de eventos para los botones de vista rápida
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-view-btn') || e.target.closest('.quick-view-btn')) {
        e.stopPropagation();
        const button = e.target.classList.contains('quick-view-btn') ? e.target : e.target.closest('.quick-view-btn');
        const card = button.closest('.jersey-card');
        
        if (card) {
            const jerseyName = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Camiseta';
            const price = card.querySelector('.price') ? card.querySelector('.price').textContent : '$79.99';
            const img = card.querySelector('.jersey-image img');
            const imgSrc = img ? img.src : '';
            const imgAlt = img ? img.alt : jerseyName;
            
            // Actualizar el modal con la información
            document.getElementById('jerseyModalLabel').textContent = jerseyName;
            document.getElementById('modalJerseyName').textContent = jerseyName;
            document.getElementById('modalJerseyPrice').textContent = price;
            document.getElementById('modalJerseyImage').src = imgSrc;
            document.getElementById('modalJerseyImage').alt = imgAlt;
            
            // Configurar el botón de ordenar del modal
            const modalOrderBtn = document.getElementById('modalOrderBtn');
            if (modalOrderBtn) {
                // Remover eventos anteriores
                const newBtn = modalOrderBtn.cloneNode(true);
                modalOrderBtn.parentNode.replaceChild(newBtn, modalOrderBtn);
                
                // Agregar nuevo evento
                document.getElementById('modalOrderBtn').addEventListener('click', function() {
                    const message = `¡Hola! Estoy interesado en ordenar la camiseta de *${jerseyName}* con precio de ${price}. ¿Está disponible?`;
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
                    window.open(whatsappURL, '_blank');
                });
            }
            
            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('jerseyModal'));
            modal.show();
        }
    }
});

// ========== VERIFICACIÓN Y FALLBACK PARA WHATSAPP ==========
// Agregar manejador global como fallback
window.orderWhatsApp = function(jerseyName, price) {
    const message = `¡Hola! Estoy interesado en ordenar la camiseta de *${jerseyName}* con precio de ${price}. ¿Está disponible?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
};

// Log para verificar que el script se cargó
console.log('Script cargado - WhatsApp Number:', WHATSAPP_NUMBER);
console.log('Botones de ordenar encontrados:', document.querySelectorAll('.order-btn').length);