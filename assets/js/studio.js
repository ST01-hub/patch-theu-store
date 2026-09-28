// VALEE - MULTI-GARMENT TRY-ON STUDIO (FRONT & BACK)
const GARMENTS = {
    'denim': {
        id: 'denim',
        name: 'Áo Khoác Denim',
        type: 'top',
        frontImg: 'assets/images/denim_front.jpg',
        backImg: 'assets/images/denim_back.jpg',
        icon: 'fa-vest'
    },
    'tee': {
        id: 'tee',
        name: 'Áo Thun Vintage',
        type: 'top',
        frontImg: 'assets/images/tee_front.jpg',
        backImg: 'assets/images/tee_back.jpg',
        icon: 'fa-shirt'
    },
    'hoodie': {
        id: 'hoodie',
        name: 'Áo Hoodie / Nỉ',
        type: 'top',
        frontImg: 'assets/images/hoodie_front.jpg',
        backImg: 'assets/images/hoodie_back.jpg',
        icon: 'fa-vest-patches'
    },
    'jeans': {
        id: 'jeans',
        name: 'Quần Jean Denim',
        type: 'bottom',
        frontImg: 'assets/images/jeans_front.jpg',
        backImg: 'assets/images/jeans_back.jpg',
        icon: 'fa-socks'
    },
    'tote': {
        id: 'tote',
        name: 'Túi Canvas Tote',
        type: 'accessory',
        frontImg: 'assets/images/tote_front.jpg',
        backImg: 'assets/images/tote_back.jpg',
        icon: 'fa-bag-shopping'
    }
};

class PatchStudio {
    constructor() {
        this.currentGarmentId = 'denim';
        this.currentView = 'front'; // 'front' or 'back'

        // Store placed patches separately per garment and per view
        this.garmentPatches = {
            'denim': { front: [], back: [] },
            'tee': { front: [], back: [] },
            'hoodie': { front: [], back: [] },
            'jeans': { front: [], back: [] },
            'tote': { front: [], back: [] }
        };

        this.canvasContainer = document.getElementById('studio-canvas-container');
        this.garmentImg = document.getElementById('studio-garment-image');
        this.patchesOverlay = document.getElementById('studio-patches-overlay');
        this.activePatchIndex = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        this.init();
    }

    init() {
        if (!this.canvasContainer) return;
        this.renderGarmentSelectors();
        this.renderStudioPatchSelector();
        this.setupEventListeners();

        // Default sample patches on denim front & back for inspiration
        setTimeout(() => {
            if (PRODUCTS.length > 0 && this.getCurrentPatches().length === 0) {
                // Front: tiger patch on chest pocket
                this.garmentPatches['denim'].front.push({
                    id: 'init-1',
                    product: PRODUCTS[0],
                    x: 28,
                    y: 36,
                    size: 95,
                    rotation: 0
                });
                // Front: ramen cat patch on lower side
                this.garmentPatches['denim'].front.push({
                    id: 'init-2',
                    product: PRODUCTS[2],
                    x: 65,
                    y: 45,
                    size: 90,
                    rotation: 0
                });
                // Back: large Kanagawa wave or astronaut on back
                this.garmentPatches['denim'].back.push({
                    id: 'init-3',
                    product: PRODUCTS[4] || PRODUCTS[0],
                    x: 50,
                    y: 42,
                    size: 140,
                    rotation: 0
                });

                this.renderGarmentView();
            }
        }, 200);
    }

    getCurrentPatches() {
        return this.garmentPatches[this.currentGarmentId][this.currentView];
    }

    renderGarmentSelectors() {
        const container = document.getElementById('studio-garment-tabs');
        if (!container) return;

        container.innerHTML = Object.values(GARMENTS).map(g => `
            <button type="button" 
                    onclick="window.patchStudio.selectGarment('${g.id}')"
                    class="garment-tab-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${g.id === this.currentGarmentId ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-md' : 'bg-stone-900/80 border-stone-700/60 text-stone-300 hover:border-stone-500'}">
                <i class="fa-solid ${g.icon} text-sm ${g.id === this.currentGarmentId ? 'text-amber-400' : 'text-stone-400'}"></i>
                <span>${g.name}</span>
            </button>
        `).join('');
    }

    selectGarment(garmentId) {
        if (!GARMENTS[garmentId]) return;
        this.currentGarmentId = garmentId;
        this.activePatchIndex = null;
        this.renderGarmentSelectors();
        this.renderGarmentView();
        showToast(`Đã chuyển sang: ${GARMENTS[garmentId].name}`, 'info');
    }

    setView(view) {
        if (this.currentView === view) return;
        this.currentView = view;
        this.activePatchIndex = null;

        // Update front/back toggle buttons styling
        const frontBtn = document.getElementById('view-front-btn');
        const backBtn = document.getElementById('view-back-btn');
        const activeClass = ['bg-amber-500', 'text-stone-950', 'font-black', 'shadow-md'];
        const inactiveClass = ['bg-stone-900/80', 'text-stone-300', 'font-medium'];

        if (view === 'front') {
            frontBtn?.classList.add(...activeClass);
            frontBtn?.classList.remove(...inactiveClass);
            backBtn?.classList.remove(...activeClass);
            backBtn?.classList.add(...inactiveClass);
        } else {
            backBtn?.classList.add(...activeClass);
            backBtn?.classList.remove(...inactiveClass);
            frontBtn?.classList.remove(...activeClass);
            frontBtn?.classList.add(...inactiveClass);
        }

        this.renderGarmentView();
        showToast(`Đang xem: ${view === 'front' ? 'Mặt Trước' : 'Mặt Sau'}`, 'info');
    }

    renderGarmentView() {
        const garment = GARMENTS[this.currentGarmentId];
        if (!garment || !this.garmentImg) return;

        // Smooth image switch with subtle fade
        this.garmentImg.style.opacity = '0.4';
        setTimeout(() => {
            this.garmentImg.src = this.currentView === 'front' ? garment.frontImg : garment.backImg;
            this.garmentImg.alt = `${garment.name} - ${this.currentView === 'front' ? 'Mặt Trước' : 'Mặt Sau'}`;
            this.garmentImg.style.opacity = '1';
        }, 120);

        // Update view badge label
        const badge = document.getElementById('studio-current-view-badge');
        if (badge) {
            badge.textContent = `${garment.name} • ${this.currentView === 'front' ? 'Mặt Trước' : 'Mặt Sau'}`;
        }

        this.renderCanvasPatches();
        this.updatePlacedList();
    }

    renderStudioPatchSelector() {
        const tray = document.getElementById('studio-tray');
        if (!tray) return;

        tray.innerHTML = PRODUCTS.slice(0, 6).map(prod => `
            <div class="studio-tray-item group flex flex-col items-center p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-700/60 hover:border-amber-400 cursor-pointer transition-all shadow-md transform hover:-translate-y-1"
                 onclick="window.patchStudio.addPatchToGarmentById('${prod.id}')"
                 title="Bấm để gắn lên vị trí này">
                <div class="relative w-14 h-14 rounded-full overflow-hidden border border-amber-400/30 group-hover:border-amber-400 bg-stone-950 flex items-center justify-center p-0.5 shadow-inner">
                    <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover rounded-full">
                </div>
                <span class="text-[10px] font-medium text-stone-200 mt-1.5 text-center line-clamp-1 w-20">${prod.name.replace('Patch Thêu', '').trim()}</span>
                <span class="text-[10px] font-bold text-amber-400 mt-0.5">${formatCurrency(prod.price)}</span>
                <span class="text-[9px] text-stone-400 mt-0.5 flex items-center gap-1 group-hover:text-amber-300">
                    <i class="fa-solid fa-plus text-[8px]"></i> Thử ngay
                </span>
            </div>
        `).join('');
    }

    addPatchToGarmentById(productId) {
        const prod = PRODUCTS.find(p => p.id === productId);
        if (!prod) return;

        const currentList = this.getCurrentPatches();
        const offsetPct = (currentList.length * 8) % 30;
        const defaultSize = this.currentView === 'back' ? 120 : 95;

        this.addPatchToGarment(prod, 40 + offsetPct, 40 + offsetPct, defaultSize);
        showToast(`Đã gắn "${prod.name}" lên ${this.currentView === 'front' ? 'mặt trước' : 'mặt sau'}!`, 'success');
    }

    addPatchToGarment(product, posXPercent = 40, posYPercent = 40, sizePx = 100) {
        const id = 'patch-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const patchData = {
            id: id,
            product: product,
            x: posXPercent,
            y: posYPercent,
            size: sizePx,
            rotation: 0
        };

        this.getCurrentPatches().push(patchData);
        this.activePatchIndex = this.getCurrentPatches().length - 1;
        this.renderCanvasPatches();
        this.updatePlacedList();
    }

    renderCanvasPatches() {
        const overlay = document.getElementById('studio-patches-overlay');
        if (!overlay) return;

        const patches = this.getCurrentPatches();
        overlay.innerHTML = '';

        patches.forEach((item, index) => {
            const isActive = index === this.activePatchIndex;
            const el = document.createElement('div');
            el.className = `absolute select-none cursor-move group transition-shadow ${isActive ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-900 shadow-2xl z-30' : 'hover:ring-1 hover:ring-white/60 z-20'}`;
            el.style.left = `${item.x}%`;
            el.style.top = `${item.y}%`;
            el.style.width = `${item.size}px`;
            el.style.height = `${item.size}px`;
            el.style.transform = `translate(-50%, -50%) rotate(${item.rotation}deg)`;
            el.dataset.index = index;

            el.innerHTML = `
                <div class="w-full h-full relative rounded-full filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-150">
                    <img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover rounded-full pointer-events-none select-none border border-black/20">
                    ${isActive ? `
                        <div class="absolute -top-3.5 -right-3.5 flex gap-1 bg-stone-950/95 rounded-full px-2 py-0.5 border border-amber-500/40 shadow-xl text-[10px]">
                            <button onclick="event.stopPropagation(); window.patchStudio.rotatePatch(${index}, 15)" title="Xoay" class="text-stone-300 hover:text-amber-400 p-1">
                                <i class="fa-solid fa-rotate-right"></i>
                            </button>
                            <button onclick="event.stopPropagation(); window.patchStudio.removePatch(${index})" title="Xóa" class="text-rose-400 hover:text-rose-300 p-1">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;

            el.addEventListener('mousedown', (e) => this.startDrag(e, index));
            el.addEventListener('touchstart', (e) => this.startDrag(e, index), { passive: false });

            overlay.appendChild(el);
        });

        this.updateCostSummary();
    }

    startDrag(e, index) {
        e.preventDefault();
        this.activePatchIndex = index;
        this.isDragging = true;

        const rect = this.canvasContainer.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const currentPatch = this.getCurrentPatches()[index];
        const patchPixelX = (currentPatch.x / 100) * rect.width;
        const patchPixelY = (currentPatch.y / 100) * rect.height;

        this.dragOffset = {
            x: (clientX - rect.left) - patchPixelX,
            y: (clientY - rect.top) - patchPixelY
        };

        this.renderCanvasPatches();
        this.updatePlacedList();
    }

    onDrag(e) {
        if (!this.isDragging || this.activePatchIndex === null) return;
        const rect = this.canvasContainer.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        let mouseX = clientX - rect.left - this.dragOffset.x;
        let mouseY = clientY - rect.top - this.dragOffset.y;

        let xPct = (mouseX / rect.width) * 100;
        let yPct = (mouseY / rect.height) * 100;

        xPct = Math.max(10, Math.min(90, xPct));
        yPct = Math.max(10, Math.min(90, yPct));

        const currentList = this.getCurrentPatches();
        if (currentList[this.activePatchIndex]) {
            currentList[this.activePatchIndex].x = xPct;
            currentList[this.activePatchIndex].y = yPct;

            const overlay = document.getElementById('studio-patches-overlay');
            if (overlay && overlay.children[this.activePatchIndex]) {
                const el = overlay.children[this.activePatchIndex];
                el.style.left = `${xPct}%`;
                el.style.top = `${yPct}%`;
            }
        }
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.renderCanvasPatches();
        }
    }

    rotatePatch(index, deltaDegree = 15) {
        const patches = this.getCurrentPatches();
        if (!patches[index]) return;
        patches[index].rotation = (patches[index].rotation + deltaDegree) % 360;
        this.renderCanvasPatches();
    }

    resizeActivePatch(sizePx) {
        const patches = this.getCurrentPatches();
        if (this.activePatchIndex === null || !patches[this.activePatchIndex]) return;
        patches[this.activePatchIndex].size = parseInt(sizePx);
        this.renderCanvasPatches();
    }

    removePatch(index) {
        const patches = this.getCurrentPatches();
        if (index >= 0 && index < patches.length) {
            const removed = patches.splice(index, 1);
            this.activePatchIndex = patches.length > 0 ? patches.length - 1 : null;
            this.renderCanvasPatches();
            this.updatePlacedList();
            if (removed[0]) {
                showToast(`Đã gỡ "${removed[0].product.name}" khỏi áo`, 'info');
            }
        }
    }

    clearCurrentViewPatches() {
        const patches = this.getCurrentPatches();
        if (patches.length === 0) return;
        if (confirm(`Bạn có chắc muốn xóa tất cả patch ở ${this.currentView === 'front' ? 'Mặt Trước' : 'Mặt Sau'} không?`)) {
            this.garmentPatches[this.currentGarmentId][this.currentView] = [];
            this.activePatchIndex = null;
            this.renderCanvasPatches();
            this.updatePlacedList();
            showToast('Đã xóa patch trên mặt hiện tại', 'info');
        }
    }

    updatePlacedList() {
        const listContainer = document.getElementById('studio-placed-patches');
        if (!listContainer) return;

        const currentList = this.getCurrentPatches();
        if (currentList.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-5 text-stone-400">
                    <i class="fa-solid fa-shirt text-2xl mb-1.5 opacity-40"></i>
                    <p class="text-xs">Chưa có patch nào ở <b>${this.currentView === 'front' ? 'Mặt Trước' : 'Mặt Sau'}</b>.<br>Bấm chọn patch ở khay bên dưới để ướm thử!</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = currentList.map((item, idx) => {
            const isActive = idx === this.activePatchIndex;
            return `
                <div class="flex items-center justify-between p-2 rounded-xl border transition-all ${isActive ? 'bg-amber-500/15 border-amber-500/60 text-white' : 'bg-stone-900/60 border-stone-800 text-stone-300'}"
                     onclick="window.patchStudio.setActivePatch(${idx})">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <img src="${item.product.image}" class="w-8 h-8 rounded-full object-cover border border-amber-400/40">
                        <div class="truncate">
                            <p class="text-xs font-semibold truncate">${item.product.name}</p>
                            <span class="text-[10px] text-amber-400 font-bold">${formatCurrency(item.product.price)}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 ml-2">
                        <button onclick="event.stopPropagation(); window.patchStudio.rotatePatch(${idx}, 15)" class="w-6 h-6 rounded flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs" title="Xoay">
                            <i class="fa-solid fa-rotate"></i>
                        </button>
                        <button onclick="event.stopPropagation(); window.patchStudio.removePatch(${idx})" class="w-6 h-6 rounded flex items-center justify-center bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs" title="Xóa">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    setActivePatch(index) {
        this.activePatchIndex = index;
        this.renderCanvasPatches();
        this.updatePlacedList();
    }

    updateCostSummary() {
        const frontList = this.garmentPatches[this.currentGarmentId].front;
        const backList = this.garmentPatches[this.currentGarmentId].back;
        const totalPatches = [...frontList, ...backList];

        const totalCost = totalPatches.reduce((sum, item) => sum + item.product.price, 0);

        const totalElem = document.getElementById('studio-total-price');
        if (totalElem) totalElem.textContent = formatCurrency(totalCost);

        const countBadge = document.getElementById('studio-patches-count');
        if (countBadge) {
            countBadge.innerHTML = `Mặt trước: <b>${frontList.length}</b> | Mặt sau: <b>${backList.length}</b>`;
        }

        const addAllBtn = document.getElementById('studio-add-all-btn');
        if (addAllBtn) {
            addAllBtn.disabled = totalPatches.length === 0;
            if (totalPatches.length === 0) {
                addAllBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                addAllBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    addAllToCart() {
        const frontList = this.garmentPatches[this.currentGarmentId].front;
        const backList = this.garmentPatches[this.currentGarmentId].back;
        const all = [...frontList, ...backList];

        if (all.length === 0) return;

        all.forEach(item => {
            window.cartStore.addItem(item.product, 'iron', 1);
        });

        showToast(`Đã thêm trọn bộ ${all.length} patch (${GARMENTS[this.currentGarmentId].name}) vào giỏ!`, 'success');
        window.cartStore.openDrawer();
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => this.onDrag(e));
        window.addEventListener('mouseup', () => this.stopDrag());
        window.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        window.addEventListener('touchend', () => this.stopDrag());

        const slider = document.getElementById('studio-size-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.resizeActivePatch(e.target.value);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.patchStudio = new PatchStudio();
});
