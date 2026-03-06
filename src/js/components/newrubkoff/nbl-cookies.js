
let cookies = document.querySelector('.nbl-cookies')

document.addEventListener('DOMContentLoaded', () => {
  if(cookies) {
    if (localStorage.getItem("bannerShown")) {
      return
    }
    setTimeout(() => {
      cookies.classList.add('_active')
      cookies.querySelector('.nbl-cookies__close').addEventListener('click', () => {
        cookies.classList.remove('_active')
        localStorage.setItem("bannerShown", "true");
      })
    }, 5000)
  }
})

