import vars from '../_vars';

let scrollPosition = 0;
let isLocked = false;

function preventDefault(e) {
  e.preventDefault();
}

export const disableScroll = () => {

  const paddingOffset = window.innerWidth - vars.bodyEl.offsetWidth;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  if (window.innerWidth >= 768) {
    document.body.style.paddingRight = paddingOffset + 'px';
    document.body.classList.add('dis-scroll');
    document.body.dataset.scrollY = scrollPosition.toString();
    document.body.style.top = `-${scrollPosition}px`;
  } else {
    document.body.style.paddingRight = paddingOffset + 'px';
    
    if (isIOS) {
      document.addEventListener('touchmove', preventDefault, { passive: false });
      document.addEventListener('wheel', preventDefault, { passive: false });
      
      document.body.dataset.scrollY = scrollPosition.toString();
      document.body.classList.add('ios-scroll-locked');
    } else {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    }
  }
  isLocked = true;

}

export const enableScroll = () => {

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const savedPosition = parseInt(document.body.dataset.scrollY || '0');
  
  if (window.innerWidth >= 768) {
    document.body.classList.remove('dis-scroll');
    document.body.style.paddingRight = '';
    document.body.style.top = '';
    window.scrollTo(0, savedPosition);
  } else {
    document.body.style.paddingRight = '';
    
    if (isIOS) {
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('wheel', preventDefault);
      
      document.body.classList.remove('ios-scroll-locked');
      
      window.scrollTo({
        top: savedPosition,
        behavior: 'auto'
      });
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
  }
  isLocked = false;

}