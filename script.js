// ==========================================================================
// PRIME FITNESS INTERACTIVE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. THEME SWITCHER (Default to Light Mode)
  initTheme();

  // 2. MOBILE NAVIGATION DRAWER
  initMobileNav();

  // 3. SCROLL REVEAL ANIMATIONS
  initScrollReveal();

  // 4. ANIMATED NUMBER COUNTERS
  initAnimatedCounters();

  // 5. IMAGE LIGHTBOX MODAL
  initLightbox();

  // 6. INTERACTIVE BMI CALCULATOR
  initBmiCalculator();

  // 7. CONTACT & ENQUIRY FORMS
  initContactForm();

  // 8. GALLERY FILTER TABS
  initGalleryFilters();
});

/* --------------------------------------------------------------------------
   THEME SWITCHER
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.querySelector('.theme-toggle');
  const storedTheme = localStorage.getItem('prime_fitness_theme') || 'light';
  
  applyTheme(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('prime_fitness_theme', newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.querySelector('.theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    toggleBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    toggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  }

  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'light' ? '#F8FAFC' : '#0A0B10');
  }
}

/* --------------------------------------------------------------------------
   MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      menuBtn.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.textContent = '☰';
      });
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove('open');
        menuBtn.textContent = '☰';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL ANIMATION OBSERVER
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   ANIMATED NUMBER COUNTERS
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let count = 0;
      const duration = 1600;
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const stepValue = Math.ceil(target / totalSteps);

      const timer = setInterval(() => {
        count = Math.min(target, count + stepValue);
        el.textContent = count.toLocaleString() + suffix;
        if (count >= target) {
          clearInterval(timer);
        }
      }, stepTime);

      obs.unobserve(el);
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => counterObserver.observe(counter));
}

/* --------------------------------------------------------------------------
   IMAGE LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initLightbox() {
  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <button class="lightbox-close" aria-label="Close modal">&times;</button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="Prime Fitness preview">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalImg = modal.querySelector('.lightbox-img');
  const modalCaption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    modalImg.src = src;
    modalCaption.textContent = caption || 'Prime Fitness • Ashgabat';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('img') || item;
      const src = item.getAttribute('href') || item.dataset.lightbox || img.src;
      const caption = item.dataset.caption || img.alt || 'Prime Fitness';
      openLightbox(src, caption);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   INTERACTIVE BMI CALCULATOR
   -------------------------------------------------------------------------- */
function initBmiCalculator() {
  const calcBtn = document.querySelector('#calculateBmiBtn');
  if (!calcBtn) return;

  const heightInput = document.querySelector('#bmiHeight');
  const weightInput = document.querySelector('#bmiWeight');
  const bmiValueEl = document.querySelector('#bmiValue');
  const bmiStatusEl = document.querySelector('#bmiStatus');
  const bmiAdviceEl = document.querySelector('#bmiAdvice');

  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (!height || !weight || height <= 0 || weight <= 0) {
      showToast('⚠️ Please enter valid height and weight');
      return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    bmiValueEl.textContent = bmi;

    let status = '';
    let advice = '';

    if (bmi < 18.5) {
      status = 'Underweight';
      advice = 'Focus on high-protein nutrition & progressive Hypertrophy strength program.';
    } else if (bmi >= 18.5 && bmi < 25) {
      status = 'Optimal Fitness Range';
      advice = 'Great shape! Maintain conditioning with our Functional & Strength programs.';
    } else if (bmi >= 25 && bmi < 30) {
      status = 'Overweight';
      advice = 'Ideal time for the Prime 60-Day Transformation & HIIT conditioning challenge.';
    } else {
      status = 'High Body Mass';
      advice = 'Personalized 1-on-1 coaching with nutrition monitoring is highly recommended.';
    }

    bmiStatusEl.textContent = status;
    if (bmiAdviceEl) bmiAdviceEl.textContent = advice;

    showToast(`BMI Calculated: ${bmi} (${status})`);
  });
}

/* --------------------------------------------------------------------------
   CONTACT FORM HANDLER & TOAST
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = 'Sending Request... ⏳';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = 'Request Sent ✓';
      showToast('✅ Thank you! Prime Fitness team will contact you shortly.');
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   GALLERY FILTER TABS
   -------------------------------------------------------------------------- */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
