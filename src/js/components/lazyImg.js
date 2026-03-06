import vanillaLazy from "vanilla-lazyload";
import { onDocLoad, onWinLoad } from '../functions/onDocLoad';

onWinLoad(lazyImgInit);

function lazyImgInit() {
  const callBackLoaded = (el) => {
    const parent = el.closest("[data-lazy]");

    parent?.classList.add("is-loaded");
    setTimeout(() => {
      parent?.removeAttribute('data-lazy')
    }, 1000)
    // setTimeout(() => (parent.style.backgroundImage = ""), 1500);
  }


  const selector = "[data-lazy] img, [data-lazy] video"
  window.APP.globalLazy = new vanillaLazy(
    {
      unobserve_entered: true,
      class_loaded: "is-loaded",
      callback_loaded: callBackLoaded,
      elements_selector: selector
    }
  );
  window.APP.globalLazyUpdate = function () {
    window.APP.globalLazy.update()
  };


  document.querySelectorAll(
    "[data-lazy] img:not([data-src]), [data-lazy] video:not([data-src])"
  ).forEach((el) => {
    el.closest("[data-lazy]")?.removeAttribute('data-lazy')
  })
}
