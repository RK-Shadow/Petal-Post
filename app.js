/* ========================================
   PETAL POST — Digital Bouquet Creator
   Application Logic (With 3D Wrapper Pocket & Draggable Positioning)
   ======================================== */

// ───── 100% Verified Transparent PNG Flower Catalog ─────
const FLOWERS = [
  { name: 'Pink Rose',        img: 'https://pngimg.com/uploads/rose/small/rose_PNG641.png' },
  { name: 'Crimson Rose',     img: 'https://pngimg.com/uploads/rose/small/rose_PNG658.png' },
  { name: 'White Rose',       img: 'https://pngimg.com/uploads/rose/small/rose_PNG67017.png' },
  { name: 'Yellow Rose',      img: 'https://pngimg.com/uploads/rose/small/rose_PNG67020.png' },
  { name: 'Orange Rose',      img: 'https://pngimg.com/uploads/rose/small/rose_PNG67018.png' },
  { name: 'Yellow Rosebud',   img: 'https://pngimg.com/uploads/rose/small/rose_PNG67019.png' },
  { name: 'Golden Rose',      img: 'https://pngimg.com/uploads/rose/small/rose_PNG67021.png' },
  { name: 'Yellow Trio',      img: 'https://pngimg.com/uploads/rose/small/rose_PNG67022.png' },
  { name: 'Red Rose',         img: 'https://pngimg.com/uploads/rose/small/rose_PNG67023.png' },
  { name: 'Spray Roses',      img: 'https://pngimg.com/uploads/rose/small/rose_PNG67024.png' },
  { name: 'Red Tulip',        img: 'https://pngimg.com/uploads/tulip/small/tulip_PNG8992.png' },
  { name: 'Red Bloom',        img: 'https://pngimg.com/uploads/tulip/small/tulip_PNG9001.png' },
  { name: 'Pink Tulips',      img: 'https://pngimg.com/uploads/tulip/small/tulip_PNG8991.png' },
  { name: 'Single Tulip',     img: 'https://pngimg.com/uploads/tulip/small/tulip_PNG8981.png' },
  { name: 'Golden Sunflower', img: 'https://pngimg.com/uploads/sunflower/small/sunflower_PNG13409.png' },
  { name: 'Sunny Sunflower',  img: 'https://pngimg.com/uploads/sunflower/small/sunflower_PNG13371.png' },
  { name: 'Bright Sunflower', img: 'https://pngimg.com/uploads/sunflower/small/sunflower_PNG13401.png' },
  { name: 'Water Lily',       img: 'https://pngimg.com/uploads/water_lily/small/water_lily_PNG12.png' },
  { name: 'Purple Lily',      img: 'https://pngimg.com/uploads/water_lily/small/water_lily_PNG30.png' },
  { name: 'Sakura Blossom',   img: 'https://pngimg.com/uploads/sakura/small/sakura_PNG15.png' },
  { name: 'Cherry Blossom',   img: 'https://pngimg.com/uploads/sakura/small/sakura_PNG27.png' },
  { name: 'Emerald Leaf',     img: 'https://pngimg.com/uploads/green_leaves/small/green_leaves_PNG3660.png' },
  { name: 'Green Leaves',     img: 'https://pngimg.com/uploads/green_leaves/small/green_leaves_PNG3663.png' },
];

// Realistic Digital PNG Bouquet Wrappers
const WRAP_STYLES = {
  pink:     { img: 'assets/pink_wrap.png', name: 'Pink Satin' },
  kraft:    { img: 'assets/kraft_wrap.png', name: 'Vintage Kraft' },
  lavender: { img: 'assets/lavender_wrap.png', name: 'Lavender Silk' },
  mint:     { img: 'assets/mint_wrap.png', name: 'Mint Ribbon' },
};

// Default Auto-arrange positions (positioned naturally inside the wrapper cone)
function calculateDefaultPositions(count) {
  const positions = [];
  if (count === 0) return positions;

  const centerX = 110;
  const centerY = 110;

  if (count === 1) {
    positions.push({ x: centerX - 30, y: centerY - 45, rot: 0 });
    return positions;
  }

  const layers = [
    { count: 1, radius: 0, startAngle: -90 },
    { count: 5, radius: 46, startAngle: -90 },
    { count: 6, radius: 82, startAngle: -60 },
  ];

  let placed = 0;
  for (const layer of layers) {
    if (placed >= count) break;
    const n = Math.min(layer.count, count - placed);
    for (let i = 0; i < n; i++) {
      const angle = layer.startAngle + (i * (360 / layer.count));
      const rad = (angle * Math.PI) / 180;
      const x = centerX + Math.cos(rad) * layer.radius - 30;
      const y = centerY + Math.sin(rad) * layer.radius - 45;
      const rot = Math.round(-15 + (i * 7) % 30);
      positions.push({ x: Math.round(x), y: Math.round(y), rot });
      placed++;
    }
  }

  return positions;
}

// ───── Application State ─────
const state = {
  flowers: [], // { imgIdx: number, x: number, y: number, rot: number }
  wrapStyle: 'pink',
  wrapOffsetY: 0,
  wrapOffsetX: 0,
  senderName: '',
  recipientName: '',
  letterContent: '',
  currentStep: 1,
};

const MAX_FLOWERS = 12;

// ───── DOM Helper ─────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ───── Initialization ─────
document.addEventListener('DOMContentLoaded', () => {
  createFloatingPetals();
  renderFlowerPicker();
  bindEvents();
  setupDragAndDrop();
  checkForReceiverMode();

  window.addEventListener('hashchange', () => {
    checkForReceiverMode();
  });
});

// ───── Floating Petals Background ─────
function createFloatingPetals() {
  const container = $('#floatingPetals');
  if (!container) return;
  const petals = ['🌸', '💮', '✿', '❀', '🪻', '🌷'];
  const count = 15;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (12 + Math.random() * 18) + 's';
    petal.style.animationDelay = (Math.random() * 15) + 's';
    petal.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
    container.appendChild(petal);
  }
}

// ───── Flower Picker Grid ─────
function renderFlowerPicker() {
  const picker = $('#flowerPicker');
  if (!picker) return;
  picker.innerHTML = FLOWERS.map((f, i) => `
    <div class="flower-option" data-index="${i}" tabindex="0" role="button" aria-label="Add ${f.name}">
      <img class="flower-thumb" src="${f.img}" alt="${f.name}" loading="lazy" draggable="false">
      <span class="flower-name">${f.name}</span>
    </div>
  `).join('');
}

// ───── Event Listeners ─────
function bindEvents() {
  // Hero CTA
  const btnStart = $('#btnStartCreating');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      $('#heroSection').style.display = 'none';
      $('#builderSection').classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Pick Flower
  const picker = $('#flowerPicker');
  if (picker) {
    picker.addEventListener('click', (e) => {
      const option = e.target.closest('.flower-option');
      if (!option) return;
      const index = parseInt(option.dataset.index);
      addFlower(index);
      option.classList.add('picked');
      setTimeout(() => option.classList.remove('picked'), 350);
      createSparkleBurst(e.clientX, e.clientY);
    });
  }

  // Clear bouquet
  const btnClear = $('#btnClearBouquet');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      state.flowers = [];
      state.wrapOffsetX = 0;
      state.wrapOffsetY = 0;
      resetWrapPosition();
      renderBouquet();
      updateNextButton();
    });
  }

  // Auto Arrange Positions
  const btnReset = $('#btnResetPositions');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const defaultPos = calculateDefaultPositions(state.flowers.length);
      state.flowers.forEach((f, i) => {
        if (defaultPos[i]) {
          f.x = defaultPos[i].x;
          f.y = defaultPos[i].y;
          f.rot = defaultPos[i].rot;
        }
      });
      state.wrapOffsetX = 0;
      state.wrapOffsetY = 0;
      resetWrapPosition();
      renderBouquet();
    });
  }

  // Wrap style selector
  const colorOpts = $('#colorOptions');
  if (colorOpts) {
    colorOpts.addEventListener('click', (e) => {
      const btn = e.target.closest('.wrap-style-btn');
      if (!btn) return;
      $$('.wrap-style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.wrapStyle = btn.dataset.wrap;
      applyWrapStyle();
    });
  }

  // Step Navigation
  $('#btnToStep2')?.addEventListener('click', () => goToStep(2));
  $('#btnBackToStep1')?.addEventListener('click', () => goToStep(1));
  $('#btnToStep3')?.addEventListener('click', () => {
    state.senderName = $('#senderName').value.trim();
    state.recipientName = $('#recipientName').value.trim();
    state.letterContent = $('#letterContent').value.trim();
    renderFinalPreview();
    goToStep(3);
  });
  $('#btnBackToStep2')?.addEventListener('click', () => goToStep(2));
  $('#btnStartOver')?.addEventListener('click', () => {
    state.flowers = [];
    state.wrapStyle = 'pink';
    state.wrapOffsetX = 0;
    state.wrapOffsetY = 0;
    state.senderName = '';
    state.recipientName = '';
    state.letterContent = '';
    if ($('#senderName')) $('#senderName').value = '';
    if ($('#recipientName')) $('#recipientName').value = '';
    if ($('#letterContent')) $('#letterContent').value = '';
    if ($('#charCount')) $('#charCount').textContent = '0';
    $$('.wrap-style-btn').forEach(b => b.classList.remove('active'));
    $('.wrap-style-btn[data-wrap="pink"]')?.classList.add('active');
    applyWrapStyle();
    resetWrapPosition();
    renderBouquet();
    updateNextButton();
    goToStep(1);
    if ($('#linkResult')) $('#linkResult').style.display = 'none';
  });

  // Letter Character Count
  $('#letterContent')?.addEventListener('input', () => {
    $('#charCount').textContent = $('#letterContent').value.length;
  });

  // Generate & Copy Link
  $('#btnGenerateLink')?.addEventListener('click', generateShareLink);
  $('#btnCopyLink')?.addEventListener('click', copyLink);

  // Receiver "Make Own" button
  $('#btnMakeOwn')?.addEventListener('click', () => {
    window.location.href = window.location.origin + window.location.pathname;
  });
}

// ───── Add Flower to Bouquet ─────
function addFlower(imgIdx) {
  if (state.flowers.length >= MAX_FLOWERS) return;

  const tempPos = calculateDefaultPositions(state.flowers.length + 1);
  const newPos = tempPos[tempPos.length - 1] || { x: 80, y: 50, rot: 0 };

  state.flowers.push({
    imgIdx: imgIdx,
    x: newPos.x,
    y: newPos.y,
    rot: newPos.rot,
  });

  renderBouquet();
  updateNextButton();
}

// ───── Remove Flower ─────
function removeFlower(index) {
  state.flowers.splice(index, 1);
  renderBouquet();
  updateNextButton();
}

// ───── Update Next Step Button ─────
function updateNextButton() {
  const btn = $('#btnToStep2');
  if (btn) btn.disabled = state.flowers.length === 0;
  const countSpan = $('#flowerCount');
  if (countSpan) countSpan.textContent = `${state.flowers.length} / ${MAX_FLOWERS} flowers`;
}

// ───── Apply Wrap Style (Syncs both Back & Front layers) ─────
function applyWrapStyle() {
  const wrapData = WRAP_STYLES[state.wrapStyle] || WRAP_STYLES.pink;
  const wrapBack = $('#wrapImgBack');
  const wrapFront = $('#wrapImgFront');
  const rWrapBack = $('#receiverWrapImgBack');
  const rWrapFront = $('#receiverWrapImgFront');

  if (wrapBack) wrapBack.src = wrapData.img;
  if (wrapFront) wrapFront.src = wrapData.img;
  if (rWrapBack) rWrapBack.src = wrapData.img;
  if (rWrapFront) rWrapFront.src = wrapData.img;
}

function resetWrapPosition() {
  const wrap = $('#bouquetWrap');
  const wrapBack = $('#wrapBackContainer');
  if (wrap) wrap.style.transform = `translateX(-50%) translate(0px, 0px)`;
  if (wrapBack) wrapBack.style.transform = `translateX(-50%) translate(0px, 0px)`;
}

// ───── Render Bouquet Canvas ─────
function renderBouquet(containerId = 'bouquetStems', placeholderId = 'bouquetPlaceholder') {
  const container = document.getElementById(containerId);
  const placeholder = placeholderId ? document.getElementById(placeholderId) : null;
  if (!container) return;

  container.innerHTML = '';

  if (state.flowers.length === 0) {
    if (placeholder) placeholder.style.display = 'block';
    return;
  }
  if (placeholder) placeholder.style.display = 'none';

  const isBuilder = containerId === 'bouquetStems';

  state.flowers.forEach((item, i) => {
    const flowerData = FLOWERS[item.imgIdx] || FLOWERS[0];
    const el = document.createElement('div');
    el.className = `bouquet-flower ${isBuilder ? 'draggable-flower' : ''}`;
    el.dataset.index = i;
    el.style.left = item.x + 'px';
    el.style.top = item.y + 'px';
    el.style.transform = `rotate(${item.rot || 0}deg)`;

    const img = document.createElement('img');
    img.src = flowerData.img;
    img.alt = flowerData.name;
    img.draggable = false;
    img.loading = 'lazy';
    el.appendChild(img);

    if (isBuilder) {
      const delBtn = document.createElement('button');
      delBtn.className = 'flower-del-btn';
      delBtn.innerHTML = '✕';
      delBtn.title = 'Remove flower';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFlower(i);
      });
      el.appendChild(delBtn);
    }

    container.appendChild(el);
  });

  // Apply wrapper position (syncs both front & back layers)
  if (isBuilder) {
    const wrap = $('#bouquetWrap');
    const wrapBack = $('#wrapBackContainer');
    const transformStr = `translateX(-50%) translate(${state.wrapOffsetX}px, ${state.wrapOffsetY}px)`;
    if (wrap) wrap.style.transform = transformStr;
    if (wrapBack) wrapBack.style.transform = transformStr;
  } else {
    const receiverWrap = $('#receiverBouquetWrap');
    const receiverWrapBack = $('#receiverWrapBackContainer');
    const transformStr = `translateX(-50%) translate(${state.wrapOffsetX}px, ${state.wrapOffsetY}px)`;
    if (receiverWrap) receiverWrap.style.transform = transformStr;
    if (receiverWrapBack) receiverWrapBack.style.transform = transformStr;
  }
}

// ───── Drag and Drop Positioning Engine (Mouse + Touch) ─────
function setupDragAndDrop() {
  const canvas = $('#bouquetCanvas');
  if (!canvas) return;

  let activeElem = null;
  let isDraggingWrap = false;
  let dragIndex = -1;
  let startX = 0;
  let startY = 0;
  let elemStartX = 0;
  let elemStartY = 0;

  function onPointerDown(e) {
    const flowerEl = e.target.closest('.draggable-flower');
    const wrapEl = e.target.closest('.draggable-wrap');

    if (e.target.closest('.flower-del-btn')) return;

    const pointer = e.touches ? e.touches[0] : e;

    if (flowerEl) {
      activeElem = flowerEl;
      dragIndex = parseInt(flowerEl.dataset.index);
      flowerEl.classList.add('is-dragging');
      startX = pointer.clientX;
      startY = pointer.clientY;
      elemStartX = state.flowers[dragIndex].x;
      elemStartY = state.flowers[dragIndex].y;
      e.preventDefault();
    } else if (wrapEl) {
      isDraggingWrap = true;
      wrapEl.classList.add('is-dragging');
      startX = pointer.clientX;
      startY = pointer.clientY;
      elemStartX = state.wrapOffsetX;
      elemStartY = state.wrapOffsetY;
      e.preventDefault();
    }
  }

  function onPointerMove(e) {
    if (!activeElem && !isDraggingWrap) return;

    const pointer = e.touches ? e.touches[0] : e;
    const dx = pointer.clientX - startX;
    const dy = pointer.clientY - startY;

    if (activeElem && dragIndex >= 0 && state.flowers[dragIndex]) {
      const newX = elemStartX + dx;
      const newY = elemStartY + dy;

      state.flowers[dragIndex].x = newX;
      state.flowers[dragIndex].y = newY;

      activeElem.style.left = newX + 'px';
      activeElem.style.top = newY + 'px';
    } else if (isDraggingWrap) {
      const newX = elemStartX + dx;
      const newY = elemStartY + dy;

      state.wrapOffsetX = newX;
      state.wrapOffsetY = newY;

      const transformStr = `translateX(-50%) translate(${newX}px, ${newY}px)`;
      const wrap = $('#bouquetWrap');
      const wrapBack = $('#wrapBackContainer');
      if (wrap) wrap.style.transform = transformStr;
      if (wrapBack) wrapBack.style.transform = transformStr;
    }
  }

  function onPointerUp() {
    if (activeElem) {
      activeElem.classList.remove('is-dragging');
      activeElem = null;
      dragIndex = -1;
    }
    if (isDraggingWrap) {
      const wrap = $('#bouquetWrap');
      if (wrap) wrap.classList.remove('is-dragging');
      isDraggingWrap = false;
    }
  }

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);
}

// ───── Step Navigation ─────
function goToStep(step) {
  state.currentStep = step;

  $$('.step-panel').forEach(p => p.classList.remove('active'));
  $(`#step${step}`)?.classList.add('active');

  $$('.progress-step').forEach(ps => {
    const s = parseInt(ps.dataset.step);
    ps.classList.remove('active', 'completed');
    if (s === step) ps.classList.add('active');
    else if (s < step) ps.classList.add('completed');
  });

  const pFill1 = $('#progressFill1');
  if (pFill1) pFill1.style.width = step >= 2 ? '100%' : '0%';
  const pFill2 = $('#progressFill2');
  if (pFill2) pFill2.style.width = step >= 3 ? '100%' : '0%';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ───── Final Preview Step ─────
function renderFinalPreview() {
  const mini = $('#previewBouquetMini');
  if (mini) {
    mini.innerHTML = state.flowers.map(item => {
      const f = FLOWERS[item.imgIdx] || FLOWERS[0];
      return `<img src="${f.img}" alt="${f.name}" class="preview-flower-img" draggable="false">`;
    }).join('');
  }

  const to = state.recipientName || 'Someone Special';
  const from = state.senderName || 'A Secret Admirer';
  const msg = state.letterContent || '(No message written)';

  if ($('#previewTo')) $('#previewTo').textContent = `Dear ${to},`;
  if ($('#previewMsg')) $('#previewMsg').textContent = msg;
  if ($('#previewFrom')) $('#previewFrom').textContent = `With love, ${from}`;
}

// ───── Robust UTF-8 Base64 Link Encoding/Decoding ─────
function encodeData(obj) {
  const json = JSON.stringify(obj);
  return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
}

function decodeData(str) {
  const json = decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(json);
}

// ───── Generate Shareable Link ─────
function generateShareLink() {
  const compactFlowers = state.flowers.map(f => [
    f.imgIdx,
    Math.round(f.x),
    Math.round(f.y),
    Math.round(f.rot || 0)
  ]);

  const payload = {
    f: compactFlowers,
    w: state.wrapStyle,
    wx: Math.round(state.wrapOffsetX),
    wy: Math.round(state.wrapOffsetY),
    s: state.senderName,
    r: state.recipientName,
    l: state.letterContent,
  };

  try {
    const encoded = encodeData(payload);
    const baseUrl = window.location.href.split('#')[0].split('?')[0];
    const fullShareUrl = baseUrl + '#bouquet=' + encoded;

    $('#shareLink').value = fullShareUrl;
    $('#linkResult').style.display = 'block';
  } catch (err) {
    console.error('Error generating link:', err);
    alert('Failed to generate link. Please try again!');
  }
}

// ───── Copy Link to Clipboard ─────
function copyLink() {
  const input = $('#shareLink');
  if (!input) return;
  input.select();
  input.setSelectionRange(0, 99999);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(input.value).then(() => {
      showCopiedToast();
    }).catch(() => {
      document.execCommand('copy');
      showCopiedToast();
    });
  } else {
    document.execCommand('copy');
    showCopiedToast();
  }
}

function showCopiedToast() {
  const toast = $('#copiedToast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ───── Sparkle Animation ─────
function createSparkleBurst(x, y) {
  const burst = document.createElement('div');
  burst.className = 'sparkle-burst';
  burst.style.left = x + 'px';
  burst.style.top = y + 'px';

  const colors = ['#ff8ab8', '#ffb3d1', '#e8d5f5', '#c8f7dc', '#ffe8b0', '#ff6da3'];
  const count = 8;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'sparkle-particle';
    const angle = (360 / count) * i;
    const distance = 25 + Math.random() * 20;
    const tx = Math.cos((angle * Math.PI) / 180) * distance;
    const ty = Math.sin((angle * Math.PI) / 180) * distance;
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    particle.style.background = colors[i % colors.length];
    burst.appendChild(particle);
  }

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 700);
}

// ═══════════════════════════════════════════
// RECEIVER MODE (Opening Shared Link)
// ═══════════════════════════════════════════
function checkForReceiverMode() {
  const hash = window.location.hash;
  if (!hash || !hash.includes('bouquet=')) return;

  try {
    const rawCode = hash.split('bouquet=')[1];
    if (!rawCode) return;

    const data = decodeData(rawCode);

    if (!data.f || !Array.isArray(data.f) || data.f.length === 0) {
      console.warn('Invalid or empty bouquet payload');
      return;
    }

    showReceiverView(data);
  } catch (e) {
    console.error('Failed to parse bouquet share URL:', e);
  }
}

function showReceiverView(data) {
  if ($('#appBuilder')) $('#appBuilder').style.display = 'none';
  if ($('#appReceiver')) $('#appReceiver').style.display = 'flex';

  state.flowers = data.f.map(item => {
    if (Array.isArray(item)) {
      return { imgIdx: item[0], x: item[1], y: item[2], rot: item[3] || 0 };
    } else if (typeof item === 'number') {
      return { imgIdx: item, x: 80, y: 50, rot: 0 };
    } else {
      return { imgIdx: 0, x: 80, y: 50, rot: 0 };
    }
  });

  state.wrapStyle = data.w || 'pink';
  state.wrapOffsetX = data.wx || 0;
  state.wrapOffsetY = data.wy || 0;
  state.senderName = data.s || '';
  state.recipientName = data.r || '';
  state.letterContent = data.l || '';

  applyWrapStyle();

  const envelopeScene = $('#envelopeScene');
  const envelope = $('#envelope');

  if (envelopeScene && envelope) {
    envelopeScene.addEventListener('click', () => {
      envelope.classList.add('opened');

      setTimeout(() => {
        envelopeScene.style.display = 'none';
        if ($('#revealContent')) $('#revealContent').style.display = 'block';
        renderReceiverContent();
      }, 900);
    }, { once: true });
  }
}

function renderReceiverContent() {
  const recipientName = state.recipientName || 'Beloved One';
  const senderName = state.senderName || 'Someone Special';
  const letterContent = state.letterContent || 'Wishing you beauty and joy!';

  if ($('#revealRecipient')) $('#revealRecipient').textContent = recipientName;

  renderBouquet('receiverBouquetStems', null);

  const flowers = $$('#receiverBouquetStems .bouquet-flower');
  flowers.forEach((el, i) => {
    el.style.animationDelay = (i * 0.12) + 's';
  });

  if ($('#revealDear')) $('#revealDear').textContent = `Dear ${recipientName},`;
  if ($('#revealBody')) $('#revealBody').textContent = letterContent;
  if ($('#revealSign')) $('#revealSign').textContent = `With love, ${senderName} 💕`;

  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = 100 + Math.random() * (window.innerWidth - 200);
        const y = 100 + Math.random() * 300;
        createSparkleBurst(x, y);
      }, i * 200);
    }
  }, 600);
}
