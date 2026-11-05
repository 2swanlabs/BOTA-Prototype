/* =========================================================
   BAJWA OUTPLAY TENNIS ACADEMY — SCRIPT (rebuilt)
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  if (header) {
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }

  /* ---------- Mobile menu toggle ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('siteNav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    /* Close mobile menu after a link is clicked (but toggle Programs submenu instead) */
    nav.querySelectorAll('.nav-list > li > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var parentLi = link.parentElement;
        if (parentLi.classList.contains('has-dropdown') && window.innerWidth <= 960) {
          e.preventDefault();
          parentLi.classList.toggle('open');
          return;
        }
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  /* ---------- Scrollspy: highlight active nav link ---------- */
  var sections = ['home', 'about', 'sports', 'programs', 'coaches', 'facilities', 'gallery']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('.nav-list > li > a')) : [];

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Newsletter form ---------- */
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterMsg = document.getElementById('newsletterMsg');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        newsletterMsg.textContent = 'Thanks for subscribing! Watch your inbox for academy updates.';
        newsletterForm.reset();
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Reveal floating actions once Sports section is reached,
     and auto-open the WhatsApp booking panel the first time ---------- */
  var floatingActions = document.getElementById('floatingActions');
  var sportsSection = document.getElementById('sports');
  if (floatingActions && sportsSection) {
    var floatingRevealed = false;
    function checkFloatingActionsVisibility() {
      if (floatingRevealed) return;
      var triggerPoint = sportsSection.offsetTop - (window.innerHeight * 0.6);
      if (window.scrollY >= triggerPoint) {
        floatingActions.classList.add('visible');
        floatingRevealed = true;
        window.removeEventListener('scroll', checkFloatingActionsVisibility);
        setTimeout(function () {
          if (waToggle && waPanel && !waPanel.classList.contains('open')) {
            openWaPanel();
          }
        }, 500);
      }
    }
    checkFloatingActionsVisibility();
    window.addEventListener('scroll', checkFloatingActionsVisibility, { passive: true });
  }

  /* ---------- WhatsApp booking widget ---------- */
  var waToggle = document.getElementById('waToggle');
  var waPanel = document.getElementById('waPanel');
  var waPanelClose = document.getElementById('waPanelClose');
  var waForm = document.getElementById('waBookingForm');
  var waSportTabs = document.querySelectorAll('.wa-sport-tab');
  var selectedSport = 'Tennis';
  var WHATSAPP_NUMBER = '919988067867';

  function openWaPanel() {
    waPanel.classList.add('open');
    waPanel.setAttribute('aria-hidden', 'false');
    waToggle.classList.add('open');
    waToggle.setAttribute('aria-expanded', 'true');
  }

  function closeWaPanel() {
    waPanel.classList.remove('open');
    waPanel.setAttribute('aria-hidden', 'true');
    waToggle.classList.remove('open');
    waToggle.setAttribute('aria-expanded', 'false');
  }

  if (waToggle && waPanel) {
    waToggle.addEventListener('click', function () {
      var isOpen = waPanel.classList.contains('open');
      if (isOpen) { closeWaPanel(); } else { openWaPanel(); }
    });

    if (waPanelClose) {
      waPanelClose.addEventListener('click', closeWaPanel);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && waPanel.classList.contains('open')) {
        closeWaPanel();
      }
    });
  }

  waSportTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      waSportTabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      selectedSport = tab.getAttribute('data-sport');
    });
  });

  /* ---------- Date / Time confirm ticks ---------- */
  var waConfirmBtns = document.querySelectorAll('.wa-confirm-btn');
  waConfirmBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrapper = btn.closest('.wa-input-confirm');
      var input = wrapper ? wrapper.querySelector('input') : null;
      if (input && !input.value) {
        input.reportValidity();
        return;
      }
      btn.classList.add('confirmed');
    });
  });
  /* Typing/changing a date or time value un-confirms its tick until re-checked */
  document.querySelectorAll('.wa-input-confirm input').forEach(function (input) {
    input.addEventListener('input', function () {
      var wrapper = input.closest('.wa-input-confirm');
      var btn = wrapper ? wrapper.querySelector('.wa-confirm-btn') : null;
      if (btn) btn.classList.remove('confirmed');
    });
  });

  function formatDateAndTime(dateValue, timeValue) {
    if (!dateValue && !timeValue) return 'Not specified';
    var combined = dateValue + (timeValue ? 'T' + timeValue : '');
    var d = new Date(combined);
    if (isNaN(d.getTime())) return (dateValue || '') + ' ' + (timeValue || '');
    var dateOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    if (!timeValue) return d.toLocaleDateString(undefined, dateOptions);
    var timeOptions = { hour: 'numeric', minute: '2-digit' };
    return d.toLocaleDateString(undefined, dateOptions) + ' at ' + d.toLocaleTimeString(undefined, timeOptions);
  }

  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!waForm.checkValidity()) {
        waForm.reportValidity();
        return;
      }
      var name = waForm.querySelector('input[name="name"]').value.trim();
      var players = waForm.querySelector('input[name="players"]').value.trim();
      var dateVal = waForm.querySelector('input[name="date"]').value;
      var timeVal = waForm.querySelector('input[name="time"]').value;

      var message = 'Hi Bajwa Outplay Tennis Academy! I would like to book a slot.\n' +
        'Name: ' + name + '\n' +
        'Sport: ' + selectedSport + '\n' +
        'Players: ' + players + '\n' +
        'Date & Time: ' + formatDateAndTime(dateVal, timeVal);

      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
      window.open(waUrl, '_blank', 'noopener');

      closeWaPanel();
      waForm.reset();
      waConfirmBtns.forEach(function (b) { b.classList.remove('confirmed'); });
      waSportTabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      if (waSportTabs[0]) {
        waSportTabs[0].classList.add('active');
        waSportTabs[0].setAttribute('aria-selected', 'true');
      }
      selectedSport = 'Tennis';
    });
  }

  /* ---------- Academy reels (9:16 videos) ---------- */
  var reelsTrack = document.getElementById('reelsTrack');
  var reelsWrap = document.getElementById('reelsWrap');
  var reelsPrev = document.getElementById('reelsPrev');
  var reelsNext = document.getElementById('reelsNext');

  if (reelsTrack) {
    var reelCards = Array.prototype.slice.call(reelsTrack.querySelectorAll('.reel-card'));
    var reelSoundOn = true; // sound is on when a visitor taps play (they made a gesture); they can mute per the speaker button

    function reelVideo(card) { return card.querySelector('.reel-video'); }

    function updateReelUi(card) {
      var v = reelVideo(card);
      var toggle = card.querySelector('.reel-toggle');
      var toggleIcon = toggle.querySelector('i');
      var sound = card.querySelector('.reel-sound');
      var soundIcon = sound.querySelector('i');
      var n = reelCards.indexOf(card) + 1;

      card.classList.toggle('playing', !v.paused);
      toggleIcon.className = v.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
      toggle.setAttribute('aria-label', (v.paused ? 'Play video ' : 'Pause video ') + n);
      soundIcon.className = v.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      sound.setAttribute('aria-label', v.muted ? 'Unmute video' : 'Mute video');
    }

    function pauseOtherReels(current) {
      reelCards.forEach(function (card) {
        var v = reelVideo(card);
        if (v !== current && !v.paused) v.pause();
      });
    }

    function toggleReel(card) {
      var v = reelVideo(card);
      if (v.paused) {
        pauseOtherReels(v);
        v.muted = !reelSoundOn;
        var attempt = v.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            // Browser refused audio — fall back to muted playback rather than failing silently
            v.muted = true;
            var retry = v.play();
            if (retry && typeof retry.catch === 'function') retry.catch(function () {});
            updateReelUi(card);
          });
        }
      } else {
        v.pause();
      }
    }

    /* Show/hide cards whose file is missing — but only if at least one video loaded,
       so a wrong folder path still leaves the section visible instead of vanishing. */
    function syncMissingReels() {
      var anyLoaded = reelCards.some(function (c) { return c.getAttribute('data-loaded') === '1'; });
      reelCards.forEach(function (c) {
        c.hidden = !!(anyLoaded && c.getAttribute('data-failed') === '1');
      });
      updateReelsNav();
    }

    reelCards.forEach(function (card) {
      var v = reelVideo(card);
      var toggle = card.querySelector('.reel-toggle');
      var sound = card.querySelector('.reel-sound');
      var bar = card.querySelector('.reel-progress span');

      toggle.addEventListener('click', function () { toggleReel(card); });

      sound.addEventListener('click', function (e) {
        e.stopPropagation();
        reelSoundOn = v.muted; // muted right now → the visitor wants sound on
        reelCards.forEach(function (c) {
          reelVideo(c).muted = !reelSoundOn;
          updateReelUi(c);
        });
      });

      v.addEventListener('play', function () { pauseOtherReels(v); updateReelUi(card); });
      v.addEventListener('pause', function () { updateReelUi(card); });
      v.addEventListener('volumechange', function () { updateReelUi(card); });
      v.addEventListener('timeupdate', function () {
        if (v.duration) bar.style.width = ((v.currentTime / v.duration) * 100) + '%';
      });

      v.addEventListener('loadedmetadata', function () {
        card.setAttribute('data-loaded', '1');
        syncMissingReels();
      });
      v.addEventListener('error', function () {
        card.setAttribute('data-failed', '1');
        syncMissingReels();
      });
      // events may have fired before this script ran
      if (v.readyState >= 1) card.setAttribute('data-loaded', '1');
      if (v.error) card.setAttribute('data-failed', '1');

      updateReelUi(card);
    });
    syncMissingReels();

    /* Pause a reel as soon as it scrolls out of view */
    if ('IntersectionObserver' in window) {
      var reelViewObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var v = reelVideo(entry.target);
          if (!entry.isIntersecting && !v.paused) v.pause();
        });
      }, { threshold: 0.2 });
      reelCards.forEach(function (card) { reelViewObserver.observe(card); });
    }

    /* Pause everything if the tab is hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        reelCards.forEach(function (card) {
          var v = reelVideo(card);
          if (!v.paused) v.pause();
        });
      }
    });

    /* Prev / next arrows */
    function updateReelsNav() {
      if (!reelsPrev || !reelsNext || !reelsWrap) return;
      var max = reelsTrack.scrollWidth - reelsTrack.clientWidth;
      reelsPrev.disabled = reelsTrack.scrollLeft <= 4;
      reelsNext.disabled = reelsTrack.scrollLeft >= max - 4;
      reelsWrap.classList.toggle('no-scroll', max <= 4);
    }
    function scrollReels(direction) {
      reelsTrack.scrollBy({ left: direction * reelsTrack.clientWidth * 0.9, behavior: 'smooth' });
    }
    if (reelsPrev) reelsPrev.addEventListener('click', function () { scrollReels(-1); });
    if (reelsNext) reelsNext.addEventListener('click', function () { scrollReels(1); });
    reelsTrack.addEventListener('scroll', updateReelsNav, { passive: true });
    window.addEventListener('resize', updateReelsNav);
    updateReelsNav();
  }

  /* ---------- Font switcher ---------- */
  var fontSwitcher = document.getElementById('fontSwitcher');
  var root = document.documentElement;

  function applyFont(fontName) {
    var stack = fontName + ', sans-serif';
    root.style.setProperty('--font-heading', stack);
    root.style.setProperty('--font-body', stack);
  }

  if (fontSwitcher) {
    var savedFont = null;
    try { savedFont = localStorage.getItem('bota-font'); } catch (err) { /* storage unavailable */ }

    if (savedFont) {
      applyFont(savedFont);
      fontSwitcher.value = savedFont;
    }

    fontSwitcher.addEventListener('change', function () {
      var chosen = fontSwitcher.value;
      applyFont(chosen);
      try { localStorage.setItem('bota-font', chosen); } catch (err) { /* storage unavailable */ }
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxBackdrop = document.getElementById('lightboxBackdrop');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentGalleryIndex = 0;

  function showGalleryImage(index) {
    if (!galleryItems.length) return;
    currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    var item = galleryItems[currentGalleryIndex];
    var full = item.getAttribute('data-full');
    var img = item.querySelector('img');
    lightboxImage.src = full;
    lightboxImage.alt = img ? img.alt : '';
  }

  function openLightbox(index) {
    showGalleryImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightbox && galleryItems.length) {
    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () { openLightbox(index); });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { showGalleryImage(currentGalleryIndex - 1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { showGalleryImage(currentGalleryIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showGalleryImage(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') showGalleryImage(currentGalleryIndex + 1);
    });
  }

});
