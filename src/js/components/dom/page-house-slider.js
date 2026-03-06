import { onWinLoad } from '../../functions/onDocLoad'

onWinLoad(() => {
  const housePreview = document.querySelectorAll('.house-preview__content')

  if(housePreview.length > 0 && window.innerWidth >= 768 ) {
  
    housePreview.forEach((item) => {
      const mainImg = item.querySelector('.img-main')
      const clickImg = item.querySelectorAll('.house-preview__content-preview span')
      clickImg.forEach((el) => {
        el.addEventListener('click', (e) => {
  
          const elImg = el.getAttribute('data-fs-full')
          setTimeout(() => {
            mainImg.setAttribute('src', elImg)
          }, 150)
          setTimeout(() => {
            mainImg.setAttribute('data-fs-full', elImg)
          }, 350)
        })
      })
    })
  }
})

