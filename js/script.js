/**
 * =============================================================================
 * S-Cream Website - Modern JavaScript
 * Interactive functionality for premium user experience
 * =============================================================================
 */

// Main initialization function to run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core components
  initPageLoader();
  initFloatingHeader();
  initTopBanner();
  initMobileMenu();
  initHeroEffects();
  initTrustBar();
  initBenefitsAnimations();
  initCounterAnimations();
  initBeforeAfterSlider();
  initTimelineAnimations();
  init3DMolecule();
  initTabsSystem();
  initClinicalChart();
  initVideoTestimonials();
  initReviewsMasonry();
  initFaqAccordion();
  initCountdownTimer();
  initPromoCodeCopy();
  initLiveChat();
  initBackToTop();
  initCookieConsent();
  initSmoothScrolling();
  
  // FIXED: Partner logo carousel - only initialize once
  initPartnerLogoCarousel();
  
  // Initialize AOS library for scroll animations if it exists
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      delay: 100,
      disable: window.innerWidth < 768 ? true : false
    });
  }
  
  // Initialize particles.js if available
  if (typeof particlesJS !== 'undefined') {
    initParticles();
  }
  
  // Update current year in footer
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});

/**
 * Initialize page loader animation
 */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  
  // Hide loader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      
      // Enable scroll after loader disappears
      document.body.style.overflow = 'auto';
    }, 500);
  });
  
  // Disable scroll while loading
  document.body.style.overflow = 'hidden';
}

/**
 * Initialize the floating header behavior
 */
function initFloatingHeader() {
  const header = document.querySelector('.floating-header');
  if (!header) return;
  
  let lastScrollTop = 0;
  const scrollThreshold = 100;
  
  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when scroll position is past threshold
    if (currentScrollTop > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Handle visibility when scrolling up/down
    if (currentScrollTop > lastScrollTop && currentScrollTop > 400) {
      // Scrolling down & past header height
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScrollTop;
  });
  
  // Update active link based on scroll position
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  if (navLinks.length) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + 200;
      
      // Find all sections with IDs
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          // Remove active class from all links
          navLinks.forEach(link => {
            link.classList.remove('active');
          });
          
          // Add active class to corresponding links
          document.querySelectorAll(`.nav-link[href="#${sectionId}"], .mobile-nav-link[href="#${sectionId}"]`).forEach(link => {
            link.classList.add('active');
          });
        }
      });
    });
  }
}

/**
 * Initialize top banner close functionality
 */
function initTopBanner() {
  const banner = document.querySelector('.top-banner');
  const closeBtn = document.querySelector('.banner-close');
  
  if (banner && closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.style.height = banner.offsetHeight + 'px';
      banner.style.overflow = 'hidden';
      
      setTimeout(() => {
        banner.style.height = '0';
        banner.style.padding = '0';
        banner.style.margin = '0';
        
        setTimeout(() => {
          banner.style.display = 'none';
        }, 300);
      }, 10);
      
      // Store closed state in localStorage
      localStorage.setItem('bannerClosed', 'true');
    });
    
    // Check if banner was previously closed
    const isBannerClosed = localStorage.getItem('bannerClosed') === 'true';
    if (isBannerClosed) {
      banner.style.display = 'none';
    }
  }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.setAttribute('aria-hidden', isExpanded);
      
      // Toggle body scroll
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileNav.getAttribute('aria-hidden') === 'false' && 
          !mobileNav.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.getAttribute('aria-hidden') === 'false') {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * Initialize Hero section interactive effects
 */
function initHeroEffects() {
  // 3D card hover effect
  const product3DContainer = document.getElementById('product3DContainer');
  if (product3DContainer && window.innerWidth > 768) {
    product3DContainer.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = product3DContainer.getBoundingClientRect();
      
      // Calculate mouse position relative to container
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      // Apply rotation based on mouse position
      if (typeof gsap !== 'undefined') {
        gsap.to(product3DContainer.querySelector('.product-3d-card'), {
          rotationY: x * 10,
          rotationX: -y * 10,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power1.out'
        });
        
        // Move glow to follow mouse
        const productGlow = product3DContainer.querySelector('.product-glow');
        if (productGlow) {
          gsap.to(productGlow, {
            x: x * 50,
            y: y * 50,
            opacity: 0.7,
            duration: 0.4
          });
        }
      } else {
        // Fallback if GSAP is not available
        const card = product3DContainer.querySelector('.product-3d-card');
        if (card) {
          card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        }
        
        const productGlow = product3DContainer.querySelector('.product-glow');
        if (productGlow) {
          productGlow.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
          productGlow.style.opacity = '0.7';
        }
      }
    });
    
    // Reset on mouse leave
    product3DContainer.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(product3DContainer.querySelector('.product-3d-card'), {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
        
        const productGlow = product3DContainer.querySelector('.product-glow');
        if (productGlow) {
          gsap.to(productGlow, {
            x: 0,
            y: 0,
            opacity: 0.3,
            duration: 0.6
          });
        }
      } else {
        // Fallback if GSAP is not available
        const card = product3DContainer.querySelector('.product-3d-card');
        if (card) {
          card.style.transform = '';
        }
        
        const productGlow = product3DContainer.querySelector('.product-glow');
        if (productGlow) {
          productGlow.style.transform = '';
          productGlow.style.opacity = '0.3';
        }
      }
    });
    
    // Animate product features on load
    const features = product3DContainer.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      setTimeout(() => {
        feature.style.opacity = '1';
        feature.style.transform = 'translateX(0)';
      }, 500 + (index * 300));
    });
  }
  
  // Video background handling
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    // Handle video loading error
    heroVideo.addEventListener('error', () => {
      const videoContainer = heroVideo.parentElement;
      const fallbackImage = document.querySelector('.fallback-image');
      
      if (videoContainer && fallbackImage) {
        // Hide video and show fallback image
        heroVideo.style.display = 'none';
        fallbackImage.style.display = 'block';
      }
    });
    
    // Mobile optimization - pause video when not visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroVideo.play();
          } else if (!entry.isIntersecting && !heroVideo.paused) {
            heroVideo.pause();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(heroVideo);
    }
  }
}

/**
 * Initialize trust bar animations
 */
function initTrustBar() {
  const trustBar = document.querySelector('.trust-bar');
  if (!trustBar) return;
  
  // Add hover effects to trust items
  const trustItems = trustBar.querySelectorAll('.trust-item');
  trustItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const icon = item.querySelector('.trust-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const icon = item.querySelector('.trust-icon');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
  });
  
  // Intersection Observer for animation when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate trust items when visible
          trustItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 100 * index);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    // Set initial state
    trustItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    observer.observe(trustBar);
  }
}

/**
 * FIXED: Initialize partner logo carousel without duplicates
 */
function initPartnerLogoCarousel() {
  const partnersTrack = document.getElementById('partnersTrack');
  if (!partnersTrack) return;
  
  // Get all partner items (non-clones only)
  const partnerItems = partnersTrack.querySelectorAll('.partner-item:not(.partner-clone)');
  if (partnerItems.length === 0) return;
  
  // First, remove any existing clones to prevent duplicate cloning
  partnersTrack.querySelectorAll('.partner-clone').forEach(clone => clone.remove());
  
  // Create only one set of clones - enough for continuous scrolling
  partnerItems.forEach(item => {
    // Create just one clone for each item
    const clone = item.cloneNode(true);
    
    // Add class to identify clones
    clone.classList.add('partner-clone');
    
    // Append to the track
    partnersTrack.appendChild(clone);
  });
  
  // Calculate the proper width
  const itemWidth = partnerItems[0].offsetWidth + 
                    parseInt(getComputedStyle(partnerItems[0]).marginLeft || 0) + 
                    parseInt(getComputedStyle(partnerItems[0]).marginRight || 0);
  
  // Set animation duration based on the number of items
  const animationDuration = partnerItems.length * 5; // 5 seconds per item
  partnersTrack.style.animationDuration = `${animationDuration}s`;
  
  // Add pause on hover functionality
  partnersTrack.addEventListener('mouseenter', () => {
    partnersTrack.style.animationPlayState = 'paused';
  });
  
  partnersTrack.addEventListener('mouseleave', () => {
    partnersTrack.style.animationPlayState = 'running';
  });
  
  // Add touch support for mobile
  partnersTrack.addEventListener('touchstart', () => {
    partnersTrack.style.animationPlayState = 'paused';
  }, { passive: true });
  
  partnersTrack.addEventListener('touchend', () => {
    partnersTrack.style.animationPlayState = 'running';
  }, { passive: true });
}

/**
 * Initialize benefits section animations
 */
function initBenefitsAnimations() {
  const benefitCards = document.querySelectorAll('.benefit-card');
  
  if (benefitCards.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered animation when cards come into view
          setTimeout(() => {
            entry.target.classList.add('active');
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.opacity = '1';
          }, index * 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    benefitCards.forEach(card => {
      card.style.transform = 'translateY(30px)';
      card.style.opacity = '0';
      card.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
      observer.observe(card);
    });
  }
}

/**
 * Initialize counter animations for statistics
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'));
          const duration = 2000; // 2 seconds
          const step = 30; // Update every 30ms
          const increment = target / (duration / step);
          
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            entry.target.textContent = Math.floor(current);
            
            if (current >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
            }
          }, step);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
}

/**
 * Initialize before & after image slider
 */
function initBeforeAfterSlider() {
  const slider = document.getElementById('beforeAfterSlider');
  if (!slider) return;
  
  const handle = document.getElementById('sliderHandle');
  const sliderAfter = slider.querySelector('.slider-after');
  
  // Set initial position
  sliderAfter.style.width = '50%';
  
  // Function to set slider position
  const setPosition = (x) => {
    const sliderRect = slider.getBoundingClientRect();
    let position = (x - sliderRect.left) / sliderRect.width;
    
    // Constrain position between 0 and 1
    position = Math.max(0, Math.min(1, position));
    
    // Update slider position
    sliderAfter.style.width = `${position * 100}%`;
    handle.style.left = `${position * 100}%`;
  };
  
  // Handle drag events
  let isDragging = false;
  
  // Mouse events
  handle.addEventListener('mousedown', () => {
    isDragging = true;
    slider.classList.add('dragging');
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      setPosition(e.clientX);
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    slider.classList.remove('dragging');
  });
  
  // Touch events for mobile
  handle.addEventListener('touchstart', () => {
    isDragging = true;
    slider.classList.add('dragging');
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      setPosition(e.touches[0].clientX);
      e.preventDefault(); // Prevent scrolling while dragging
    }
  });
  
  document.addEventListener('touchend', () => {
    isDragging = false;
    slider.classList.remove('dragging');
  });
  
  // Allow clicking anywhere on slider to set position
  slider.addEventListener('click', (e) => {
    if (e.target !== handle) {
      setPosition(e.clientX);
    }
  });
}

/**
 * Initialize timeline animations
 */
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }
}

/**
 * Initialize 3D molecule visualization
 */
function init3DMolecule() {
  const moleculeContainer = document.getElementById('moleculeContainer');
  if (!moleculeContainer || typeof THREE === 'undefined') return;
  
  // Set up the scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, moleculeContainer.offsetWidth / moleculeContainer.offsetHeight, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(moleculeContainer.offsetWidth, moleculeContainer.offsetHeight);
  moleculeContainer.innerHTML = '';
  moleculeContainer.appendChild(renderer.domElement);
  
  // Create molecule geometry
  const mainSphere = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xE17A92, shininess: 100 })
  );
  scene.add(mainSphere);
  
  // Create orbiting atoms
  const atomMaterial = new THREE.MeshPhongMaterial({ color: 0xFF6B6B, shininess: 80 });
  const atoms = [];
  
  for (let i = 0; i < 5; i++) {
    const atom = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 24, 24),
      atomMaterial
    );
    
    const orbit = new THREE.Object3D();
    const angle = Math.random() * Math.PI * 2;
    const distance = 3 + Math.random() * 2;
    
    atom.position.set(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 3,
      Math.sin(angle) * distance
    );
    
    // Randomize orbit axis
    orbit.rotation.x = Math.random() * Math.PI;
    orbit.rotation.y = Math.random() * Math.PI;
    
    orbit.add(atom);
    scene.add(orbit);
    atoms.push({ orbit, speed: 0.005 + Math.random() * 0.01 });
  }
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Position camera
  camera.position.z = 10;
  
  // Animation function
  const animate = () => {
    requestAnimationFrame(animate);
    
    // Rotate main molecule
    mainSphere.rotation.y += 0.005;
    
    // Rotate orbits
    atoms.forEach(atom => {
      atom.orbit.rotation.y += atom.speed;
      atom.orbit.rotation.x += atom.speed * 0.5;
    });
    
    // Render the scene
    renderer.render(scene, camera);
  };
  
  // Start animation
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = moleculeContainer.offsetWidth / moleculeContainer.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(moleculeContainer.offsetWidth, moleculeContainer.offsetHeight);
  });
  
  // Add interactive rotation
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  
  moleculeContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = {
      x: e.clientX,
      y: e.clientY
    };
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      
      mainSphere.rotation.y += deltaMove.x * 0.01;
      mainSphere.rotation.x += deltaMove.y * 0.01;
      
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

/**
 * Initialize tabs system
 */
function initTabsSystem() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  if (tabButtons.length && tabPanes.length) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Activate target tab
        button.classList.add('active');
        document.getElementById(`tab-${targetTab}`)?.classList.add('active');
      });
    });
  }
}

/**
 * Initialize clinical chart visualization
 */
function initClinicalChart() {
  const chartCanvas = document.getElementById('clinicalChart');
  if (!chartCanvas || typeof Chart === 'undefined') return;
  
  // Chart configuration
  const ctx = chartCanvas.getContext('2d');
  const labels = ['Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12'];
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'With S-Cream',
          data: [45, 76, 125, 162, 215],
          borderColor: 'rgba(225, 122, 146, 0.8)',
          backgroundColor: 'rgba(225, 122, 146, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Without S-Cream (Control)',
          data: [42, 45, 50, 52, 55],
          borderColor: 'rgba(200, 200, 200, 0.5)',
          backgroundColor: 'rgba(200, 200, 200, 0.1)',
          tension: 0.4,
          fill: true,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + '% sensitivity';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sensitivity Increase (%)',
            color: '#666',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        },
        x: {
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
  
  // Animate chart when in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chart.update();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(chartCanvas);
  }
}

/**
 * Initialize video testimonials carousel
 */
function initVideoTestimonials() {
  const carousel = document.getElementById('videoCarousel');
  if (!carousel) return;
  
  const items = carousel.querySelectorAll('.video-item');
  const dots = document.querySelectorAll('#videoDots .video-dot');
  const prevBtn = document.getElementById('videoPrev');
  const nextBtn = document.getElementById('videoNext');
  
  if (!items.length) return;
  
  let currentIndex = 0;
  
  // Function to show specific slide
  const showSlide = (index) => {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    
    // Hide all slides
    items.forEach(item => {
      item.classList.remove('active');
    });
    
    // Update dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show current slide
    items[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    currentIndex = index;
  };
  
  // Event listeners for navigation controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
    });
  }
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });
  
  // Video play buttons
  const playButtons = carousel.querySelectorAll('.video-play-button');
  playButtons.forEach(button => {
    button.addEventListener('click', () => {
      const videoId = button.getAttribute('data-video-id');
      const wrapper = button.closest('.video-wrapper');
      
      if (videoId && wrapper) {
        // Replace thumbnail with embedded video
        wrapper.innerHTML = `
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          ></iframe>
        `;
      }
    });
  });
}

/**
 * Initialize reviews masonry layout
 */
function initReviewsMasonry() {
  const masonry = document.getElementById('reviewsMasonry');
  if (!masonry) return;
  
  // If we have the Masonry library, use it for advanced layout
  if (typeof Masonry !== 'undefined') {
    new Masonry(masonry, {
      itemSelector: '.review-card',
      columnWidth: '.review-card',
      percentPosition: true,
      gutter: 16
    });
  }
}

/**
 * Initialize FAQ accordion
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length) {
    faqQuestions.forEach((question) => {
      const answer = question.nextElementSibling;
      
      // Set initial height to 0 for closed state
      answer.style.maxHeight = '0px';
      
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other questions
        faqQuestions.forEach((q) => {
          if (q !== question) {
            q.setAttribute('aria-expanded', 'false');
            q.nextElementSibling.style.maxHeight = '0px';
          }
        });
        
        // Toggle current question
        question.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0px';
        }
      });
    });
  }
}

/**
 * Initialize countdown timer
 */
function initCountdownTimer() {
  const daysElement = document.getElementById('countdown-days');
  const hoursElement = document.getElementById('countdown-hours');
  const minutesElement = document.getElementById('countdown-minutes');
  const secondsElement = document.getElementById('countdown-seconds');
  
  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;
  
  // Set end date to 2 weeks from now if not stored in localStorage
  let endDate = localStorage.getItem('offerEndDate');
  
  if (!endDate) {
    // Create new end date if not stored
    const now = new Date();
    endDate = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
    localStorage.setItem('offerEndDate', endDate.toString());
  } else {
    endDate = new Date(endDate);
    
    // If offer has expired, reset it
    if (endDate < new Date()) {
      const now = new Date();
      endDate = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
      localStorage.setItem('offerEndDate', endDate.toString());
    }
  }
  
  // Update countdown
  function updateCountdown() {
    const currentTime = new Date();
    const difference = endDate - currentTime;
    
    if (difference <= 0) {
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
  }
  
  // Update countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * Initialize promo code copy functionality
 */
function initPromoCodeCopy() {
  const promoCode = document.getElementById('promoCode');
  const copyButton = document.getElementById('copyPromoButton');
  
  if (promoCode && copyButton) {
    copyButton.addEventListener('click', () => {
      // Create a temporary input element to copy from
      const tempInput = document.createElement('input');
      tempInput.value = promoCode.textContent;
      document.body.appendChild(tempInput);
      
      // Select and copy the content
      tempInput.select();
      document.execCommand('copy');
      
      // Remove the temporary element
      document.body.removeChild(tempInput);
      
      // Visual feedback
      const originalIcon = copyButton.innerHTML;
      copyButton.innerHTML = '<i class="bi bi-check"></i>';
      
      setTimeout(() => {
        copyButton.innerHTML = originalIcon;
      }, 2000);
    });
  }
}

/**
 * Initialize live chat functionality
 */
function initLiveChat() {
  const chatToggle = document.querySelector('.chat-toggle');
  const chatWindow = document.querySelector('.chat-window');
  const chatClose = document.querySelector('.chat-close');
  const chatInput = document.querySelector('.chat-input textarea');
  const sendButton = document.querySelector('.send-button');
  const chatMessages = document.querySelector('.chat-messages');
  
  if (!chatToggle || !chatWindow) return;
  
  // Toggle chat window
  chatToggle?.addEventListener('click', () => {
    const isExpanded = chatToggle.getAttribute('aria-expanded') === 'true';
    chatToggle.setAttribute('aria-expanded', !isExpanded);
    chatWindow.setAttribute('aria-hidden', isExpanded);
    
    if (!isExpanded) {
      // Focus on input when opening chat
      setTimeout(() => {
        if (chatInput) chatInput.focus();
      }, 300);
    }
  });
  
  // Close chat window
  chatClose?.addEventListener('click', () => {
    chatToggle.setAttribute('aria-expanded', 'false');
    chatWindow.setAttribute('aria-hidden', 'true');
  });
  
  // Send message functionality
  if (sendButton && chatInput && chatMessages) {
    const sendMessage = () => {
      const message = chatInput.value.trim();
      
      if (message) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = 'Just now';
        
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTime);
        
        // Add to chat
        chatMessages.appendChild(messageElement);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after delay
        setTimeout(() => {
          const responseElement = document.createElement('div');
          responseElement.className = 'message received';
          
          const responseContent = document.createElement('div');
          responseContent.className = 'message-content';
          responseContent.textContent = "Thanks for your message! I'll help you find the perfect S-Cream formula for your needs. Could you tell me what specific benefits you're looking for?";
          
          const responseTime = document.createElement('div');
          responseTime.className = 'message-time';
          responseTime.textContent = 'Just now';
          
          responseElement.appendChild(responseContent);
          responseElement.appendChild(responseTime);
          
          chatMessages.appendChild(responseElement);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
      }
    };
    
    // Send on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send on Enter key (allow Shift+Enter for new line)
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = (chatInput.scrollHeight < 100) ? chatInput.scrollHeight + 'px' : '100px';
    });
  }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Initialize cookie consent banner
 */
function initCookieConsent() {
  const cookieConsent = document.getElementById('cookieConsent');
  if (!cookieConsent) return;
  
  const acceptButton = cookieConsent.querySelector('.cookie-accept');
  const settingsButton = cookieConsent.querySelector('.cookie-settings');
  
  // Check if user has already accepted cookies
  const cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
  
  if (!cookiesAccepted) {
    // Show cookie banner after a delay
    setTimeout(() => {
      cookieConsent.classList.add('visible');
    }, 2000);
  }
  
  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.classList.remove('visible');
    });
  }
  
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      // Here you would open a cookie settings modal instead
      // For simplicity, we'll just accept cookies
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.classList.remove('visible');
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initialize particles.js effect
 */
function initParticles() {
  if (typeof particlesJS === 'undefined' || !document.getElementById('particles-js')) return;
  
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { 
        type: "circle", 
        stroke: { width: 0, color: "#000000" }
      },
      opacity: {
        value: 0.3,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "bubble" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        bubble: { distance: 200, size: 4, duration: 2, opacity: 0.8, speed: 3 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}
