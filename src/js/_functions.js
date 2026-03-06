import "./functions/ymaps"

// Определение ширины экрана
import { isMobile, isTablet, isDesktop } from './functions/check-viewport';
window.isMobile = isMobile

// система адаптивных значений
import { aPixels } from './functions/aPixels';
window.aPixels = aPixels

// Реализация остановки скролла (не забудьте вызвать функцию)
import { disableScroll } from './functions/disable-scroll';
window.disableScroll = disableScroll

// Реализация включения скролла (не забудьте вызвать функцию) 
import { enableScroll } from './functions/disable-scroll';
window.enableScroll = enableScroll

// Подключение свайпера
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Autoplay, Zoom} from 'swiper/modules';
Swiper.use([Navigation, Pagination, EffectFade, Autoplay, Zoom]);
window.Swiper = Swiper

import { Fancybox } from '../../node_modules/@fancyapps/ui/dist/fancybox/fancybox.umd';

Fancybox.bind('[data-fancybox]', {
  Image: {
    hideScrollbar: false,
    protect: true, 
    click: 'close', 
    zoom: false,
    width: 1437,
    height: 1080,
  },
  Video: {
    width: 1920,
    height: 1080,
  },
  Thumbs: {
    type: 'classic',
  },
});
