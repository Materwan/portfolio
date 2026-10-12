// Language toggle: EN by default, FR remembered. Text is switched in CSS (html[lang]); this swaps the buttons, image alts and page title.
const root = document.documentElement;
const buttons = document.querySelectorAll('.lang button');

function setLang(l) {
  root.lang = l;
  buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.l === l));
  document.querySelectorAll('[data-alt-fr]').forEach(el => {
    const attr = el.tagName === 'VIDEO' ? 'aria-label' : 'alt';
    el.dataset.altEn ??= el.getAttribute(attr);
    el.setAttribute(attr, l === 'fr' ? el.dataset.altFr : el.dataset.altEn);
  });
  document.title = l === 'fr' ? root.dataset.titleFr : root.dataset.titleEn;
  try { localStorage.lang = l; } catch {}
}

buttons.forEach(b => b.onclick = () => setLang(b.dataset.l));
setLang(root.lang === 'fr' ? 'fr' : 'en');

// click a project-page image or clip to enlarge it
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.page video.shot').forEach(v => {
  if (reduceMotion) { v.pause(); v.controls = true; }
});
const zoomable = document.querySelectorAll(reduceMotion ? '.page img.shot' : '.page .shot');
if (zoomable.length) {
  const box = document.createElement('dialog');
  box.className = 'lightbox';
  const close = document.createElement('button');
  close.type = 'button';
  document.body.append(box);
  const open = el => {
    const copy = el.cloneNode(true);
    ['class', 'tabindex', 'role', 'loading'].forEach(a => copy.removeAttribute(a));
    if (copy.tagName === 'VIDEO') { copy.muted = true; copy.play(); }
    close.setAttribute('aria-label', root.lang === 'fr' ? 'Fermer' : 'Close');
    box.replaceChildren(copy, close);
    box.showModal();
  };
  box.onclick = () => box.close();
  zoomable.forEach(el => {
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.onclick = () => open(el);
    el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); } };
  });
}
