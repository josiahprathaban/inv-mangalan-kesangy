(() => {
  const heading = document.querySelector('#couple-names');
  if (!heading || !window.anime) return;

  const { animate, utils } = window.anime;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const names = [...heading.querySelectorAll('.name')];
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const timers = new Map();
  const animations = new Map();
  let inView = false;
  let running = false;

  const layer = document.createElement('span');
  layer.className = 'name-sparkles';
  layer.setAttribute('aria-hidden', 'true');
  const stars = Array.from({ length: 3 }, (_, index) => {
    const star = document.createElement('span');
    star.className = 'name-sparkle';
    star.dataset.name = String(index % names.length);
    star.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1C13 8 16 11 23 12C16 13 13 16 12 23C11 16 8 13 1 12C8 11 11 8 12 1Z"/></svg>';
    layer.append(star);
    return star;
  });
  heading.append(layer);

  const schedule = (star, delay) => {
    timers.set(star, setTimeout(() => {
      timers.delete(star);
      if (running) twinkle(star);
    }, delay));
  };

  const positionStar = (star) => {
    const name = names[Number(star.dataset.name)];
    const text = name.firstChild;
    if (!text || text.nodeType !== Node.TEXT_NODE) return false;
    const index = utils.random(0, text.length - 1);
    const range = document.createRange();
    range.setStart(text, index);
    range.setEnd(text, index + 1);
    const letter = range.getBoundingClientRect();
    const box = name.getBoundingClientRect();
    const parent = heading.getBoundingClientRect();
    const style = getComputedStyle(name);
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics = context.measureText(text.textContent[index]);
    const ascent = metrics.fontBoundingBoxAscent ?? parseFloat(style.fontSize) * .8;
    const descent = metrics.fontBoundingBoxDescent ?? parseFloat(style.fontSize) * .2;
    const baseline = box.top + (parseFloat(style.lineHeight) - ascent - descent) / 2 + ascent;
    const topEdge = Math.random() < .8;
    const x = letter.left + letter.width * (utils.random(25, 75) / 100) - parent.left;
    const y = baseline + (topEdge ? -metrics.actualBoundingBoxAscent : metrics.actualBoundingBoxDescent) - parent.top;

    // Keep simultaneous glints apart, without changing the typography or layout.
    if ([...animations.keys()].some((other) => Math.hypot(parseFloat(other.style.left) - x, parseFloat(other.style.top) - y) < 28)) return false;
    const mobile = innerWidth <= 580;
    const size = utils.random(mobile ? 11 : 15, mobile ? 20 : 29);
    star.style.left = `${x}px`;
    star.style.top = `${y + utils.random(-2, 2)}px`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.marginLeft = `${-size / 2}px`;
    star.style.marginTop = `${-size / 2}px`;
    return true;
  };

  function twinkle(star) {
    if (!positionStar(star)) {
      schedule(star, 500);
      return;
    }
    animations.set(star, animate(star, {
      opacity: [0, .8, 0],
      scale: [.35, 1, .35],
      rotate: [utils.random(-18, 0), utils.random(5, 22)],
      duration: utils.random(1600, 2400),
      ease: 'inOutSine',
      onComplete: () => {
        animations.delete(star);
        if (running) schedule(star, utils.random(900, 2500));
      },
    }));
  }

  const stop = () => {
    running = false;
    timers.forEach(clearTimeout);
    timers.clear();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
    stars.forEach((star) => { star.style.opacity = '0'; });
  };
  const sync = () => {
    const allowed = inView && !document.hidden && !reducedMotion.matches && !document.documentElement.classList.contains('intro-pending');
    if (!allowed) {
      if (running) stop();
      return;
    }
    if (!running) {
      running = true;
      stars.forEach((star) => schedule(star, utils.random(250, 1500)));
    }
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    }, { threshold: .05 }).observe(heading);
  } else {
    inView = true;
  }
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', sync);
  sync();
})();
