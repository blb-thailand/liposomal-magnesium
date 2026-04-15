// === ตั้งค่า URL ของ Google Apps Script ที่นี่ ===
const GAS_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"; 

let cart = [];

// 1. ระบบตะกร้าสินค้า (Cart & Animation)
function addToCart(btnElement, itemName) {
    const rect = btnElement.getBoundingClientRect();
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    flyingItem.innerText = "+1";
    flyingItem.style.left = rect.left + 'px';
    flyingItem.style.top = rect.top + 'px';
    document.body.appendChild(flyingItem);

    const cartIcon = document.getElementById('floating-cart');
    const cartRect = cartIcon.getBoundingClientRect();

    setTimeout(() => {
        flyingItem.style.left = (cartRect.left + 10) + 'px';
        flyingItem.style.top = (cartRect.top + 5) + 'px';
        flyingItem.style.transform = 'scale(0.2)';
        flyingItem.style.opacity = '0';
    }, 50);

    setTimeout(() => {
        flyingItem.remove();
        cart.push(itemName);
        document.getElementById('cart-count').innerText = cart.length;
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
    }, 800);
}

function openCartPopup() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    if (cart.length === 0) {
        list.innerHTML = '<li style="text-align:center; color:#A8B2D1;">ไม่มีสินค้าในตะกร้า</li>';
    } else {
        cart.forEach((item, index) => {
            list.innerHTML += `<li style="background:var(--bg-deep-navy); padding:10px; margin-bottom:5px; border-radius:6px; border-left:4px solid var(--accent-gold);">${index + 1}. ${item}</li>`;
        });
    }
    document.getElementById('cart-popup').style.display = 'flex';
}
function closeCartPopup() { document.getElementById('cart-popup').style.display = 'none'; }

// 2. ระบบ Checkout (ส่งข้อมูลไป GAS)
function openCheckout() {
    if(cart.length === 0) return alert('กรุณาเลือกสินค้าก่อนครับ');
    closeCartPopup();
    document.getElementById('checkout-form-popup').style.display = 'flex';
}
function closeCheckout() { document.getElementById('checkout-form-popup').style.display = 'none'; }

async function submitOrder() {
    const name = document.getElementById('order-name').value;
    const tel = document.getElementById('order-tel').value;
    const address = document.getElementById('order-address').value;
    
    if (!name || !tel || !address) return alert("กรุณากรอกข้อมูลให้ครบถ้วนครับ");

    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                tel: tel,
                address: address,
                products: cart.join(', '),
                timestamp: new Date().toLocaleString('th-TH')
            })
        });
        alert("✅ รับออเดอร์สำเร็จ! แอดมินกำลังเตรียมจัดส่งครับ");
        cart = []; document.getElementById('cart-count').innerText = '0';
        document.getElementById('order-name').value = '';
        document.getElementById('order-tel').value = '';
        document.getElementById('order-address').value = '';
        closeCheckout();
    } catch (e) {
        alert("ขัดข้องชั่วคราว ทักแชทสั่งซื้อแทนได้เลยครับ");
    }
}

// 3. ระบบ Popups อื่นๆ (FAQ, Admin, Gacha)
function openChatPopup() { document.getElementById('faq-chat-popup').style.display = 'flex'; }
function closeChat() { document.getElementById('faq-chat-popup').style.display = 'none'; }
function sendQuestion(q) {
    const box = document.getElementById('chat-box');
    box.innerHTML += `<div class="message user-msg">${q}</div>`;
    box.scrollTop = box.scrollHeight;
    
    const typingId = "typing-" + Date.now();
    box.innerHTML += `<div id="${typingId}" class="message bot-msg">กำลังพิมพ์...</div>`;
    box.scrollTop = box.scrollHeight;

    setTimeout(() => {
        document.getElementById(typingId).remove();
        let ans = "ยินดีให้คำปรึกษาครับ ทัก LINE แอดมินได้เลยครับ";
        if(q.includes('ท้องว่าง')) ans = "ทานได้สบายมากครับ! นวัตกรรมไลโปโซมไม่ระคายเคืองกระเพาะอาหารแน่นอน 👍";
        if(q.includes('ต่างจาก')) ans = "ดูดซึมสูงกว่า 1.06 เท่า และเป็นแคปซูลเจลาตินทานได้อย่างปลอดภัยครับ ✨";
        box.innerHTML += `<div class="message bot-msg">${ans}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 1500);
}

function openAdminPopup() { document.getElementById('admin-popup').style.display = 'flex'; }
function closeAdminPopup() { document.getElementById('admin-popup').style.display = 'none'; }

let gachaOpened = false;
function openGacha() {
    if(gachaOpened) return;
    gachaOpened = true;
    document.getElementById('gacha-box').classList.add('shake');
    setTimeout(() => {
        document.getElementById('gacha-box').style.display = 'none';
        document.getElementById('gacha-reward').style.display = 'block';
    }, 600);
}
function closeGacha() { document.getElementById('gacha-popup').style.display = 'none'; }

// 4. Social Proof & Daily Tip & Scroll
const fNames = ["คุณ ภัทรพล", "คุณ มาลี", "คุณ สมศักดิ์", "คุณ พิมพ์ชนก"];
const fProds = ["เซ็ตโปร 2 แถม 1", "เซ็ตพรีเมียม 1 กระปุก", "เซ็ตทดลอง"];
function showSocialProof() {
    document.getElementById('sp-name').innerText = fNames[Math.floor(Math.random() * fNames.length)];
    document.getElementById('sp-product').innerText = fProds[Math.floor(Math.random() * fProds.length)];
    const t = document.getElementById('social-proof');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
}

const tips = [
    "ลดแสงจากมือถือก่อนนอน 1 ชม. ช่วยให้หลับลึกขึ้น", 
    "แมกนีเซียมช่วยลดตะคริวตอนกลางคืนได้ดีมาก", 
    "ทาน Liposomal ก่อนนอน 30 นาที ร่างกายดูดซึมไปฟื้นฟูเต็มที่",
    "การยืดเหยียดเบาๆ 5 นาทีก่อนนอน ช่วยคลายความตึงเครียด",
    "รู้หรือไม่? แมกนีเซียมมีส่วนช่วยปรับสมดุลระบบประสาทให้สงบลงได้"
];

function loadDailyTip() {
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem('blb_tip_date');
    let savedIndex = localStorage.getItem('blb_tip_index');

    if (savedDate !== todayStr || savedIndex === null) {
        savedIndex = Math.floor(Math.random() * tips.length);
        localStorage.setItem('blb_tip_date', todayStr);
        localStorage.setItem('blb_tip_index', savedIndex);
    }
    document.getElementById('daily-tip-text').innerText = tips[savedIndex];
}

window.onload = function() {
    loadDailyTip();
    setTimeout(() => {
        if(!sessionStorage.getItem('gachaSeen')) {
            document.getElementById('gacha-popup').style.display = 'flex';
            sessionStorage.setItem('gachaSeen', 'true');
        }
    }, 15000);
    setInterval(showSocialProof, 35000);
};

window.onscroll = function() {
    const s = document.getElementById('sticky-cta');
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) s.classList.add('show');
    else s.classList.remove('show');
};