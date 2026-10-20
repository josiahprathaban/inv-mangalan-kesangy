(() => {
  const audio = document.querySelector('#background-music');
  const button = document.querySelector('.music-toggle');
  const gestures = ['pointerdown', 'touchend', 'keydown'];
  let userPaused = false;
  let context;
  let source;
  let gain;
  let graphUnavailable = false;

  audio.volume = .05;
  audio.loop = true;
  button.hidden = false;

  const updateControl = () => {
    const playing = !audio.paused && !audio.ended;
    const label = playing ? 'Pause background music' : 'Play background music';
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', label);
    button.title = label;
  };

  const removeGestureListeners = () => {
    gestures.forEach((event) => document.removeEventListener(event, unlockMusic));
  };

  const prepareVolume = () => {
    // iPhone controls HTML audio volume itself. A gain node applies our 5%
    // level independently when served over HTTP(S). Local files use HTML volume.
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext || graphUnavailable || location.protocol === 'file:') return Promise.resolve();
    try {
      if (!context) {
        context = new AudioContext();
        source = context.createMediaElementSource(audio);
        gain = context.createGain();
        gain.gain.value = .05;
        source.connect(gain);
        gain.connect(context.destination);
        audio.volume = 1;
      }
      return context.state === 'suspended' ? context.resume() : Promise.resolve();
    } catch {
      // Keep direct audio available on browsers without a usable audio graph.
      if (source && context) source.connect(context.destination);
      audio.volume = .05;
      graphUnavailable = true;
      return Promise.resolve();
    }
  };

  const playMusic = (fromGesture = false) => {
    if (userPaused) return;
    // Both calls happen synchronously within the tap/key handler for Safari.
    const ready = fromGesture ? prepareVolume() : Promise.resolve();
    const playing = audio.play();
    Promise.all([ready, playing]).then(() => {
      if (userPaused) {
        audio.pause();
        return;
      }
      removeGestureListeners();
      updateControl();
    }).catch(() => {
      // Autoplay may be blocked; leave the first-interaction fallback active.
      updateControl();
    });
  };

  function unlockMusic(event) {
    if (userPaused || event.target.closest?.('.music-toggle')) return;
    if (event.type === 'keydown' && (event.repeat || event.ctrlKey || event.metaKey || event.altKey)) return;
    playMusic(true);
  }

  gestures.forEach((event) => document.addEventListener(event, unlockMusic, { passive: true }));
  button.addEventListener('click', () => {
    if (!audio.paused) {
      userPaused = true;
      audio.pause();
      removeGestureListeners();
    } else {
      userPaused = false;
      playMusic(true);
    }
  });
  audio.addEventListener('play', updateControl);
  audio.addEventListener('pause', updateControl);
  audio.addEventListener('ended', updateControl);
  audio.addEventListener('error', () => {
    removeGestureListeners();
    button.disabled = true;
    button.setAttribute('aria-label', 'Background music unavailable');
    button.title = 'Background music unavailable';
  });

  updateControl();
  playMusic();
})();
