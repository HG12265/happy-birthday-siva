import './style.css'
import gsap from 'gsap'
import confetti from 'canvas-confetti'

// Elements
const loader = document.getElementById('loader');
const mainContent = document.getElementById('main-content');
const slides = document.querySelectorAll('.slide');
const nextBtns = document.querySelectorAll('.btn-next');
const floatingContainer = document.getElementById('floating-elements');

// Music Player Elements
const bgMusic = document.getElementById('bg-music');
const musicPlayer = document.getElementById('music-player');
const musicToggle = document.getElementById('music-toggle');

let currentSlide = 1;
let musicStarted = false;
let musicPaused = false;

// Initialization
window.addEventListener('load', () => {
    setTimeout(() => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                loader.style.visibility = 'hidden';
                mainContent.classList.remove('hidden');
                gsap.to(mainContent, { opacity: 1, duration: 0.8 });

                showSlide(1);
                createFloatingBubbles();
            }
        });
    }, 1500);

    createStarfield();
});

function createStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;

    // Create 80 micro-dots
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'twinkling-star';

        // Random placement
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Slight size variations (1px to 3px max)
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random opacity max value (subtle)
        star.style.setProperty('--star-opacity', Math.random() * 0.7 + 0.3);

        // Random twinkle animation duration and delay
        star.style.animationDuration = `${Math.random() * 4 + 2}s`;
        star.style.animationDelay = `${Math.random() * 4}s`;

        starfield.appendChild(star);
    }
}

function showSlide(slideNumber) {
    const nextSlide = document.getElementById(`slide-${slideNumber}`);
    const prevSlide = document.querySelector('.slide.active');

    if (prevSlide === nextSlide) return;

    if (prevSlide) {
        gsap.to(prevSlide, {
            opacity: 0, y: -20, duration: 0.6, onComplete: () => {
                prevSlide.classList.remove('active');
                prevSlide.style.visibility = 'hidden';
            }
        });
    }

    nextSlide.style.visibility = 'visible';
    nextSlide.classList.add('active');
    gsap.fromTo(nextSlide, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });

    // Animations per slide
    if (slideNumber === 1) {
        gsap.from('.main-title', { scale: 0.8, opacity: 0, duration: 1, delay: 0.5, ease: 'back.out(1.7)' });
    }
    if (slideNumber === 3) startBalloonGame();
    if (slideNumber >= 4 && slideNumber <= 6) {
        gsap.from(`#slide-${slideNumber} .premium-card`, { scale: 0.8, y: 40, opacity: 0, duration: 1.2, ease: 'back.out(1.5)' });
        if (slideNumber === 4) gsap.from('.story-title', { y: -30, opacity: 0, duration: 1.5, ease: 'power3.out' });
    }
    if (slideNumber === 7) {
        gsap.from('#slide-7 .story-title', { y: -30, opacity: 0, duration: 1, ease: 'power3.out' });
        gsap.from('#slide-7 .flip-card', { opacity: 0, y: 40, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'all' });
    }
    if (slideNumber === 9) {
        // Premium entrance animations
        gsap.from('.cake-title-icon', { scale: 0, rotation: -30, duration: 0.8, delay: 0.2, ease: 'back.out(1.7)' });
        gsap.from('.cake-title-text', { y: -30, opacity: 0, duration: 1, delay: 0.4, ease: 'power3.out' });
        gsap.from('.cake-title-sub', { y: -15, opacity: 0, duration: 0.8, delay: 0.7, ease: 'power2.out' });
        gsap.from('.cake-stage', { scale: 0.5, opacity: 0, duration: 1.2, delay: 0.5, ease: 'back.out(1.5)' });
        gsap.from('.cake-blow-btn', { y: 30, opacity: 0, scale: 0.8, duration: 0.8, delay: 1.2, ease: 'back.out(1.7)' });

        // Reset candles, smoke, and message when entering
        document.querySelectorAll('.flame').forEach(f => f.classList.remove('blown-out'));
        document.querySelectorAll('.smoke-puff').forEach(s => s.classList.remove('active'));
        const cakeMsg = document.getElementById('cake-message');
        if (cakeMsg) cakeMsg.classList.add('hidden');
        const blowBtnEl = document.getElementById('blow-candles-btn');
        if (blowBtnEl) {
            blowBtnEl.style.display = 'flex';
            blowBtnEl.style.pointerEvents = 'auto';
            gsap.set(blowBtnEl, { scale: 1, opacity: 1 });
        }
    }

    // Feedback Logic (Slide 10)
    if (slideNumber === 10) {
        gsap.fromTo('#slide-10 .story-title', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
        gsap.fromTo('#slide-10 p', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' });
        gsap.fromTo('#slide-10 .premium-textarea', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, delay: 0.4, ease: 'back.out(1.5)' });
        gsap.fromTo('#submit-feedback-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    }

    // Fireworks Finale Logic (Slide 11)
    if (slideNumber === 11) {
        startFireworksFinale();
        gsap.fromTo('#slide-11 .finale-title', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)', delay: 1 });
        gsap.fromTo('#slide-11 .finale-msg', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2 });
        gsap.fromTo('#slide-11 .restart-btn', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3 });
    } else {
        stopFireworksFinale();
    }
}

// Navigation Logic
nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const nextTarget = parseInt(btn.getAttribute('data-next'));
        currentSlide = nextTarget;
        showSlide(currentSlide);

        // Start music when leaving slide 1 (hero button clicked)
        if (!musicStarted && nextTarget === 2) {
            musicStarted = true;
            bgMusic.volume = 0;
            bgMusic.play().then(() => {
                // Fade volume in smoothly
                let vol = 0;
                const fadeIn = setInterval(() => {
                    vol = Math.min(vol + 0.04, 0.55);
                    bgMusic.volume = vol;
                    if (vol >= 0.55) clearInterval(fadeIn);
                }, 100);

                // Slide in the music player button
                setTimeout(() => {
                    musicPlayer.classList.remove('hidden-player');
                    musicPlayer.classList.add('visible');
                }, 800);
            }).catch(() => {
                // Autoplay blocked — still show the button so user can tap
                musicPlayer.classList.remove('hidden-player');
                musicPlayer.classList.add('visible');
                musicPlayer.classList.add('paused');
                musicPaused = true;
            });
        }
    });
});

// Music toggle — pause / resume
if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (!musicStarted) return;

        if (musicPaused) {
            // Resume with fade-in
            bgMusic.play();
            let vol = 0;
            const fadeIn = setInterval(() => {
                vol = Math.min(vol + 0.04, 0.55);
                bgMusic.volume = vol;
                if (vol >= 0.55) clearInterval(fadeIn);
            }, 80);
            musicPlayer.classList.remove('paused');
            musicPaused = false;
        } else {
            // Pause with fade-out
            let vol = bgMusic.volume;
            const fadeOut = setInterval(() => {
                vol = Math.max(vol - 0.04, 0);
                bgMusic.volume = vol;
                if (vol <= 0) {
                    clearInterval(fadeOut);
                    bgMusic.pause();
                }
            }, 80);
            musicPlayer.classList.add('paused');
            musicPaused = true;
        }
    });
}

// Flip card sparkle interaction
const flipCards = document.querySelectorAll('.flip-card');

function createFlipSparkles(card) {
    const sparkleCount = 6;
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'flip-sparkle';
        sparkle.style.left = `${50 + (Math.random() - 0.5) * 40}%`;
        sparkle.style.top = `${50 + (Math.random() - 0.5) * 40}%`;
        sparkle.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
        sparkle.style.setProperty('--dy', `${(Math.random() - 0.5) * 80}px`);
        sparkle.textContent = '✦';
        card.appendChild(sparkle);

        sparkle.addEventListener('animationend', () => sparkle.remove());
    }
}

flipCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        createFlipSparkles(card);
    });
});

// =============================================
// EPIC FIREWORKS FINALE LOGIC
// =============================================
let fireworksInterval;

function startFireworksFinale() {
    stopFireworksFinale(); // ensure we clear prior runs
    const container = document.getElementById('fireworks-container');
    if (!container) return;

    // Initial barrage
    for (let i = 0; i < 4; i++) {
        setTimeout(() => launchFirework(container), i * 300);
    }

    // Launch a firework continuously
    fireworksInterval = setInterval(() => {
        launchFirework(container);
    }, 800);
}

function stopFireworksFinale() {
    if (fireworksInterval) clearInterval(fireworksInterval);
    const container = document.getElementById('fireworks-container');
    if (container) container.innerHTML = '';
}

function launchFirework(container) {
    const startX = 20 + Math.random() * 60; // 20% to 80% screen width
    const endX = startX + (Math.random() - 0.5) * 40;
    const endY = 10 + Math.random() * 40; // Peak height 10% to 50%

    // Create rocket
    const rocket = document.createElement('div');
    rocket.className = 'firework-rocket';
    rocket.style.left = `${startX}%`;
    rocket.style.top = `100%`; // Start at bottom

    const colors = ['#ff69b4', '#ffd700', '#00d4ff', '#ff4757', '#2ed573', '#9c88ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    rocket.style.backgroundColor = color;
    rocket.style.boxShadow = `0 0 10px 2px ${color}, 0 0 20px ${color}`;

    container.appendChild(rocket);

    const duration = 1 + Math.random() * 0.6;

    // Create the arc with GSAP
    gsap.to(rocket, {
        x: (endX - startX) * (window.innerWidth / 100),
        ease: 'power1.out',
        duration: duration
    });

    gsap.to(rocket, {
        top: `${endY}%`,
        ease: 'power2.out',
        duration: duration,
        onComplete: () => {
            rocket.remove();
            explodeFirework(endX, endY, color);
        }
    });

    // Trail effect
    const trailInterval = setInterval(() => {
        if (!rocket.parentNode) return clearInterval(trailInterval);
        const trail = document.createElement('div');
        trail.className = 'firework-trail';
        const rect = rocket.getBoundingClientRect();
        trail.style.left = `${rect.left + rect.width / 2}px`;
        trail.style.top = `${rect.top + rect.height / 2}px`;
        trail.style.backgroundColor = color;
        // Make body appending relative to viewport mostly
        document.body.appendChild(trail);

        gsap.to(trail, {
            opacity: 0,
            scale: 0.2,
            y: '+=20',
            duration: 0.6,
            onComplete: () => trail.remove()
        });
    }, 40);
}

function explodeFirework(x, y, color) {
    confetti({
        particleCount: Math.floor(60 + Math.random() * 60),
        spread: 360,
        startVelocity: 25 + Math.random() * 15,
        origin: { x: x / 100, y: y / 100 },
        colors: [color, '#ffffff', '#ffd700'],
        gravity: 0.8,
        scalar: 0.8 + Math.random() * 0.4,
        ticks: 200,
        zIndex: -1 // So it drops below the text content if inside slide
    });
}

// Cake Cutting - Blow Candles Logic (PREMIUM)
const blowBtn = document.getElementById('blow-candles-btn');
if (blowBtn) {
    blowBtn.addEventListener('click', () => {
        const flames = document.querySelectorAll('.flame');
        const smokePuffs = document.querySelectorAll('.smoke-puff');

        // Disable button immediately
        blowBtn.style.pointerEvents = 'none';
        gsap.to(blowBtn, { scale: 0.9, opacity: 0.5, duration: 0.3 });

        // Blow out candles one by one with smoke
        flames.forEach((flame, i) => {
            setTimeout(() => {
                // Blow out flame with animation
                flame.classList.add('blown-out');

                // Activate smoke puff
                if (smokePuffs[i]) {
                    smokePuffs[i].classList.add('active');
                }

                // Small golden spark for each candle
                confetti({
                    particleCount: 12,
                    spread: 50,
                    startVelocity: 18,
                    origin: { x: 0.5, y: 0.35 },
                    colors: ['#ffd700', '#ff8c00', '#fff'],
                    gravity: 1.5,
                    scalar: 0.5,
                    drift: 0
                });

                // Subtle screen shake per candle
                gsap.to('#slide-9', {
                    x: (Math.random() - 0.5) * 4,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => gsap.set('#slide-9', { x: 0 })
                });
            }, i * 400);
        });

        // After all candles blown out - BIG celebration
        const totalDelay = flames.length * 400 + 600;
        setTimeout(() => {
            // Screen flash effect
            const flash = document.createElement('div');
            flash.className = 'screen-flash';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 700);

            // Cake bounce
            const cake = document.querySelector('.cake');
            if (cake) cake.classList.add('cake-bounce');
            setTimeout(() => { if (cake) cake.classList.remove('cake-bounce'); }, 700);

            // Floating musical notes
            const notes = ['🎵', '🎶', '🎼', '🎵', '🎶', '🎼', '🎵', '🎶'];
            notes.forEach((note, i) => {
                setTimeout(() => {
                    const noteEl = document.createElement('div');
                    noteEl.className = 'music-note';
                    noteEl.textContent = note;
                    noteEl.style.left = `${15 + Math.random() * 70}%`;
                    noteEl.style.top = `${50 + Math.random() * 30}%`;
                    noteEl.style.fontSize = `${1.2 + Math.random() * 1.2}rem`;
                    document.body.appendChild(noteEl);
                    setTimeout(() => noteEl.remove(), 2600);
                }, i * 200);
            });

            // Massive celebration confetti burst
            const celebrationColors = ['#ff69b4', '#ffd700', '#8a2be2', '#00d4ff', '#ff4757', '#2ed573', '#ff6b81', '#7bed9f'];

            // Initial big burst
            confetti({
                particleCount: 120,
                spread: 180,
                origin: { x: 0.5, y: 0.4 },
                colors: celebrationColors,
                startVelocity: 45,
                gravity: 0.8,
                scalar: 1.2
            });

            // Continuous celebration rain
            const duration = 4000;
            const end = Date.now() + duration;
            const interval = setInterval(() => {
                if (Date.now() > end) return clearInterval(interval);

                // Left side
                confetti({
                    particleCount: 30,
                    spread: 70,
                    angle: 60,
                    origin: { x: 0, y: 0.5 },
                    colors: celebrationColors,
                    startVelocity: 35
                });

                // Right side
                confetti({
                    particleCount: 30,
                    spread: 70,
                    angle: 120,
                    origin: { x: 1, y: 0.5 },
                    colors: celebrationColors,
                    startVelocity: 35
                });

                // Center top
                confetti({
                    particleCount: 20,
                    spread: 100,
                    origin: { x: 0.5, y: 0 },
                    colors: celebrationColors,
                    gravity: 1.2
                });
            }, 250);

            // Hide button with animation
            gsap.to(blowBtn, {
                scale: 0, opacity: 0, duration: 0.5, ease: 'back.in(1.7)',
                onComplete: () => { blowBtn.style.display = 'none'; }
            });

            // Show celebration message with staggered animation
            const cakeMsg = document.getElementById('cake-message');
            cakeMsg.classList.remove('hidden');

            gsap.fromTo(cakeMsg,
                { scale: 0.3, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'back.out(1.7)', delay: 0.3 }
            );

            // Stagger inner elements
            gsap.fromTo('.celebration-emoji', { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.8, delay: 0.8, ease: 'back.out(2)' });
            gsap.fromTo('.celebration-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1, ease: 'power3.out' });
            gsap.fromTo('.celebration-msg', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: 'power3.out' });
            gsap.fromTo('.celebration-stars', { scale: 0 }, { scale: 1, duration: 0.6, delay: 1.4, ease: 'back.out(2)' });
            gsap.fromTo('.celebration-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.6, ease: 'power3.out' });

        }, totalDelay);
    });
}

// Floating Decorations
function createFloatingBubbles() {
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 50 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
        floatingContainer.appendChild(bubble);

        gsap.to(bubble, {
            y: -100 - Math.random() * 200,
            x: (Math.random() - 0.5) * 50,
            duration: 5 + Math.random() * 10,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// Balloon Game Logic
const balloonContainer = document.getElementById('balloon-container');
let gameInterval;

let poppedCount = 0;
const TOTAL_BALLOONS = 8;

function startBalloonGame() {
    balloonContainer.innerHTML = '';
    poppedCount = 0;
    document.getElementById('game-modal').classList.add('hidden');

    // Spawn exactly 8 balloons at different intervals
    for (let i = 0; i < TOTAL_BALLOONS; i++) {
        setTimeout(() => {
            if (currentSlide === 3) spawnBalloon();
        }, i * 800);
    }
}

function spawnBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    const colors = ['#ff69b4', '#8a2be2', '#ffd700', '#00d4ff', '#ff4757', '#2ed573'];
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];

    const size = Math.random() * 20 + 60;
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.3}px`;

    // Static Random Positions
    const padding = 50;
    const maxX = balloonContainer.offsetWidth - size - padding;
    const maxY = balloonContainer.offsetHeight - (size * 1.3) - padding;

    balloon.style.left = `${padding + Math.random() * maxX}px`;
    balloon.style.top = `${padding + Math.random() * maxY}px`;

    balloonContainer.appendChild(balloon);

    // Initial entrance animation for static balloon
    gsap.from(balloon, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });

    balloon.addEventListener('click', () => {
        popBalloon(balloon);
    });

    // Subtle floating effect (bobbing) but not moving away
    gsap.to(balloon, {
        y: 'random(-10, 10)',
        x: 'random(-5, 5)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

function popBalloon(balloon) {
    balloon.classList.add('balloon-pop');
    poppedCount++;

    // Create "Happy Birthday Siva" text
    const text = document.createElement('div');
    text.className = 'pop-text';
    text.innerText = 'Happy Birthday Siva! ✨';
    text.style.left = `${balloon.offsetLeft}px`;
    text.style.top = `${balloon.offsetTop}px`;
    text.style.color = balloon.style.background;
    balloonContainer.appendChild(text);

    // Animate text
    gsap.to(text, {
        y: -120,
        opacity: 0,
        scale: 1.8,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => text.remove()
    });

    // Sparkle
    confetti({
        particleCount: 30,
        spread: 80,
        origin: {
            x: (balloon.offsetLeft + balloon.offsetWidth / 2) / window.innerWidth,
            y: (balloon.offsetTop + balloon.offsetHeight / 2) / window.innerHeight
        },
        colors: [balloon.style.background, '#ffffff', '#ffd700'],
        gravity: 0.8,
        scalar: 0.8
    });

    setTimeout(() => {
        if (balloon.parentNode) balloon.remove();

        // Check if all popped
        if (poppedCount === TOTAL_BALLOONS) {
            revealGameModal();
        }
    }, 200);
}

function revealGameModal() {
    const modal = document.getElementById('game-modal');
    modal.classList.remove('hidden');
    gsap.from('.modal-card', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    });
}

// Feedback Form Logic
const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
if (submitFeedbackBtn) {
    submitFeedbackBtn.addEventListener('click', async () => {
        const msg = document.getElementById('feedback-message').value.trim();
        if (!msg) {
            alert('Entha message umae illama anupa mudiyathu! Type something di 👀');
            return;
        }

        // Disable button while sending
        submitFeedbackBtn.innerText = 'Sending... ⏳';
        submitFeedbackBtn.style.pointerEvents = 'none';

        try {
            // Web3Forms API: Sends the message directly to your email without opening any apps!
            // REPLACE "YOUR_ACCESS_KEY_HERE" with your Web3Forms Access Key
            await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: '46b77c72-cba7-423f-8a59-025d052fdb7f', // <-- Paste your key here
                    subject: 'Birthday Site - Friend Feedback ✨',
                    message: `Message from Siva:\n\n${msg}`,
                    from_name: 'Birthday Website'
                })
            });

            // Automatically go to final slide on success
            currentSlide = 11;
            showSlide(currentSlide);

        } catch (error) {
            alert('Oops! Message anuppa mudiyala. Try again later.');
            submitFeedbackBtn.innerText = 'Send to Me 🚀';
            submitFeedbackBtn.style.pointerEvents = 'auto';
        }
    });
}

// Focus effect for textarea
const feedbackTextarea = document.getElementById('feedback-message');
if (feedbackTextarea) {
    feedbackTextarea.addEventListener('focus', () => {
        feedbackTextarea.style.borderColor = 'rgba(255, 105, 180, 1)';
        feedbackTextarea.style.boxShadow = 'inset 0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(255, 105, 180, 0.3)';
    });
    feedbackTextarea.addEventListener('blur', () => {
        feedbackTextarea.style.borderColor = 'rgba(255, 105, 180, 0.4)';
        feedbackTextarea.style.boxShadow = 'inset 0 2px 10px rgba(0,0,0,0.5), 0 0 15px rgba(255, 105, 180, 0.1)';
    });
}

// Mouse Parallax for backgrounds
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    gsap.to('.hero-bg', { x: x, y: y, duration: 1, ease: 'power2.out' });
});
