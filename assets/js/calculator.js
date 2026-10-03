// VALEE - CUSTOM EMBROIDERY PATCH CALCULATOR (BẢNG GIÁ CHI TIẾT THEO YÊU CẦU XƯỞNG VALEE)
class PatchCalculator {
    constructor() {
        // 5 Kích thước mẫu tiêu chuẩn (cm)
        this.sizePresets = [
            { key: 'small', label: 'Nhỏ (5 x 5 cm)', w: 5, h: 5, desc: 'Cho mũ, cổ áo, ngực áo nhỏ' },
            { key: 'standard', label: 'Tiêu chuẩn (7.5 x 7.5 cm)', w: 7.5, h: 7.5, desc: 'Phổ biến nhất cho ngực áo, túi áo' },
            { key: 'medium', label: 'Trung Bình (9 x 9 cm)', w: 9, h: 9, desc: 'Cho bắp tay, vạt áo khoác' },
            { key: 'large', label: 'Lớn (12 x 12 cm)', w: 12, h: 12, desc: 'Balo lớn, lưng áo khoác nhỏ' },
            { key: 'max', label: 'Cực đại (30 x 20 cm)', w: 30, h: 20, desc: 'Trọn mảng lưng áo Bomber/Denim' }
        ];

        this.currentSettings = {
            width: 7.5,
            height: 7.5,
            complexity: 'standard',     // 'simple' | 'standard' | 'complex' | 'complex_3d'
            colorsCount: '1-2',         // '1-2' | '3-6' | '7+'
            threadType: 'standard',      // 'standard' | 'metallic' | 'glow' | 'both'
            metallicColors: 1,          // 1, 2, 3 màu kim tuyến (+5.000đ/màu/cái)
            quantity: 10,
            edgeType: 'merrowed',       // 'merrowed' | 'laser'
            backing: 'iron',            // 'iron' | 'velcro' | 'sticker' | 'none' | 'custom'
            customBackingNote: '',      // Ghi chú cho vật liệu khác
            uploadedImage: null
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.calculate();
    }

    bindEvents() {
        // Render Size Presets
        const presetContainer = document.getElementById('calc-size-presets');
        if (presetContainer) {
            presetContainer.innerHTML = this.sizePresets.map((p, idx) => `
                <button type="button" 
                        class="calc-preset-btn text-left p-3 rounded-xl border border-stone-750 bg-stone-900/80 hover:bg-stone-800 transition-all ${idx === 1 ? 'active-preset ring-2 ring-amber-500 bg-amber-500/10 border-amber-500' : ''}"
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
                this.clearPresetActiveStyle();
                this.calculate();
            });
        }
        if (heightInput) {
            heightInput.addEventListener('input', (e) => {
                this.currentSettings.height = parseFloat(e.target.value) || 5;
                this.clearPresetActiveStyle();
                this.calculate();
            });
        }
        if (qtyInput) {
            qtyInput.addEventListener('input', (e) => {
                this.currentSettings.quantity = parseInt(e.target.value) || 1;
                this.calculate();
            });
        }

        // Custom backing note input
        const customBackingInput = document.getElementById('calc-custom-backing-input');
        if (customBackingInput) {
            customBackingInput.addEventListener('input', (e) => {
                this.currentSettings.customBackingNote = e.target.value.trim();
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

    clearPresetActiveStyle() {
        document.querySelectorAll('.calc-preset-btn').forEach(btn => {
            btn.classList.remove('active-preset', 'ring-2', 'ring-amber-500', 'bg-amber-500/10', 'border-amber-500');
        });
    }

    selectPreset(w, h, btnElem) {
        this.currentSettings.width = w;
        this.currentSettings.height = h;

        const widthInput = document.getElementById('calc-width');
        const heightInput = document.getElementById('calc-height');
        if (widthInput) widthInput.value = w;
        if (heightInput) heightInput.value = h;

        this.clearPresetActiveStyle();
        if (btnElem) {
            btnElem.classList.add('active-preset', 'ring-2', 'ring-amber-500', 'bg-amber-500/10', 'border-amber-500');
        }

        this.calculate();
    }

    // 1. Độ phức tạp (4 cấp bậc: simple, standard, complex, complex_3d)
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

    // 4. Số lượng màu chỉ (1-2, 3-6, 7+)
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

    // 3. Tùy chọn chất liệu chỉ cao cấp (standard, metallic, glow, both)
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

        // Toggle sub-options for metallic colors
        const metallicOptions = document.getElementById('calc-metallic-options');
        if (metallicOptions) {
            if (threadType === 'metallic' || threadType === 'both') {
                metallicOptions.classList.remove('hidden');
            } else {
                metallicOptions.classList.add('hidden');
            }
        }

        this.calculate();
    }

    setMetallicColors(count) {
        this.currentSettings.metallicColors = count;
        document.querySelectorAll('.calc-metallic-color-btn').forEach(b => {
            b.classList.remove('bg-amber-500', 'text-stone-950', 'font-black');
            b.classList.add('bg-stone-900', 'text-stone-300');
        });
        const activeBtn = document.getElementById(`metallic-btn-${count}`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-stone-900', 'text-stone-300');
            activeBtn.classList.add('bg-amber-500', 'text-stone-950', 'font-black');
        }
        this.calculate();
    }

    // 6. Chọn loại mặt sau (iron, velcro, sticker, none, custom)
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

        // Toggle custom backing input box
        const customBox = document.getElementById('calc-custom-backing-box');
        if (customBox) {
            if (backing === 'custom') {
                customBox.classList.remove('hidden');
            } else {
                customBox.classList.add('hidden');
            }
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
            if (typeof showToast === 'function') {
                showToast('Vui lòng chọn file hình ảnh (PNG, JPG, SVG, PSD)', 'error');
            }
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
            if (typeof showToast === 'function') {
                showToast(`Đã tải lên thiết kế: ${file.name}`, 'success');
            }
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

    // Helper xác định phân loại size từ diện tích và kích thước
    getSizeCategory(width, height) {
        const area = width * height;
        if (area <= 36) return { key: 'small', name: 'Nhỏ (≤ 5x5 cm)' };
        if (area <= 65) return { key: 'standard', name: 'Tiêu chuẩn (7.5x7.5 cm)' };
        if (area <= 100) return { key: 'medium', name: 'Trung Bình (9x9 cm)' };
        if (area <= 225) return { key: 'large', name: 'Lớn (12x12 cm)' };
        return { key: 'max', name: 'Cực đại (30x20 cm)' };
    }

    // 1 & 2. Tính Phí Số Hóa Mẫu Thêu (Digitizing Fee) theo 4 cấp bậc và số lượng
    getDigitizingFee(complexity, quantity) {
        // Miễn phí 100% từ 21 cái trở lên
        if (quantity >= 21) {
            return { fee: 0, originalFee: this.getBaseDigitizingFee(complexity) };
        }

        const feeTable = {
            'simple': { tier1: 50000, tier2: 25000 },       // 1-9: 50k, 10-20: 25k
            'standard': { tier1: 80000, tier2: 45000 },     // 1-9: 80k, 10-20: 45k
            'complex': { tier1: 120000, tier2: 68000 },     // 1-9: 120k, 10-20: 68k
            'complex_3d': { tier1: 180000, tier2: 90000 }   // 1-9: 180k, 10-20: 90k
        };

        const config = feeTable[complexity] || feeTable['standard'];
        const fee = quantity <= 9 ? config.tier1 : config.tier2; // 10 - 20 cái áp tier2
        return { fee, originalFee: config.tier1 };
    }

    getBaseDigitizingFee(complexity) {
        const baseFees = {
            'simple': 50000,
            'standard': 80000,
            'complex': 120000,
            'complex_3d': 180000
        };
        return baseFees[complexity] || 80000;
    }

    // 2. Tính chiết khấu bậc thang theo số lượng (Tiered Quantity Discount)
    getQuantityDiscount(qty) {
        if (qty >= 1000) return { factor: 0.05, label: 'Đại lý nhà máy (≥ 1000 cái) - Giảm 95%' };
        if (qty >= 200) return { factor: 0.10, label: 'Đơn sỉ xưởng (200-999 cái) - Giảm 90%' };
        if (qty >= 100) return { factor: 0.22, label: 'Đơn đại lý (100-199 cái) - Giảm 78%' };
        if (qty >= 50) return { factor: 0.28, label: 'Đơn số lượng lớn (50-99 cái) - Giảm 72%' };
        if (qty >= 20) return { factor: 0.52, label: 'Đơn hội nhóm / CLB (20-49 cái) - Giảm 48%' };
        if (qty >= 5) return { factor: 0.70, label: 'Đơn nhóm nhỏ (5-19 cái) - Giảm 30%' };
        return { factor: 1.00, label: 'Mẫu thử đơn chiếc (1-4 cái) - Giá mẫu gốc' };
    }

    // 6. Tính phụ phí mặt sau (Backing Fee) theo phân loại kích thước & số lượng
    getBackingFee(backingType, sizeCategoryKey, quantity) {
        let fee = 0;
        let note = '';

        switch (backingType) {
            case 'iron': // Keo ủi nhiệt
                // 1-5 cái: Miễn phí cho tất cả các size
                if (quantity <= 5) {
                    fee = 0;
                    note = 'Keo ủi nhiệt (1-5 cái: Miễn phí)';
                } else {
                    // >= 6 cái: 500đ tiêu chuẩn, 1k lớn, 3.5k cực đại
                    if (sizeCategoryKey === 'small' || sizeCategoryKey === 'standard') {
                        fee = 500;
                        note = 'Keo ủi nhiệt (+500đ/cái)';
                    } else if (sizeCategoryKey === 'medium' || sizeCategoryKey === 'large') {
                        fee = 1000;
                        note = 'Keo ủi nhiệt (+1.000đ/cái)';
                    } else { // max
                        fee = 3500;
                        note = 'Keo ủi nhiệt Cực đại (+3.500đ/cái)';
                    }
                }
                break;

            case 'velcro': // Gai Velcro
                // Size nhỏ/tiêu chuẩn/trung bình: 15k/cái | Size lớn: 20k/cái | Size cực đại: 25k/cái
                if (sizeCategoryKey === 'small' || sizeCategoryKey === 'standard' || sizeCategoryKey === 'medium') {
                    fee = 15000;
                    note = 'Gai Velcro (+15.000đ/cái)';
                } else if (sizeCategoryKey === 'large') {
                    fee = 20000;
                    note = 'Gai Velcro bản lớn (+20.000đ/cái)';
                } else { // max
                    fee = 25000;
                    note = 'Gai Velcro cực đại (+25.000đ/cái)';
                }
                break;

            case 'sticker': // Keo 3M dán nón bảo hiểm, laptop
                // Size nhỏ/tiêu chuẩn: 3k/cái | Size trung bình/lớn: 8k/cái | Size cực đại: 15k/cái
                if (sizeCategoryKey === 'small' || sizeCategoryKey === 'standard') {
                    fee = 3000;
                    note = 'Keo dán 3M (+3.000đ/cái)';
                } else if (sizeCategoryKey === 'medium' || sizeCategoryKey === 'large') {
                    fee = 8000;
                    note = 'Keo dán 3M bản lớn (+8.000đ/cái)';
                } else { // max
                    fee = 15000;
                    note = 'Keo dán 3M cực đại (+15.000đ/cái)';
                }
                break;

            case 'none': // Không dùng (may viền trực tiếp)
                fee = 0;
                note = 'May viền trực tiếp (+0đ)';
                break;

            case 'custom': // Vật liệu khác
                fee = 0;
                note = this.currentSettings.customBackingNote 
                    ? `Vật liệu khác (${this.currentSettings.customBackingNote} - Báo giá sau)` 
                    : 'Vật liệu khác (Báo giá riêng sau tư vấn)';
                break;

            default:
                fee = 0;
                note = 'Keo ủi nhiệt';
        }

        return { fee, note };
    }

    calculate() {
        const { width, height, quantity, backing, complexity, colorsCount, threadType, metallicColors } = this.currentSettings;

        // 1. Diện tích (Area in cm2)
        const area = width * height;
        const sizeCategory = this.getSizeCategory(width, height);

        // 2. Mật độ mũi thêu & Hệ số đơn giá kỹ thuật theo 4 cấp bậc
        let densityStitchesPerCm2 = 240;
        let complexityFactor = 1.0;
        let complexityName = 'Tiêu chuẩn (Độ phủ ~65%)';

        if (complexity === 'simple') {
            densityStitchesPerCm2 = 120; // Nét mảnh, outline, chữ
            complexityFactor = 0.70;
            complexityName = 'Đơn Giản (Chữ / Nét mảnh / Phủ ~35%)';
        } else if (complexity === 'complex') {
            densityStitchesPerCm2 = 390; // Phủ kín nhiều chi tiết, tranh thêu
            complexityFactor = 1.35;
            complexityName = 'Phức Tạp (Chi tiết cao / Thêu phủ kín 100%)';
        } else if (complexity === 'complex_3d') {
            densityStitchesPerCm2 = 520; // Thêu nổi 3D đa tầng xốp EVA
            complexityFactor = 1.70;
            complexityName = 'Phức Tạp 3D (Thêu nổi xốp 3D / Đa tầng)';
        }

        const estimatedStitches = Math.max(2000, Math.round((area * densityStitchesPerCm2) / 100) * 100);

        // 3. Phụ phí số màu chỉ (Thread Changes & Trims)
        // 1-2 màu: +0đ | 3-6 màu: +3.000đ/cái | 7-10+ màu: +6.000đ/cái
        let colorExtra = 0;
        let colorName = '1 – 2 màu (Cơ bản - +0đ)';
        if (colorsCount === '3-6') {
            colorExtra = 3000;
            colorName = '3 – 6 màu (+3.000đ/cái)';
        } else if (colorsCount === '7+') {
            colorExtra = 6000;
            colorName = '7 – 10+ màu (+6.000đ/cái)';
        }

        // 4. Phụ phí chất liệu sợi chỉ cao cấp
        // Chỉ thường: +0đ
        // Kim tuyến Vàng/Bạc: +5.000đ/màu
        // Chỉ dạ quang phát sáng: +18.000đ/cái
        let threadExtra = 0;
        let threadName = 'Chỉ thêu Polyester bền màu tiêu chuẩn (+0đ)';

        if (threadType === 'metallic') {
            const mCount = Math.max(1, Math.min(3, metallicColors || 1));
            threadExtra = 5000 * mCount;
            threadName = `Chỉ Kim Tuyến Vàng/Bạc (${mCount} màu kim tuyến - +${(threadExtra/1000).toFixed(0)}K/cái)`;
        } else if (threadType === 'glow') {
            threadExtra = 18000;
            threadName = 'Chỉ Dạ Quang UV phát sáng trong bóng tối (+18.000đ/cái)';
        } else if (threadType === 'both') {
            const mCount = Math.max(1, Math.min(3, metallicColors || 1));
            threadExtra = (5000 * mCount) + 18000;
            threadName = `Phối Kim Tuyến (${mCount} màu) + Dạ Quang UV (+${(threadExtra/1000).toFixed(0)}K/cái)`;
        }

        // 5. Phụ phí mặt sau (Backing)
        const backingInfo = this.getBackingFee(backing, sizeCategory.key, quantity);
        const backingExtra = backingInfo.fee;

        // 6. Chiết khấu bậc thang theo số lượng (Tiered Quantity Discount)
        const qtyDiscount = this.getQuantityDiscount(quantity);
        const qtyDiscountFactor = qtyDiscount.factor;
        const tierLabel = qtyDiscount.label;

        // 7. Phí số hóa mẫu thêu vi tính (Digitizing Fee)
        const digitizingInfo = this.getDigitizingFee(complexity, quantity);
        const digitizingFee = digitizingInfo.fee;
        const baseFilmFee = digitizingInfo.originalFee;

        // 8. Đơn giá cơ sở tính theo DIỆN TÍCH PATCH THÊU (cm2):
        // Công thức: (Chi phí định mức ban đầu + Diện tích cm2 x Đơn giá mỗi cm2) x Hệ số độ phức tạp
        let rawUnitPrice = (32000 + (area * 360)) * complexityFactor;

        // Áp dụng chiết khấu số lượng + các phụ phí per-item
        let unitPrice = Math.round(((rawUnitPrice * qtyDiscountFactor) + colorExtra + threadExtra + backingExtra) / 500) * 500;
        
        // Sàn tối thiểu cho từng nhóm size để đảm bảo chi phí vật tư tối thiểu
        const floorPrices = {
            'small': 4000,
            'standard': 6000,
            'medium': 8000,
            'large': 12000,
            'max': 30000
        };
        const minFloor = floorPrices[sizeCategory.key] || 6000;
        if (unitPrice < minFloor) unitPrice = minFloor;

        // Tổng tiền
        let subtotal = unitPrice * quantity;
        let total = subtotal + digitizingFee;

        // Thời gian sản xuất
        let prodDays = quantity <= 10 ? '2 - 3 ngày' : (quantity <= 50 ? '3 - 5 ngày' : '5 - 7 ngày');
        if (quantity >= 500) prodDays = '7 - 10 ngày';

        // Cập nhật giao diện UI
        const unitPriceElem = document.getElementById('calc-unit-price');
        const totalPriceElem = document.getElementById('calc-total-price');
        const digitizingFeeElem = document.getElementById('calc-digitizing-fee');
        const tierElem = document.getElementById('calc-tier-badge');
        const daysElem = document.getElementById('calc-prod-days');
        const stitchesElem = document.getElementById('calc-estimated-stitches');
        const complexityDisplayElem = document.getElementById('calc-complexity-display');
        const threadDisplayElem = document.getElementById('calc-thread-display');
        const sizeCategoryBadge = document.getElementById('calc-size-category-badge');

        if (unitPriceElem) unitPriceElem.textContent = formatCurrency(unitPrice);
        if (totalPriceElem) totalPriceElem.textContent = formatCurrency(total);
        if (sizeCategoryBadge) sizeCategoryBadge.textContent = sizeCategory.name;

        if (digitizingFeeElem) {
            if (digitizingFee === 0) {
                digitizingFeeElem.textContent = `MIỄN PHÍ (Tiết kiệm ${formatCurrency(baseFilmFee)})`;
                digitizingFeeElem.className = 'text-emerald-400 font-bold';
            } else {
                digitizingFeeElem.textContent = formatCurrency(digitizingFee);
                digitizingFeeElem.className = 'text-stone-300 font-medium';
            }
        }

        if (tierElem) tierElem.textContent = tierLabel;
        if (daysElem) daysElem.textContent = prodDays;
        
        const areaElem = document.getElementById('calc-area-display');
        const formattedArea = (area % 1 === 0 ? area : area.toFixed(2));
        if (areaElem) areaElem.textContent = `${formattedArea} cm² (${width} × ${height} cm)`;

        if (stitchesElem) stitchesElem.textContent = `~${estimatedStitches.toLocaleString('vi-VN')} mũi chỉ (${sizeCategory.name})`;
        if (complexityDisplayElem) complexityDisplayElem.textContent = complexityName;
        if (threadDisplayElem) threadDisplayElem.textContent = `${colorName.split('(')[0].trim()} • ${threadName.split('(')[0].trim()}`;
        const backingDisplayElem = document.getElementById('calc-backing-display');
        if (backingDisplayElem) backingDisplayElem.textContent = backingInfo.note;

        this.calculatedResult = {
            unitPrice,
            total,
            digitizingFee,
            baseFilmFee,
            quantity,
            width,
            height,
            area: formattedArea,
            sizeCategoryName: sizeCategory.name,
            estimatedStitches,
            complexityName,
            colorName,
            threadName,
            backingNote: backingInfo.note,
            prodDays,
            tierLabel
        };
    }

    submitCustomOrder() {
        const res = this.calculatedResult;

        const summaryText = `🧵 YÊU CẦU BÁO GIÁ ĐẶT THÊU - XƯỞNG VALEE:
- Kích thước: ${res.width} x ${res.height} cm (${res.sizeCategoryName} - Diện tích: ${res.area} cm²)
- Mật độ mũi thêu ước tính: ~${res.estimatedStitches.toLocaleString('vi-VN')} mũi
- Mức độ phức tạp: ${res.complexityName}
- Số màu chỉ: ${res.colorName}
- Loại sợi chỉ: ${res.threadName}
- Loại mặt sau: ${res.backingNote}
- Số lượng đặt: ${res.quantity} cái (${res.tierLabel})
-------------------------------------
- Đơn giá: ${formatCurrency(res.unitPrice)} / cái
- Phí khuôn thêu vi tính (Film): ${res.digitizingFee === 0 ? 'MIỄN PHÍ 100%' : formatCurrency(res.digitizingFee)}
- TỔNG CHI PHÍ TẠM TÍNH: ${formatCurrency(res.total)}
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
