# 🏓 Neon Pong - Slim

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Uma recriação moderna e acelerada do clássico Pong, desenvolvida com **HTML5 Canvas**, **CSS3** e **JavaScript Puro**. O projeto foca em uma estética "Neon/Cyberpunk", física realista com efeitos de curva e áudio sintetizado em tempo real.

## ✨ Funcionalidades

-   **Estética Neon:** Efeitos de brilho (glow) utilizando `shadowBlur` do Canvas.
-   **Áudio Procedural:** Efeitos sonoros gerados via **Web Audio API** (sem arquivos .mp3 externos).
-   **Física Avançada:** A bola muda de ângulo e velocidade dependendo de onde toca na raquete.
-   **Modo Turbo:** Aceleração progressiva da bola a cada rebatida para aumentar a tensão.
-   **IA Adaptativa:** O computador utiliza interpolação linear (LERP) para seguir a bola com um tempo de reação "humano".
-   **Totalmente Responsivo:**
    -   🖥️ **Desktop:** Controle via Mouse.
    -   📱 **Mobile:** Controle via Toque (Touch) sem scroll da tela.

## 🚀 Como Executar

Não é necessário instalar nenhuma dependência (npm, node, etc). Este é um projeto estático.

1.  Baixe os arquivos do projeto ou clone o repositório.
2.  Certifique-se de que os três arquivos estão na mesma pasta:
    -   `index.html`
    -   `style.css`
    -   `script.js`
3.  Abra o arquivo **`index.html`** em qualquer navegador moderno (Chrome, Firefox, Edge, Safari).
4.  Clique na tela inicial para ativar o áudio e começar.

## 🎮 Como Jogar

O objetivo é simples: não deixe a bola passar pela sua raquete e tente marcar pontos contra a IA.

| Dispositivo | Controle | Ação |
| :--- | :--- | :--- |
| **Desktop** | Mouse | Mova o mouse verticalmente para controlar a raquete da esquerda (Azul). |
| **Mobile** | Toque | Arraste o dedo para cima/baixo em qualquer lugar da tela. |

> **Dica:** Bater na bola com as *pontas* da raquete faz com que ela saia com mais ângulo e mais velocidade, dificultando para a IA defender.

## 🛠️ Estrutura do Projeto

/
├── index.html   # Estrutura do DOM e Canvas
├── style.css    # Estilização visual, efeitos neon e reset
├── script.js    # Lógica do jogo, física, IA e sintetizador de áudio
└── README.md    # Documentação

## ⚙️ Personalização (Para Desenvolvedores)

Você pode ajustar a dificuldade e a velocidade editando as variáveis no topo do arquivo script.js:

JavaScript
// Ajustar velocidade inicial da bola
const ball = {
    // ...
    speed: 12, // Aumente para deixar mais rápido
    // ...
};

// Ajustar dificuldade da IA
function update() {
    // 0.05 (Fácil) a 0.20 (Impossível)
    let computerLevel = 0.12;
}

## 🧠 Tecnologias Utilizadas

HTML5 Canvas API: Para renderização gráfica 2D a 60FPS.

Web Audio API: Para síntese de som (Oscillators e GainNodes).

CSS3 Flexbox: Para centralização e layout responsivo.

JavaScript (ES6+): Lógica do jogo sem frameworks.

## 📄 Licença
Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

Desenvolvido com 💻 e café.

## 👨‍💻 Autor

Desenvolvido por Patrick Gonçalves

💡 Projeto educacional e interativo em JavaScript
