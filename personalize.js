(() => {
  const params = new URLSearchParams(location.search);
  const guest = (params.get('guest') || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  const note = (params.get('message') || '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, 400);
  const show = (id, text) => {
    const element = document.getElementById(id);
    if (!element || !text) return;
    element.textContent = text;
    element.hidden = false;
  };
  show('guest-greeting', guest ? `Dear ${guest},` : '');
  show('guest-note', note);
})();
