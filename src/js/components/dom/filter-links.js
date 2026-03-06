
const filter = document.querySelector('.filter-links')
if(filter) {

  filter.addEventListener('click', function (event) {
    const link = event.target.closest('.button-s')
    if(link) {
      const containerScrollLeft = link.offsetLeft - (filter.offsetWidth / 2) + (link.offsetWidth / 2)

      filter.querySelectorAll('.button-s').forEach((el) => {
        el.classList.remove('_active')
      })
      link.classList.add('_active')
  
      filter.scrollTo({
        left: containerScrollLeft,
        behavior: "smooth"
      })
  
      const dGrid = link.parentElement.parentElement.parentElement.querySelectorAll('.d-gridSlider')
      const activeTab = link.dataset.tab
      dGrid.forEach(element => {
        element.classList.remove('_active')
        if(element.dataset.tab === activeTab) {
          element.classList.add('_active')
        }
      })
    }


  })

  const activeLink = filter.querySelector('.button-s._active')
  if(activeLink) {
    const containerScrollLeft = activeLink.offsetLeft - (filter.offsetWidth / 2) + (activeLink.offsetWidth / 2)
    if(activeLink) {
      filter.scrollTo({
        left: containerScrollLeft,
        behavior: "smooth"
      })
    }
  }
}