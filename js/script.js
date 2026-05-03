// Adiciona rolagem suave (Smooth Scroll) aos links da barra de navegação
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80, // Compensa a altura da barra fixa
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// Efeito de Boot (Animação rápida + Pular ao clicar)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const bootScreen = document.getElementById("boot-screen");
    const bootLines = document.getElementById("boot-lines");
    
    // Frases que o terminal vai "digitar"
    const lines = [
        "> Inicializando sistema...",
        "> Carregando ambiente...",
        "> Iniciando servidor...",
        "> Conectando ao banco de dados... [OK]",
        "> Acesso concedido. Bem-vindo, dev."
    ];
    
    let currentLine = 0;
    let currentChar = 0;
    let isSkipped = false;
    let typingTimer; // Variável para controlar o tempo e podermos cancelar a animação
    
    // Trava o scroll da página enquanto a animação acontece
    document.body.style.overflow = "hidden";
    
    // Função para esconder a tela de boot (usada no fim da animação ou ao clicar)
    function endBootScreen() {
        if (isSkipped) return; // Evita que rode duas vezes
        isSkipped = true;
        
        clearTimeout(typingTimer); // Para a digitação imediatamente
        
        // Efeito de fade out
        bootScreen.style.opacity = "0";
        setTimeout(() => {
            bootScreen.style.visibility = "hidden";
            document.body.style.overflow = "auto"; // Libera o scroll
        }, 800); // Tempo do fade out do CSS
    }
    
    // Se o usuário clicar em qualquer lugar da tela preta, pula a animação
    bootScreen.addEventListener("click", endBootScreen);
    
    // Função que digita letra por letra
    function typeCharacter() {
        if (isSkipped) return; // Se já pulou, não faz mais nada
        
        if (currentLine < lines.length) {
            // Digitando a linha atual
            if (currentChar < lines[currentLine].length) {
                bootLines.innerHTML += lines[currentLine].charAt(currentChar);
                currentChar++;
                
                // Velocidade MUITO mais rápida (entre 10ms e 25ms por letra)
                typingTimer = setTimeout(typeCharacter, Math.random() * 15 + 10); 
            } else {
                // Terminou a linha, quebra para a próxima
                bootLines.innerHTML += "<br>";
                currentLine++;
                currentChar = 0;
                
                // Pausa bem curta (150ms) entre uma linha e outra
                typingTimer = setTimeout(typeCharacter, 150); 
            }
        } else {
            // Terminou de escrever TUDO. 
            // Agora sim, aguarda os 2 segundos (2000ms) com a tela preenchida antes de sumir.
            typingTimer = setTimeout(endBootScreen, 2000);
        }
    }
    
    // Inicia a animação quase imediatamente (300ms) após carregar a página
    typingTimer = setTimeout(typeCharacter, 300);
});

// =========================================
// Efeito de Rede de Partículas (Fundo)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particle-network");
    const ctx = canvas.getContext("2d");

    let particlesArray;

    // Define o tamanho do canvas para o tamanho da janela
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Atualiza o tamanho do canvas se a janela for redimensionada
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(); // Recria as partículas para o novo tamanho
    });

    // Classe para criar as partículas (pontos)
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Desenha o ponto na tela
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Atualiza a posição do ponto
        update() {
            // Verifica se o ponto bateu nas bordas da tela e inverte a direção
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move o ponto
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    // Inicializa a rede de partículas
    function init() {
        particlesArray = [];
        
        // Define a quantidade de partículas baseada no tamanho da tela (para não sobrecarregar no celular)
        let numberOfParticles = (canvas.height * canvas.width) / 12000;
        
        // Cor baseada nas suas imagens (um tom de azul/roxo bem suave)
        let particleColor = 'rgba(99, 102, 241, 0.4)'; 

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1; // Tamanho entre 1px e 3px
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            
            // Velocidade bem lenta e suave
            let directionX = (Math.random() * 0.5) - 0.25;
            let directionY = (Math.random() * 0.5) - 0.25;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    // Desenha as linhas conectando os pontos próximos
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                // Calcula a distância entre dois pontos
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                // Se a distância for menor que o limite, desenha a linha
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000); // Linha fica mais transparente quanto mais longe
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.2})`; // Linha bem suave
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Loop de animação
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    init();
    animate();
});

// =========================================
// Lógica do Carrossel de Frameworks
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("frameworks-track");
    const btnPrev = document.getElementById("prev-btn");
    const btnNext = document.getElementById("next-btn");
    
    if(!track || !btnPrev || !btnNext) return; // Evita erros se não achar os elementos

    const cards = Array.from(track.children);
    let currentIndex = 0;

    // Descobre quantos cards estão visíveis na tela no momento
    function getCardsToShow() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3; // Padrão no PC
    }

    function updateCarousel() {
        const cardWidth = cards[0].getBoundingClientRect().width;
        // Pega o gap (15px) definido no CSS
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0; 
        
        // Calcula a distância do movimento
        const moveAmount = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveAmount}px)`;
    }

    btnNext.addEventListener("click", () => {
        const cardsToShow = getCardsToShow();
        const maxIndex = cards.length - cardsToShow; // Limite máximo para não deixar espaço em branco
        
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    btnPrev.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Recalcula o tamanho se a janela for redimensionada
    window.addEventListener("resize", () => {
        // Garante que o index não estoure o limite ao mudar o tamanho da tela
        const maxIndex = Math.max(0, cards.length - getCardsToShow());
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        updateCarousel();
    });
});

// =========================================
// Lógica do Carrossel de Imagens dos Projetos
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    // Pega todos os carrosséis de projetos na página
    const projectCarousels = document.querySelectorAll('.projeto-carousel');

    projectCarousels.forEach(carousel => {
        const track = carousel.querySelector('.proj-carousel-track');
        const images = carousel.querySelectorAll('.proj-carousel-track img');
        const btnPrev = carousel.querySelector('.proj-prev-btn');
        const btnNext = carousel.querySelector('.proj-next-btn');

        let currentIndex = 0;

        // Se não tiver imagens ou track, ignora este card
        if (!track || images.length === 0) return;

        // Oculta os botões se houver apenas 1 imagem
        if (images.length === 1) {
            if (btnPrev) btnPrev.style.display = 'none';
            if (btnNext) btnNext.style.display = 'none';
            return;
        }

        function updateProjectCarousel() {
            // Move a trilha 100% para o lado a cada índice
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (currentIndex < images.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Volta para a primeira imagem se chegar no final
                }
                updateProjectCarousel();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = images.length - 1; // Vai para a última se clicar pra voltar na primeira
                }
                updateProjectCarousel();
            });
        }
    });
});

// =========================================
// Lógica do Carrossel Principal de Projetos
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const trackProjetos = document.getElementById("main-projects-track");
    const btnPrevProjetos = document.getElementById("main-prev-btn");
    const btnNextProjetos = document.getElementById("main-next-btn");
    
    if(!trackProjetos || !btnPrevProjetos || !btnNextProjetos) return;

    const cardsProjetos = Array.from(trackProjetos.children);
    let currentIndexProjetos = 0;

   // Descobre quantos projetos devem aparecer na tela (agora sempre 1)
    function getProjetosToShow() {
        return 1;
    }

    function updateProjetosCarousel() {
        // Pega a largura exata de um card e do espaço (gap) entre eles
        const cardWidth = cardsProjetos[0].getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(trackProjetos).gap) || 0;
        
        const moveAmount = (cardWidth + gap) * currentIndexProjetos;
        trackProjetos.style.transform = `translateX(-${moveAmount}px)`;
    }

    btnNextProjetos.addEventListener("click", () => {
        const cardsToShow = getProjetosToShow();
        const maxIndex = cardsProjetos.length - cardsToShow; // Limite
        
        if (currentIndexProjetos < maxIndex) {
            currentIndexProjetos++;
            updateProjetosCarousel();
        }
    });

    btnPrevProjetos.addEventListener("click", () => {
        if (currentIndexProjetos > 0) {
            currentIndexProjetos--;
            updateProjetosCarousel();
        }
    });

    // Ajusta o carrossel automaticamente se a pessoa girar o celular ou redimensionar a tela
    window.addEventListener("resize", () => {
        const maxIndex = Math.max(0, cardsProjetos.length - getProjetosToShow());
        if (currentIndexProjetos > maxIndex) {
            currentIndexProjetos = maxIndex;
        }
        updateProjetosCarousel();
    });
});