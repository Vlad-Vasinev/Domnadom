import vars from '../_vars';

export const getScrollBarWidth = () => {
  const width = window.innerWidth - vars.bodyEl.offsetWidth;
  document.body.style.setProperty('--scrollbar-width', isMobile() ? `${width}px` : `${(width/window.innerWidth*100).toFixed(3)}vw`);
}
