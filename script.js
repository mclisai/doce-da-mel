// ===== FUNDO FIXO COM CONFETES E BRIGADEIROS REALISTAS =====
const style = document.createElement("style");
style.innerHTML = `
  body {
    margin: 0;
    overflow-x: hidden;
    background-color: #fff8f0; /* fundo claro de festa */
    position: relative;
    z-index: 0;
  }
  #particle-canvas {
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -1;
  }
`;
document.head.appendChild(style);

// Criar canvas
const canvas = document.createElement("canvas");
canvas.id = "particle-canvas";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let width, height;
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resize();
window.addEventListener("resize", resize);

// Função para desenhar um confete
function drawConfetti(ctx, x, y, size, color, alpha, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(-size / 2, -size / 4, size, size / 2);
  ctx.restore();
}

// Função para desenhar um brigadeiro com borda irregular e granulado
function drawBrigadeiro(ctx, x, y, size, alpha, bounce) {
  ctx.save();
  ctx.globalAlpha = alpha;

  // Criar borda irregular para dar textura de brigadeiro
  ctx.beginPath();
  const spikes = 20;
  for (let i = 0; i < spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2;
    const radius = size + Math.random() * 1.5; // irregularidade
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius + bounce;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = "#5C2C12"; // marrom base
  ctx.fill();

  // Granulados
  ctx.fillStyle = "#2E1A0F";
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = (size - 2) * Math.random();
    const gx = x + Math.cos(angle) * radius;
    const gy = y + Math.sin(angle) * radius + bounce;
    ctx.fillRect(gx, gy, 2, 1);
  }

  ctx.restore();
}

// Classe para partículas
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.depth = Math.random();
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = (6 + Math.random() * 8) * (0.5 + this.depth);
    this.speedX = (Math.random() - 0.5) * (0.5 + this.depth);
    this.speedY = (Math.random() - 0.5) * (0.5 + this.depth);
    this.alpha = 0.8;

    // Decide se será brigadeiro ou confete
    this.type = Math.random() < 0.5 ? "confetti" : "brigadeiro";
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`; // confete colorido
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.bounceAngle = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Gira confetes
    if (this.type === "confetti") {
      this.rotation += this.rotationSpeed;
    }

    // Movimento de quicar dos brigadeiros
    if (this.type === "brigadeiro") {
      this.bounceAngle += 0.05;
    }

    // Loop de tela
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;
  }
  draw(ctx) {
    if (this.type === "confetti") {
      drawConfetti(ctx, this.x, this.y, this.size, this.color, this.alpha, this.rotation);
    } else {
      const bounce = Math.sin(this.bounceAngle) * 2;
      drawBrigadeiro(ctx, this.x, this.y, this.size / 2, this.alpha, bounce);
    }
  }
}

// Criar partículas
const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push(new Particle());
}

// Loop de animação sem rastro
function animate() {
  ctx.clearRect(0, 0, width, height); // limpa a tela a cada frame

  particles.forEach(p => {
    p.update();
    p.draw(ctx);
  });

  requestAnimationFrame(animate);
}
animate();

// ==========================

function openOrderModal(productName, price) {
    currentProduct = productName;
    currentPrice = price;
    currentQuantity = 1;

    document.getElementById('productName').textContent = productName;
    document.getElementById('unitPrice').textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    document.getElementById('quantity').textContent = currentQuantity;
    updateTotalPrice();

    document.getElementById('orderModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('orderNotes').value = '';
}

function increaseQuantity() {
    currentQuantity++;
    document.getElementById('quantity').textContent = currentQuantity;
    updateTotalPrice();
}

function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById('quantity').textContent = currentQuantity;
        updateTotalPrice();
    }
}

function updateTotalPrice() {
    const total = currentPrice * currentQuantity;
    document.getElementById('totalPrice').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function sendWhatsAppOrder() {
    const notes = document.getElementById('orderNotes').value;
    const total = (currentPrice * currentQuantity).toFixed(2).replace('.', ',');

    let message = `🍫 *Pedido - Doces Gourmet*\n\n`;
    message += `📦 *Produto:* ${currentProduct}\n`;
    message += `🔢 *Quantidade:* ${currentQuantity} unidade(s)\n`;
    message += `💰 *Valor Total:* R$ ${total}\n`;

    if (notes.trim()) {
        message += `📝 *Observações:* ${notes}\n`;
    }

    message += `\nGostaria de confirmar este pedido! 😊`;

    const whatsappUrl = `https://wa.me/5514996149176?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    closeOrderModal();
}

// Fechar modal clicando fora
document.getElementById('orderModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeOrderModal();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeOrderModal();
    }
});
// Função para criar o canvas com partículas dentro de um container específico
function createParticleCanvas(container) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  container.style.position = 'relative';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = 1 + Math.random() * 3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      const colors = ['#34d399', '#10b981', '#059669', '#047857']; // tons de verde
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = 0.1 + Math.random() * 0.4;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      this.x += Math.sin(this.y * 0.01) * 0.1;
      this.y += Math.cos(this.x * 0.01) * 0.1;

      if (this.x < -this.size) this.x = canvas.width + this.size;
      if (this.x > canvas.width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = canvas.height + this.size;
      if (this.y > canvas.height + this.size) this.y = -this.size;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }

  const particles = [];
  const PARTICLE_COUNT = 60;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Usar na seção de contato
const contatoSection = document.querySelector('section.py-20.bg-white');
if (contatoSection) {
  createParticleCanvas(contatoSection);
}
