import Aos from 'aos';
import Lenis from 'lenis'
import { onDocLoad } from '../../functions/onDocLoad';

onDocLoad(() => {

  if(window.innerWidth >= 768) {
    const lenis = new Lenis({
      autoRaf: true,
      touchMultiplier: 0,
    });
    lenis.on('scroll', (e) => {
      
    });
  }
  
  Aos.init({
    once: true, 
    disable: 'mobile'
  });
})