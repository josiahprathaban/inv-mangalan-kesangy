(() => {
  const root = document.documentElement;
  const page = document.querySelector('.page-frame');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  const openingArtAnimations = new Set();
  let observer;
  let openingTimer;
  let openingAnimation;
  let openingTransition;
  let transitioning = false;
  let openingSplits = [];
  let started = false;
  const releaseCover = () => {
    const wasOpening = root.classList.contains('intro-pending');
    clearTimeout(window.invitationOpeningFallback);
    clearTimeout(openingTimer);
    openingTransition?.cancel();
    openingTransition = undefined;
    transitioning = false;
    document.querySelector('.opening').style.removeProperty('transform');
    page.style.removeProperty('transform');
    openingArtAnimations.forEach((animation) => animation.cancel());
    openingArtAnimations.clear();
    openingAnimation?.cancel();
    activeAnimations.delete(openingAnimation);
    openingSplits.forEach((split) => split.revert());
    openingSplits = [];
    root.classList.remove('intro-pending', 'invitation-ready', 'opening-font-ready', 'opening-font-fallback');
    page.inert = false;
    if (wasOpening) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  // The invitation remains usable if the library is unavailable.
  if (!window.anime || reducedMotion.matches) {
    releaseCover();
    return;
  }

  const { animate, stagger, splitText, utils, svg, createTimeline, waapi } = window.anime;
  // Native browser animations keep transform work out of the JS frame loop.
  const nativeAnimate = waapi?.animate || animate;
  const sway = (element, from, to, duration, delay = 0) => {
    openingArtAnimations.add(nativeAnimate(element, {
      transform: [`rotate(${from}deg)`, `rotate(${to}deg)`],
      duration, delay, loop: true, alternate: true, ease: 'inOutSine',
    }));
  };
  document.addEventListener('visibilitychange', () => {
    openingArtAnimations.forEach((animation) => document.hidden ? animation.pause() : animation.resume());
  });
  const animateOpeningHearts = () => {
    document.querySelectorAll('.opening-heart-small').forEach((heart) => {
      const size = parseFloat(heart.style.getPropertyValue('--heart-size'));
      heart.style.setProperty('--heart-size', `${utils.random(Math.round(size * .85), Math.round(size * 1.12))}px`);
      heart.style.setProperty('--heart-opacity', utils.random(5, 10) / 100);
    });
    openingArtAnimations.add(animate(svg.createDrawable('.opening-heart path'), {
      draw: ['0 0', '0 1'],
      duration: () => utils.random(1400, 2000),
      delay: stagger(90, { from: 'random' }),
      ease: 'inOutSine',
    }));
    document.querySelectorAll('.opening-heart svg').forEach((heart) => {
      openingArtAnimations.add(nativeAnimate(heart, {
        transform: ['scale(1)', `scale(${utils.random(106, 110) / 100})`],
        duration: utils.random(2400, 4200),
        delay: utils.random(0, 600),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }));
    });
  };
  const animateOpeningArt = () => {
    animateOpeningHearts();
    // Draw a white mask along the contours, revealing the original filled strokes.
    // The artwork stays single-lined and remains fully drawn after its entrance.
    // Animate only motifs used by visible plants at this viewport size.
    const symbols = new Set([...document.querySelectorAll('.opening-meadow-plant, .opening-stem')]
      .filter((plant) => getComputedStyle(plant).display !== 'none')
      .map((plant) => document.querySelector(plant.querySelector('use').getAttribute('href'))));
    const maskedPaths = [...symbols].flatMap((symbol) => [...symbol.querySelectorAll('[mask]')]);
    const drawPaths = maskedPaths.map((path) => {
      const mask = document.querySelector(path.getAttribute('mask').slice(4, -1));
      return mask.querySelector('.opening-draw-path');
    });
    const drawing = animate(svg.createDrawable(drawPaths), {
      draw: ['0 0', '0 1'],
      duration: () => utils.random(3200, 4000),
      delay: stagger(120, { from: 'random' }),
      ease: 'inOutSine',
      // Once ink is complete, sway plain vectors instead of rasterized masks.
      onComplete: () => maskedPaths.forEach((path) => path.removeAttribute('mask')),
    });
    openingArtAnimations.add(drawing);
    if (root.dataset.foregroundFlowers !== 'off') {
      document.querySelectorAll('.opening-stem svg').forEach((stem) => sway(stem, -2, 2, 4000));
    }
    document.querySelectorAll('.opening-meadow-plant svg').forEach((plant) => {
      if (getComputedStyle(plant.parentElement).display === 'none') return;
      const direction = Math.random() < .5 ? -1 : 1;
      const angle = utils.random(18, 42) / 10;
      sway(plant, direction * angle, -direction * angle, utils.random(3400, 8200), utils.random(0, 700));
    });
    return drawing;
  };
  const track = (animation) => {
    activeAnimations.add(animation);
    animation.then(() => activeAnimations.delete(animation));
    return animation;
  };
  const reveal = (elements, delay = 0) => {
    if (reducedMotion.matches) return;
    track(animate(elements, {
      opacity: [0, 1],
      y: [24, 0],
      duration: 1200,
      delay: stagger(150, { start: delay }),
      ease: 'out(3)',
    }));
  };

  const startInvitation = () => {
    if (started) return;
    started = true;
    reveal(document.querySelectorAll('.invitation [data-reveal]'), 100);
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.celebration [data-reveal], .closing [data-reveal]')
        .forEach((element) => observer.observe(element));
    }
  };
  const skipOpening = (event) => {
    if (event.key === 'Escape') finishOpening(true);
  };
  const finalizeOpening = () => {
    releaseCover();
    document.removeEventListener('keydown', skipOpening);
    startInvitation();
  };
  const finishOpening = (immediate = false) => {
    if (immediate || reducedMotion.matches || !root.classList.contains('intro-pending')) {
      finalizeOpening();
      return;
    }
    if (transitioning) return;
    transitioning = true;
    clearTimeout(window.invitationOpeningFallback);
    clearTimeout(openingTimer);
    // Both pages move together, like a curtain rising onto the invitation.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    utils.set(page, { y: window.innerHeight });
    root.classList.add('invitation-ready');
    openingTransition = createTimeline({
      defaults: { duration: 1500, ease: 'inOut(3)' },
      onComplete: finalizeOpening,
    })
      .add('.opening', { y: ['0%', '-100%'] }, 0)
      .add(page, { y: [window.innerHeight, 0] }, 0)
      .call(startInvitation, 180);
  };

  reducedMotion.addEventListener('change', (event) => {
    if (!event.matches) return;
    observer?.disconnect();
    finishOpening(true);
    [...activeAnimations].forEach((animation) => animation.complete());
    activeAnimations.clear();
    releaseCover();
  });

  try {
    if (root.classList.contains('intro-pending')) {
      page.inert = true;
      document.addEventListener('keydown', skipOpening);
      // Split only after the fonts load so character positions are stable.
      // If loading fails, keep a fixed fallback so the typeface never swaps.
      const fontsReady = Promise.all([
        document.fonts.load('700 48px "Opening Serif"', 'Mangalan Kesangy'),
        document.fonts.load('italic 700 48px "Opening Serif"', '&'),
      ]).then((faces) => faces.every((face) => face.length > 0)).catch(() => false);
      let fontTimeout;
      Promise.race([
        fontsReady,
        new Promise((resolve) => { fontTimeout = setTimeout(() => resolve(false), 2500); }),
      ]).then((loaded) => {
        clearTimeout(fontTimeout);
        if (!root.classList.contains('intro-pending')) return;
        if (!loaded) root.classList.add('opening-font-fallback');
        openingSplits = [...document.querySelectorAll('.opening-name, .opening-ampersand')]
          .map((element) => splitText(element, { lines: false, words: false, chars: true }));
        const characters = utils.shuffle(openingSplits.flatMap((split) => split.chars));
        utils.set(characters, { opacity: 0 });
        const drawing = animateOpeningArt();
        root.classList.add('opening-font-ready');
        drawing.then(() => {
          if (!root.classList.contains('intro-pending') || reducedMotion.matches) return;
          openingAnimation = track(nativeAnimate(characters, {
            opacity: [0, 1],
            transform: ['translateY(8px) scale(.78)', 'translateY(0px) scale(1.035)', 'translateY(0px) scale(1)'],
            filter: ['blur(8px)', 'blur(0px)'],
            textShadow: ['0 0 18px rgba(246, 242, 233, .65)', '0 0 0px rgba(246, 242, 233, 0)'],
            duration: 1200,
            delay: stagger(75),
            ease: 'out(3)',
            onComplete: () => {
              // Keep the letter layout until the cover closes to avoid a kerning snap.
              if (root.classList.contains('intro-pending')) {
                openingTimer = setTimeout(finishOpening, 2000);
              }
            },
          }));
        });
      });
    } else {
      startInvitation();
    }
  } catch (error) {
    releaseCover();
    console.error('The invitation animation could not start.', error);
  }
})();
