// Main Application Logic
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'popular';
let activeQuickViewProduct = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCategoryTabs();
    renderProducts();
    initSearch();
    initSort();
    initMobileNav();
    initFAQ();
});

// Toast notification helper uses global showToast from products.js
// If not defined, fallback safely
if (typeof showToast !== 'function') {
    window.showToast = function(message, type = 'info') {
        console.log(`[Toast] ${message}`);
    };
}

// Category Tabs
function initCategoryTabs() {
    const container = document.getElementById('category-filter-buttons');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
        <button class="category-btn px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${cat.id === 'all' ? 'active bg-amber-500 text-stone-950 font-black border-amber-500 shadow-md' : 'bg-stone-900/80 text-stone-300 border-stone-750 hover:border-amber-500/50 hover:text-white'}"
                data-category="${cat.id}"
                onclick="filterCategory('${cat.id}', this)">
            <i class="fa-solid ${cat.icon} mr-1.5 opacity-80"></i> ${cat.name}
        </button>
    `).join('');
}

function filterCategory(catId, btnElem) {
    currentCategory = catId;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-amber-500', 'text-stone-950', 'font-black', 'border-amber-500', 'shadow-md');
        btn.classList.add('bg-stone-900/80', 'text-stone-300', 'border-stone-750');
    });
    if (btnElem) {
        btnElem.classList.remove('bg-stone-900/80', 'text-stone-300', 'border-stone-750');
        btnElem.classList.add('active', 'bg-amber-500', 'text-stone-950', 'font-black', 'border-amber-500', 'shadow-md');
    }
    renderProducts();
}

// Search
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    const handleSearch = (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        renderProducts();
    };

    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (mobileSearchInput) mobileSearchInput.addEventListener('input', handleSearch);
}

// Sort
function initSort() {
    const sortSelect = document.getElementById('product-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
    }
}

// Render Products Catalog
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const countBadge = document.getElementById('catalog-count-badge');
    if (!grid) return;

    let list = [...PRODUCTS];

    // Filter Category
    if (currentCategory !== 'all') {
        list = list.filter(p => p.category === currentCategory);
    }

    // Filter Search
    if (currentSearch) {
        list = list.filter(p => 
            p.name.toLowerCase().includes(currentSearch) ||
            p.description.toLowerCase().includes(currentSearch) ||
            p.tags.some(t => t.toLowerCase().includes(currentSearch))
        );
    }

    // Sort
    if (currentSort === 'price-asc') {
        list.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
        list.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
    } else {
        // popular
        list.sort((a, b) => b.salesCount - a.salesCount);
    }

    if (countBadge) {
        countBadge.textContent = `${list.length} mẫu`;
    }

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center text-slate-400">
                <i class="fa-solid fa-magnifying-glass text-4xl mb-3 text-slate-600"></i>
                <h4 class="text-base font-semibold text-slate-200">Không tìm thấy mẫu patch phù hợp</h4>
                <p class="text-xs text-slate-400 mt-1">Thử từ khóa khác hoặc bấm nút "Đặt thêu theo yêu cầu" để may mẫu riêng!</p>
                <button onclick="currentSearch=''; currentCategory='all'; renderProducts();" class="mt-4 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 text-slate-200">
                    Xem tất cả mẫu
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="product-card vintage-card group relative rounded-2xl border border-stone-750 hover:border-amber-500/60 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <!-- Badge -->
            <div class="absolute top-3 left-3 z-10">
                <span class="${p.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    ${p.badge}
                </span>
            </div>

            <!-- Quick Action Icons -->
            <div class="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onclick="quickViewProduct('${p.id}')" title="Xem chi tiết" class="w-8 h-8 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-700 text-stone-200 hover:text-amber-400 hover:border-amber-400 flex items-center justify-center text-xs shadow-lg transition-transform hover:scale-110">
                    <i class="fa-regular fa-eye"></i>
                </button>
                <button onclick="window.patchStudio.addPatchToGarmentById('${p.id}'); window.scrollTo({top: document.getElementById('studio').offsetTop - 60, behavior: 'smooth'});" title="Thử lên áo/quần trong Studio" class="w-8 h-8 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-700 text-stone-200 hover:text-amber-400 hover:border-amber-400 flex items-center justify-center text-xs shadow-lg transition-transform hover:scale-110">
                    <i class="fa-solid fa-shirt"></i>
                </button>
            </div>

            <!-- Image Wrap -->
            <div class="relative w-full aspect-square bg-stone-950 overflow-hidden cursor-pointer p-4 flex items-center justify-center" onclick="quickViewProduct('${p.id}')">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <!-- Info Content -->
            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                        <span class="flex items-center gap-1 text-amber-400 font-semibold">
                            <i class="fa-solid fa-star text-[10px]"></i> ${p.rating} <span class="text-stone-500">(${p.salesCount} đã bán)</span>
                        </span>
                        <span class="text-stone-400">${p.size}</span>
                    </div>
                    <h3 class="font-bold text-sm text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer font-vintage" onclick="quickViewProduct('${p.id}')">
                        ${p.name}
                    </h3>
                    <p class="text-xs text-stone-400 mt-1 line-clamp-1">${p.thread}</p>
                </div>

                <div class="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                    <div>
                        <div class="text-xs text-stone-400 line-through">${formatCurrency(p.originalPrice)}</div>
                        <div class="text-base font-extrabold text-amber-400 font-vintage">${formatCurrency(p.price)}</div>
                    </div>
                    <button onclick="window.cartStore.addItem(PRODUCTS.find(x => x.id === '${p.id}'), 'iron', 1)" 
                            class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95">
                        <i class="fa-solid fa-bag-shopping"></i> Thêm
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Quick View Modal
function quickViewProduct(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    activeQuickViewProduct = p;

    document.getElementById('qv-image').src = p.image;
    document.getElementById('qv-title').textContent = p.name;
    document.getElementById('qv-badge').textContent = p.badge;
    document.getElementById('qv-badge').className = `${p.badgeColor} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-2`;
    document.getElementById('qv-price').textContent = formatCurrency(p.price);
    document.getElementById('qv-original-price').textContent = formatCurrency(p.originalPrice);
    document.getElementById('qv-rating').textContent = `${p.rating} (${p.reviewsCount} đánh giá | ${p.salesCount} đã bán)`;
    document.getElementById('qv-size').textContent = p.size;
    document.getElementById('qv-density').textContent = p.stitchDensity;
    document.getElementById('qv-thread').textContent = p.thread;
    document.getElementById('qv-edge').textContent = p.edgeType;
    document.getElementById('qv-desc').textContent = p.description;

    // Reset quantity
    document.getElementById('qv-quantity').value = 1;

    // Render backing choices
    const backingContainer = document.getElementById('qv-backing-options');
    if (backingContainer) {
        backingContainer.innerHTML = Object.values(BACKING_TYPES).map((b, idx) => `
            <label class="flex items-center justify-between p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-750 cursor-pointer transition-all">
                <div class="flex items-center gap-2.5">
                    <input type="radio" name="qvBacking" value="${b.id}" ${idx === 0 ? 'checked' : ''} class="text-amber-500 focus:ring-amber-500">
                    <div>
                        <div class="text-xs font-semibold text-slate-200">${b.name}</div>
                        <div class="text-[10px] text-slate-400">${b.description}</div>
                    </div>
                </div>
                <span class="text-xs font-bold ${b.extraPrice > 0 ? 'text-amber-400' : 'text-emerald-400'}">
                    ${b.extraPrice > 0 ? '+' + formatCurrency(b.extraPrice) : 'Miễn phí'}
                </span>
            </label>
        `).join('');
    }

    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function addQuickViewToCart() {
    if (!activeQuickViewProduct) return;
    const qty = parseInt(document.getElementById('qv-quantity').value) || 1;
    const backing = document.querySelector('input[name="qvBacking"]:checked')?.value || 'iron';

    window.cartStore.addItem(activeQuickViewProduct, backing, qty);
    closeQuickView();
    window.cartStore.openDrawer();
}

function tryQuickViewInStudio() {
    if (!activeQuickViewProduct) return;
    window.patchStudio.addPatchToGarmentById(activeQuickViewProduct.id);
    closeQuickView();
    window.scrollTo({
        top: document.getElementById('studio').offsetTop - 60,
        behavior: 'smooth'
    });
}

// Mobile Nav
function initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

// FAQs Accordion
function initFAQ() {
    const triggers = document.querySelectorAll('.faq-trigger');
    triggers.forEach(trig => {
        trig.addEventListener('click', () => {
            const body = trig.nextElementSibling;
            const icon = trig.querySelector('.faq-icon');
            if (body.classList.contains('hidden')) {
                body.classList.remove('hidden');
                icon.classList.add('rotate-180');
            } else {
                body.classList.add('hidden');
                icon.classList.remove('rotate-180');
            }
        });
    });
}
