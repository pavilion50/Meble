const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const header = document.querySelector('.site-header');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.classList.remove('active');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Otwórz menu');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.classList.toggle('active', !isOpen);
    navigation.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Otwórz menu' : 'Zamknij menu');
  });

  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 920) closeMenu();
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

function updateHeader() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -28px' });

  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

const lightbox = document.querySelector('#gallery-lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-open').forEach(button => {
    button.addEventListener('click', () => {
      lightboxImage.src = button.dataset.full;
      lightboxImage.alt = button.dataset.alt || '';
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }
    });
  });

  const closeLightbox = () => {
    if (typeof lightbox.close === 'function') lightbox.close();
    else lightbox.removeAttribute('open');
    lightboxImage.src = '';
  };

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
}

