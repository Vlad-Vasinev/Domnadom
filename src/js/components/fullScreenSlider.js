import vanillaLazy from "vanilla-lazyload";
import getChildIndex from '../functions/getChildIndex'
import { disableScroll } from '.././functions/disable-scroll';
import { enableScroll } from '.././functions/disable-scroll';

export default class fsSlider {
  constructor(sliderEl) {
    this.fsEl = sliderEl
    this.fsSliderEl = this.fsEl.querySelector('.swiper-container')
    this.fsWrpEl = this.fsEl.querySelector('.swiper-wrapper')
    this.sldTpl = this.fsEl.querySelector('#slide-tpl')
    this.sldSel = '.' + this.sldTpl.content.firstElementChild.classList[0]
    this.fsClose = this.fsEl.querySelector('[data-fs-close]')
    this.slides = []
    this.currCtr = undefined
    this.lastCtr = undefined
    this.thumbnailPagination = null;
    this.isMobile = window.innerWidth < 768;
    this.init()
    
    window.addEventListener('resize', this.handleResize.bind(this));
    const gridImages = document.querySelector('.grid-images')

    if(gridImages) {
      const gridImagesOpen = document.querySelectorAll('.developers-imgGrid .open-grid')
      const gridImagesClose = gridImages.querySelector('.grid-images__close')
      gridImagesOpen.forEach((el) => {
        el.addEventListener('click', () => {
          gridImages.classList.add('_active')
          disableScroll()
        })
      })
  
      gridImagesClose.addEventListener('click', () => {
        gridImages.classList.remove('_active')
        enableScroll()
      })
    }
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768; 

    if (wasMobile !== this.isMobile && this.fsEl.classList.contains('_active')) {
      this.recreatePagination();
    }
  }
  
  recreatePagination() {
    // Remove existing custom pagination
    if (this.thumbnailPagination) {
      this.thumbnailPagination.remove();
      this.thumbnailPagination = null;
    }
    
    // Get current srcArr from mounted slides
    const srcArr = Array.from(this.slides).map(slide => {
      const img = slide.querySelector('img');
      return img ? img.dataset.src : '';
    }).filter(src => src);
    
    if (this.isMobile && srcArr.length > 0 && !fsCtr.classList.contains('dev-slider')) {
      this.createThumbnailPagination(srcArr);
    }
  }
  
  init() {
    document.querySelectorAll('[data-fs-ctr]:not(._fs-inited)').forEach((fsCtr) => {
      if(fsCtr.classList.contains('dev-slider')) {
        console.log('contains')
      }
      else {
        console.log('!contains')
      }
      const sldArr = fsCtr.querySelectorAll('[data-fs-full]')
      sldArr.forEach((el) => {
        let srcArr = Array.from(sldArr).map(el => el.dataset.fsFull)
        if (fsCtr.dataset.fsSrcset) {
          srcArr = srcArr.concat(fsCtr.dataset.fsSrcset.split(','))
        }
        el.addEventListener('click', (e) => { this.openSlider(e, srcArr, fsCtr) })
      })
      fsCtr.classList.add('_fs-inited')
    })
  }
  
  openSlider(event = undefined, srcArr = undefined, fsCtr = null) {
    if (!this.lastCtr) {
      this.lastCtr = fsCtr
      this.slides = this.mountSlides(srcArr)
    } else if (this.lastCtr === fsCtr) {
      // Already set up
    } else if (fsCtr) {
      this.lastCtr = fsCtr
      this.removeSlides()
      this.slides = this.mountSlides(srcArr)
    }

    // Create custom pagination only on mobile
    if (this.isMobile && !fsCtr.classList.contains('dev-slider')) {
      this.createThumbnailPagination(srcArr);
    }

    this.vl = new vanillaLazy({
      container: this.fsSliderEl,
      unobserve_entered: true,
      thresholds: '-2%',
      class_loaded: 'is-loaded',
      callback_loaded: function (el) {
        el.parentElement.classList.add('is-loaded')
        setTimeout(() => el.parentElement.style.backgroundImage = '', 1500)
      },
      callback_finish: function () {
        this.vl.destroy()
      }.bind(this)
    }, Array.from(this.slides).map(el => el.querySelector('img')).filter(el => el));

    this.fsClose.addEventListener('click', this.closeSlider.bind(this), { once: true })

    // Swiper configuration - conditionally enable pagination
    const swiperConfig = {
      wrapperClass: 'swiper-wrapper',
      slideClass: 'swiper-slide',
      loop: true,
      slidesPerView: 1,
      navigation: {
        nextEl: '.fullscreen-slider .slider-pagination-navigation .slider-navigation-next',
        prevEl: '.fullscreen-slider .slider-pagination-navigation .slider-navigation-prev',
      },
      on: {
        init: () => {
          if (this.isMobile) {
            this.centerActiveThumbnail();
          }
        },
        slideChange: () => {
          if (this.isMobile) {
            this.centerActiveThumbnail();
          }
        },
        slideChangeTransitionEnd: () => {
          if (this.isMobile) {
            this.updateActiveThumbnail();
          }
        }
      }
    };

    // Only add default pagination on desktop
    if (!this.isMobile) {
      swiperConfig.pagination = {
        el: '.fullscreen-slider .slider-pagination-navigation .swiper-pagination',
        clickable: true,
        type: 'bullets'
      };
    }
    else if(this.isMobile) {
      if(fsCtr.classList.contains('dev-slider')) {
        swiperConfig.pagination = {
          el: '.fullscreen-slider .slider-pagination-navigation .swiper-pagination',
          clickable: true,
          type: 'bullets'
        };
        //fsCtr.parentElement.querySelector('.slider-pagination-navigation').style.display = "flex"
      }
    }

    this.fsSliderObj = new Swiper(this.fsSliderEl, swiperConfig);

    this.fsEl.classList.add('_active')
    disableScroll()
  }

  createThumbnailPagination(srcArr) {
    // Remove existing custom pagination if any
    if (this.thumbnailPagination) {
      this.thumbnailPagination.remove();
    }

    // Create custom pagination container
    this.thumbnailPagination = document.createElement('div');
    this.thumbnailPagination.className = 'thumbnail-pagination';
    
    // Find where to insert the pagination
    const paginationContainer = this.fsEl.querySelector('.slider-pagination-navigation');
    if (paginationContainer) {
      // Hide default pagination on mobile
      const defaultPagination = paginationContainer.querySelector('.swiper-pagination');
      if (defaultPagination) {
        defaultPagination.style.display = 'none';
      }
      paginationContainer.appendChild(this.thumbnailPagination);
    } else {
      this.fsEl.appendChild(this.thumbnailPagination);
    }

    // Create thumbnail bullets
    srcArr.forEach((src, index) => {
      const bullet = document.createElement('div');
      bullet.className = 'thumbnail-bullet';
      bullet.dataset.index = index;
      
      if (index === 0) {
        bullet.classList.add('thumbnail-bullet-active');
      }
      
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Thumbnail ${index + 1}`;
      
      bullet.appendChild(img);
      bullet.addEventListener('click', () => {
        this.fsSliderObj.slideToLoop(index);
        // Force centering after click with a small delay
        setTimeout(() => {
          this.centerActiveThumbnail();
        }, 100);
      });
      
      this.thumbnailPagination.appendChild(bullet);
    });
  }

  updateActiveThumbnail() {
    if (!this.isMobile || !this.thumbnailPagination) return;
    
    const activeIndex = this.fsSliderObj.realIndex;
    const bullets = this.thumbnailPagination.querySelectorAll('.thumbnail-bullet');
    
    bullets.forEach((bullet, index) => {
      if (index === activeIndex) {
        bullet.classList.add('thumbnail-bullet-active');
      } else {
        bullet.classList.remove('thumbnail-bullet-active');
      }
    });
    
    this.centerActiveThumbnail();
  }

  centerActiveThumbnail() {
    if (!this.isMobile || !this.thumbnailPagination) return;
  
    const activeBullet = this.thumbnailPagination.querySelector('.thumbnail-bullet-active');
    if (!activeBullet) return;
  
    const container = this.thumbnailPagination;
    
    // Get the container's center point
    const containerCenter = container.offsetWidth / 2;
    
    // Get the bullet's center point relative to the container
    const bulletCenter = activeBullet.offsetLeft + (activeBullet.offsetWidth / 2);
    
    // Calculate how much we need to scroll to align centers
    const scrollLeft = bulletCenter - containerCenter;
    
    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  }

  closeSlider() {
    this.fsEl.classList.remove('_active')
    enableScroll()
    this.fsEl.addEventListener('transitionend', () => {
      if (this.vl._settings) {
        this.vl.destroy()
      }
      this.fsSliderObj.destroy()
      
      // Clean up custom pagination
      if (this.thumbnailPagination) {
        this.thumbnailPagination.remove();
        this.thumbnailPagination = null;
      }
      
      // Show default pagination again if it was hidden
      const defaultPagination = this.fsEl.querySelector('.swiper-pagination');
      if (defaultPagination) {
        defaultPagination.style.display = '';
      }
    }, { once: true })
  }

  mountSlides(srcArr) {
    srcArr.forEach((src) => {
      const slide = this.sldTpl.content.firstElementChild.cloneNode(true)
      slide.querySelector('img').dataset.src = src
      this.fsWrpEl.appendChild(slide)
    })
    return this.fsWrpEl.querySelectorAll(this.sldSel)
  }

  removeSlides() {
    this.slides.forEach((el) => { el.remove() })
    this.slides = []
  }
}