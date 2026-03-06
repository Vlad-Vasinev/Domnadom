import { enableScroll } from '../../functions/disable-scroll';
import { disableScroll } from '../../functions/disable-scroll';
import { onDocLoad } from '../../functions/onDocLoad';

onDocLoad(() => {
  const filterPopup = document.querySelector('.filter-popup');
  const filterBtn = document.querySelector('.button-s._filter');
  let filterElements = undefined;
  
  let activeTabData = null;
  
  if(filterPopup) {
    filterElements = filterPopup.querySelectorAll('.filter-popup__item');
  }
  
  const saveActiveButtonState = () => {
    const activeButton = document.querySelector('.button-s._active:not(._filter)');
    
    if(activeButton) {
      activeTabData = {
        tab: activeButton.dataset.tab,
        id: activeButton.id,
        text: activeButton.textContent.trim()
      };
      
      console.log('Сохранена активная кнопка:', activeTabData);
    }
  };
  
  const restoreActiveButton = () => {
    if(!activeTabData) return;
    
    let buttonToRestore = null;
    
    if(activeTabData.tab) {
      buttonToRestore = document.querySelector(`[data-tab="${activeTabData.tab}"]`);
    }
    
    if(!buttonToRestore && activeTabData.id) {
      buttonToRestore = document.getElementById(activeTabData.id);
    }
    
    if(!buttonToRestore && activeTabData.text) {
      const allButtons = document.querySelectorAll('.button-s:not(._filter)');
      allButtons.forEach(btn => {
        if(btn.textContent.trim() === activeTabData.text) {
          buttonToRestore = btn;
        }
      });
    }
    
    if(buttonToRestore) {
      document.querySelectorAll('.button-s._active:not(._filter)').forEach(el => {
        el.classList.remove('_active');
      });
      
      buttonToRestore.classList.add('_active');
      console.log('Восстановлена кнопка:', buttonToRestore);
    }
    
    activeTabData = null;
  };
  
  if (filterPopup && filterBtn) {
    filterPopup.addEventListener('wheel', function(e) {
      e.stopPropagation();
      
      const isAtTop = this.scrollTop === 0;
      const isAtBottom = this.scrollTop + this.clientHeight >= this.scrollHeight - 1;
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    });

    filterBtn.addEventListener('click', (e) => {
      if (e.target.closest('.filter-popup')) {
        return;
      }
      
      if(filterPopup.classList.contains('_active')) {
        filterPopup.classList.remove('_active');
        filterBtn.classList.remove('_active');
        enableScroll();
        document.querySelector('.filter-popup__header')?.classList.remove('_active');
        
        restoreActiveButton();
      } else {
        saveActiveButtonState();
        
        document.querySelectorAll('.button-s._active:not(._filter)').forEach(el => {
          el.classList.remove('_active');
        });
        
        filterPopup.classList.add('_active');
        filterBtn.classList.add('_active');
        disableScroll();
        document.querySelector('.filter-popup__header')?.classList.add('_active');
      }
      
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      const filterModal = target.closest('.filter-popup');
      const clickedOnFilterBtn = target.closest('.button-s._filter');
      
      if(filterModal || clickedOnFilterBtn) {
        return;
      }
      
      if(filterPopup.classList.contains('_active')) {
        filterPopup.classList.remove('_active');
        filterBtn.classList.remove('_active');
        enableScroll();
        document.querySelector('.filter-popup__header')?.classList.remove('_active');
        
        restoreActiveButton();
      }
    });

    if(window.innerWidth <= 768) {
      const closeBtn = document.querySelector('.filter-popup__header svg');
      if(closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          enableScroll();
          e.currentTarget.parentElement.classList.remove('_active');
          filterPopup.classList.remove('_active');
          filterBtn.classList.remove('_active');
          
          restoreActiveButton();
        });
      }
    }

    if(filterElements) {
      filterElements.forEach((filterEl) => {  
        filterEl.addEventListener('click', (e) => {

          filterElements.forEach(el => el.classList.remove('_active'));
          e.currentTarget.classList.add('_active');

          enableScroll();
          e.currentTarget.parentElement.classList.remove('_active');
          filterPopup.classList.remove('_active');
          filterBtn.classList.remove('_active');

          restoreActiveButton();
          
          const filterValue = e.currentTarget.dataset.filterValue;
          if(filterValue) {
            const correspondingButton = document.querySelector(`[data-tab="${filterValue}"]`);
            if(correspondingButton) {
              correspondingButton.classList.add('_active');
            }
          }
        });
      });
    }
  }
});