// app.js - Agrega camisetas dinamicas de Supabase al grid existente

(function initDynamicJerseys() {
    if (window.__camisadel10_app_initialized__) {
        return;
    }
    window.__camisadel10_app_initialized__ = true;

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        console.error('Supabase no disponible en app.js');
        return;
    }
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
        console.error('Faltan variables de Supabase en config.js');
        return;
    }

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    function categoryBadge(category) {
        if (category === 'selecciones') return 'Seleccion';
        if (category === 'ligas') return 'Ligas';
        if (category === 'retro') return 'Retro';
        if (category === 'uniformes') return 'Uniformes';
        return category;
    }

    function inferLeagueTag(teamName) {
        const team = (teamName || '').toLowerCase();

        if (/real madrid|barcelona|atleti|atletico|betis/.test(team)) return 'laliga';
        if (/arsenal|chelsea|liverpool|manchester|united|city|newcastle|aston|brighton|fullham|fulham|totenham|tottenham/.test(team)) return 'premier';
        if (/inter|juventus|milan|roma|napoli/.test(team)) return 'seriea';
        if (/paris|psg/.test(team)) return 'ligue1';
        if (/bayern|dortmunt|dortmund/.test(team)) return 'bundesliga';

        return 'ligas';
    }

    function normalizeImageList(jersey) {
        const urls = [];

        function addUrl(value) {
            if (!value || typeof value !== 'string') return;
            const trimmed = value.trim();
            if (!trimmed) return;
            if (!urls.includes(trimmed)) {
                urls.push(trimmed);
            }
        }

        const directImageUrl = typeof jersey.image_url === 'string' ? jersey.image_url.trim() : '';

        if (directImageUrl) {
            if (directImageUrl.startsWith('[') && directImageUrl.endsWith(']')) {
                try {
                    const parsed = JSON.parse(directImageUrl);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(addUrl);
                    }
                } catch (e) {
                    addUrl(directImageUrl);
                }
            } else if (directImageUrl.includes('|')) {
                directImageUrl.split('|').forEach(addUrl);
            } else {
                addUrl(directImageUrl);
            }
        }

        if (Array.isArray(jersey.image_urls)) {
            jersey.image_urls.forEach(addUrl);
        } else if (typeof jersey.image_urls === 'string') {
            const raw = jersey.image_urls.trim();
            if (raw) {
                if (raw.startsWith('[') && raw.endsWith(']')) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            parsed.forEach(addUrl);
                        }
                    } catch (e) {
                        raw.split('|').forEach(addUrl);
                    }
                } else {
                    raw.split('|').forEach(addUrl);
                }
            }
        }

        return urls;
    }

    function orderJersey(jerseyName, price) {
        const phoneNumber = '50663620357';
        const message = encodeURIComponent(`Hola, me interesa la camiseta ${jerseyName} - Precio: ₡${price}`);
        window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank');
    }

    function openQuickView(team, price, imageUrl) {
        const modal = document.getElementById('jerseyModal');
        if (!modal) return;

        // Actualizar contenido del modal
        const modalTitle = document.getElementById('jerseyModalLabel');
        const modalName = document.getElementById('modalJerseyName');
        const modalPrice = document.getElementById('modalJerseyPrice');
        const modalImage = document.getElementById('modalJerseyImage');
        const modalOrderBtn = document.getElementById('modalOrderBtn');

        if (modalTitle) modalTitle.textContent = team;
        if (modalName) modalName.textContent = team;
        if (modalPrice) modalPrice.textContent = `₡${price}`;
        if (modalImage) modalImage.src = imageUrl;

        // Manejar botón de orden en el modal
        if (modalOrderBtn) {
            modalOrderBtn.onclick = () => {
                orderJersey(team, price);
            };
        }

        // Abrir modal con Bootstrap
        const bsModal = new bootstrap.Modal(modal, { backdrop: true, keyboard: true });
        bsModal.show();
    }

    function appendJerseyCard(grid, jersey, category) {
        const images = normalizeImageList(jersey);
        const mainImage = images[0] || '';
        const leagueFromDb = typeof jersey.league === 'string' ? jersey.league.trim().toLowerCase() : '';
        const leagueTag = category === 'ligas'
            ? (leagueFromDb || inferLeagueTag(jersey.team))
            : category;

        const card = document.createElement('div');
        card.className = 'jersey-card dynamic-jersey';
        card.setAttribute('data-league', leagueTag);

        const imageSection = images.length > 1
            ? `
                <div class="jersey-image-carousel">
                    <div class="jersey-carousel-images">
                        ${images.map((src) => `<img src="${src}" alt="${jersey.team}" loading="lazy">`).join('')}
                    </div>
                    <button class="jersey-carousel-btn prev-jersey"><i class="fas fa-chevron-left"></i></button>
                    <button class="jersey-carousel-btn next-jersey"><i class="fas fa-chevron-right"></i></button>
                    <div class="jersey-carousel-indicators"></div>
                </div>
            `
            : `<img src="${mainImage}" alt="${jersey.team}" loading="lazy">`;

        card.innerHTML = `
            <div class="jersey-image">
                ${imageSection}
                <div class="jersey-overlay">
                    <button class="quick-view-btn" type="button">Ver Detalles</button>
                </div>
            </div>
            <div class="jersey-info">
                <span class="league-badge">${categoryBadge(category)}</span>
                <h3>${jersey.team}</h3>
                <p class="price">₡${jersey.price}</p>
                <button class="order-btn" type="button" data-jersey="${jersey.team}">Ordenar <i class="fab fa-whatsapp"></i></button>
            </div>
        `;

        const orderBtn = card.querySelector('.order-btn');

        if (orderBtn) {
            orderBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                orderJersey(jersey.team, jersey.price);
            });
        }

        grid.appendChild(card);
    }

    async function loadDynamicJerseys(category) {
        try {
            const { data, error } = await client
                .from('jerseys')
                .select('*')
                .eq('category', category)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                return;
            }

            const grid = document.querySelector('.jerseys-grid');
            if (!grid) {
                return;
            }

            grid.querySelectorAll('.dynamic-jersey').forEach((node) => node.remove());

            data.forEach((jersey) => {
                appendJerseyCard(grid, jersey, category);
            });

            if (typeof window.initJerseyCarousels === 'function') {
                window.initJerseyCarousels();
            }
            if (typeof window.applyActiveLeagueFilter === 'function') {
                window.applyActiveLeagueFilter();
            }
        } catch (error) {
            console.error('Error cargando camisetas dinamicas:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.pathname.includes('ligas.html') || document.getElementById('ligas')) {
            loadDynamicJerseys('ligas');
            return;
        }
        if (window.location.pathname.includes('selecciones.html') || document.getElementById('selecciones')) {
            loadDynamicJerseys('selecciones');
            return;
        }
        if (window.location.pathname.includes('retro.html') || document.getElementById('retro')) {
            loadDynamicJerseys('retro');
            return;
        }
        if (window.location.pathname.includes('uniformes.html') || document.getElementById('uniformes')) {
            loadDynamicJerseys('uniformes');
        }
    });
})();