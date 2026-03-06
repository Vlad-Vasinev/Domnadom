import { onDocLoad } from '../../functions/onDocLoad';

onDocLoad(() => {
  const pageBlocks = document.querySelectorAll('.page__block');
  const fixedIcon = document.querySelector('.d-fixedBlock__icon');

  const setColor = (color, type) => {
    if (type === 'svg') {
      document.body.style.setProperty('--fixedColor', color);
    } else if (type === 'text') {
      document.body.style.setProperty('--fixedTextColor', color);
    }
  }

  if(window.innerWidth >= 768) {
    if(fixedIcon) {
      fixedIcon.addEventListener('click', () => {
        const firstBlock = document.getElementById('firstBlock')

        firstBlock.scrollIntoView({
          behavior: 'smooth'
        })
      })
    }
  }



  let currentBlockForSvg = null;
  let currentBlockForText = null;

  function updateFixedColors() {
    if(window.innerWidth < 768) return;
    
    const iconTop = fixedIcon.getBoundingClientRect().top;
    
    let svgBlock = null;
    let textBlock = null;
    let closestSvg = Infinity;
    
    for (let block of pageBlocks) {
      const rect = block.getBoundingClientRect();
      const blockCenter = rect.top + rect.height / 2;
      
      const svgDist = Math.abs(iconTop - blockCenter);
      if (svgDist < closestSvg) {
        closestSvg = svgDist;
        svgBlock = block;
      }
    
    }

    if (svgBlock !== currentBlockForSvg) {
      currentBlockForSvg = svgBlock;
      setColor(svgBlock.classList.contains('_black') ? '#000000' : '#ffffff', 'svg');
    }
    
    if (textBlock !== currentBlockForText) {
      currentBlockForText = textBlock;
      setColor(textBlock.classList.contains('_black') ? '#000000' : '#ffffff', 'text');
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateFixedColors();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateFixedColors();
  window.addEventListener('resize', updateFixedColors);
})
