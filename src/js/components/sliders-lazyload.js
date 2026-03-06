
import vanillaLazy from "vanilla-lazyload";
import { onDocLoad, onWinLoad } from '../functions/onDocLoad';
const startSliderLazy = (el) => {
  const vl = new vanillaLazy({
    container: el,
    elements_selector: `
    [data-lazy-slide] img,
    [data-lazy-slide] video
    `,
    unobserve_entered: true,
    thresholds: "0px -5% 0px 0px",
    class_loaded: "is-loaded",
    callback_loaded: (el) => {
      const parent = el.closest('[data-lazy-slide]')
      parent?.classList.add("is-loaded")
      setTimeout(() => {
        parent.removeAttribute('data-lazy-slide')
        parent?.classList.remove("is-loaded")
        el.removeAttribute('data-ll-status')
        el?.classList.remove("entered", "is-loaded")

      }, 250)
    },
    callback_finish: () => {
      vl.destroy();
    },
  })
}
const initLazySlider = function (sw) {
  onWinLoad(() => {
    if (!window?.sliderObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startSliderLazy(entry.target)
            observer.unobserve(entry.target)
          }
        })

      }, {
        rootMargin: "0px",
        threshold: 0.4,
      })
      window.sliderObserver = observer
    }
    window.sliderObserver && window.sliderObserver.observe(sw.el)
  })
};

export default initLazySlider;
