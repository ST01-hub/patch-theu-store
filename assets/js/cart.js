// Shopping Cart & Checkout System
class CartStore {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('patch_cart_items')) || [];
        this.coupon = JSON.parse(localStorage.getItem('patch_cart_coupon')) || null;
        this.freeShipThreshold = 299000;
        this.shippingFee = 30000;

        this.init();
    }

    init() {
        this.renderCart();
        this.updateHeaderBadge();
    }

    save() {
        localStorage.setItem('patch_cart_items', JSON.stringify(this.items));
        localStorage.setItem('patch_cart_coupon', JSON.stringify(this.coupon));
        this.updateHeaderBadge();
    }

    addItem(product, backingId = 'iron', quantity = 1) {
        const itemKey = `${product.id}_${backingId}`;
        const backing = BACKING_TYPES[backingId] || BACKING_TYPES['iron'];
        const unitPrice = product.price + backing.extraPrice;

        const existing = this.items.find(i => i.key === itemKey);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                key: itemKey,
                productId: product.id,
                name: product.name,
                image: product.image,
                backingId: backingId,
                backingName: backing.name,
                unitPrice: unitPrice,
                quantity: quantity
            });
        }

        this.save();
        this.renderCart();
        showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
    }

    updateQuantity(key, delta) {
        const item = this.items.find(i => i.key === key);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            this.removeItem(key);
            return;
        }

        this.save();
        this.renderCart();
    }

    removeItem(key) {
        const idx = this.items.findIndex(i => i.key === key);
        if (idx !== -1) {
            const removed = this.items.splice(idx, 1);
            this.save();
            this.renderCart();
            showToast(`Đã xóa ${removed[0].name} khỏi giỏ`, 'info');
        }
    }

    applyCoupon(code) {
        code = code.trim().toUpperCase();
        if (code === 'PATCHVIBE') {
            this.coupon = { code: 'PATCHVIBE', discountPct: 10, discountAmount: 0, label: 'Giảm 10% toàn đơn' };
            showToast('Áp dụng mã PATCHVIBE giảm 10% thành công!', 'success');
        } else if (code === 'FREESHIP') {
            this.coupon = { code: 'FREESHIP', discountPct: 0, discountAmount: 30000, label: 'Miễn phí giao hàng (30K)' };
            showToast('Áp dụng mã FREESHIP thành công!', 'success');
        } else if (code === 'HELLO20') {
            this.coupon = { code: 'HELLO20', discountPct: 0, discountAmount: 20000, label: 'Giảm ngay 20.000đ' };
            showToast('Áp dụng mã HELLO20 thành công!', 'success');
        } else {
            showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'error');
            return false;
        }

        this.save();
        this.renderCart();
        return true;
    }

    removeCoupon() {
        this.coupon = null;
        this.save();
        this.renderCart();
        showToast('Đã hủy áp dụng mã giảm giá', 'info');
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    }

    getShipping() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= this.freeShipThreshold || (this.coupon && this.coupon.code === 'FREESHIP')) {
            return 0;
        }
        return this.shippingFee;
    }

    getDiscount() {
        if (!this.coupon) return 0;
        const subtotal = this.getSubtotal();
        let discount = 0;
        if (this.coupon.discountPct > 0) {
            discount += (subtotal * this.coupon.discountPct) / 100;
        }
        if (this.coupon.discountAmount > 0 && this.coupon.code !== 'FREESHIP') {
            discount += this.coupon.discountAmount;
        }
        return Math.min(subtotal, Math.round(discount));
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        const shipping = this.getShipping();
        const discount = this.getDiscount();
        return Math.max(0, subtotal + shipping - discount);
    }

    getTotalItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateHeaderBadge() {
        const badge = document.getElementById('header-cart-badge');
        const count = this.getTotalItemCount();
        if (badge) {
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
        }
    }

    openDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const backdrop = document.getElementById('cart-backdrop');
        if (drawer && backdrop) {
            drawer.classList.remove('translate-x-full');
            backdrop.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }
    }

    closeDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const backdrop = document.getElementById('cart-backdrop');
        if (drawer && backdrop) {
            drawer.classList.add('translate-x-full');
            backdrop.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    }

    renderCart() {
        const container = document.getElementById('cart-items-container');
        const subtotalElem = document.getElementById('cart-subtotal');
        const totalElem = document.getElementById('cart-total');
        const discountElem = document.getElementById('cart-discount-row');
        const freeshipBar = document.getElementById('cart-freeship-bar');
        const freeshipText = document.getElementById('cart-freeship-text');
        const checkoutBtn = document.getElementById('cart-checkout-btn');

        if (!container) return;

        const subtotal = this.getSubtotal();
        const shipping = this.getShipping();
        const discount = this.getDiscount();
        const total = this.getTotal();

        // Freeship threshold status
        if (freeshipBar && freeshipText) {
            if (subtotal >= this.freeShipThreshold) {
                freeshipBar.style.width = '100%';
                freeshipBar.className = 'h-2 rounded-full transition-all duration-500 bg-emerald-500';
                freeshipText.innerHTML = '<span class="text-emerald-400 font-bold">🎉 Bạn đã được MIỄN PHÍ VẬN CHUYỂN!</span>';
            } else {
                const diff = this.freeShipThreshold - subtotal;
                const pct = Math.min(100, Math.round((subtotal / this.freeShipThreshold) * 100));
                freeshipBar.style.width = `${pct}%`;
                freeshipBar.className = 'h-2 rounded-full transition-all duration-500 bg-amber-500';
                freeshipText.innerHTML = `Mua thêm <span class="text-amber-400 font-bold">${formatCurrency(diff)}</span> để được FREESHIP`;
            }
        }

        // Render Cart Items
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                    <div class="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 text-3xl text-slate-500 border border-slate-700">
                        <i class="fa-solid fa-basket-shopping"></i>
                    </div>
                    <h4 class="text-base font-semibold text-slate-200">Giỏ hàng của bạn đang trống</h4>
                    <p class="text-xs mt-1 text-slate-400 max-w-xs">Hãy khám phá bộ sưu tập patch thêu hot trend và biến tấu trang phục của bạn!</p>
                    <button onclick="window.cartStore.closeDrawer(); window.scrollTo({top: document.getElementById('catalog').offsetTop - 80, behavior: 'smooth'})" 
                            class="mt-5 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20">
                        Khám phá sản phẩm ngay
                    </button>
                </div>
            `;
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        } else {
            container.innerHTML = this.items.map(item => `
                <div class="flex gap-3 p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl hover:border-slate-600 transition-all">
                    <div class="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start gap-1">
                            <h5 class="text-xs font-semibold text-slate-100 truncate">${item.name}</h5>
                            <button onclick="window.cartStore.removeItem('${item.key}')" class="text-slate-400 hover:text-rose-400 text-xs p-1" title="Xóa">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <span class="inline-block text-[10px] text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded mt-1 border border-amber-500/20">
                            ${item.backingName}
                        </span>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs font-bold text-amber-400">${formatCurrency(item.unitPrice)}</span>
                            <div class="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                                <button onclick="window.cartStore.updateQuantity('${item.key}', -1)" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs">
                                    <i class="fa-solid fa-minus text-[9px]"></i>
                                </button>
                                <span class="w-7 text-center text-xs font-semibold text-slate-200">${item.quantity}</span>
                                <button onclick="window.cartStore.updateQuantity('${item.key}', 1)" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs">
                                    <i class="fa-solid fa-plus text-[9px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }

        // Pricing summary
        if (subtotalElem) subtotalElem.textContent = formatCurrency(subtotal);
        if (totalElem) totalElem.textContent = formatCurrency(total);

        // Coupon display
        const couponWrapper = document.getElementById('cart-coupon-badge-wrapper');
        if (couponWrapper) {
            if (this.coupon) {
                couponWrapper.innerHTML = `
                    <div class="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs mt-2">
                        <div class="flex items-center gap-1.5 text-amber-300">
                            <i class="fa-solid fa-ticket"></i>
                            <span>${this.coupon.code}: <b>${this.coupon.label}</b></span>
                        </div>
                        <button onclick="window.cartStore.removeCoupon()" class="text-slate-400 hover:text-rose-400 text-xs">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                `;
            } else {
                couponWrapper.innerHTML = '';
            }
        }

        if (discountElem) {
            if (discount > 0 || (this.coupon && this.coupon.code === 'FREESHIP')) {
                discountElem.classList.remove('hidden');
                document.getElementById('cart-discount-value').textContent = `-${formatCurrency(discount || 30000)}`;
            } else {
                discountElem.classList.add('hidden');
            }
        }

        const shippingElem = document.getElementById('cart-shipping-value');
        if (shippingElem) {
            shippingElem.textContent = shipping === 0 ? 'MIỄN PHÍ' : formatCurrency(shipping);
            shippingElem.className = shipping === 0 ? 'text-xs font-bold text-emerald-400' : 'text-xs text-slate-300';
        }
    }

    openCheckoutModal() {
        if (this.items.length === 0) return;
        this.closeDrawer();
        const modal = document.getElementById('checkout-modal');
        if (!modal) return;

        // Render checkout item review
        const reviewContainer = document.getElementById('checkout-order-items');
        if (reviewContainer) {
            reviewContainer.innerHTML = this.items.map(item => `
                <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                    <div class="flex items-center gap-2 truncate max-w-[220px]">
                        <span class="font-bold text-amber-400">${item.quantity}x</span>
                        <span class="truncate text-slate-200">${item.name}</span>
                    </div>
                    <span class="font-semibold text-slate-300">${formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
            `).join('');
        }

        // Update amounts
        const total = this.getTotal();
        document.getElementById('checkout-final-amount').textContent = formatCurrency(total);
        document.getElementById('checkout-shipping-amount').textContent = this.getShipping() === 0 ? 'Miễn phí' : formatCurrency(this.getShipping());

        // Update QR code for bank transfer
        const orderCode = 'VALEE' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('checkout-order-code-display').textContent = orderCode;
        
        const qrImg = document.getElementById('vietqr-image');
        if (qrImg) {
            // VietQR public generator API with Valee phone and store name
            qrImg.src = `https://img.vietqr.io/image/MB-0977891360-compact2.png?amount=${total}&addInfo=${orderCode}&accountName=VALEE%20EMBROIDERY`;
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    closeCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    processOrder(event) {
        event.preventDefault();
        const name = document.getElementById('order-fullname').value;
        const phone = document.getElementById('order-phone').value;
        const address = document.getElementById('order-address').value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod';

        if (!name || !phone || !address) {
            showToast('Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ giao hàng!', 'error');
            return;
        }

        const orderCode = document.getElementById('checkout-order-code-display').textContent;
        const finalTotal = this.getTotal();

        // Clear cart
        this.items = [];
        this.coupon = null;
        this.save();
        this.renderCart();
        this.closeCheckoutModal();

        // Show Order Success Screen
        const successModal = document.getElementById('order-success-modal');
        if (successModal) {
            document.getElementById('success-order-code').textContent = orderCode;
            document.getElementById('success-recipient').textContent = `${name} (${phone})`;
            document.getElementById('success-address').textContent = address;
            document.getElementById('success-total').textContent = formatCurrency(finalTotal);
            document.getElementById('success-payment').textContent = paymentMethod === 'bank' ? 'Chuyển khoản QR SePay/VietQR' : 'Thanh toán COD khi nhận hàng';

            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
        }
    }

    closeSuccessModal() {
        const successModal = document.getElementById('order-success-modal');
        if (successModal) {
            successModal.classList.add('hidden');
            successModal.classList.remove('flex');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cartStore = new CartStore();
});
