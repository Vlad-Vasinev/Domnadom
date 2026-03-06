import { onDocLoad } from '../../functions/onDocLoad';

onDocLoad(() => {
  const header = document.querySelector('.header')

  if(header && !header.classList.contains('_header-bg')) {

    const observer = new IntersectionObserver(
      ([e]) => {
        if(window.innerWidth > 1025) {
          header.classList.toggle("_active", e.intersectionRatio < 1)
        }
        if(window.innerWidth >= 769 && window.innerWidth <= 1024) {
          header.classList.toggle("_active", e.intersectionRatio < 1)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [1]
      }
    );
    observer.observe(document.querySelector('.scroll-marker'))
  }
})
