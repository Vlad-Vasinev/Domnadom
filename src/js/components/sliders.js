
import { onWinLoad } from '../functions/onDocLoad';
import { responsiveSize } from './dom/responsive-size';

onWinLoad(initSliders);

function initSliders() {


  //dSlider()

  if(window.innerWidth <= 768) {
    productSlider()
    productSliderNews()
    productSmallSlider()
    houseSlider()
    developesSlider()
    developersSlider()
  }

}

function productSlider() {
  new Swiper(".d-gridSlider", {
    wrapperClass: "d-grid",
    slideClass: "d-card",
    breakpoints: {
      200: {
        slidesPerView: 1.2,
        spaceBetween: 10,
      },
    },
  });
}

function houseSlider() {
  new Swiper(".house-preview__content", {
    wrapperClass: "house-preview__content-main",
    slideClass: "house-preview__content-item",
    breakpoints: {
      200: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
    },
    speed: 800,
    loop: true,
    pagination: {
      el: ".slider-pagination",
      type: "bullets",
      clickable: "true",
    },
  });
}

function developersSlider() {

  const lastSlide = document.querySelector('.developers-imgGrid__item._last');
  if (lastSlide) {
    lastSlide.remove();
  }

  new Swiper(".developers-imgGrid", {
    wrapperClass: "developers-imgGrid__wrapper",
    slideClass: "developers-imgGrid__item",
    breakpoints: {
      200: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
    },
    speed: 800,
    loop: true,
    pagination: {
      el: ".slider-pagination",
      type: "bullets",
      clickable: "true",
    },
  });
}

function productSmallSlider() {
  new Swiper(".d-gridSliderSmall", {
    wrapperClass: "d-grid",
    slideClass: "d-gridCard",
    breakpoints: {
      200: {
        slidesPerView: 1.4,
        spaceBetween: 10,
      },
    },
  });
}

function developesSlider() {
  new Swiper(".developers-block__slider", {
    wrapperClass: "developers-block__content",
    slideClass: "developers-block__content-item",
    breakpoints: {
      200: {
        slidesPerView: 1.4,
        spaceBetween: 8,
      },
    },
  });
}

function productSliderNews() {
  new Swiper(".d-newsSlider", {
    wrapperClass: "d-news",
    slideClass: "d-news__el",
    breakpoints: {
      200: {
        slidesPerView: 1.2,
        spaceBetween: 10,
      },
    },
  });
}

let arrNumber = ['0.1670998632010944', '6.5670998632010944', '13.5670998632010944', '19.5670998632010944', '27.1670998632010944', '37.1670998632010944', '46.1670998632010944', '55.1670998632010944', '65.1670998632010944', '75.1670998632010944', '81.1670998632010944', '87.5670998632010944', '99.03080711354309']
let arrNumberLength = arrNumber.length
let interval 
let previousRealIndex = 0;

function dSlider() {
  let bgSwiper = new Swiper(".d-slider", {
    wrapperClass: "d-slider__wrapper",
    slideClass: "d-slider__card",
    loop: true,
    speed: 800,
    breakpoints: {
      200: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
    },
    pagination: {
      el: ".swiper-pagination",
    },
    on: {
      afterInit: function (swiper) {
        const swiperEssence = swiper.el
        const swiperBullets = swiperEssence.querySelectorAll('.swiper-pagination-bullet')

        if(window.innerWidth >= 768) {
          const responsiveBullet = responsiveSize(87, 768, 2560)
          swiperEssence.style.setProperty('--bulletWidth', `${responsiveBullet / (swiperBullets.length)}%`)
        }
        else {
          swiperEssence.style.setProperty('--bulletWidth', `${87 / (swiperBullets.length)}%`)
        }

        swiperBullets.forEach((bullet, index) => {
          bullet.setAttribute('data-slide-index', index);
          bullet.classList.remove('completed');
        });

        previousRealIndex = swiper.realIndex; 
        
        animateTextForSlide(swiper);
        
        startSlideProgress(swiper);
      },
      slideChangeTransitionStart: function () {
        clearInterval(interval)
        document.querySelector('.d-slider').style.setProperty('--currentTime', 0)

        const videos = document.querySelectorAll('.d-slider video');
        videos.forEach(video => {
          video.pause();
          video.currentTime = 0;
        });

        const allTitles = document.querySelectorAll('.movable-title');
        if(allTitles.length > 0) {
          allTitles.forEach(title => {
            title.classList.remove('animate-text');
            title.style.animationDelay = '';
          });
  
          startSlideProgress(this);
        }

      },

      slideChangeTransitionEnd: function () {
        const realIndex = this.realIndex;
        const bullets = this.pagination.bullets;
        const slidesCount = this.slides.length - (this.params.loop ? 2 : 0);
        
        if (previousRealIndex === slidesCount - 1 && realIndex === 0) {
          bullets.forEach(bullet => {
            bullet.classList.remove('completed');
          });
        }
        else if (previousRealIndex === 0 && realIndex === slidesCount - 1) {
          bullets.forEach(bullet => {
            bullet.classList.remove('completed');
          });
        }
        else if (realIndex > previousRealIndex) {
          bullets.forEach((bullet, index) => {
            if (index < realIndex) {
              bullet.classList.add('completed');
            }
          });
        }
        else if (realIndex < previousRealIndex) {
          bullets.forEach((bullet, index) => {
            if (index >= realIndex) {
              bullet.classList.remove('completed');
            }
          });
        }

        animateTextForSlide(this);
        
        previousRealIndex = realIndex;
      },
    },
  });

  function animateTextForSlide(swiper) {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const titles = activeSlide.querySelectorAll('.movable-title');
    
    if (titles.length > 0) {
      titles.forEach((title, index) => {
        title.classList.remove('animate-text');
        
        void title.offsetWidth;
        
        title.style.animationDelay = `${index * 0.2}s`;
        
        title.classList.add('animate-text');
      });
    }
  }

  function startSlideProgress(swiper) {
    let count = arrNumber.length
    let countArr = 0
    let realIndex = swiper.realIndex;
    let activeSlide = swiper.slides[swiper.activeIndex].querySelector('video');
    let activeSlideImg = swiper.slides[swiper.activeIndex].querySelector('img');
    const bullets = swiper.pagination.bullets;
    const slidesCount = swiper.slides.length - (swiper.params.loop ? 2 : 0);

    if (activeSlide) {
      clearInterval(interval) 
      activeSlide.play();

      activeSlide.addEventListener('timeupdate', () => {
        let percent = ((activeSlide.currentTime / 7.35) * 100) + "%"
        document.querySelector('.d-slider').style.setProperty('--currentTime', `${percent}`);
        
        if(activeSlide.currentTime >= 7.35) {
          if (bullets[realIndex]) {
            bullets[realIndex].classList.add('completed');
          }
          
          const allCompleted = Array.from(bullets).every(bullet => bullet.classList.contains('completed'));
          if (allCompleted) {
            bullets.forEach(bullet => {
              bullet.classList.remove('completed');
            });
          }
          
          bgSwiper.slideNext()
        } 
      })
    }
    else if(activeSlideImg) { 
      if(count > 0) {
        interval = setInterval(() => {
          if(count > 0) {
            let percent = parseInt(arrNumber[countArr]) + "%"
            document.querySelector('.d-slider').style.setProperty('--currentTime', `${percent}`);
            
            count--
            countArr++
          }
          else {  
            clearInterval(interval)
            if (bullets[realIndex]) {
              bullets[realIndex].classList.add('completed');
            }
            
            const allCompleted = Array.from(bullets).every(bullet => bullet.classList.contains('completed'));
            if (allCompleted) {
              bullets.forEach(bullet => {
                bullet.classList.remove('completed');
              });
            }
            
            count = arrNumberLength
            countArr = 0
            bgSwiper.slideNext()
          }
        }, 230)
      }
      else {
        clearInterval(interval)
      }
    }
  }
}