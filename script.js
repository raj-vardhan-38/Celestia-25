// Interactive cursor trail
class CursorTrail {
  constructor() {
    this.canvas = document.getElementById('cursor-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.lastTime = 0;
    this.fps = 60;
    this.interval = 1000 / this.fps;
    
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
  
  animate(currentTime = 0) {
    // Throttle to 60fps for better performance
    if (currentTime - this.lastTime < this.interval) {
      requestAnimationFrame((time) => this.animate(time));
      return;
    }
    
    this.lastTime = currentTime;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles with optimized loop
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Optimized drawing with batched operations
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = `hsl(${45 + Math.sin(currentTime * 0.001) * 15}, 70%, 80%)`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    
    requestAnimationFrame((time) => this.animate(time));
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
    this.maxParticles = isMobileDevice() ? 15 : 30; // Reduced for better performance
    
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
    // Use clearRect for better performance
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Batch drawing operations for better performance
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Boundary collision with better performance
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Optimized drawing
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color + '1)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
    
    // Use requestAnimationFrame for smooth 60fps
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
    
    button.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0) scale3d(1.08, 1.08, 1)`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)';
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

// Mobile detection// Mobile optimizations with performance-aware animations
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

if (isMobileDevice()) {
  // Reduce particle count for mobile performance
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas) {
    // Keep particles but reduce count
    const ctx = particleCanvas.getContext('2d');
    // Reduce particle system intensity by 70%
  }
  
  // Disable cursor trail on mobile but keep touch interactions
  document.addEventListener('touchmove', (e) => {
    // Allow natural scrolling
  }, { passive: true });
}

// Mobile-friendly animation optimizations
function optimizeForMobile() {
  if (isMobileDevice()) {
    // Reduce particle count instead of disabling completely
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
      // Keep canvas visible but optimize performance
      particleCanvas.style.opacity = '0.6';
    }
    
    // Disable cursor canvas
    const cursorCanvas = document.getElementById('cursor-canvas');
    if (cursorCanvas) {
      cursorCanvas.style.display = 'none';
    }
    
    // Keep essential animations but optimize them
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .magnetic-btn {
          animation: fadeIn 2s ease 1.8s both, buttonPulse 4s ease-in-out infinite !important;
        }
        .title .letter {
          animation: letterReveal 0.8s ease forwards !important;
          animation-delay: calc(var(--i) * 0.1s + 2s) !important;
        }
        .bg-sparkle {
          animation: bgSparkleFloat 8s ease-in-out infinite !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Countdown Timer Functionality
function initCountdownTimer() {
  // Set the event date - you can modify this date
  const eventDate = new Date('2024-12-31T20:00:00').getTime(); // Example: Dec 31, 2024 8:00 PM
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;
    
    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      document.getElementById('days').textContent = days.toString().padStart(2, '0');
      document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    } else {
      // Event has started
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.querySelector('.countdown-title').textContent = 'The party has begun!';
    }
  }
  
  // Update immediately and then every minute
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

// Modal functionality
function initModal() {
  const mainBtn = document.getElementById('main-btn');
  const registrationBtn = document.getElementById('registration-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('cancel-btn');
  const formBtn = document.getElementById('form-btn');
  
  // Main button modal functionality
  if (mainBtn && modalOverlay) {
    mainBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
      
      // Create sparkle effect
      createSparkleEffect(e.target);
    });
  }
  
  // Registration button functionality
  if (registrationBtn && modalOverlay) {
    registrationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!registrationBtn.disabled) {
        // Open the same modal as main button
        modalOverlay.classList.add('active');
        
        // Create sparkle effect
        createSparkleEffect(e.target);
      }
    });
  }
  
  if (modalOverlay) {
    // Close modal handlers
    [modalClose, cancelBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          modalOverlay.classList.remove('active');
        });
      }
    });
    
    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
    
    // Form button with delay
    if (formBtn) {
      formBtn.addEventListener('click', () => {
        // Add some cosmic effect before redirect
        createCosmicExplosion();
        setTimeout(() => {
          modalOverlay.classList.remove('active');
        }, 500);
      });
    }
  }
}

// Create sparkle effect for button clicks
function createSparkleEffect(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 15; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: radial-gradient(circle, rgba(255,215,0,1), rgba(255,182,193,0.8));
      border-radius: 50%;
      pointer-events: none;
      z-index: 10001;
      box-shadow: 0 0 15px rgba(255,215,0,0.8);
      left: ${centerX}px;
      top: ${centerY}px;
    `;
    
    document.body.appendChild(sparkle);
    
    const angle = (i / 15) * Math.PI * 2;
    const velocity = Math.random() * 200 + 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    sparkle.animate([
      { 
        transform: 'translate(0, 0) scale(1) rotate(0deg)', 
        opacity: 1 
      },
      { 
        transform: `translate(${vx}px, ${vy}px) scale(0) rotate(720deg)`, 
        opacity: 0 
      }
    ], {
      duration: Math.random() * 1500 + 800,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => sparkle.remove();
  }
}

// Create cosmic explosion effect
function createCosmicExplosion() {
  const colors = [
    'rgba(255,215,0,0.8)',
    'rgba(255,182,193,0.8)',
    'rgba(135,206,235,0.8)',
    'rgba(221,160,221,0.8)'
  ];
  
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
      position: fixed;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 10002;
      box-shadow: 0 0 20px ${color};
      left: 50%;
      top: 50%;
    `;
    
    document.body.appendChild(particle);
    
    const angle = (i / 25) * Math.PI * 2;
    const velocity = Math.random() * 300 + 150;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    particle.animate([
      { 
        transform: 'translate(-50%, -50%) scale(1)', 
        opacity: 1 
      },
      { 
        transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: Math.random() * 2000 + 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => particle.remove();
  }
}

// Enhanced music functionality
let globalAudio = null;
let globalIsPlaying = false;

function initEnhancedMusic() {
  const soundToggle = document.getElementById('sound-toggle');
  const audioElement = document.getElementById('background-audio');
  
  if (!soundToggle) return;
  
  // Use HTML audio element for better compatibility
  globalAudio = audioElement || new Audio('Bgm.mp4');
  globalAudio.volume = 0.3;
  globalAudio.loop = true;
  globalAudio.currentTime = 0;
  
  // Set initial state
  globalIsPlaying = true;
  soundToggle.classList.add('active');
  
  // Immediate play attempt with multiple strategies
  const attemptAutoPlay = async () => {
    // Strategy 1: Direct play
    try {
      await globalAudio.play();
      console.log('Audio started automatically');
      return;
    } catch (e) {
      console.log('Direct play blocked');
    }
    
    // Strategy 2: Muted autoplay then unmute
    try {
      globalAudio.muted = true;
      await globalAudio.play();
      setTimeout(() => {
        globalAudio.muted = false;
        console.log('Audio started via muted autoplay');
      }, 100);
      return;
    } catch (e) {
      console.log('Muted autoplay blocked');
    }
    
    // Strategy 3: Wait for ANY user interaction
    const startAudio = async () => {
      try {
        globalAudio.muted = false;
        globalAudio.currentTime = 0;
        await globalAudio.play();
        globalIsPlaying = true;
        soundToggle.classList.add('active');
        console.log('Audio started after interaction');
      } catch (err) {
        console.log('Audio failed even after interaction');
      }
    };
    
    // Listen for multiple interaction types
    const interactions = ['click', 'keydown', 'touchstart', 'mousemove', 'scroll', 'mousedown'];
    const cleanup = () => {
      interactions.forEach(event => {
        document.removeEventListener(event, startAudio);
      });
    };
    
    interactions.forEach(event => {
      document.addEventListener(event, () => {
        startAudio();
        cleanup();
      }, { once: true });
    });
  };
  
  // Start audio immediately
  attemptAutoPlay();
  
  // Music toggle functionality
  soundToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (globalIsPlaying) {
      globalAudio.pause();
      globalIsPlaying = false;
      soundToggle.classList.remove('active');
    } else {
      globalAudio.play().then(() => {
        globalIsPlaying = true;
        soundToggle.classList.add('active');
      }).catch(console.error);
    }
  });
  
  // Audio event handlers
  globalAudio.addEventListener('play', () => {
    globalIsPlaying = true;
    soundToggle.classList.add('active');
  });
  
  globalAudio.addEventListener('pause', () => {
    globalIsPlaying = false;
    soundToggle.classList.remove('active');
  });
  
  globalAudio.addEventListener('ended', () => {
    globalAudio.currentTime = 0;
    globalAudio.play();
  });
}

// Registration Countdown Timer Functionality
function initRegistrationCountdown() {
  // Set the registration deadline - modify this date as needed
  const registrationDeadline = new Date('2025-09-07T23:59:59').getTime(); // September 7, 2025 11:59 PM
  const countdownElement = document.getElementById('registration-countdown');
  const registrationBtn = document.getElementById('registration-btn');
  
  function updateRegistrationCountdown() {
    const now = new Date().getTime();
    const distance = registrationDeadline - now;
    
    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Update countdown with animation
      updateTimeWithAnimation('reg-days', days);
      updateTimeWithAnimation('reg-hours', hours);
      updateTimeWithAnimation('reg-minutes', minutes);
      updateTimeWithAnimation('reg-seconds', seconds);
      
      // Enable registration button
      if (registrationBtn) {
        registrationBtn.disabled = false;
        registrationBtn.querySelector('.btn-text').textContent = 'Fill Participation Form';
      }
    } else {
      // Registration deadline has passed
      countdownElement.classList.add('closed');
      document.querySelector('.countdown-title').innerHTML = '⛔ Registration Closed!';
      document.querySelector('.countdown-title').classList.add('registration-closed');
      
      // Hide countdown timer
      document.querySelector('.countdown-timer').style.display = 'none';
      
      // Disable registration button
      if (registrationBtn) {
        registrationBtn.disabled = true;
        registrationBtn.querySelector('.btn-text').textContent = 'Form Closed';
      }
    }
  }
  
  function updateTimeWithAnimation(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      const currentValue = element.textContent;
      const newValue = value.toString().padStart(2, '0');
      
      if (currentValue !== newValue) {
        element.classList.add('updating');
        setTimeout(() => {
          element.textContent = newValue;
          element.classList.remove('updating');
        }, 300);
      }
    }
  }
  
  // Update immediately and then every second
  updateRegistrationCountdown();
  setInterval(updateRegistrationCountdown, 1000);
}

// Initialize audio immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Pre-initialize audio as early as possible
  if (!globalAudio) {
    globalAudio = new Audio('Bgm.mp4');
    globalAudio.loop = true;
    globalAudio.volume = 0.3;
    globalAudio.preload = 'auto';
    globalAudio.currentTime = 0;
    
    // Add audio element to DOM to help with auto-play
    globalAudio.muted = true; // Start muted to bypass auto-play restrictions
    document.body.appendChild(globalAudio);
    
    // Try to play immediately
    globalAudio.play().then(() => {
      // Unmute after successful play
      globalAudio.muted = false;
      globalIsPlaying = true;
      console.log('Audio started on DOM ready');
    }).catch(() => {
      console.log('Audio blocked on DOM ready, will try again');
      // Try alternative approach
      globalAudio.muted = false;
    });
  }
});

// Enhanced loading sequence with mobile optimization
window.addEventListener("load", () => {
  const mobile = isMobileDevice();
  const loadingElement = document.getElementById("loading");
  const mainElement = document.getElementById("main");
  
  // Apply mobile optimizations immediately
  optimizeForMobile();
  
  // Show loading screen for 2-3 seconds
  setTimeout(() => {
    // Fade out loading screen
    loadingElement.classList.add('fade-out');
    
    // After fade out completes, show main content
    setTimeout(() => {
      loadingElement.style.display = "none";
      mainElement.classList.remove("hidden");
      mainElement.classList.add('fade-in');
      
      // Show registration countdown after main content loads
      setTimeout(() => {
        const registrationCountdown = document.getElementById('registration-countdown');
        if (registrationCountdown) {
          registrationCountdown.classList.add('show');
        }
      }, 500);
      
      // Initialize registration countdown
      initRegistrationCountdown();
      
      // Initialize modal
      initModal();
      
      // Initialize enhanced music
      initEnhancedMusic();
      
      // Only initialize particle system on desktop
      if (!mobile) {
        const particleCanvas = document.getElementById('particle-canvas');
        if (particleCanvas) {
          new ParticleSystem(particleCanvas);
        }
        
        // Initialize cursor trail only on desktop
        if (typeof CursorTrail !== 'undefined') {
          new CursorTrail();
        }
      }
      
      // Initialize magnetic button
      initMagneticButton();
      
      // Initialize sound toggle
      initSoundToggle();
      
      // Animate letters only on desktop to prevent flickering
      if (!mobile) {
        setTimeout(() => {
          animateLetters();
        }, 500);
      }
      
      // Start word-by-word animation for intro (simplified on mobile)
      const introElement = document.getElementById('animated-intro');
      if (introElement) {
        setTimeout(() => {
          if (mobile) {
            // Simple fade-in on mobile instead of complex animation
            introElement.textContent = "An unforgettable night awaits you at Celestia'25, where the ordinary ends, stars descend and memories shine bright.";
            introElement.style.opacity = '1';
          } else {
            animateWordsWithDelay(introElement, "An unforgettable night awaits you at Celestia'25, where the ordinary ends, stars descend and memories shine bright.", 150);
          }
        }, mobile ? 800 : 1200);
      }
      
      // Animate subtitle (simplified on mobile)
      const subtitleElement = document.getElementById('animated-subtitle');
      if (subtitleElement) {
        setTimeout(() => {
          subtitleElement.style.opacity = '1';
          if (!mobile) {
            subtitleElement.style.transform = 'translateX(0)';
          }
        }, mobile ? 800 : 1500);
      }
      
    }, 800); // Wait for fade out animation
  }, mobile ? 2000 : 3000); // Loading duration
});

// Create particles continuously with mobile optimization
if (!isMobileDevice()) {
  setInterval(createParticle, 300);
}
// Completely disable particle creation on mobile to prevent flickering

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
  // Enhanced parallax with smooth interpolation (desktop only)
  if (!isMobileDevice()) {
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    function updateParallax() {
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;
      
      const floatingShapes = document.querySelector('.floating-shapes');
      const accentOrbs = document.querySelector('.accent-orbs');
      
      if (floatingShapes) {
        floatingShapes.style.opacity = '0.4';
        // Slow down animations for better performance
        const shapes = floatingShapes.querySelectorAll('.shape');
        shapes.forEach(shape => {
          shape.style.animationDuration = '12s';
        });
      }
      
      if (accentOrbs) {
        accentOrbs.style.opacity = '0.6';
        const orbs = accentOrbs.querySelectorAll('.orb');
        orbs.forEach(orb => {
          orb.style.animationDuration = '8s';
        });
      }
      
      const card = document.querySelector('.main-card');
      const aurora = document.querySelector('.aurora');
      
      if (card) {
        card.style.transform = `perspective(1000px) rotateY(${mouseX * 3}deg) rotateX(${mouseY * -3}deg)`;
      }
      
      if (aurora) {
        aurora.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px) rotate(${mouseX * 2}deg)`;
      }
      
      const shapes = document.querySelectorAll('.shape');
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.3;
        const currentTransform = shape.style.transform || '';
        const baseTransform = currentTransform.split('translate')[0];
        shape.style.transform = baseTransform + ` translate(${mouseX * speed * 10}px, ${mouseY * speed * 10}px)`;
      });
      
      requestAnimationFrame(updateParallax);
    }
    updateParallax();
  }
  
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
  
  // Button functionality now handled by modal system
  
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
  
  // Ambient background animation (desktop only)
  if (!isMobileDevice()) {
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
  }
});
