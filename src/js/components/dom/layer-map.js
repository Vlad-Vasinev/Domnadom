import { responsiveSize } from "../../functions/aPixels";

const layerMaps = document.querySelectorAll('.layer-map')

async function getData (url) {

  const response = await fetch(url)

  if(!response.ok) {
    throw new Error(`Error status: ${response}: ${response.statusText} - ${url}`)
  }

  const resJson = await response.json()
  return resJson

}

function setData(data, card, layerImg, layerData = [], mapsBlock) {
  if(mapsBlock.length !== 0) {

    data.forEach((el) => { 
      layerData.push(el)
    })

    let isHovering = false;
    let leaveTimeout = null;

    const activeHouse = new Set(layerData.filter(el => el.active).map(el => el.id))
    const dataLinks = document.querySelectorAll('[data-link-id]')
    
    const filteredData = Array.from(dataLinks).filter(el => {
      const linkId = el.dataset.linkId 
      return layerData.some(el => el.id === linkId)
    })

    const filteredDataMob = Array.from(dataLinks).filter(el => {
      const linkId = el.dataset.linkId 
      return layerData.every(el => el.id !== linkId)
    })
    if(window.innerWidth <= 768) {
      filteredDataMob.forEach((el) => {
        el.removeAttribute('data-modal-side')
      })
    }

    addBadgesToMap(layerData);
    filteredData.forEach((element, index, arr) => {

      if(layerImg.classList.contains('single-house') && window.innerWidth <= 768 && activeHouse.has(element.dataset.linkId)) {
        element.removeAttribute('data-modal-side')
      }

      if(activeHouse.has(element.dataset.linkId)) {
        element.querySelector('.layer-map__path').classList.add('house-path_active')
        const rect = element.querySelector('.badge-group .badge-rect');
        if (rect) {
          rect.setAttribute('fill', '#0000004d');
        }
      }
      else {
        arr.forEach((el) => {
          const rect = el.querySelector('.badge-group .badge-rect');
          if (rect) {
            rect.setAttribute('fill', '#0000004d');
          }
        });
      }

      if(window.innerWidth >= 768 && !layerImg.classList.contains('single-house')) {

        element.addEventListener('mouseenter', (e) => {

          element.classList.add('_active')
          let currId  = element.dataset.linkId
          
          const currentRect = element.querySelector('.badge-group .badge-rect');
          if (currentRect) {
            currentRect.setAttribute('fill', '#000000');
            e.target.querySelector('.layer-map__path').classList.add('house-path_active')
          }
  
          if (leaveTimeout) {
            clearTimeout(leaveTimeout);
            leaveTimeout = null;
          }
  
          isHovering = true;
          const currEl = layerData.filter((el) => {
            return el.id == currId
          })
  
          element.setAttribute('href', `${currEl[0].link}`)

          card.querySelector('.small-card__content img').setAttribute('src', currEl[0].imgLink) 
          card.querySelector('.small-card__info .text-lBold._title').innerHTML = currEl[0].title
          card.querySelector('.small-card__info .text-lBold._size').innerHTML = currEl[0].size
  
          if(card.querySelector('.small-card__description .icon img')) {
            card.querySelector('.small-card__description .icon img').setAttribute('src', currEl[0].descriptionIcon)
          }
          card.querySelector('.small-card__description .caps-m').innerHTML = currEl[0].descriptionTitle
          //card.querySelector('.small-card__description .caps-m').innerHTML = currEl[0].descriptionTitle
          if(currEl[0].review === null) {
            card.querySelector('.small-card__description .star').style.display = "none"
          }
          if(currEl[0].reviewCount === null) {
            card.querySelector('.small-card__description .review').style.display = "none"
          }
          if(currEl[0].review !== null){
            card.querySelector('.small-card__description .star').style.display = "flex"
          }
          if(currEl[0].reviewCount !== null){
            card.querySelector('.small-card__description .review').style.display = "flex"
          }
          card.querySelector('.small-card__description .star .text-s').innerHTML = currEl[0].review
          card.querySelector('.small-card__description .review p.text-s').innerHTML = currEl[0].reviewCount
          card.querySelector('.small-card__description .review span.text-s').innerHTML = currEl[0].reviewText
  
          let itemLeft = element.getBoundingClientRect().left - layerImg.getBoundingClientRect().left + (element.getBoundingClientRect().width / 2)
          let itemTop = element.getBoundingClientRect().top - layerImg.getBoundingClientRect().top + (element.getBoundingClientRect().height / 2)
          card.style.setProperty('--data-text-left', `${itemLeft}px`)
          const elementHeight = responsiveSize(260, 768, 2560)
          card.style.setProperty('--data-text-top', `${itemTop - elementHeight}px`)
  
          card.classList.add('layers__info_active')
  
        })

        if(window.innerWidth >= 768) {
          element.addEventListener('mouseleave', (e) => {
            isHovering = false;
            if(!activeHouse.has(element.dataset.linkId)) {
              element.querySelector('.layer-map__path').classList.remove('house-path_active')
              const rect = element.querySelector('.badge-group .badge-rect');
              if (rect) {
                rect.setAttribute('fill', '#0000004d');
              }
            }
            if(activeHouse.has(element.dataset.linkId)) {
              const rect = element.querySelector('.badge-group .badge-rect');
              if (rect) {
                rect.setAttribute('fill', '#0000004d');
              }
            }
            leaveTimeout = setTimeout(() => {
              if (!isHovering) {
                card.classList.remove('layers__info_active')
              }
              leaveTimeout = null;
            }, 100)
          })  
        }
      }

      if(window.innerWidth >= 768 && layerImg.classList.contains('single-house')) {

        if(!activeHouse.has(element.dataset.linkId)) {
                  element.addEventListener('mouseenter', (e) => {

          element.classList.add('_active')
          let currId  = element.dataset.linkId
          
          const currentRect = element.querySelector('.badge-group .badge-rect');
          if (currentRect) {
            currentRect.setAttribute('fill', '#000000');
            e.target.querySelector('.layer-map__path').classList.add('house-path_active')
          }
  
          if (leaveTimeout) {
            clearTimeout(leaveTimeout);
            leaveTimeout = null;
          }
  
          isHovering = true;
          const currEl = layerData.filter((el) => {
            return el.id == currId
          })
  
          element.setAttribute('href', `${currEl[0].link}`)

          card.querySelector('.small-card__content img').setAttribute('src', currEl[0].imgLink) 
          card.querySelector('.small-card__info .text-lBold._title').innerHTML = currEl[0].title
          card.querySelector('.small-card__info .text-lBold._size').innerHTML = currEl[0].size
  
          if(card.querySelector('.small-card__description .icon img')) {
            card.querySelector('.small-card__description .icon img').setAttribute('src', currEl[0].descriptionIcon)
          }
          card.querySelector('.small-card__description .caps-m').innerHTML = currEl[0].descriptionTitle
          if(currEl[0].review === null) {
            card.querySelector('.small-card__description .star').style.display = "none"
          }
          if(currEl[0].reviewCount === null) {
            card.querySelector('.small-card__description .review').style.display = "none"
          }
          if(currEl[0].review !== null){
            card.querySelector('.small-card__description .star').style.display = "flex"
          }
          if(currEl[0].reviewCount !== null){
            card.querySelector('.small-card__description .review').style.display = "flex"
          }
          card.querySelector('.small-card__description .star .text-s').innerHTML = currEl[0].review
          card.querySelector('.small-card__description .review p.text-s').innerHTML = currEl[0].reviewCount
          card.querySelector('.small-card__description .review span.text-s').innerHTML = currEl[0].reviewText
  
          let itemLeft = element.getBoundingClientRect().left - layerImg.getBoundingClientRect().left + (element.getBoundingClientRect().width / 2)
          let itemTop = element.getBoundingClientRect().top - layerImg.getBoundingClientRect().top + (element.getBoundingClientRect().height / 2)
          card.style.setProperty('--data-text-left', `${itemLeft}px`)
          const elementHeight = responsiveSize(260, 768, 2560)
          card.style.setProperty('--data-text-top', `${itemTop - elementHeight}px`)
  
          card.classList.add('layers__info_active')
  
        })

        if(window.innerWidth >= 768) {
          element.addEventListener('mouseleave', (e) => {
            isHovering = false;
            if(!activeHouse.has(element.dataset.linkId)) {
              element.querySelector('.layer-map__path').classList.remove('house-path_active')
              const rect = element.querySelector('.badge-group .badge-rect');
              if (rect) {
                rect.setAttribute('fill', '#0000004d');
              }
            }
            if(activeHouse.has(element.dataset.linkId)) {
              const rect = element.querySelector('.badge-group .badge-rect');
              if (rect) {
                rect.setAttribute('fill', '#0000004d');
              }
            }
            leaveTimeout = setTimeout(() => {
              if (!isHovering) {
                card.classList.remove('layers__info_active')
              }
              leaveTimeout = null;
            }, 100)
          })  
        }
        }


      }

      if(window.innerWidth <= 768 && !layerImg.classList.contains('single-house')) {
        element.addEventListener('click', (e) => {

          //console.log('mobile click')

          let currId  = element.dataset.linkId
          arr.forEach((el) => {
            const rect = el.querySelector('.badge-group .badge-rect');
            if (rect) {
              rect.setAttribute('fill', '#0000004d');
            }
          });
          const currentRect = element.querySelector('.badge-group .badge-rect');
          if (currentRect) {
            currentRect.setAttribute('fill', '#000000');
            e.currentTarget.querySelector('.layer-map__path').classList.add('house-path_active')
          }
  
          if (leaveTimeout) {
            clearTimeout(leaveTimeout);
            leaveTimeout = null;
          }

          if(activeHouse) {
            arr.forEach((el) => {
              if(activeHouse.has(el.dataset.linkId)) {
                el.querySelector('.layer-map__path').setAttribute('fill', '#f55404')
                el.querySelector('.layer-map__path').style.opacity = "0.7"
              }
            })
          }

          isHovering = true;
          const currEl = layerData.filter((el) => {
            return el.id == currId
          })
          //console.log(currEl)

          setTimeout(() => {
            const popupLayer = document.querySelector('.popup._layer-mob')

            popupLayer.querySelector('.small-card').setAttribute('href', `${currEl[0].link}`)
            popupLayer.querySelector('.small-card__content img').setAttribute('src', currEl[0].imgLink) 
            popupLayer.querySelector('.small-card__info .text-lBold._title').innerHTML = currEl[0].title
            popupLayer.querySelector('.small-card__info .text-lBold._size').innerHTML = currEl[0].size
            if(popupLayer.querySelector('.small-card__description .icon img')) {
              popupLayer.querySelector('.small-card__description .icon img').setAttribute('src', currEl[0].descriptionIcon)
            }
            if(currEl[0].review === null) {
              popupLayer.querySelector('.small-card__description .star').style.display = "none"
            }
            if(currEl[0].reviewCount === null) {
              popupLayer.querySelector('.small-card__description .review').style.display = "none"
            }
            if(currEl[0].review !== null){
              popupLayer.querySelector('.small-card__description .star').style.display = "flex"
            }
            if(currEl[0].reviewCount !== null){
              popupLayer.querySelector('.small-card__description .review').style.display = "flex"
            }
            popupLayer.querySelector('.small-card__description .caps-m').textContent = currEl[0].descriptionTitle
            popupLayer.querySelector('.small-card__description .star .text-s').innerHTML = currEl[0].review
            popupLayer.querySelector('.small-card__description .review p.text-s').innerHTML = currEl[0].reviewCount
            popupLayer.querySelector('.small-card__description .review span.text-s').innerHTML = currEl[0].reviewText
          }, 200)

        })
      }
      if(window.innerWidth <= 768 && layerImg.classList.contains('single-house')) {
        if(!activeHouse.has(element.dataset.linkId)) {
          element.addEventListener('click', (e) => {
            let currId  = element.dataset.linkId
            arr.forEach((el) => {
              const rect = el.querySelector('.badge-group .badge-rect');
              if (rect) {
                rect.setAttribute('fill', '#0000004d');
              }
            });
            const currentRect = element.querySelector('.badge-group .badge-rect');
            if (currentRect) {
              currentRect.setAttribute('fill', '#000000');
              e.currentTarget.querySelector('.layer-map__path').classList.add('house-path_active')
            }
    
            if (leaveTimeout) {
              clearTimeout(leaveTimeout);
              leaveTimeout = null;
            }

            if(activeHouse) {
              arr.forEach((el) => {
                if(activeHouse.has(el.dataset.linkId)) {
                  el.querySelector('.layer-map__path').setAttribute('fill', '#f55404')
                  el.querySelector('.layer-map__path').style.opacity = "0.7"
                }
              })
            }

            isHovering = true;
            const currEl = layerData.filter((el) => {
              return el.id == currId
            })

            setTimeout(() => {
              const popupLayer = document.querySelector('.popup._layer-mob')

              popupLayer.querySelector('.small-card').setAttribute('href', `${currEl[0].link}`)
              popupLayer.querySelector('.small-card__content img').setAttribute('src', currEl[0].imgLink) 
              popupLayer.querySelector('.small-card__info .text-lBold._title').textContent = currEl[0].title
              popupLayer.querySelector('.small-card__info .text-lBold._size').textContent = currEl[0].size
              if(popupLayer.querySelector('.small-card__description .icon img')) {
                popupLayer.querySelector('.small-card__description .icon img').setAttribute('src', currEl[0].descriptionIcon)
              }
              if(currEl[0].review === null) {
                popupLayer.querySelector('.small-card__description .star').style.display = "none"
              }
              if(currEl[0].reviewCount === null) {
                popupLayer.querySelector('.small-card__description .review').style.display = "none"
              }
              if(currEl[0].review !== null){
                popupLayer.querySelector('.small-card__description .star').style.display = "flex"
              }
              if(currEl[0].reviewCount !== null){
                popupLayer.querySelector('.small-card__description .review').style.display = "flex"
              }
              popupLayer.querySelector('.small-card__description .caps-m').textContent = currEl[0].descriptionTitle
              popupLayer.querySelector('.small-card__description .star .text-s').textContent = currEl[0].review
              popupLayer.querySelector('.small-card__description .review p.text-s').textContent = currEl[0].reviewCount
              popupLayer.querySelector('.small-card__description .review span.text-s').textContent = currEl[0].reviewText
            }, 200)

          })
        }
      }
    });



    layerImg.addEventListener('mouseleave', () => {
      isHovering = false;
      if (leaveTimeout) {
        clearTimeout(leaveTimeout);
      }
      card.classList.remove('layers__info_active');
    });
  }
}

async function applyData (link, card, layerImg, layerMaps) {

  try {
    const data = await getData(link)
    setData(data, card, layerImg, [], layerMaps)
  }
  catch (error) {
    console.error('Error in data:', error)
  }
}

layerMaps.forEach(element => {
  applyData(element.dataset.layerLink, element.querySelector('.small-card'), element, layerMaps)
  if(window.innerWidth <= 768) {
    if(element.querySelector('.layer-map__scroll-container')) {
      console.log(element.querySelector('.layer-map__scroll-container'))
      enablePinchZoom(element.querySelector('.layer-map__scroll-container'))
    }
  }
});

function addBadgesToMap(data) {
  document.querySelectorAll('.layer-map__link').forEach((link) => {
    if(!link.querySelector('.badge-group')) {
      const path = link.querySelector('.layer-map__path');
      if (!path) return;
      
      const linkId = link.dataset.linkId;
      const item = data.find(item => item.id.toString() === linkId);

      if (item && item.number) {
        const number = item.number;
        
        const bbox = path.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        
        let baseSize = null 

        if(window.innerWidth >= 1921) {
          baseSize = Math.min(window.innerWidth, window.innerHeight) / 200;
        }
        if(window.innerWidth <= 1921) {
          baseSize = Math.min(window.innerWidth, window.innerHeight) / 120;
        }
        if(window.innerWidth <= 768) {
          baseSize = Math.min(window.innerWidth, window.innerHeight) / 60;
        }
        
        let rectWidth = baseSize * 5;
        const rectHeight = baseSize * 4.4;
        const fontSize = baseSize * 2.5;
        const borderRadius = baseSize * 0.9;

        if (number.length >= 3) {
          rectWidth = baseSize * (5 + (number.length - 2) * 0.9);
        }
        
        let badgeHTML = ``

        if(item.fill) {
          badgeHTML = `
            <g class="badge-group">
              <rect x="${centerX - rectWidth/2}" y="${centerY - rectHeight/2}" 
                    width="${rectWidth}" height="${rectHeight}" rx="${borderRadius}" 
                    fill="#000000" class="badge-rect"/>
              <text x="${centerX}" y="${centerY}" font-size="${fontSize}" 
                    fill="#76C976" text-anchor="middle" dominant-baseline="central" 
                    class="badge-text">${number}</text>
            </g>
          `;
        }
        else {
          badgeHTML = `
            <g class="badge-group">
              <rect x="${centerX - rectWidth/2}" y="${centerY - rectHeight/2}" 
                    width="${rectWidth}" height="${rectHeight}" rx="${borderRadius}" 
                    fill="#000000" class="badge-rect"/>
              <text x="${centerX}" y="${centerY}" font-size="${fontSize}" 
                    fill="#ffffff" text-anchor="middle" dominant-baseline="central" 
                    class="badge-text">${number}</text>
            </g>
          `;
        }
        
        link.insertAdjacentHTML('beforeend', badgeHTML);
      } else {
        console.warn(`No data found for linkId ${linkId}`);
      }
    }
  });
}

function quickCenterMap() {
    document.querySelectorAll('.layer-map._mobile').forEach(map => {
        const scrollContainer = map.querySelector('.layer-map__scroll-container');
        if (scrollContainer && window.innerWidth < 768) {
            const containerWidth = map.clientWidth;
            const containerHeight = map.clientHeight;
            
            const transform = scrollContainer.style.transform;
            const scaleMatch = transform.match(/scale\(([^)]+)\)/);
            const currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
            
            const scaledWidth = scrollContainer.scrollWidth * currentScale;
            const scaledHeight = scrollContainer.scrollHeight * currentScale;
            
            if (scaledWidth > containerWidth) {
                map.scrollLeft = (scaledWidth - containerWidth) / 2;
            }
            if (scaledHeight > containerHeight) {
                map.scrollTop = (scaledHeight - containerHeight) / 2;
            }
        }
    });
}

quickCenterMap();

function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

if(window.innerWidth <= 768 && isIOS()) {
  document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
        event.preventDefault();
    }
}, { passive: false });

  document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
  });

  document.addEventListener('gesturechange', function(e) {
      e.preventDefault();
  });

  document.addEventListener('gestureend', function(e) {
      e.preventDefault();
  });
}

function enablePinchZoom(element) {
    const MIN_SCALE = 1;
    const MAX_SCALE = 1.3;
    
    let scale = MIN_SCALE;
    let startScale = MIN_SCALE;
    let startDistance = 0;
    let startX1 = 0, startY1 = 0, startX2 = 0, startY2 = 0;
    
    const mapContainer = element.closest('.layer-map._mobile');
    
    element.style.zoom = MIN_SCALE;
    element.style.transform = `scale(${MIN_SCALE})`;
    
    element.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            startX1 = e.touches[0].clientX;
            startY1 = e.touches[0].clientY;
            startX2 = e.touches[1].clientX;
            startY2 = e.touches[1].clientY;
            
            startDistance = Math.sqrt(
                Math.pow(startX2 - startX1, 2) + 
                Math.pow(startY2 - startY1, 2)
            );
            startScale = scale;
        }
    });
    
    element.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            
            const currentX1 = e.touches[0].clientX;
            const currentY1 = e.touches[0].clientY;
            const currentX2 = e.touches[1].clientX;
            const currentY2 = e.touches[1].clientY;
            
            const currentDistance = Math.sqrt(
                Math.pow(currentX2 - currentX1, 2) + 
                Math.pow(currentY2 - currentY1, 2)
            );
            
            if (startDistance > 0) {
                // Вычисляем новый масштаб
                const newScale = startScale * (currentDistance / startDistance);
                
                // Ограничиваем
                const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
                
                // Если масштаб изменился, обновляем
                if (Math.abs(clampedScale - scale) > 0.001) {
                    scale = clampedScale;
                    element.style.zoom = scale;
                    element.style.transform = `scale(${scale})`;
                    
                    // Сбрасываем startScale при изменении масштаба
                    startScale = scale;
                }
                
                // Панорамирование всегда работает
                const dx1 = currentX1 - startX1;
                const dy1 = currentY1 - startY1;
                const dx2 = currentX2 - startX2;
                const dy2 = currentY2 - startY2;
                
                const avgDx = (dx1 + dx2) / 2;
                const avgDy = (dy1 + dy2) / 2;
                
                mapContainer.scrollLeft -= avgDx * scale;
                mapContainer.scrollTop -= avgDy * scale;
                
                // Обновляем позиции
                startX1 = currentX1;
                startY1 = currentY1;
                startX2 = currentX2;
                startY2 = currentY2;
                startDistance = currentDistance;
            }
        }
    });
}