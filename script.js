// --- ÁUDIO (Simples e Eficiente) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq, type, duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// --- JOGO ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");

let gameRunning = false;
let animationId;

// Objetos "Slim"
const net = { x: 0, y: 0, width: 1, height: 10, color: "rgba(255,255,255,0.2)" };
const user = { x: 0, y: 0, width: 0, height: 0, color: "#00d2ff", score: 0 };
const com = { x: 0, y: 0, width: 0, height: 0, color: "#ff0055", score: 0 };
const ball = { x: 0, y: 0, radius: 0, speed: 0, velocityX: 0, velocityY: 0, color: "#fff" };

// Variáveis de Estado
let isMobile = false;
let baseSpeed = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    isMobile = canvas.width < 768;

    // --- CONFIGURAÇÃO "SLIM" ---

    // Raquetes Finas
    user.width = isMobile ? 6 : 10;
    com.width = isMobile ? 6 : 10;

    // Altura Proporcional
    user.height = canvas.height * 0.15;
    com.height = canvas.height * 0.15;

    // Posições X
    user.x = 10;
    com.x = canvas.width - (com.width + 10);

    // Bola Pequena
    ball.radius = isMobile ? 4 : 6;

    // Velocidade Base
    baseSpeed = isMobile ? 6 : 10;

    net.x = (canvas.width - 1) / 2;

    // Se o jogo não estiver rodando, centraliza tudo
    if (!gameRunning) {
        user.y = (canvas.height - user.height) / 2;
        com.y = (canvas.height - com.height) / 2;
        // Posiciona a bola no centro sem movimento
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
}

function resetBall() {
    // 1. Centraliza a bola
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // 2. ZERA a velocidade (Pausa visual)
    ball.velocityX = 0;
    ball.velocityY = 0;

    // 3. Aguarda 2 segundos antes de lançar
    setTimeout(() => {
        // Verifica se o jogo ainda está rodando para evitar bugs se a pessoa fechar/sair
        if (gameRunning) {
            ball.speed = baseSpeed;
            // Direção X aleatória (Esquerda ou Direita)
            ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
            // Direção Y aleatória suave
            ball.velocityY = (Math.random() * 4) - 2;
        }
    }, 2000); // 2000 milissegundos = 2 segundos
}

function update() {
    // Se a velocidade for 0, a bola está "pausada", mas as raquetes ainda funcionam
    // Isso é bom para o jogador se posicionar antes do saque

    // Movimento Bola
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // IA (Suave)
    let aiLevel = isMobile ? 0.08 : 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * aiLevel;

    // Limites da IA
    if (com.y < 0) com.y = 0;
    if (com.y + com.height > canvas.height) com.y = canvas.height - com.height;

    // Colisão Paredes
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        if (ball.velocityX !== 0) beep(200, 'sine', 0.1); // Só toca som se a bola estiver se movendo
    }

    // Colisão Raquetes
    let player = (ball.x < canvas.width / 2) ? user : com;

    if (collision(ball, player)) {
        beep(600, 'square', 0.1);

        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }

    // Pontuação
    if (ball.x < 0) {
        com.score++;
        beep(100, 'sawtooth', 0.3);
        resetBall(); // Chama o reset com pausa
    } else if (ball.x > canvas.width) {
        user.score++;
        beep(100, 'sawtooth', 0.3);
        resetBall(); // Chama o reset com pausa
    }
}

function collision(b, p) {
    return b.x - b.radius < p.x + p.width &&
        b.x + b.radius > p.x &&
        b.y - b.radius < p.y + p.height &&
        b.y + b.radius > p.y;
}

function draw() {
    // Limpa tela
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Placar
    ctx.fillStyle = "#333";
    ctx.font = isMobile ? "40px 'Orbitron'" : "60px 'Orbitron'";
    ctx.fillText(user.score, canvas.width / 4, canvas.height / 5);
    ctx.fillText(com.score, 3 * canvas.width / 4, canvas.height / 5);

    // Rede
    ctx.strokeStyle = net.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    ctx.moveTo(net.x, 0);
    ctx.lineTo(net.x, canvas.height);
    ctx.stroke();

    // Raquetes
    ctx.shadowBlur = 15;

    // Jogador
    ctx.fillStyle = user.color;
    ctx.shadowColor = user.color;
    ctx.fillRect(user.x, user.y, user.width, user.height);

    // PC
    ctx.fillStyle = com.color;
    ctx.shadowColor = com.color;
    ctx.fillRect(com.x, com.y, com.width, com.height);

    // Bola
    ctx.fillStyle = ball.color;
    ctx.shadowColor = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
}

function loop() {
    update();
    draw();
    animationId = requestAnimationFrame(loop);
}

// --- CONTROLES ---

// Desktop
window.addEventListener("mousemove", (evt) => {
    if (!gameRunning) return;
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
});

// Mobile
window.addEventListener("touchmove", (evt) => {
    if (!gameRunning) return;
    evt.preventDefault();
    let touch = evt.touches[0];
    let rect = canvas.getBoundingClientRect();
    user.y = (touch.clientY - rect.top) - (user.height / 2);
    if (user.y < 0) user.y = 0;
    if (user.y + user.height > canvas.height) user.y = canvas.height - user.height;
}, { passive: false });

window.addEventListener("resize", resize);

startScreen.addEventListener("click", () => {
    startScreen.style.opacity = 0;
    setTimeout(() => startScreen.style.display = "none", 300);
    gameRunning = true;
    resize();
    resetBall(); // Inicia o primeiro saque com delay
    loop();
});

// Inicialização
resize();
draw();