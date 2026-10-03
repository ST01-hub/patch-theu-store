// VALEE - CUSTOM EMBROIDERY PATCH CALCULATOR (MẬT ĐỘ MŨI THÊU & MÀU CHỈ)
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
            complexity: 'standard', // 'simple' | 'standard' | 'complex'
            colorsCount: '1-3',     // '1-3' | '4-6' | '7+'
            threadType: 'standard',  // 'standard' | 'metallic' | 'glow'
            quantity: 10,
            edgeType: 'merrowed',   // 'merrowed' | 'laser'
            backing: 'iron',        // 'iron' | 'velcro' | 'sew' | 'sticker'
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
                        class="calc-preset-btn text-left p-3 rounded-xl border border-stone-750 bg-stone-900/80 hover:bg-stone-800 transition-all ${idx === 1 ? 'active-preset ring-2 ring-amber-500 bg-amber-500/10' : ''}"
                        onclick="window.patchCalc.selectPreset(${p.w}, ${p.h}, this)">
                    <div class="font-bold text-xs text-stone-100 font-vintage">${p.label}</div>
                    <div class="text-[10px] text-stone-400 mt-0.5">${p.desc}</div>
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

    setComplexity(complexity, btnElem) {
        this.currentSettings.complexity = complexity;
        document.querySelectorAll('.calc-complexity-btn').forEach(b => {
            b.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-500/15', 'border-amber-500');
            b.classList.add('bg-stone-950', 'border-stone-750');
        });
        if (btnElem) {
            btnElem.classList.remove('bg-stone-950', 'border-stone-750');
            btnElem.classList.add('ring-2', 'ring-amber-500', 'bg-amber-500/15', 'border-amber-500');
        }
        this.calculate();
    }

    setColorsCount(colors, btnElem) {
        this.currentSettings.colorsCount = colors;
        document.querySelectorAll('.calc-color-btn').forEach(b => {
            b.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-500/15', 'border-amber-500');
            b.classList.add('bg-stone-950', 'border-stone-750');
        });
        if (btnElem) {
            btnElem.classList.remove('bg-stone-950', 'border-stone-750');
            btnElem.classList.add('ring-2', 'ring-amber-500', 'bg-amber-500/15', 'border-amber-500');
        }
        this.calculate();
    }

    setThreadType(threadType, btnElem) {
        this.currentSettings.threadType = threadType;
        document.querySelectorAll('.calc-thread-btn').forEach(b => {
            b.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-500/15', 'border-amber-500');
            b.classList.add('bg-stone-950', 'border-stone-750');
        });
        if (btnElem) {
            btnElem.classList.remove('bg-stone-950', 'border-stone-750');
            btnElem.classList.add('ring-2', 'ring-amber-500', 'bg-amber-500/15', 'border-amber-500');
        }
        this.calculate();
    }

    setEdgeType(type) {
        this.currentSettings.edgeType = type;
        this.calculate();
    }

    setBacking(backing, btnElem) {
        this.currentSettings.backing = backing;
        document.querySelectorAll('.calc-backing-btn').forEach(b => {
            b.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-500/15', 'border-amber-500');
            b.classList.add('bg-stone-950', 'border-stone-750');
        });
        if (btnElem) {
            btnElem.classList.remove('bg-stone-950', 'border-stone-750');
            btnElem.classList.add('ring-2', 'ring-amber-500', 'bg-amber-500/15', 'border-amber-500');
        }
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
        const { width, height, quantity, backing, complexity, colorsCount, threadType } = this.currentSettings;

        // 1. Diện tích (Area in cm2)
        const area = width * height; // e.g. 7.5 x 7.5 = 56.25 cm2

        // 2. Ước tính Mật độ mũi thêu (Stitch Density & Estimated Stitch Count)
        let densityStitchesPerCm2 = 240; // chuẩn
        let complexityFactor = 1.0;
        let complexityName = 'Tiêu chuẩn (Độ phủ ~65%)';
        let baseDigitizingFee = 50000;

        if (complexity === 'simple') {
            densityStitchesPerCm2 = 120; // nét mảnh, viền outline, chữ
            complexityFactor = 0.70;     // giảm 30% giá vì ít mũi, máy chạy nhanh
            complexityName = 'Đơn giản / Chữ nét mảnh (Độ phủ ~35%)';
            baseDigitizingFee = 30000;
        } else if (complexity === 'complex') {
            densityStitchesPerCm2 = 430; // phủ kín 100%, 3D, ukiyo-e, anime
            complexityFactor = 1.38;     // tăng 38% vì đâm kim dày đặc, hao chỉ nhiều
            complexityName = 'Phức tạp / Thêu phủ kín 100% 3D';
            baseDigitizingFee = 80000;
        }

        const estimatedStitches = Math.max(2500, Math.round((area * densityStitchesPerCm2) / 100) * 100);

        // 3. Phụ phí số màu chỉ (Color Change Surcharge)
        let colorExtra = 0;
        let colorName = '1 – 3 màu (Cơ bản)';
        if (colorsCount === '4-6') {
            colorExtra = 3000;
            colorName = '4 – 6 màu (+3K/cái)';
        } else if (colorsCount === '7+') {
            colorExtra = 6000;
            colorName = '7 – 10+ màu (+6K/cái)';
        }

        // 4. Phụ phí loại chỉ đặc biệt (Special Thread Surcharge)
        let threadExtra = 0;
        let threadName = 'Chỉ thêu Polyester bền màu tiêu chuẩn';
        if (threadType === 'metallic') {
            threadExtra = 5000;
            threadName = 'Phối chỉ Kim Tuyến Vàng/Bạc (+5K/cái)';
        } else if (threadType === 'glow') {
            threadExtra = 6000;
            threadName = 'Phối chỉ Phát Quang / Dạ Quang (+6K/cái)';
        }

        // 5. Phụ phí mặt sau (Backing)
        let backingExtra = 0;
        if (backing === 'velcro') backingExtra = 8000;
        else if (backing === 'sticker') backingExtra = 4000;

        // 6. Chiết khấu bậc thang theo số lượng (Tiered Quantity Discount)
        let qtyDiscountFactor = 1.0;
        let tierLabel = 'Mẫu thử đơn chiếc (1-4 cái)';
        let digitizingFee = baseDigitizingFee;

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
            digitizingFee = Math.round(baseDigitizingFee * 0.5 / 1000) * 1000; // giảm 50% tiền film
        }

        // 7. Đơn giá cơ sở dựa trên số mũi thêu thực tế
        // Base formula: 25.000đ công cố định + (số mũi thêu x 1.6đ)
        let rawUnitPrice = (25000 + (estimatedStitches * 1.55)) * complexityFactor;

        // Áp dụng chiết khấu số lượng + phụ phí màu & mặt sau & loại chỉ
        let unitPrice = Math.round(((rawUnitPrice * qtyDiscountFactor) + colorExtra + threadExtra + backingExtra) / 1000) * 1000;
        if (unitPrice < 12000) unitPrice = 12000; // sàn tối thiểu cho mẫu siêu nhỏ

        // Tổng tiền
        let subtotal = unitPrice * quantity;
        let total = subtotal + digitizingFee;

        // Thời gian sản xuất
        let prodDays = quantity <= 10 ? '2 - 3 ngày' : (quantity <= 50 ? '3 - 5 ngày' : '5 - 7 ngày');

        // Cập nhật giao diện UI
        const unitPriceElem = document.getElementById('calc-unit-price');
        const totalPriceElem = document.getElementById('calc-total-price');
        const digitizingFeeElem = document.getElementById('calc-digitizing-fee');
        const tierElem = document.getElementById('calc-tier-badge');
        const daysElem = document.getElementById('calc-prod-days');
        const stitchesElem = document.getElementById('calc-estimated-stitches');
        const complexityDisplayElem = document.getElementById('calc-complexity-display');
        const threadDisplayElem = document.getElementById('calc-thread-display');

        if (unitPriceElem) unitPriceElem.textContent = formatCurrency(unitPrice);
        if (totalPriceElem) totalPriceElem.textContent = formatCurrency(total);
        if (digitizingFeeElem) {
            digitizingFeeElem.textContent = digitizingFee === 0 ? 'MIỄN PHÍ (Tiết kiệm ' + formatCurrency(baseDigitizingFee) + ')' : formatCurrency(digitizingFee);
            digitizingFeeElem.className = digitizingFee === 0 ? 'text-emerald-400 font-bold' : 'text-stone-300 font-medium';
        }
        if (tierElem) tierElem.textContent = tierLabel;
        if (daysElem) daysElem.textContent = prodDays;
        if (stitchesElem) stitchesElem.textContent = `~${estimatedStitches.toLocaleString('vi-VN')} mũi chỉ`;
        if (complexityDisplayElem) complexityDisplayElem.textContent = complexityName;
        if (threadDisplayElem) threadDisplayElem.textContent = `${colorName} • ${threadName.split('(')[0].trim()}`;

        this.calculatedResult = {
            unitPrice,
            total,
            digitizingFee,
            quantity,
            width,
            height,
            estimatedStitches,
            complexityName,
            colorName,
            threadName,
            backing,
            prodDays
        };
    }

    submitCustomOrder() {
        const res = this.calculatedResult;
        const backingName = (typeof BACKING_TYPES !== 'undefined' && BACKING_TYPES[res.backing]) 
            ? BACKING_TYPES[res.backing].name 
            : res.backing;

        const summaryText = `🧵 YÊU CẦU BÁO GIÁ ĐẶT THÊU - XƯỞNG VALEE:
- Kích thước: ${res.width} x ${res.height} cm
- Mật độ mũi thêu ước tính: ~${res.estimatedStitches.toLocaleString('vi-VN')} mũi
- Mức độ phức tạp: ${res.complexityName}
- Số màu chỉ & Loại sợi: ${res.colorName} | ${res.threadName}
- Mặt sau: ${backingName}
- Số lượng đặt: ${res.quantity} cái
-------------------------------------
- Đơn giá: ${formatCurrency(res.unitPrice)} / cái
- Phí khuôn thêu vi tính: ${res.digitizingFee === 0 ? 'Miễn phí' : formatCurrency(res.digitizingFee)}
- TỔNG CHI PHÍ DỰ TOÁN: ${formatCurrency(res.total)}
- Thời gian sản xuất: ${res.prodDays}
-------------------------------------
📍 Xưởng Valee: Gò Cát, P.Long Trường, TP. Thủ Đức, HCM
📞 Hotline/Zalo: 0977891360`;

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
