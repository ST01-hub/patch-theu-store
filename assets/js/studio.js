// Interactive Patch Studio Simulator
class PatchStudio {
    constructor() {
        this.canvasContainer = document.getElementById('studio-canvas-container');
        this.placedPatchesList = document.getElementById('studio-placed-patches');
        this.totalPriceElem = document.getElementById('studio-total-price');
        this.patchesOnGarment = [];
        this.activePatchIndex = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        this.init();
    }

    init() {
        if (!this.canvasContainer) return;
        this.renderStudioPatchSelector();
        this.setupEventListeners();
        
        // Add default sample patch to show it's active
        setTimeout(() => {
            if (PRODUCTS.length > 0 && this.patchesOnGarment.length === 0) {
                this.addPatchToGarment(PRODUCTS[0], 28, 38, 110);
                this.addPatchToGarment(PRODUCTS[2], 65, 42, 95);
            }
        }, 300);
    }

    renderStudioPatchSelector() {
        const tray = document.getElementById('studio-tray');
        if (!tray) return;

        tray.innerHTML = PRODUCTS.slice(0, 5).map(prod => `
            <div class="studio-tray-item group flex flex-col items-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-400 cursor-pointer transition-all shadow-md transform hover:-translate-y-1"
                 onclick="window.patchStudio.addPatchToGarmentById('${prod.id}')"
                 title="Bấm để gắn lên áo">
                <div class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/40 group-hover:border-amber-400 shadow-inner bg-slate-900 flex items-center justify-center p-0.5">
                    <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover rounded-full">
                </div>
                <span class="text-[11px] font-medium text-slate-200 mt-2 text-center line-clamp-1 w-20">${prod.name.split('-')[0].replace('Patch Thêu', '').trim()}</span>
                <span class="text-[10px] font-bold text-amber-400 mt-0.5">${formatCurrency(prod.price)}</span>
                <span class="text-[9px] text-slate-400 mt-1 flex items-center gap-1 group-hover:text-amber-300">
                    <i class="fa-solid fa-plus text-[8px]"></i> Thử ngay
                </span>
            </div>
        `).join('');
    }

    addPatchToGarmentById(productId) {
        const prod = PRODUCTS.find(p => p.id === productId);
        if (!prod) return;
        // Position slightly staggered
        const offsetPct = (this.patchesOnGarment.length * 8) % 30;
        this.addPatchToGarment(prod, 30 + offsetPct, 35 + offsetPct, 105);
        showToast(`Đã thêm "${prod.name}" lên áo khoác!`, 'success');
    }

    addPatchToGarment(product, posXPercent = 40, posYPercent = 40, sizePx = 100) {
        const id = 'patch-layer-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const patchData = {
            id: id,
            product: product,
            x: posXPercent, // in % of canvas
            y: posYPercent, // in % of canvas
            size: sizePx, // in px
            rotation: 0 // in deg
        };

        this.patchesOnGarment.push(patchData);
        this.activePatchIndex = this.patchesOnGarment.length - 1;
        this.renderCanvasPatches();
        this.updatePlacedList();
    }

    renderCanvasPatches() {
        const overlay = document.getElementById('studio-patches-overlay');
        if (!overlay) return;

        overlay.innerHTML = '';
        this.patchesOnGarment.forEach((item, index) => {
            const isActive = index === this.activePatchIndex;
            const el = document.createElement('div');
            el.className = `absolute select-none cursor-move group transition-shadow ${isActive ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50 shadow-2xl z-30' : 'hover:ring-1 hover:ring-white/60 z-20'}`;
            el.style.left = `${item.x}%`;
            el.style.top = `${item.y}%`;
            el.style.width = `${item.size}px`;
            el.style.height = `${item.size}px`;
            el.style.transform = `translate(-50%, -50%) rotate(${item.rotation}deg)`;
            el.dataset.index = index;

            el.innerHTML = `
                <div class="w-full h-full relative rounded-full filter drop-shadow-[0_12px_14px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-150">
                    <img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover rounded-full pointer-events-none select-none border border-black/20">
                    ${isActive ? `
                        <div class="absolute -top-3 -right-3 flex gap-1 bg-slate-900/90 rounded-full px-1.5 py-0.5 border border-slate-700 shadow-lg text-[10px]">
                            <button onclick="event.stopPropagation(); window.patchStudio.rotatePatch(${index}, 15)" title="Xoay" class="text-slate-300 hover:text-amber-400 p-1">
                                <i class="fa-solid fa-rotate-right"></i>
                            </button>
                            <button onclick="event.stopPropagation(); window.patchStudio.removePatch(${index})" title="Xóa" class="text-rose-400 hover:text-rose-300 p-1">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;

            // Mouse and Touch drag binding
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

        const currentPatch = this.patchesOnGarment[index];
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

        // Convert to percentage
        let xPct = (mouseX / rect.width) * 100;
        let yPct = (mouseY / rect.height) * 100;

        // Clamping to remain inside jacket bounds (10% to 90%)
        xPct = Math.max(12, Math.min(88, xPct));
        yPct = Math.max(12, Math.min(88, yPct));

        this.patchesOnGarment[this.activePatchIndex].x = xPct;
        this.patchesOnGarment[this.activePatchIndex].y = yPct;

        // Smooth direct style update without full re-render for 60fps drag
        const overlay = document.getElementById('studio-patches-overlay');
        if (overlay && overlay.children[this.activePatchIndex]) {
            const el = overlay.children[this.activePatchIndex];
            el.style.left = `${xPct}%`;
            el.style.top = `${yPct}%`;
        }
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.renderCanvasPatches();
        }
    }

    rotatePatch(index, deltaDegree = 15) {
        if (!this.patchesOnGarment[index]) return;
        this.patchesOnGarment[index].rotation = (this.patchesOnGarment[index].rotation + deltaDegree) % 360;
        this.renderCanvasPatches();
    }

    resizeActivePatch(sizePx) {
        if (this.activePatchIndex === null || !this.patchesOnGarment[this.activePatchIndex]) return;
        this.patchesOnGarment[this.activePatchIndex].size = parseInt(sizePx);
        this.renderCanvasPatches();
    }

    removePatch(index) {
        if (index >= 0 && index < this.patchesOnGarment.length) {
            const removed = this.patchesOnGarment.splice(index, 1);
            this.activePatchIndex = this.patchesOnGarment.length > 0 ? this.patchesOnGarment.length - 1 : null;
            this.renderCanvasPatches();
            this.updatePlacedList();
            if (removed[0]) {
                showToast(`Đã gỡ "${removed[0].product.name}" khỏi áo`, 'info');
            }
        }
    }

    clearAllPatches() {
        if (this.patchesOnGarment.length === 0) return;
        if (confirm('Bạn có chắc muốn xóa tất cả các patch đang thử trên áo không?')) {
            this.patchesOnGarment = [];
            this.activePatchIndex = null;
            this.renderCanvasPatches();
            this.updatePlacedList();
            showToast('Đã xóa tất cả patch trên mẫu thử', 'info');
        }
    }

    updatePlacedList() {
        if (!this.placedPatchesList) return;
        if (this.patchesOnGarment.length === 0) {
            this.placedPatchesList.innerHTML = `
                <div class="text-center py-6 text-slate-400">
                    <i class="fa-solid fa-shirt text-3xl mb-2 opacity-50"></i>
                    <p class="text-xs">Chưa có patch nào trên áo.<br>Bấm chọn patch ở khay bên dưới để ướm thử ngay!</p>
                </div>
            `;
            return;
        }

        this.placedPatchesList.innerHTML = this.patchesOnGarment.map((item, idx) => {
            const isActive = idx === this.activePatchIndex;
            return `
                <div class="flex items-center justify-between p-2 rounded-lg border transition-all ${isActive ? 'bg-amber-500/10 border-amber-500/50 text-white' : 'bg-slate-800/40 border-slate-700/60 text-slate-300'}"
                     onclick="window.patchStudio.setActivePatch(${idx})">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <img src="${item.product.image}" class="w-8 h-8 rounded-full object-cover border border-amber-400/40">
                        <div class="truncate">
                            <p class="text-xs font-semibold truncate">${item.product.name}</p>
                            <span class="text-[11px] text-amber-400 font-bold">${formatCurrency(item.product.price)}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 ml-2">
                        <button onclick="event.stopPropagation(); window.patchStudio.rotatePatch(${idx}, 15)" class="w-6 h-6 rounded flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs" title="Xoay">
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
        if (!this.totalPriceElem) return;
        const total = this.patchesOnGarment.reduce((sum, item) => sum + item.product.price, 0);
        this.totalPriceElem.textContent = formatCurrency(total);

        const countBadge = document.getElementById('studio-patches-count');
        if (countBadge) {
            countBadge.textContent = `${this.patchesOnGarment.length} patch`;
        }

        const addAllBtn = document.getElementById('studio-add-all-btn');
        if (addAllBtn) {
            addAllBtn.disabled = this.patchesOnGarment.length === 0;
            if (this.patchesOnGarment.length === 0) {
                addAllBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                addAllBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    addAllToCart() {
        if (this.patchesOnGarment.length === 0) return;
        this.patchesOnGarment.forEach(item => {
            window.cartStore.addItem(item.product, 'iron', 1);
        });
        showToast(`Đã thêm trọn bộ ${this.patchesOnGarment.length} patch vào giỏ hàng!`, 'success');
        window.cartStore.openDrawer();
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => this.onDrag(e));
        window.addEventListener('mouseup', () => this.stopDrag());
        window.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        window.addEventListener('touchend', () => this.stopDrag());

        // Size slider
        const slider = document.getElementById('studio-size-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.resizeActivePatch(e.target.value);
            });
        }
    }
}

// Global instance initialized on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.patchStudio = new PatchStudio();
});
