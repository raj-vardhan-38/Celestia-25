// Interactive cursor trail
class CursorTrail {
  constructor() {
    this.canvas = document.getElementById('cursor-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    
    this.resize();
    this.bindEvents();
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      // Create trail particles
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: this.mouse.x + (Math.random() - 0.5) * 10,
          y: this.mouse.y + (Math.random() - 0.5) * 10,
          size: Math.random() * 3 + 1,
          life: 1,
          decay: Math.random() * 0.02 + 0.01,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        });
      }
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = `hsl(${0 + Math.sin(Date.now() * 0.001) * 30}, 20%, 80%)`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Typewriter effect for title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Word-by-word animation with delay
function animateWordsWithDelay(element, text, delay = 150) {
  const words = text.split(' ');
  element.innerHTML = '';
  
  words.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.textContent = word;
    wordSpan.style.opacity = '0';
    wordSpan.style.transform = 'translateY(20px)';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.transition = 'all 0.6s ease';
    wordSpan.style.marginRight = '0.3em';
    wordSpan.classList.add('word-animate');
    
    element.appendChild(wordSpan);
    
    setTimeout(() => {
      wordSpan.style.opacity = '1';
      wordSpan.style.transform = 'translateY(0)';
    }, index * delay);
  });
}

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  updateCounter();
}

// Create floating particles
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 3 + 1;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.left = Math.random() * 100 + '%';
  
  const duration = Math.random() * 4 + 4;
  particle.style.animationDuration = duration + 's';
  particle.style.animationDelay = Math.random() * 2 + 's';
  
  document.body.appendChild(particle);
  
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, (duration + 2) * 1000);
}

// Particle system for enhanced visual effects
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = isMobile() ? 15 : 50;
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomColor()
      });
    }
  }
  
  getRandomColor() {
    const colors = [
      'rgba(255,215,0,',
      'rgba(255,182,193,',
      'rgba(135,206,235,',
      'rgba(221,160,221,'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color + particle.opacity + ')';
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Enhanced magnetic button effect
function initMagneticButton() {
  const button = document.querySelector('.magnetic-btn');
  if (!button) return;
  
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.08)`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0px, 0px) scale(1)';
  });
  
  // Enhanced button interactions
  const ripple = button.querySelector('.btn-ripple');
  if (ripple) {
    button.addEventListener('click', (e) => {
      ripple.style.width = '0';
      ripple.style.height = '0';
      
      setTimeout(() => {
        ripple.style.width = '300px';
        ripple.style.height = '300px';
      }, 10);
      
      setTimeout(() => {
        ripple.style.width = '0';
        ripple.style.height = '0';
      }, 600);
    });
  }
}

// Letter animation for title
function animateLetters() {
  const letters = document.querySelectorAll('.title .letter');
  letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.style.opacity = '1';
      letter.style.transform = 'translateY(0) rotateY(0)';
    }, index * 100);
  });
}

// Sound toggle functionality
function initSoundToggle() {
  const soundToggle = document.getElementById('sound-toggle');
  if (!soundToggle) return;
  
  let isPlaying = false;
  
  soundToggle.addEventListener('click', () => {
    isPlaying = !isPlaying;
    soundToggle.style.transform = isPlaying ? 'scale(1.2)' : 'scale(1)';
    
    const waves = soundToggle.querySelectorAll('.wave');
    waves.forEach(wave => {
      wave.style.animationPlayState = isPlaying ? 'running' : 'paused';
    });
  });
}

// Mobile detection and optimization
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// Enhanced loading sequence with mobile optimization
window.addEventListener("load", () => {
  const mobile = isMobile();
  
  // Reduce particle count on mobile
  const particleCount = mobile ? 3 : 10;
  for (let i = 0; i < particleCount; i++) {
    setTimeout(createParticle, i * 100);
  }
  
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("main").classList.remove("hidden");
    
    // Initialize particle system with mobile optimization
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas && !mobile) {
      new ParticleSystem(particleCanvas);
    }
    
    // Initialize cursor trail only on desktop
    if (!mobile && typeof CursorTrail !== 'undefined') {
      new CursorTrail();
    }
    
    // Initialize magnetic button
    initMagneticButton();
    
    // Initialize sound toggle
    initSoundToggle();
    
    // Animate letters
    setTimeout(() => {
      animateLetters();
    }, 500);
    
    // Start word-by-word animation for intro
    const introElement = document.getElementById('animated-intro');
    setTimeout(() => {
      animateWordsWithDelay(introElement, "An unforgettable night awaits you at Celestia'25, where stars meet celebration and memories shine bright.", mobile ? 100 : 150);
    }, 2500);
    
    // Animate subtitle
    const subtitleElement = document.getElementById('animated-subtitle');
    setTimeout(() => {
      subtitleElement.style.opacity = '1';
      subtitleElement.style.transform = 'translateX(0)';
    }, 1500);
    
  }, mobile ? 2000 : 3000);
});

// Create particles continuously with mobile optimization
if (!isMobile()) {
  setInterval(createParticle, 300);
} else {
  setInterval(createParticle, 800);
}

// Advanced interaction system
document.addEventListener('DOMContentLoaded', () => {
  // Initialize title animation
  setTimeout(() => {
    animateTitle();
  }, 500);
  
  // Initialize subtitle animation  
  setTimeout(() => {
    animateSubtitle();
  }, 1500);
  // Enhanced parallax with smooth interpolation
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  
  function updateParallax() {
    if (isMobile()) return; // Disable parallax on mobile for performance
    
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;
    
    const card = document.querySelector('.main-card');
    const shapes = document.querySelectorAll('.shape');
    const aurora = document.querySelector('.aurora');
    
    if (card) {
      card.style.transform = `perspective(1000px) rotateY(${mouseX * 3}deg) rotateX(${mouseY * -3}deg)`;
    }
    
    if (aurora) {
      aurora.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px) rotate(${mouseX * 2}deg)`;
    }
    
    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.3;
      const currentTransform = shape.style.transform || '';
      const baseTransform = currentTransform.split('translate')[0];
      shape.style.transform = baseTransform + ` translate(${mouseX * speed * 10}px, ${mouseY * speed * 10}px)`;
    });
    
    requestAnimationFrame(updateParallax);
  }
  updateParallax();
  
  // Enhanced button interactions with sound toggle
  const btn = document.querySelector('.magnetic-btn');
  const soundToggle = document.querySelector('.sound-toggle');
  let soundEnabled = false;
  
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle('active', soundEnabled);
    });
  }
  
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Create advanced explosion effect
      for (let i = 0; i < 20; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
          position: fixed;
          width: ${Math.random() * 6 + 2}px;
          height: ${Math.random() * 6 + 2}px;
          background: rgba(255,255,255,${Math.random() * 0.8 + 0.2});
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        `;
        
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        spark.style.left = centerX + 'px';
        spark.style.top = centerY + 'px';
        
        document.body.appendChild(spark);
        
        const angle = (i / 20) * Math.PI * 2;
        const velocity = Math.random() * 150 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        spark.animate([
          { 
            transform: 'translate(0, 0) scale(1) rotate(0deg)', 
            opacity: 1 
          },
          { 
            transform: `translate(${vx}px, ${vy}px) scale(0) rotate(360deg)`, 
            opacity: 0 
          }
        ], {
          duration: Math.random() * 1000 + 500,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => spark.remove();
      }
      
      // Delayed navigation
      setTimeout(() => {
        window.open(btn.href, '_blank');
      }, 300);
    });
  }
  
  // Interactive letter effects
  const letters = document.querySelectorAll('.title .letter');
  letters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
      letter.style.transform = 'rotateY(360deg) scale(1.3) translateZ(20px)';
      letter.style.textShadow = '0 0 30px rgba(255,255,255,0.8)';
    });
    
    letter.addEventListener('mouseleave', () => {
      letter.style.transform = 'rotateY(0deg) scale(1) translateZ(0px)';
      letter.style.textShadow = '0 0 30px rgba(255,255,255,0.2)';
    });
  });
  
  // Ambient background animation
  function createAmbientParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 1px;
      height: 1px;
      background: rgba(255,255,255,${Math.random() * 0.5 + 0.1});
      pointer-events: none;
      z-index: 1;
      left: ${Math.random() * 100}vw;
      top: 100vh;
    `;
    
    document.body.appendChild(particle);
    
    particle.animate([
      { transform: 'translateY(0px)', opacity: 0 },
      { transform: 'translateY(-20px)', opacity: 1 },
      { transform: 'translateY(-100vh)', opacity: 0 }
    ], {
      duration: Math.random() * 8000 + 5000,
      easing: 'linear'
    }).onfinish = () => particle.remove();
  }
  
  // Create ambient particles periodically
  setInterval(createAmbientParticle, 200);
});
