(() => {
  const form = document.querySelector('#write-form');
  const guestInput = document.querySelector('#guest');
  const noteInput = document.querySelector('#personal-note');
  const messageInput = document.querySelector('#share-message');
  const result = document.querySelector('#writer-result');
  const linkInput = document.querySelector('#invitation-link');
  const readyMessage = document.querySelector('#ready-message');
  const status = document.querySelector('#writer-status');
  const nativeShare = document.querySelector('#native-share');
  let customMessage = false;
  let generated = false;

  const guestName = () => guestInput.value.replace(/\s+/g, ' ').trim();
  const defaultMessage = () => `Dear ${guestName() || '[guest names]'},\n\nWith joyful hearts, we invite you to celebrate our wedding!\n\nSunday, 1 November 2026 at 10:00 AM\nThulasi Wedding Hall, Kallady, Batticaloa\n\nPlease join us for lunch as we celebrate our special day. Your presence would mean so much to us.\n\nWith love,\nMangalan & Kesangy`;
  const invitationUrl = () => {
    const url = new URL(location.href);
    url.pathname = url.pathname.replace(/\/write(?:\/index\.html)?\/?$/, '/');
    if (url.protocol === 'file:') url.pathname += 'index.html';
    url.search = '';
    url.hash = '';
    url.searchParams.set('guest', guestName());
    if (noteInput.value.trim()) url.searchParams.set('message', noteInput.value.trim());
    return url.href;
  };
  const updateResult = () => {
    if (!generated) return;
    // Hide stale sharing controls if the guest field is cleared.
    if (!guestName()) {
      result.hidden = true;
      return;
    }
    const url = invitationUrl();
    const message = messageInput.value.trim();
    linkInput.value = url;
    readyMessage.value = message ? `${message}\n\n${url}` : url;
    document.querySelector('#open-invitation').href = url;
    document.querySelector('#share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(readyMessage.value)}`;
    document.querySelector('#share-telegram').href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
    document.querySelector('#share-email').href = `mailto:?subject=${encodeURIComponent(`A wedding invitation for ${guestName()}`)}&body=${encodeURIComponent(readyMessage.value)}`;
    result.hidden = false;
  };
  const update = () => {
    document.querySelector('#preview-greeting').textContent = `Dear ${guestName() || 'your lovely guests'},`;
    const note = document.querySelector('#preview-note');
    note.textContent = noteInput.value.trim();
    note.hidden = !note.textContent;
    if (!customMessage) messageInput.value = defaultMessage();
    status.textContent = '';
    updateResult();
  };
  guestInput.addEventListener('input', update);
  noteInput.addEventListener('input', update);
  messageInput.addEventListener('input', () => {
    customMessage = true;
    status.textContent = '';
    updateResult();
  });
  document.querySelector('#reset-message').addEventListener('click', () => {
    customMessage = false;
    update();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!guestName()) {
      guestInput.setCustomValidity('Please enter your guests’ names.');
      guestInput.reportValidity();
      return;
    }
    generated = true;
    updateResult();
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    status.textContent = 'Your invitation is ready. Preview it or choose how to share.';
  });
  guestInput.addEventListener('input', () => guestInput.setCustomValidity(''));

  const copy = async (field, label) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(field.value);
      status.textContent = `${label} copied.`;
    } catch {
      field.focus();
      field.select();
      field.setSelectionRange(0, field.value.length);
      status.textContent = `Select Copy from your browser to copy the ${label.toLowerCase()}.`;
    }
  };
  document.querySelector('#copy-link').addEventListener('click', () => copy(linkInput, 'Invitation link'));
  document.querySelector('#copy-message').addEventListener('click', () => copy(readyMessage, 'Message and link'));
  if (navigator.share) {
    nativeShare.hidden = false;
    nativeShare.addEventListener('click', async () => {
      try {
        await navigator.share({ title: 'Mangalan & Kesangy — Wedding invitation', text: readyMessage.value });
      } catch (error) {
        if (error.name !== 'AbortError') status.textContent = 'Sharing is unavailable here. Use WhatsApp, Telegram, email, or copy the message instead.';
      }
    });
  }
  update();
})();
