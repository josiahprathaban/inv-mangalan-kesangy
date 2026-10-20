(() => {
  const root = document.documentElement;
  const page = document.querySelector('.page-frame');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  let observer;
  let openingTimer;
  let openingAnimation;
  let openingSplits = [];
  let started = false;
  const releaseCover = () => {
    clearTimeout(window.invitationOpeningFallback);
    clearTimeout(openingTimer);
    openingAnimation?.cancel();
    activeAnimations.delete(openingAnimation);
    openingSplits.forEach((split) => split.revert());
    openingSplits = [];
    root.classList.remove('intro-pending', 'invitation-ready', 'opening-font-ready', 'opening-font-fallback');
    page.inert = false;
  };
  // The invitation remains usable if the library is unavailable.
  if (!window.anime || reducedMotion.matches) {
    releaseCover();
    return;
  }

  const { animate, stagger, splitText, utils } = window.anime;
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
    if (event.key === 'Escape') finishOpening();
  };
  const finishOpening = () => {
    releaseCover();
    document.removeEventListener('keydown', skipOpening);
    startInvitation();
  };

  reducedMotion.addEventListener('change', (event) => {
    if (!event.matches) return;
    observer?.disconnect();
    finishOpening();
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
        openingAnimation = track(animate(characters, {
          opacity: [0, 1],
          y: [8, 0],
          scale: [.78, 1.035, 1],
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
        root.classList.add('opening-font-ready');
      });
    } else {
      startInvitation();
    }
  } catch (error) {
    releaseCover();
    console.error('The invitation animation could not start.', error);
  }
})();
