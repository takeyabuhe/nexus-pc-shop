// Shared header and footer for all pages
const SITE_NAME = "NEXUS PC";

// ===== カート管理 =====
let cart = JSON.parse(localStorage.getItem('nexus_cart') || '[]');

function cartSave() {
  localStorage.setItem('nexus_cart', JSON.stringify(cart));
}

function cartAdd(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += product.qty;
  } else {
    cart.push({ ...product });
  }
  cartSave();
  renderCart();
  openCartDropdown();
}

function cartRemove(id) {
  cart = cart.filter(i => i.id !== id);
  cartSave();
  renderCart();
}

function cartChangeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  cartSave();
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function cartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function renderCart() {
  const badge = document.getElementById('cart-badge');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-price');
  if (!badge || !itemsEl) return;

  const count = cartCount();
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">カートに商品がありません</div>';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">
          ${item.img ? `<img src="${item.img}" alt="${item.name}">` : '<svg width="24" height="24" fill="none" stroke="#444" stroke-width="1" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">¥${(item.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="cartChangeQty('${item.id}',-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="cartChangeQty('${item.id}',1)">＋</button>
          </div>
        </div>
        <button class="cart-item-del" onclick="cartRemove('${item.id}')">×</button>
      </div>
    `).join('');
  }
  if (totalEl) totalEl.textContent = '¥' + cartTotal().toLocaleString();
}

function openCartDropdown() {
  const dd = document.getElementById('cart-dropdown');
  if (dd) dd.classList.add('open');
}

function toggleCartDropdown() {
  const dd = document.getElementById('cart-dropdown');
  if (dd) dd.classList.toggle('open');
}

// 外クリックで閉じる
document.addEventListener('click', e => {
  const wrap = document.getElementById('cart-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) {
    const dd = document.getElementById('cart-dropdown');
    if (dd) dd.classList.remove('open');
  }
});

function injectCartDropdown() {
  // ヘッダーのカートリンクをドロップダウンに置き換え
  const cartLinks = document.querySelectorAll('.header-actions a');
  cartLinks.forEach(a => {
    if (a.textContent.includes('カート')) {
      const wrap = document.createElement('div');
      wrap.className = 'cart-dropdown-wrap';
      wrap.id = 'cart-dropdown-wrap';
      wrap.style.position = 'relative';
      wrap.innerHTML = `
        <a href="#" style="color:var(--text2);text-decoration:none;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;" onclick="toggleCartDropdown();return false;">
          <div style="position:relative;display:inline-block;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="cart-badge" id="cart-badge">0</span>
          </div>
          カート
        </a>
        <div class="cart-dropdown" id="cart-dropdown">
          <div class="cart-dropdown-header">
            <span>カート</span>
            <span style="font-size:12px;color:var(--text2);font-family:'Noto Sans JP',sans-serif;font-weight:400;" id="cart-count-label"></span>
          </div>
          <div class="cart-items" id="cart-items">
            <div class="cart-empty">カートに商品がありません</div>
          </div>
          <div class="cart-dropdown-footer">
            <div class="cart-total">
              <span class="cart-total-label">合計（税抜）</span>
              <span class="cart-total-price" id="cart-total-price">¥0</span>
            </div>
            <a href="#" class="btn-checkout">レジに進む</a>
          </div>
        </div>
      `;
      a.parentNode.replaceChild(wrap, a);
      renderCart();
    }
  });
}

function renderHeader(activePage = '') {
  return `
  <div class="notice-bar">🎮 新製品 RTX 5090 搭載モデル 入荷しました！ &nbsp;|&nbsp; 全国送料無料 &nbsp;|&nbsp; 最短翌日発送対応</div>
  <header>
    <div class="header-top">
      <a href="index.html" class="logo">NEXUS<span>PC</span></a>
      <div class="header-search">
        <svg width="14" height="14" fill="none" stroke="#888" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="商品名・スペックで検索...">
      </div>
      <div class="header-actions">
        <a href="#">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          マイページ
        </a>
        <a href="#">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          お気に入り
        </a>
        <a href="#">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          カート (0)
        </a>
      </div>
    </div>
    <nav class="nav-bar">
      <div class="nav-inner">
        <a href="index.html" class="${activePage==='home'?'active':''}">ゲーミングPC</a>
        <a href="index.html" class="${activePage==='creator'?'active':''}">クリエイターPC</a>
        <a href="index.html">ビジネスPC</a>
        <a href="index.html">コンパクトPC</a>
        <a href="index.html">パーツ・周辺機器</a>
        <a href="index.html">カスタマイズ注文</a>
        <a href="index.html">セール</a>
        <a href="contact.html" class="${activePage==='contact'?'active':''}">サポート</a>
      </div>
    </nav>
  </header>`;
}

function renderFooter() {
  return `
  <footer>
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">NEXUS<span>PC</span></a>
          <p>ゲーミングPCおよびクリエイター向けPCの専門店。<br>全製品日本国内組み立て・動作保証付き。</p>
        </div>
        <div class="footer-col">
          <h4>PRODUCTS</h4>
          <ul>
            <li><a href="index.html">ゲーミングPC</a></li>
            <li><a href="index.html">クリエイターPC</a></li>
            <li><a href="index.html">ビジネスPC</a></li>
            <li><a href="index.html">カスタマイズ注文</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>SUPPORT</h4>
          <ul>
            <li><a href="guide.html">ご利用ガイド</a></li>
            <li><a href="faq.html">よくある質問</a></li>
            <li><a href="contact.html">お問い合わせ</a></li>
            <li><a href="company.html">会社概要</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>LEGAL</h4>
          <ul>
            <li><a href="tokushoho.html">特定商取引法に基づく表記</a></li>
            <li><a href="terms.html">利用規約</a></li>
            <li><a href="privacy.html">プライバシーポリシー</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 NEXUS PC. All rights reserved.</p>
        <p>東京都千代田区 ● 全国送料無料 ● 最短翌日発送</p>
      </div>
    </div>
  </footer>`;
}
