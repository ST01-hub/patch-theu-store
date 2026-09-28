// Custom Patch Price Estimator & Order Logic
class PatchCalculator {
    constructor() {
        this.sizePresets = [
            { label: 'Nhỏ (5 x 5 cm)', w: 5, h: 5, desc: 'Cho mũ, cổ áo, ngực áo nhỏ' },
            { label: 'Tiêu chuẩn (7.5 x 7.5 cm)', w: 7.5, h: 7.5, desc: 'Phổ biến nhất cho ngực áo, balo' },
            { label: 'Trung bình (9 x 9 cm)', w: 9, h: 9, desc: 'Cho bắp tay, vạt áo khoác' },
            { label: 'Lớn (12 x 12 cm)', w: 12, h: 12, desc: 'Balo lớn, lưng áo khoác nhỏ' },
            { label: 'Cực đại (20 x 20 cm)', w: 20, h: 20, desc: 'Nguyên mảng lưng áo Bomber/Denim' }
        ];

        this.currentSettings = {
            width: 7.5,
            height: 7.5,
            quantity: 10,
            edgeType: 'merrowed', // merrowed or laser
            backing: 'iron', // iron, velcro, sew, sticker
            uploadedImage: null
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.calculate();
    }

    bindEvents() {
        // Preset buttons
        const presetContainer = document.getElementById('calc-size-presets');
        if (presetContainer) {
            presetContainer.innerHTML = this.sizePresets.map((p, idx) => `
                <button type="button" 
                        class="calc-preset-btn text-left p-3 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-750 transition-all ${idx === 1 ? 'active-preset ring-2 ring-amber-500 bg-amber-500/10' : ''}"
                        onclick="window.patchCalc.selectPreset(${p.w}, ${p.h}, this)">
                    <div class="font-bold text-sm text-slate-100">${p.label}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">${p.desc}</div>
                </button>
            `).join('');
        }

        // Custom dimension inputs
        const widthInput = document.getElementById('calc-width');
        const heightInput = document.getElementById('calc-height');
        const qtyInput = document.getElementById('calc-quantity');

        if (widthInput) {
            widthInput.addEventListener('input', (e) => {
                this.currentSettings.width = parseFloat(e.target.value) || 5;
                this.calculate();
            });
        }
        if (heightInput) {
            heightInput.addEventListener('input', (e) => {
                this.currentSettings.height = parseFloat(e.target.value) || 5;
                this.calculate();
            });
        }
        if (qtyInput) {
            qtyInput.addEventListener('input', (e) => {
                this.currentSettings.quantity = parseInt(e.target.value) || 1;
                this.calculate();
            });
        }

        // Image upload preview
        const dropZone = document.getElementById('calc-dropzone');
        const fileInput = document.getElementById('calc-file-input');
        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFile(e.target.files[0]));
            
            // Drag and drop
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('border-amber-400', 'bg-amber-500/5');
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('border-amber-400', 'bg-amber-500/5');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-amber-400', 'bg-amber-500/5');
                if (e.dataTransfer.files.length) {
                    this.handleFile(e.dataTransfer.files[0]);
                }
            });
        }
    }

    selectPreset(w, h, btnElem) {
        this.currentSettings.width = w;
        this.currentSettings.height = h;

        const widthInput = document.getElementById('calc-width');
        const heightInput = document.getElementById('calc-height');
        if (widthInput) widthInput.value = w;
        if (heightInput) heightInput.value = h;

        document.querySelectorAll('.calc-preset-btn').forEach(btn => {
            btn.classList.remove('active-preset', 'ring-2', 'ring-amber-500', 'bg-amber-500/10');
        });
        if (btnElem) {
            btnElem.classList.add('active-preset', 'ring-2', 'ring-amber-500', 'bg-amber-500/10');
        }

        this.calculate();
    }

    setEdgeType(type) {
        this.currentSettings.edgeType = type;
        this.calculate();
    }

    setBacking(backing) {
        this.currentSettings.backing = backing;
        this.calculate();
    }

    setQuantity(qty) {
        this.currentSettings.quantity = qty;
        const qtyInput = document.getElementById('calc-quantity');
        if (qtyInput) qtyInput.value = qty;
        this.calculate();
    }

    handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showToast('Vui lòng chọn file hình ảnh (PNG, JPG, SVG, PSD)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentSettings.uploadedImage = e.target.result;
            const previewContainer = document.getElementById('calc-preview-container');
            const dropzonePrompt = document.getElementById('calc-dropzone-prompt');
            const previewImg = document.getElementById('calc-preview-img');

            if (previewContainer && previewImg && dropzonePrompt) {
                previewImg.src = e.target.result;
                previewContainer.classList.remove('hidden');
                dropzonePrompt.classList.add('hidden');
            }
            showToast(`Đã tải lên thiết kế: ${file.name}`, 'success');
        };
        reader.readAsDataURL(file);
    }

    removeUploadedFile(event) {
        if (event) event.stopPropagation();
        this.currentSettings.uploadedImage = null;
        const previewContainer = document.getElementById('calc-preview-container');
        const dropzonePrompt = document.getElementById('calc-dropzone-prompt');
        const fileInput = document.getElementById('calc-file-input');

        if (previewContainer && dropzonePrompt) {
            previewContainer.classList.add('hidden');
            dropzonePrompt.classList.remove('hidden');
        }
        if (fileInput) fileInput.value = '';
    }

    calculate() {
        const { width, height, quantity, backing, edgeType } = this.currentSettings;

        // Base area index in sq cm
        const area = width * height; // e.g. 7.5 x 7.5 = 56.25 cm2
        
        // Base rate per cm2
        let baseUnitPrice = 45000 + (area * 320);

        // Quantity tiered discount factor
        let qtyDiscountFactor = 1.0;
        let tierLabel = 'Mẫu thử đơn chiếc (1-4 cái)';
        let digitizingFee = 50000; // Phí thiết kế ra film thêu vi tính

        if (quantity >= 100) {
            qtyDiscountFactor = 0.28;
            tierLabel = 'Đại lý sỉ (≥ 100 cái) - Giảm 72%';
            digitizingFee = 0;
        } else if (quantity >= 50) {
            qtyDiscountFactor = 0.38;
            tierLabel = 'Đơn số lượng lớn (50-99 cái) - Giảm 62%';
            digitizingFee = 0;
        } else if (quantity >= 20) {
            qtyDiscountFactor = 0.52;
            tierLabel = 'Đơn câu lạc bộ/nhóm (20-49 cái) - Giảm 48%';
            digitizingFee = 0;
        } else if (quantity >= 5) {
            qtyDiscountFactor = 0.70;
            tierLabel = 'Đơn nhóm nhỏ (5-19 cái) - Giảm 30%';
            digitizingFee = 25000;
        }

        // Backing fee adjustment
        let backingExtra = 0;
        if (backing === 'velcro') backingExtra = 8000;
        else if (backing === 'sticker') backingExtra = 4000;

        // Unit Price
        let unitPrice = Math.round((baseUnitPrice * qtyDiscountFactor + backingExtra) / 1000) * 1000;
        if (unitPrice < 15000) unitPrice = 15000;

        // Total
        let subtotal = unitPrice * quantity;
        let total = subtotal + digitizingFee;

        // Production days
        let prodDays = quantity <= 10 ? '2 - 3 ngày làm việc' : (quantity <= 50 ? '3 - 5 ngày làm việc' : '5 - 7 ngày làm việc');

        // Update UI
        const unitPriceElem = document.getElementById('calc-unit-price');
        const totalPriceElem = document.getElementById('calc-total-price');
        const digitizingFeeElem = document.getElementById('calc-digitizing-fee');
        const tierElem = document.getElementById('calc-tier-badge');
        const daysElem = document.getElementById('calc-prod-days');

        if (unitPriceElem) unitPriceElem.textContent = formatCurrency(unitPrice);
        if (totalPriceElem) totalPriceElem.textContent = formatCurrency(total);
        if (digitizingFeeElem) {
            digitizingFeeElem.textContent = digitizingFee === 0 ? 'MIỄN PHÍ (Tiết kiệm 50K)' : formatCurrency(digitizingFee);
            digitizingFeeElem.className = digitizingFee === 0 ? 'text-emerald-400 font-bold' : 'text-slate-300 font-medium';
        }
        if (tierElem) tierElem.textContent = tierLabel;
        if (daysElem) daysElem.textContent = prodDays;

        this.calculatedResult = {
            unitPrice,
            total,
            digitizingFee,
            quantity,
            width,
            height,
            backing,
            edgeType,
            prodDays
        };
    }

    submitCustomOrder() {
        const res = this.calculatedResult;
        const backingName = BACKING_TYPES[res.backing]?.name || res.backing;
        const edgeName = res.edgeType === 'merrowed' ? 'Viền vắt sổ Merrowed đệm nổi' : 'Viền cắt nhiệt Laser-Cut sắc nét';

        const summaryText = `🧵 YÊU CẦU ĐẶT THÊU TẠI XƯỞNG VALEE:
- Kích thước: ${res.width} x ${res.height} cm
- Số lượng: ${res.quantity} cái
- Mặt sau: ${backingName}
- Kiểu viền: ${edgeName}
- Đơn giá ước tính: ${formatCurrency(res.unitPrice)}/cái
- Phí khuôn thêu vi tính: ${res.digitizingFee === 0 ? 'Miễn phí' : formatCurrency(res.digitizingFee)}
- TỔNG CHI PHÍ: ${formatCurrency(res.total)}
- Thời gian sản xuất: ${res.prodDays}
- Hotline/Zalo Valee: 0977891360 (Gò Cát, P.Long Trường, HCM)`;

        // Populate modal
        const modalSummary = document.getElementById('custom-order-modal-summary');
        if (modalSummary) {
            modalSummary.innerText = summaryText;
        }

        const modal = document.getElementById('custom-order-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    closeModal() {
        const modal = document.getElementById('custom-order-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.patchCalc = new PatchCalculator();
});
