import { getScrollBarWidth } from '../functions/getScrollBarWidth';
import fsSlider from './fullScreenSlider';

window.startFunc = function () {
  // console.log('grecaptcha is ready')
}

getScrollBarWidth()

if (!isMobile()) {
  slideEffectButton()
}

window.fsSlider = new fsSlider(document.querySelector('.fullscreen-slider'))

function slideEffectButton() {
  document.querySelectorAll('.slide-button').forEach(
    (el) => {
      try {
        const innerSpan = el.querySelector('span')
        const container = document.createElement('div')
        container.className = 'slide-button-inner'
        container.appendChild(innerSpan.cloneNode(true))
        container.appendChild(innerSpan.cloneNode(true))
        innerSpan.remove()
        el.insertBefore(container, el.firstChild);

      } catch (error) {
      }
    }
  )
}
