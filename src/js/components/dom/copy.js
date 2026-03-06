
import { onDocLoad } from '../../functions/onDocLoad';

onDocLoad(() => {
  console.log('Copy script initializing');
  
  const copyDsk = document.querySelector('.copy.copy--dsk');
  const copyMob = document.querySelector('.copy.copy--mob');
  const shareDsk = document.querySelector('.share-dsk');
  const shareMob = document.querySelector('.share-mob');
  
  [copyDsk, copyMob].forEach(copyEl => {
    if (copyEl) {
      const h3 = copyEl.querySelector('.h3');
      if (h3) {
        h3.dataset.originalText = h3.textContent;
      }
    }
  });
  
  function handleShareClick(event, copyElement) {
    event.preventDefault();
    event.stopPropagation();
    
    [copyDsk, copyMob].forEach(el => {
      if (el) el.classList.remove('copy--copied');
    });
    
    if (copyElement) {
      copyElement.classList.add('copy--copied');
    }
  }
  
  async function handleCopyClick(event, copyElement) {
    event.preventDefault();
    event.stopPropagation();
    
    const url = copyElement.dataset.url || window.location.href;
    const h3 = copyElement.querySelector('.h3');
    
    if (!h3) return;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      h3.textContent = 'Скопировано!';
      copyElement.classList.add('copy--active');
      
      setTimeout(() => {
        h3.textContent = h3.dataset.originalText || 'Скопировать ссылку';
        copyElement.classList.remove('copy--active');
        copyElement.classList.remove('copy--copied');
      }, 1300);
      
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Не удалось скопировать: ' + url);
    }
  }
  
  if (shareDsk && copyDsk) {
    shareDsk.addEventListener('click', (e) => handleShareClick(e, copyDsk));
    shareDsk.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleShareClick(e, copyDsk);
    }, { passive: false });
    
    copyDsk.addEventListener('click', (e) => handleCopyClick(e, copyDsk));
    copyDsk.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleCopyClick(e, copyDsk);
    }, { passive: false });
  }
  
  if (shareMob && copyMob) {
    shareMob.addEventListener('click', (e) => handleShareClick(e, copyMob));
    shareMob.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleShareClick(e, copyMob);
    }, { passive: false });
    
    copyMob.addEventListener('click', (e) => handleCopyClick(e, copyMob));
    copyMob.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleCopyClick(e, copyMob);
    }, { passive: false });
  }
  
  document.addEventListener('click', (e) => {
    const target = e.target;
    const isOurElement = target.closest('.share-dsk, .share-mob, .copy');
    
    if (!isOurElement) {
      [copyDsk, copyMob].forEach(el => {
        if (el) {
          el.classList.remove('copy--copied');
          const h3 = el.querySelector('.h3');
          if (h3 && h3.dataset.originalText) {
            h3.textContent = h3.dataset.originalText;
          }
        }
      });
    }
  }, true);
});