// ===== AuditVerse AI — main.js =====

document.addEventListener('DOMContentLoaded', () => {

  /* Loader */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 350);
  });
  setTimeout(() => loader && loader.classList.add('hide'), 1600);

  /* Sticky header */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    const backTop = document.getElementById('back-top');
    if (backTop) backTop.classList.toggle('show', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  /* Mobile menu */
  const burger = document.getElementById('burger-btn');
  const mm = document.getElementById('mobile-menu');
  const mmClose = document.getElementById('mm-close');
  if (burger && mm) {
    burger.addEventListener('click', () => { mm.classList.add('open'); document.body.style.overflow='hidden'; });
    mmClose.addEventListener('click', () => { mm.classList.remove('open'); document.body.style.overflow=''; });
    mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mm.classList.remove('open'); document.body.style.overflow='';
    }));
  }

  /* Back to top */
  const backTop = document.getElementById('back-top');
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  revealEls.forEach(el => io.observe(el));

  /* Animated counters */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      let cur = 0;
      const dur = 1600;
      const start = performance.now();
      const step = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        cur = target * eased;
        el.textContent = cur.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

  /* Accordion (FAQ) */
  document.querySelectorAll('.acc-item').forEach(item => {
    const q = item.querySelector('.acc-q');
    const a = item.querySelector('.acc-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* Tabs */
  document.querySelectorAll('.tabs-nav[data-group]').forEach(nav => {
    const group = nav.dataset.group;
    const panels = document.querySelectorAll(`.tab-panel[data-group="${group}"]`);
    if (!panels.length) return;
    const btns = nav.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.querySelector(`.tab-panel[data-group="${group}"][data-tab="${btn.dataset.tab}"]`);
        if (!target) return;
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        target.classList.add('active');
      });
    });
  });

  /* Contact form (demo submit) */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type=submit]');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message received — we\'ll reply within 24 hours';
        contactForm.reset();
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3400);
      }, 900);
    });
  }

  /* Newsletter form */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      setTimeout(() => btn.textContent = original, 2600);
      form.reset();
    });
  });

  /* Pricing toggle (monthly/annual) */
  const pricingToggle = document.getElementById('pricing-toggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const annual = pricingToggle.checked;
      document.querySelectorAll('[data-monthly]').forEach(el => {
        el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
      });
      document.querySelectorAll('.price-period').forEach(el => {
        el.textContent = annual ? '/mo, billed annually' : '/month';
      });
    });
  }

  /* Case study filter */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.filterable').forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
        });
      });
    });
  }

  /* Blog filter */
  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
  if (blogFilterBtns.length) {
    blogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.blog-filterable').forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
        });
      });
    });
  }

  /* Career filter + application modal */
  const jobFilterBtns = document.querySelectorAll('.job-filter-btn');
  if (jobFilterBtns.length) {
    jobFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        jobFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.job-row').forEach(row => {
          row.style.display = (filter === 'all' || row.dataset.dept === filter) ? '' : 'none';
        });
      });
    });
  }

  /* Simple modal (apply now / demo) */
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modalOpen);
      if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
    });
  });

  /* Dark / light theme toggle */
  const modeBtn = document.getElementById('mode-toggle');
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('av-theme', t);
  };
  if (modeBtn) {
    const saved = localStorage.getItem('av-theme') || 'dark';
    applyTheme(saved);
    modeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(cur);
    });
  }

  /* AI Chat Widget (demo) */
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => chatWindow.classList.toggle('open'));
    const chatForm = document.getElementById('chat-form');
    const chatBody = document.getElementById('chat-body');
    const replies = [
      "Great question — our AI Automation team can map that workflow in a free 30-minute audit. Want to book a slot?",
      "Yes, AuditVerse AI integrates with Odoo, SAP, Oracle NetSuite and most major ERPs.",
      "Our pricing starts with the Starter plan for growing SMEs, scaling up to fully custom Enterprise engagements.",
      "I can connect you with a Chartered Accountant on our team — shall I share the consultation link?",
    ];
    chatForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('input');
      if (!input.value.trim()) return;
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user';
      userMsg.textContent = input.value;
      chatBody.appendChild(userMsg);
      input.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.textContent = replies[Math.floor(Math.random()*replies.length)];
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 700);
    });
  }

});
