const WHATSAPP_NUMBER = '923241707203';
const DEFAULT_NAME = 'Areeba Shaikh';

const doorOverlay = document.getElementById('doorOverlay');
const scannerBtn = document.getElementById('scannerBtn');
const fpRing = document.getElementById('fpRing');
const scanLabel = document.getElementById('scanLabel');

let selectedTreat = 'Chocolates 🍫';
let recipientName = new URLSearchParams(window.location.search).get('name') || DEFAULT_NAME;
let scanTimer = null;
let isOpened = false;

function updateHeading() {
  const h1 = document.getElementById('cardHeading');
  if (h1) {
    const finalName = recipientName || DEFAULT_NAME;
    h1.innerText = `I'm Really Sorry, ${finalName}!`;
  }
}
updateHeading();

function setRecipientName() {
  const name = prompt("Naam likhein:", recipientName);
  if (name !== null) {
    recipientName = name.trim() || DEFAULT_NAME;
    updateHeading();
  }
}

function unlockDoors() {
  if (isOpened || !doorOverlay) return;
  isOpened = true;
  if (fpRing) fpRing.classList.add('scanning');
  if (scanLabel) scanLabel.innerText = '🔓 Unlock Ho Gaya!';
  setTimeout(() => {
    doorOverlay.classList.add('opened');
    launchConfetti();
  }, 350);
}

function startScan(e) {
  if (isOpened) return;
  e.preventDefault();
  if (fpRing) fpRing.classList.add('scanning');
  if (scanLabel) scanLabel.innerText = '✨ Scanning...';
  scanTimer = setTimeout(unlockDoors, 450);
}

function resetDoors() {
  isOpened = false;
  clearTimeout(scanTimer);
  if (fpRing) fpRing.classList.remove('scanning');
  if (scanLabel) scanLabel.innerText = '👆 Finger Yahan Rakhein';
  if (doorOverlay) doorOverlay.classList.remove('opened');
  const status = document.getElementById('statusText');
  const waBtn = document.getElementById('waBtn');
  if (status) status.innerText = '';
  if (waBtn) waBtn.style.display = 'none';
}

if (scannerBtn) {
  scannerBtn.addEventListener('mousedown', startScan);
  scannerBtn.addEventListener('touchstart', startScan, { passive: false });
  scannerBtn.addEventListener('click', unlockDoors);
}

function selectTreat(el, treat) {
  document.querySelectorAll('.treat-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  selectedTreat = treat;
}

function forgiveMe() {
  const status = document.getElementById('statusText');
  const waBtn = document.getElementById('waBtn');
  const finalName = recipientName || DEFAULT_NAME;
  if (status) {
    status.innerText = `Shukriya ${finalName}! Ab jaldi se muskura dein 😊 (${selectedTreat} pakki!)`;
  }
  launchConfetti();

  if (waBtn) {
    const msg = encodeURIComponent(`Assalam-o-Alaikum Sufyan! Maaf kiya 😊 (${finalName} ki taraf se) — ab jaldi se meri treat (${selectedTreat}) ready rakhein!`);
    waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    waBtn.style.display = 'inline-block';
  }
}

function sendCustomWhatsapp(customText) {
  const finalName = recipientName || DEFAULT_NAME;
  const text = customText || `Assalam-o-Alaikum Sufyan! ${finalName} ki taraf se paigham 😊`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

function dodgeBtn() {
  const btn = document.getElementById('madBtn');
  if (!btn) return;
  const x = Math.floor(Math.random() * 120) - 60;
  const y = Math.floor(Math.random() * 70) - 35;
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

function launchConfetti() {
  const c = document.getElementById('confettiCanvas');
  if (!c) return;
  const cCtx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;

  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * c.width,
    y: Math.random() * -c.height,
    r: Math.random() * 6 + 4,
    color: ['#ffd700', '#ff9f1c', '#ffffff', '#f4a261'][Math.floor(Math.random() * 4)],
    speed: Math.random() * 3 + 2
  }));

  let frames = 0;
  function animate() {
    cCtx.clearRect(0, 0, c.width, c.height);
    pieces.forEach(p => {
      p.y += p.speed;
      cCtx.fillStyle = p.color;
      cCtx.fillRect(p.x, p.y, p.r, p.r * 1.4);
    });
    frames++;
    if (frames < 145) requestAnimationFrame(animate);
    else cCtx.clearRect(0, 0, c.width, c.height);
  }
  animate();
}

(function initAmbient() {
  const ac = document.getElementById('ambientCanvas');
  if (!ac) return;
  const actx = ac.getContext('2d');
  ac.width = window.innerWidth;
  ac.height = window.innerHeight;

  const dots = Array.from({ length: 35 }, () => ({
    x: Math.random() * ac.width,
    y: Math.random() * ac.height,
    r: Math.random() * 2.2 + 0.8,
    vy: -(Math.random() * 0.4 + 0.15),
    alpha: Math.random() * 0.5 + 0.2
  }));

  function loop() {
    actx.clearRect(0, 0, ac.width, ac.height);
    dots.forEach(d => {
      d.y += d.vy;
      if (d.y < 0) d.y = ac.height;
      actx.beginPath();
      actx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      actx.fillStyle = `rgba(255, 215, 0, ${d.alpha})`;
      actx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();
