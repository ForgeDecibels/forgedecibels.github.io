// ==========================================================================
// ANMANE — Cyber-Scientific Acoustic Physics & Telemetry Engine
// Featuring: Upward Streaming Growth Sine Wave & Antigravity Particle Field
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. Antigravity Particle Field & Ascending Streams Sine Wave Graph
  // ------------------------------------------------------------------------
  const particleCanvas = document.getElementById('antigravity-particles');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 175; // Rich star/particle density
    let wavePhase = 0;

    const mouse = {
      x: null,
      y: null,
      radius: 180,
      active: false
    };

    function resizeCanvas() {
      width = particleCanvas.width = window.innerWidth;
      height = particleCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.active = false;
    });

    // Particle Object
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : (Math.random() < 0.5 ? -10 : height + 10);
        this.depth = Math.random() * 0.75 + 0.25;
        this.radius = Math.random() < 0.65 ? (this.depth * 1.4) : (this.depth * 2.8);
        
        this.baseVx = (Math.random() - 0.5) * 0.28 * this.depth;
        this.baseVy = (Math.random() - 0.5) * 0.28 * this.depth;
        this.vx = this.baseVx;
        this.vy = this.baseVy;

        this.alpha = this.depth * 0.7;
        this.pulseSpeed = Math.random() * 0.025 + 0.008;
        this.pulseVal = Math.random() * Math.PI * 2;

        const rand = Math.random();
        if (rand < 0.25) {
          this.color = 'rgba(74, 222, 128,'; // Soft green accent
        } else if (rand < 0.4) {
          this.color = 'rgba(110, 231, 183,'; // Soft mint spark
        } else {
          this.color = 'rgba(240, 240, 250,'; // Starry white
        }
      }

      update() {
        this.pulseVal += this.pulseSpeed;
        const dynamicAlpha = this.alpha * (0.65 + 0.35 * Math.sin(this.pulseVal));

        if (mouse.active && mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 2.2;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.45;
            this.vy += Math.sin(angle) * force * 0.45;
          }
        }

        this.vx += (this.baseVx - this.vx) * 0.035;
        this.vy += (this.baseVy - this.vy) * 0.035;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -30) this.x = width + 30;
        if (this.x > width + 30) this.x = -30;
        if (this.y < -30) this.y = height + 30;
        if (this.y > height + 30) this.y = -30;

        return dynamicAlpha;
      }

      draw(alpha) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${alpha})`;
        ctx.fill();

        if (this.radius > 2.0) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let isHoveringCurve = false;
    let waveEnergy = 0;

    // Function to calculate static resting curve baseline for hover detection
    function getStaticWaveY(x, offset = 0) {
      const progress = x / width;
      const baseline = height * (0.86 - Math.pow(progress, 1.35) * 0.76) + offset;
      const amplitude = (height * 0.065) * (0.65 + progress * 0.6);
      const freq = (3.6 * Math.PI) / width;
      return baseline + Math.sin(x * freq) * amplitude;
    }

    // Function to calculate dynamic curve with smooth Gaussian localized deflection
    function getWaveY(x, phase, offset = 0) {
      const progress = x / width;
      const baseline = height * (0.86 - Math.pow(progress, 1.35) * 0.76) + offset;
      const amplitude = (height * 0.065 + (waveEnergy * height * 0.012)) * (0.65 + progress * 0.6);
      const freq = (3.6 * Math.PI) / width;
      
      let waveY = baseline + Math.sin(x * freq - phase) * amplitude;

      // Ultra-smooth Gaussian localized curve deflection strictly under cursor
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = x - mouse.x;
        const radius = 160;
        const distSq = dx * dx;
        if (distSq < radius * radius) {
          const sigma = radius * 0.42;
          const gaussian = Math.exp(-distSq / (2 * sigma * sigma));
          
          const dy = mouse.y - waveY;
          if (Math.abs(dy) < 140) {
            const verticalProximity = 1 - Math.abs(dy) / 140;
            waveY += dy * 0.35 * gaussian * verticalProximity;
          }
        }
      }

      return waveY;
    }

    function renderAscendingSineWave() {
      // 1. Draw Subtle Secondary Ghost Harmonic Stream (Soft Green & Discreet)
      ctx.beginPath();
      ctx.lineWidth = 1.4 + waveEnergy * 0.4;
      ctx.strokeStyle = `rgba(74, 222, 128, ${0.14 + waveEnergy * 0.14})`;
      ctx.shadowColor = 'rgba(74, 222, 128, 0.3)';
      ctx.shadowBlur = 12 + waveEnergy * 8;

      for (let x = 0; x <= width; x += 4) {
        const y = getWaveY(x, wavePhase * 0.85, 26);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Draw Soft Diffused Outer Ambient Blur Halo
      ctx.beginPath();
      ctx.lineWidth = 18 + waveEnergy * 8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + waveEnergy * 0.04})`;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.55)';
      ctx.shadowBlur = 38 + waveEnergy * 18;

      for (let x = 0; x <= width; x += 4) {
        const y = getWaveY(x, wavePhase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Draw Core Blurred & Discreet Luminous White Stream Curve
      ctx.beginPath();
      ctx.lineWidth = 2.4 + waveEnergy * 0.6;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.42 + waveEnergy * 0.28})`;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
      ctx.shadowBlur = 22 + waveEnergy * 12;

      for (let x = 0; x <= width; x += 3) {
        const y = getWaveY(x, wavePhase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadow for subsequent drawings
      ctx.shadowBlur = 0;

      // 4. Draw Soft Harmonic Energy Pulse Nodes along the wave
      const nodeCount = 5;
      for (let i = 0; i < nodeCount; i++) {
        const nodeProgress = ((i / nodeCount) + (wavePhase * 0.025)) % 1;
        const nodeX = nodeProgress * width;
        const nodeY = getWaveY(nodeX, wavePhase);

        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 2.5 + waveEnergy * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + waveEnergy * 0.35})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 10 + waveEnergy * 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function renderEngine() {
      ctx.clearRect(0, 0, width, height);

      // Check if mouse is directly hovering over the curve path (within 65px radius)
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const expectedY = getStaticWaveY(mouse.x);
        const distToCurve = Math.abs(mouse.y - expectedY);
        isHoveringCurve = distToCurve < 68;
      } else {
        isHoveringCurve = false;
      }

      // Smoothly ramp wave animation energy up only when hovering over curve
      const targetEnergy = isHoveringCurve ? 1.0 : 0.0;
      waveEnergy += (targetEnergy - waveEnergy) * 0.075;

      // Slow, calm ambient wave animation speed + soft acceleration on hover
      wavePhase += 0.009 + 0.022 * waveEnergy;

      // Render Ascending Streams Sine Wave Graph
      renderAscendingSineWave();

      // Render Particles & Constellation Links
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const a1 = p1.update();
        p1.draw(a1);

        // Constellation lines for nearby particles
        for (let j = i + 1; j < particles.length; j += 2) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 95;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.12 * Math.min(p1.depth, p2.depth);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      wavePhase += 0.032; // Smooth continuous streaming flow
      requestAnimationFrame(renderEngine);
    }

    requestAnimationFrame(renderEngine);
  }

  // ------------------------------------------------------------------------
  // 2. Real-time Telemetry Oscilloscope Waveform Canvas
  // ------------------------------------------------------------------------
  const waveCanvas = document.getElementById('telemetry-wave-canvas');
  if (waveCanvas) {
    const ctx = waveCanvas.getContext('2d');
    let phase = 0;

    function resizeWave() {
      const rect = waveCanvas.getBoundingClientRect();
      waveCanvas.width = rect.width * (window.devicePixelRatio || 1);
      waveCanvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    resizeWave();
    window.addEventListener('resize', resizeWave);

    function drawWave() {
      const rect = waveCanvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Center reference grid
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();

      // Main Acoustic Waveform
      ctx.beginPath();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#4ade80';
      ctx.shadowColor = 'rgba(74, 222, 128, 0.65)';
      ctx.shadowBlur = 8;

      for (let x = 0; x < w; x++) {
        const angle = x * 0.035 + phase;
        const y = cy + Math.sin(angle) * 14 + Math.sin(angle * 2.5) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += 0.045;
      requestAnimationFrame(drawWave);
    }

    requestAnimationFrame(drawWave);
  }

  // ------------------------------------------------------------------------
  // 3. Discography Releases Carousel Controls (Smooth Navigation & Drag)
  // ------------------------------------------------------------------------
  const carousel = document.getElementById('releases-carousel');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (carousel && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const card = carousel.querySelector('.release-card');
      return card ? card.offsetWidth + 24 : 304;
    };

    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    let isDown = false;
    let startX, scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
      carousel.style.userSelect = 'none';
    });

    const stopDrag = () => {
      isDown = false;
      carousel.style.cursor = 'default';
      carousel.style.removeProperty('user-select');
    };

    carousel.addEventListener('mouseleave', stopDrag);
    carousel.addEventListener('mouseup', stopDrag);

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    });
  }

  // ------------------------------------------------------------------------
  // 4. Smooth Navigation Anchors
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ------------------------------------------------------------------------
  // 5. Scroll Reveal Animations
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

});
