import { onWinLoad } from '../../functions/onDocLoad'

onWinLoad(() => {
  const gridSmall = document.querySelector('.d-grid._desktop.small')

  if(gridSmall && window.innerWidth >= 768) {
    const gridCards = gridSmall.querySelectorAll('.card-small')

    gridCards.forEach((card) => {

      //let isHovered = false

      card.addEventListener('mouseenter', (event) => {

        // if(isHovered) return 
        // isHovered = true 

        const curentCard = event.currentTarget

        const normalImage = curentCard.querySelector('.card-small__content img.normal-image')
        const activeImage = curentCard.querySelector('.card-small__content img.active-image')

        card.classList.add('_active')
        normalImage.classList.add('_active')
        activeImage.classList.add('_active')

      })

      card.addEventListener('mouseleave', (event) => {

        // if(!isHovered) return
        // isHovered = false 

        const curentCard = event.currentTarget

        const normalImage = curentCard.querySelector('.card-small__content img.normal-image')
        const activeImage = curentCard.querySelector('.card-small__content img.active-image')

        card.classList.remove('_active')
        normalImage.classList.remove('_active')
        activeImage.classList.remove('_active')

      })
    })
  }
})
