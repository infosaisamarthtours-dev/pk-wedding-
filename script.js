/**
 * Purushothaman & Kanchana - Royal Wedding Invitation Script
 * Full interactivity: Audio Raag Synthesizer, Live Countdown, Interactive Guestbook,
 * Canvas Sparkles/Petals, Lightbox, Add to Calendar, and WhatsApp Share.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Live Wedding Countdown (Target: Nov 11, 2026, 06:00 AM IST)
     ========================================================================== */
  const weddingDate = new Date('2026-11-11T06:00:00+05:30').getTime();
  
  const heroCountdownText = document.getElementById('heroCountdownText');
  const countDays = document.getElementById('countDays');
  const countHours = document.getElementById('countHours');
  const countMins = document.getElementById('countMins');
  const countSecs = document.getElementById('countSecs');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (heroCountdownText) {
        heroCountdownText.textContent = `${days} Days to Go`;
      }
      if (countDays) countDays.textContent = String(days).padStart(3, '0');
      if (countHours) countHours.textContent = String(hours).padStart(2, '0');
      if (countMins) countMins.textContent = String(minutes).padStart(2, '0');
      if (countSecs) countSecs.textContent = String(seconds).padStart(2, '0');
    } else {
      if (heroCountdownText) heroCountdownText.textContent = 'Today is the Day!';
      if (countDays) countDays.textContent = '000';
      if (countHours) countHours.textContent = '00';
      if (countMins) countMins.textContent = '00';
      if (countSecs) countSecs.textContent = '00';
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     2. Top Navigation Bar & Scroll Spy
     ========================================================================== */
  const topNavBar = document.getElementById('topNavBar');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (topNavBar) {
      if (window.scrollY > 40) {
        topNavBar.classList.add('scrolled');
      } else {
        topNavBar.classList.remove('scrolled');
      }
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  /* ==========================================================================
     3. Floating Golden Sparkles & Floating Floral Petals Canvas
     ========================================================================== */
  const canvas = document.getElementById('sparklesCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 40;

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // random initial distribution
    }

    reset() {
      this.isPetal = Math.random() > 0.65;
      this.x = Math.random() * width;
      this.y = -10;
      this.size = this.isPetal ? (Math.random() * 4 + 3) : (Math.random() * 2.2 + 0.8);
      this.speedY = this.isPetal ? (Math.random() * 0.9 + 0.4) : (Math.random() * 0.5 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.alpha = Math.random() * 0.5 + 0.3;
      // Soft sage & emerald petals and radiant gold dust
      if (this.isPetal) {
        this.color = Math.random() > 0.5 ? 'rgba(46, 109, 76,' : 'rgba(88, 148, 118,';
      } else {
        this.color = Math.random() > 0.3 ? 'rgba(184, 134, 11,' : 'rgba(218, 165, 32,';
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isPetal) {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#fbe38e';
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ==========================================================================
     4. Royal Indian Wedding Melody Synthesizer (Raag Mohanam / Bhupali Harmony)
     Uses Web Audio API to produce traditional Indian flute / harp acoustic notes
     ========================================================================== */
  let audioCtx = null;
  let isPlaying = false;
  let melodyInterval = null;
  let noteIndex = 0;

  // Raag Mohanam / Kalyani Pentatonic Swaras (Sa, Ri2, Ga3, Pa, Dha2)
  const mohanamMelody = [
    261.63, 293.66, 329.63, 392.00, 440.00,
    523.25, 440.00, 392.00, 329.63, 293.66,
    329.63, 392.00, 523.25, 587.33, 523.25,
    440.00, 392.00, 329.63, 293.66, 261.63
  ];

  function playAcousticNote(freq, duration = 1.4) {
    if (!audioCtx) return;
    try {
      // Primary flute oscillator
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();

      // Soft harmonic overtone (tanpura shimmer)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, audioCtx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);

      // Envelope: gentle attack, resonant sustain, peaceful fade
      gain1.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.075, audioCtx.currentTime + 0.15);
      gain1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      gain2.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.02, audioCtx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration * 0.8);

      osc1.connect(gain1);
      osc2.connect(gain2);

      gain1.connect(audioCtx.destination);
      gain2.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      osc1.stop(audioCtx.currentTime + duration);
      osc2.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback note error:', e);
    }
  }

  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');

  function toggleMusic() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlaying) {
      isPlaying = true;
      musicToggleBtn.classList.add('playing');
      musicIcon.className = 'fa-solid fa-volume-high';
      showToast('🎵 Playing Auspicious Wedding Melodies');

      playAcousticNote(mohanamMelody[noteIndex]);
      melodyInterval = setInterval(() => {
        noteIndex = (noteIndex + 1) % mohanamMelody.length;
        playAcousticNote(mohanamMelody[noteIndex]);
      }, 760);
    } else {
      isPlaying = false;
      clearInterval(melodyInterval);
      musicToggleBtn.classList.remove('playing');
      musicIcon.className = 'fa-solid fa-volume-xmark';
      showToast('Music Paused');
    }
  }

  if (musicToggleBtn) musicToggleBtn.addEventListener('click', toggleMusic);

  /* ==========================================================================
     5. Add to Calendar (.ics Generator & Google Calendar Link)
     ========================================================================== */
  function handleAddToCalendar() {
    const title = encodeURIComponent("Wedding: Purushothaman & Kanchana");
    const details = encodeURIComponent("With immense joy and the blessings of our families, we cordially invite you to celebrate the wedding celebrations of Purushothaman & Kanchana.\n\n• Grand Reception: Tuesday, 10th November 2026 (6:30 PM Onwards at Royal Marriage Hall)\n• Auspicious Muhurtham: Wednesday, 11th November 2026 (6:00 AM - 7:30 AM at Sri Karumariamman Temple)");
    const location = encodeURIComponent("Sri Karumariamman Temple & Royal Marriage Hall, Tiruvannamalai, Tamil Nadu");
    const dates = "20261110T130000Z/20261111T083000Z";

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

    // Generate .ics file for offline/Apple Calendar import
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'SUMMARY:Wedding of Purushothaman & Kanchana',
      'DESCRIPTION:Grand Reception: 10th Nov 2026 (6:30 PM) | Auspicious Muhurtham: 11th Nov 2026 (6:00 AM - 7:30 AM)',
      'LOCATION:Sri Karumariamman Temple & Royal Marriage Hall, Tiruvannamalai, Tamil Nadu',
      'DTSTART:20261110T130000Z',
      'DTEND:20261111T083000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Purushothaman_Kanchana_Wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Also open Google Calendar in new tab
    window.open(gcalUrl, '_blank');
    showToast('📅 Added to Calendar!');
  }

  const addToCalMainBtn = document.getElementById('addToCalMainBtn');
  const addCalendarFooterBtn = document.getElementById('addCalendarFooterBtn');
  if (addToCalMainBtn) addToCalMainBtn.addEventListener('click', handleAddToCalendar);
  if (addCalendarFooterBtn) addCalendarFooterBtn.addEventListener('click', handleAddToCalendar);

  /* ==========================================================================
     6. WhatsApp Share Integration
     ========================================================================== */
  function shareOnWhatsApp() {
    const message = encodeURIComponent(
      `🌺 *WEDDING INVITATION* 🌺\n\n` +
      `With immense joy and family blessings, we invite you to celebrate the marriage of:\n\n` +
      `✨ *PURUSHOTHAMAN & KANCHANA* ✨\n\n` +
      `🎉 *Grand Reception:* Tuesday, 10th November 2026 (6:30 PM Onwards at Royal Marriage Hall)\n` +
      `⏰ *Auspicious Muhurtham:* Wednesday, 11th November 2026 (6:00 AM – 7:30 AM at Sri Karumariamman Temple)\n` +
      `📍 *Location:* Tiruvannamalai, Tamil Nadu\n\n` +
      `Please join us and shower your warm blessings! ❤️`
    );

    const waUrl = `https://api.whatsapp.com/send?text=${message}`;
    window.open(waUrl, '_blank');
    showToast('💬 Opening WhatsApp Share');
  }

  const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
  const shareWhatsappFooterBtn = document.getElementById('shareWhatsappFooterBtn');
  if (shareWhatsappBtn) shareWhatsappBtn.addEventListener('click', shareOnWhatsApp);
  if (shareWhatsappFooterBtn) shareWhatsappFooterBtn.addEventListener('click', shareOnWhatsApp);

  /* ==========================================================================
     7. Copy Venue Address to Clipboard
     ========================================================================== */
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = "Royal Palace Convention Hall, Main Highway Junction, Bypass Road, Opposite Sacred Temple Gardens, Tamil Nadu";
      navigator.clipboard.writeText(address).then(() => {
        showToast('📋 Address copied to clipboard!');
      }).catch(() => {
        showToast('Address: Royal Palace Convention Hall, Tamil Nadu');
      });
    });
  }

  /* ==========================================================================
     8. Download Untouched Hero Image Poster
     ========================================================================== */
  const downloadHeroCardBtn = document.getElementById('downloadHeroCardBtn');
  if (downloadHeroCardBtn) {
    downloadHeroCardBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'hero-image.jpg';
      link.download = 'Purushothaman_Kanchana_SaveTheDate.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('💾 Save the Date image downloaded!');
    });
  }

  /* ==========================================================================
     9. Interactive Wall of Blessings & Guestbook
     ========================================================================== */
  const initialWishes = [
    {
      name: "S. Venkatesh & Family",
      attendance: "Joyfully Attending",
      message: "Wishing Purushothaman & Kanchana a lifetime filled with boundless love, great laughter, and abundant prosperity! Can't wait to celebrate!",
      time: "2 hours ago",
      likes: 12
    },
    {
      name: "Anitha & Karthik",
      attendance: "Joyfully Attending",
      message: "Heartiest congratulations to the beautiful couple! May god bless you both with immense happiness on this sacred union.",
      time: "Yesterday",
      likes: 9
    },
    {
      name: "Ramesh Kumar (Bangalore)",
      attendance: "Blessings from Afar",
      message: "Warmest wishes to Purushothaman and Kanchana! May your holy bond grow stronger with each passing day. Our love and prayers are always with you.",
      time: "2 days ago",
      likes: 7
    }
  ];

  const STORAGE_KEY = 'pk_wedding_wishes_v1';
  let storedWishes = [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      storedWishes = JSON.parse(raw);
    } else {
      storedWishes = [...initialWishes];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedWishes));
    }
  } catch (e) {
    storedWishes = [...initialWishes];
  }

  const wishesListContainer = document.getElementById('wishesListContainer');
  const wishesCount = document.getElementById('wishesCount');
  const publicWishesForm = document.getElementById('publicWishesForm');

  function renderWishes() {
    if (!wishesListContainer) return;
    wishesListContainer.innerHTML = '';
    if (wishesCount) wishesCount.textContent = storedWishes.length;

    storedWishes.forEach((w, idx) => {
      const wishItem = document.createElement('div');
      wishItem.className = 'wish-item';
      wishItem.innerHTML = `
        <div class="wish-item-header">
          <span class="wish-sender">${escapeHtml(w.name)}</span>
          <span class="wish-time">${w.time}</span>
        </div>
        <div class="wish-attendance-tag">
          <i class="fa-solid fa-heart"></i> ${escapeHtml(w.attendance)}
        </div>
        <p class="wish-body">"${escapeHtml(w.message)}"</p>
        <div class="wish-footer">
          <button class="wish-like-btn" data-index="${idx}">
            <i class="fa-solid fa-heart"></i> <span>${w.likes || 1}</span>
          </button>
        </div>
      `;
      wishesListContainer.appendChild(wishItem);
    });

    // Add like listeners
    document.querySelectorAll('.wish-like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        if (storedWishes[index]) {
          storedWishes[index].likes = (storedWishes[index].likes || 0) + 1;
          saveAndRenderWishes();
          showToast('❤️ Blessing liked!');
        }
      });
    });
  }

  function saveAndRenderWishes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedWishes));
    } catch (e) {}
    renderWishes();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderWishes();

  if (publicWishesForm) {
    publicWishesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('wishesGuestName').value.trim();
      const guestAttendance = document.getElementById('wishesAttendance').value;
      const guestMessage = document.getElementById('wishesMessage').value.trim();

      if (!guestName || !guestMessage) return;

      const newWish = {
        name: guestName,
        attendance: guestAttendance,
        message: guestMessage,
        time: "Just now",
        likes: 1
      };

      storedWishes.unshift(newWish);
      saveAndRenderWishes();
      publicWishesForm.reset();
      showToast(`💐 Thank you ${guestName}, your blessing is posted!`);
    });
  }

  /* ==========================================================================
     10. RSVP Modal Handling
     ========================================================================== */
  const rsvpModal = document.getElementById('rsvpModal');
  const closeRsvpBtn = document.getElementById('closeRsvpBtn');
  const navRsvpBtn = document.getElementById('navRsvpBtn');
  const openRsvpHeroBtn = document.getElementById('openRsvpHeroBtn');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccessBox = document.getElementById('rsvpSuccessBox');

  function openRsvpModal() {
    if (rsvpModal) {
      rsvpModal.classList.add('active');
      if (rsvpForm) rsvpForm.style.display = 'block';
      if (rsvpSuccessBox) rsvpSuccessBox.classList.remove('active');
    }
  }

  function closeRsvpModal() {
    if (rsvpModal) rsvpModal.classList.remove('active');
  }

  if (navRsvpBtn) navRsvpBtn.addEventListener('click', openRsvpModal);
  if (openRsvpHeroBtn) openRsvpHeroBtn.addEventListener('click', openRsvpModal);
  if (closeRsvpBtn) closeRsvpBtn.addEventListener('click', closeRsvpModal);

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) closeRsvpModal();
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('modalGuestName').value.trim();
      const guestStatus = document.getElementById('modalGuestStatus').value;
      const guestMessage = document.getElementById('modalGuestMessage').value.trim();

      if (guestMessage) {
        storedWishes.unshift({
          name: guestName,
          attendance: guestStatus === 'Yes' ? 'Joyfully Attending' : 'Blessings from Afar',
          message: guestMessage,
          time: 'Just now',
          likes: 1
        });
        saveAndRenderWishes();
      }

      rsvpForm.style.display = 'none';
      if (rsvpSuccessBox) rsvpSuccessBox.classList.add('active');
      showToast(`❤️ Thank you, ${guestName}!`);
    });
  }

  /* ==========================================================================
     11. Royal Moments Photo Carousel (Left & Right Scrollable) & Clean Lightbox
     ========================================================================== */
  const galleryTrack = document.getElementById('galleryCarouselTrack');
  const scrollLeftBtn = document.getElementById('galleryScrollLeft');
  const scrollRightBtn = document.getElementById('galleryScrollRight');
  const carouselCards = Array.from(document.querySelectorAll('.gallery-carousel-card'));
  const galleryDots = Array.from(document.querySelectorAll('.gallery-dot'));
  
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  // Left & Right Scroll Buttons
  if (scrollLeftBtn && galleryTrack) {
    scrollLeftBtn.addEventListener('click', () => {
      const card = galleryTrack.querySelector('.gallery-carousel-card');
      const step = card ? card.offsetWidth + 20 : 280;
      galleryTrack.scrollBy({ left: -step, behavior: 'smooth' });
    });
  }

  if (scrollRightBtn && galleryTrack) {
    scrollRightBtn.addEventListener('click', () => {
      const card = galleryTrack.querySelector('.gallery-carousel-card');
      const step = card ? card.offsetWidth + 20 : 280;
      galleryTrack.scrollBy({ left: step, behavior: 'smooth' });
    });
  }

  // Update Active Pagination Dot on Scroll
  function updateActiveGalleryDot() {
    if (!galleryTrack || !carouselCards.length) return;
    const trackCenter = galleryTrack.scrollLeft + galleryTrack.clientWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    carouselCards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const diff = Math.abs(trackCenter - cardCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    galleryDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === closestIdx);
    });
  }

  if (galleryTrack) {
    let scrollDebounce;
    galleryTrack.addEventListener('scroll', () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(updateActiveGalleryDot, 60);
    }, { passive: true });

    // Smooth Desktop Drag-to-Scroll
    let isMouseDown = false;
    let dragStartX = 0;
    let initialScrollLeft = 0;
    let hasDragged = false;

    galleryTrack.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      hasDragged = false;
      dragStartX = e.pageX - galleryTrack.offsetLeft;
      initialScrollLeft = galleryTrack.scrollLeft;
      galleryTrack.style.cursor = 'grabbing';
      galleryTrack.style.scrollSnapType = 'none'; // Temporarily disable snapping during drag
    });

    window.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      if (galleryTrack) {
        galleryTrack.style.cursor = '';
        galleryTrack.style.scrollSnapType = 'x mandatory';
      }
    });

    galleryTrack.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      const x = e.pageX - galleryTrack.offsetLeft;
      const walk = (x - dragStartX);
      if (Math.abs(walk) > 6) {
        hasDragged = true;
      }
      galleryTrack.scrollLeft = initialScrollLeft - walk;
    });

    // Prevent click on drag
    carouselCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (hasDragged) {
          e.stopPropagation();
          e.preventDefault();
        }
      });
    });
  }

  // Dot Navigation Clicks
  galleryDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      if (carouselCards[idx]) {
        carouselCards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  });

  // Clean Fullscreen Lightbox Modal (Pure High-Res Photos)
  let currentLightboxIdx = 0;

  function updateLightbox(index) {
    if (!carouselCards.length) return;
    if (index < 0) index = carouselCards.length - 1;
    if (index >= carouselCards.length) index = 0;
    currentLightboxIdx = index;

    const card = carouselCards[currentLightboxIdx];
    const img = card.querySelector('img');

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || `Wedding Photo ${index + 1}`;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${carouselCards.length}`;
    }
  }

  carouselCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      updateLightbox(idx);
      if (lightboxModal) {
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(currentLightboxIdx - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(currentLightboxIdx + 1);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-backdrop') || e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(currentLightboxIdx - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentLightboxIdx + 1);
  });

  /* ==========================================================================
     12. Toast Notification Bubble
     ========================================================================== */
  const toastBubble = document.getElementById('toastBubble');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  function showToast(msg) {
    if (!toastBubble || !toastText) return;
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = msg;
    toastBubble.classList.add('show');
    toastTimer = setTimeout(() => {
      toastBubble.classList.remove('show');
    }, 3200);
  }

  /* ==========================================================================
     13. Welcome Section & Viewport Fade-In Animations
     ========================================================================== */
  const welcomeSection = document.getElementById('welcomeSection');
  if (welcomeSection) {
    const rect = welcomeSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      welcomeSection.classList.add('in-view');
    } else if ('IntersectionObserver' in window) {
      const welcomeObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            welcomeSection.classList.add('in-view');
            obs.unobserve(welcomeSection);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      });
      welcomeObserver.observe(welcomeSection);
    } else {
      welcomeSection.classList.add('in-view');
    }
  }

  // Royal Welcome Language Switcher Tabs
  const welcomeTabBtns = document.querySelectorAll('.welcome-lang-tab-btn');
  const welcomePanes = document.querySelectorAll('.welcome-lang-pane');
  const welcomeViewport = document.getElementById('welcomeContentViewport');

  welcomeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      welcomeTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (lang === 'both') {
        welcomePanes.forEach(pane => pane.classList.add('active'));
        if (welcomeViewport) welcomeViewport.classList.add('dual-mode');
      } else {
        if (welcomeViewport) welcomeViewport.classList.remove('dual-mode');
        welcomePanes.forEach(pane => {
          if (pane.id === (lang === 'en' ? 'paneLangEn' : 'paneLangTa')) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      }
    });
  });

  /* ==========================================================================
     14. Interactive 3-Stop Wedding Map & Dynamic Route Calculator
     ========================================================================== */
  const mapElement = document.getElementById('interactiveWeddingMap');
  
  if (mapElement && typeof L !== 'undefined') {
    // Default 3 Locations
    let stops = {
      home: {
        name: "Groom's Home Residence",
        lat: 12.207556,
        lng: 79.079556,
        type: 'home',
        iconClass: 'fa-solid fa-house-chimney',
        addressDesc: "12°12'27.2\"N 79°04'46.4\"E"
      },
      tvm: {
        name: "Tiruvannamalai Town Center",
        lat: 12.229400,
        lng: 79.067300,
        type: 'tvm',
        iconClass: 'fa-solid fa-landmark-dome',
        addressDesc: "12°13'46.0\"N 79°04'02.0\"E"
      },
      hall: {
        name: "Royal Marriage Hall",
        lat: 12.223389,
        lng: 79.074833,
        type: 'hall',
        iconClass: 'fa-solid fa-bell-concierge',
        addressDesc: "12°13'24.2\"N 79°04'29.4\"E"
      }
    };

    // Initialize Leaflet Map
    const map = L.map('interactiveWeddingMap', {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView([12.218, 79.073], 13);

    // Add High-Quality Free OpenStreetMap Tiles (No API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    let markers = {};
    let activeRouteLayer = null;
    let cachedRoutes = {};
    let currentSelectedRoute = 'complete';

    // Helper to create custom HTML pin markers
    function createCustomMarker(key, stop) {
      const iconHtml = `<div class="custom-wedding-marker ${stop.type}">
        <i class="${stop.iconClass}"></i>
      </div>`;
      
      const customIcon = L.divIcon({
        className: 'wedding-marker-container',
        html: iconHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: Montserrat, sans-serif; padding: 4px 6px; text-align: center;">
          <strong style="color: #163624; font-size: 13px;">${stop.name}</strong><br>
          <span style="font-size: 11px; color: #5a7d69;">${stop.addressDesc}</span>
        </div>
      `);
      return marker;
    }

    function renderMarkers() {
      // Clear existing markers if any
      Object.values(markers).forEach(m => map.removeLayer(m));
      markers = {
        home: createCustomMarker('home', stops.home),
        tvm: createCustomMarker('tvm', stops.tvm),
        hall: createCustomMarker('hall', stops.hall)
      };
    }

    renderMarkers();

    // Haversine fallback distance calculation in case of network issue
    function calculateHaversineKm(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c * 1.25; // 1.25 road winding factor
    }

    // Dynamic OSRM API Route Fetcher
    async function fetchOsrmRoute(coordsArray) {
      const coordString = coordsArray.map(c => `${c[1]},${c[0]}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('OSRM routing response failed');
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          return {
            distanceKm: (route.distance / 1000).toFixed(2),
            durationMins: Math.max(1, Math.round(route.duration / 60)),
            coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]),
            isLive: true
          };
        }
      } catch (err) {
        console.warn('Live routing fallback engaged:', err);
      }

      // Safe road network fallback calculation
      let totalDist = 0;
      for (let i = 0; i < coordsArray.length - 1; i++) {
        totalDist += calculateHaversineKm(coordsArray[i][0], coordsArray[i][1], coordsArray[i+1][0], coordsArray[i+1][1]);
      }
      return {
        distanceKm: totalDist.toFixed(2),
        durationMins: Math.max(1, Math.round((totalDist / 35) * 60)),
        coordinates: coordsArray,
        isLive: false
      };
    }

    // Route Definitions
    function getRouteCoords(routeType) {
      if (routeType === 'home-tvm') {
        return {
          title: "Stop 1: Home → Stop 2: Tiruvannamalai",
          stopsCount: 2,
          summary: "Home ➔ Tiruvannamalai",
          coords: [[stops.home.lat, stops.home.lng], [stops.tvm.lat, stops.tvm.lng]],
          origin: `${stops.home.lat},${stops.home.lng}`,
          destination: `${stops.tvm.lat},${stops.tvm.lng}`,
          waypoints: null,
          stepperState: [true, true, false]
        };
      } else if (routeType === 'tvm-hall') {
        return {
          title: "Stop 2: Tiruvannamalai → Stop 3: Marriage Hall",
          stopsCount: 2,
          summary: "Tiruvannamalai ➔ Marriage Hall",
          coords: [[stops.tvm.lat, stops.tvm.lng], [stops.hall.lat, stops.hall.lng]],
          origin: `${stops.tvm.lat},${stops.tvm.lng}`,
          destination: `${stops.hall.lat},${stops.hall.lng}`,
          waypoints: null,
          stepperState: [false, true, true]
        };
      } else if (routeType === 'home-hall') {
        return {
          title: "Direct Route: Home → Marriage Hall",
          stopsCount: 2,
          summary: "Home ➔ Marriage Hall (Direct)",
          coords: [[stops.home.lat, stops.home.lng], [stops.hall.lat, stops.hall.lng]],
          origin: `${stops.home.lat},${stops.home.lng}`,
          destination: `${stops.hall.lat},${stops.hall.lng}`,
          waypoints: null,
          stepperState: [true, false, true]
        };
      } else {
        // Complete Journey (Default)
        return {
          title: "Complete Journey: Home → Tiruvannamalai → Marriage Hall",
          stopsCount: 3,
          summary: "Home ➔ Tiruvannamalai ➔ Marriage Hall",
          coords: [[stops.home.lat, stops.home.lng], [stops.tvm.lat, stops.tvm.lng], [stops.hall.lat, stops.hall.lng]],
          origin: `${stops.home.lat},${stops.home.lng}`,
          destination: `${stops.hall.lat},${stops.hall.lng}`,
          waypoints: `${stops.tvm.lat},${stops.tvm.lng}`,
          stepperState: [true, true, true]
        };
      }
    }

    // Load and Display a Selected Route
    async function selectRoute(routeType) {
      currentSelectedRoute = routeType;
      const def = getRouteCoords(routeType);

      // Update UI Header & Stepper
      const activeRouteName = document.getElementById('activeRouteName');
      const routeStopsDisplay = document.getElementById('routeStopsDisplay');
      const routeStopsSummary = document.getElementById('routeStopsSummary');
      const routeDistanceDisplay = document.getElementById('routeDistanceDisplay');
      const routeDurationDisplay = document.getElementById('routeDurationDisplay');
      const routeApiBadge = document.getElementById('routeApiBadge');

      if (activeRouteName) activeRouteName.textContent = def.title;
      if (routeStopsDisplay) routeStopsDisplay.textContent = def.stopsCount;
      if (routeStopsSummary) routeStopsSummary.textContent = def.summary;

      // Update Stepper Nodes
      ['stepNode1', 'stepNode2', 'stepNode3'].forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) {
          if (def.stepperState[idx]) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        }
      });

      // Update Google Maps Buttons
      const routeDirectionsBtn = document.getElementById('routeDirectionsBtn');
      const routeOpenGmapsBtn = document.getElementById('routeOpenGmapsBtn');

      if (routeDirectionsBtn) {
        let gmapsDirUrl = `https://www.google.com/maps/dir/?api=1&origin=${def.origin}&destination=${def.destination}&travelmode=driving`;
        if (def.waypoints) {
          gmapsDirUrl += `&waypoints=${def.waypoints}`;
        }
        routeDirectionsBtn.href = gmapsDirUrl;
      }

      if (routeOpenGmapsBtn) {
        routeOpenGmapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${def.destination}`;
      }

      // Fetch or use cached route data
      if (routeDistanceDisplay) routeDistanceDisplay.textContent = '...';
      if (routeDurationDisplay) routeDurationDisplay.textContent = '...';

      let routeData = cachedRoutes[routeType];
      if (!routeData) {
        routeData = await fetchOsrmRoute(def.coords);
        cachedRoutes[routeType] = routeData;
      }

      if (routeDistanceDisplay) routeDistanceDisplay.textContent = routeData.distanceKm;
      if (routeDurationDisplay) routeDurationDisplay.textContent = `~${routeData.durationMins}`;
      if (routeApiBadge) {
        routeApiBadge.textContent = routeData.isLive 
          ? "Dynamic Road Routing via OSRM"
          : "Estimated Road Travel Route";
      }

      // Draw Polyline on Map
      if (activeRouteLayer) {
        map.removeLayer(activeRouteLayer);
      }

      activeRouteLayer = L.polyline(routeData.coordinates, {
        color: '#b8860b',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Fit map bounds smoothly
      try {
        map.fitBounds(activeRouteLayer.getBounds(), {
          padding: [45, 45],
          maxZoom: 15,
          animate: true
        });
      } catch (e) {
        // Fallback view if bounds error
        map.setView([12.218, 79.073], 13);
      }
    }

    // Attach Tab Event Handlers
    const tabButtons = document.querySelectorAll('.route-tab-btn[data-route]');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const route = btn.getAttribute('data-route');
        selectRoute(route);
      });
    });

    // Initial Route Selection
    selectRoute('complete');

    // Toggle Address Editor Drawer
    const toggleEditorBtn = document.getElementById('toggleEditorBtn');
    const addressEditorDrawer = document.getElementById('addressEditorDrawer');

    if (toggleEditorBtn && addressEditorDrawer) {
      toggleEditorBtn.addEventListener('click', () => {
        const isHidden = addressEditorDrawer.style.display === 'none';
        addressEditorDrawer.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          addressEditorDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    // Coordinate / Address parsing helper
    function parseCoordString(val, fallback) {
      if (!val) return fallback;
      const parts = val.split(',').map(s => parseFloat(s.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { lat: parts[0], lng: parts[1] };
      }
      return fallback;
    }

    // Apply Custom Coordinates Button
    const applyCustomCoordsBtn = document.getElementById('applyCustomCoordsBtn');
    const resetDefaultCoordsBtn = document.getElementById('resetDefaultCoordsBtn');
    const editorFeedbackMsg = document.getElementById('editorFeedbackMsg');

    if (applyCustomCoordsBtn) {
      applyCustomCoordsBtn.addEventListener('click', () => {
        const homeVal = document.getElementById('inputHomeCoords')?.value;
        const tvmVal = document.getElementById('inputTvmCoords')?.value;
        const hallVal = document.getElementById('inputHallCoords')?.value;

        const pHome = parseCoordString(homeVal, { lat: stops.home.lat, lng: stops.home.lng });
        const pTvm = parseCoordString(tvmVal, { lat: stops.tvm.lat, lng: stops.tvm.lng });
        const pHall = parseCoordString(hallVal, { lat: stops.hall.lat, lng: stops.hall.lng });

        stops.home.lat = pHome.lat; stops.home.lng = pHome.lng;
        stops.tvm.lat = pTvm.lat; stops.tvm.lng = pTvm.lng;
        stops.hall.lat = pHall.lat; stops.hall.lng = pHall.lng;

        // Clear route cache and re-render
        cachedRoutes = {};
        renderMarkers();
        selectRoute(currentSelectedRoute);

        if (editorFeedbackMsg) {
          editorFeedbackMsg.className = 'editor-feedback-msg success';
          editorFeedbackMsg.textContent = '✓ Locations updated! Routes and live distances recalculated successfully.';
        }
        showToast('✓ Route & distances recalculated!');
      });
    }

    if (resetDefaultCoordsBtn) {
      resetDefaultCoordsBtn.addEventListener('click', () => {
        stops.home.lat = 12.207556; stops.home.lng = 79.079556;
        stops.tvm.lat = 12.229400; stops.tvm.lng = 79.067300;
        stops.hall.lat = 12.223389; stops.hall.lng = 79.074833;

        const inHome = document.getElementById('inputHomeCoords');
        const inTvm = document.getElementById('inputTvmCoords');
        const inHall = document.getElementById('inputHallCoords');

        if (inHome) inHome.value = "12.207556, 79.079556";
        if (inTvm) inTvm.value = "12.229400, 79.067300";
        if (inHall) inHall.value = "12.223389, 79.074833";

        cachedRoutes = {};
        renderMarkers();
        selectRoute(currentSelectedRoute);

        if (editorFeedbackMsg) {
          editorFeedbackMsg.className = 'editor-feedback-msg success';
          editorFeedbackMsg.textContent = '✓ Default coordinates restored.';
        }
        showToast('✓ Restored default stop coordinates');
      });
    }
  }

  /* ==========================================================================
     15. Quick Navigation to Venues & Location Section
     ========================================================================== */
  const locationBtns = document.querySelectorAll('#navLocationBtn, #floatingLocationBtn');
  locationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const venuesSection = document.getElementById('venuesSection');
      if (venuesSection) {
        const navBar = document.getElementById('topNavBar');
        const navHeight = navBar ? navBar.offsetHeight : 70;
        const targetPos = venuesSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 15;
        
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        venuesSection.classList.add('venues-highlight-glow');
        setTimeout(() => {
          venuesSection.classList.remove('venues-highlight-glow');
        }, 2400);

        showToast('📍 Wedding Venues & Route Guide');
      }
    });
  });

  /* ==========================================================================
     16. Sri Karumariamman Temple Map Preview Drawer Toggle
     ========================================================================== */
  const toggleTempleMapBtn = document.getElementById('toggleTempleMapBtn');
  const templeMapDrawer = document.getElementById('templeMapDrawer');
  const templeMapBtnText = document.getElementById('templeMapBtnText');
  const templeMapIcon = document.getElementById('templeMapIcon');

  if (toggleTempleMapBtn && templeMapDrawer) {
    toggleTempleMapBtn.addEventListener('click', () => {
      const isHidden = templeMapDrawer.style.display === 'none';
      if (isHidden) {
        templeMapDrawer.style.display = 'block';
        toggleTempleMapBtn.setAttribute('aria-expanded', 'true');
        if (templeMapBtnText) templeMapBtnText.textContent = 'Hide Map Preview';
        if (templeMapIcon) templeMapIcon.className = 'fa-solid fa-eye-slash';
        showToast('📍 Map preview opened');
      } else {
        templeMapDrawer.style.display = 'none';
        toggleTempleMapBtn.setAttribute('aria-expanded', 'false');
        if (templeMapBtnText) templeMapBtnText.textContent = 'View Map Location';
        if (templeMapIcon) templeMapIcon.className = 'fa-solid fa-map-location-dot';
      }
    });
  }

  /* ==========================================================================
     17. Floating Corner Location Button Smooth Navigation
     ========================================================================== */
  const cornerLocationBtn = document.getElementById('cornerLocationBtn');
  if (cornerLocationBtn) {
    cornerLocationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSec = document.getElementById('venuesSection');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetSec.classList.add('venues-highlight-glow');
        setTimeout(() => targetSec.classList.remove('venues-highlight-glow'), 2500);
        showToast('📍 Navigated to Wedding Venues & Map');
      }
    });
  }

});
