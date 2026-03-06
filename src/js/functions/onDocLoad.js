export function onDocLoad(clb) {
  if (document.readyState != 'complete') {
    document.addEventListener('DOMContentLoaded', clb);
  } else {
    clb()
  }
}
export function onWinLoad(clb) {
  if (document.readyState != 'complete') {
    window.addEventListener('load', clb);
  } else {
    clb()
  }
}