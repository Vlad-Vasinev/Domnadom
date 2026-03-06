
import { onDocLoad } from '../../functions/onDocLoad'

onDocLoad(() => {
  const textTruncate = document.querySelectorAll('.text-truncate');

  textTruncate.forEach((textBlock) => {
    const wrapper = textBlock.querySelector('.text-truncate__wrapper');
    const btn = textBlock.querySelector('.text-truncate__btn');
    
    if (!btn || !wrapper) return;
    
    const btnText = btn.querySelector('.btn-accent');
    
    const originalHTML = wrapper.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    const originalParagraphs = tempDiv.querySelectorAll('p');
    
    let totalChars = 0;
    originalParagraphs.forEach(p => {
      totalChars += p.textContent.replace(/\s+/g, ' ').trim().length;
    });
    
    if (totalChars <= 700) {
      btn.style.display = 'none';
      wrapper.classList.remove('text-hidden');
      wrapper.style.height = 'auto';
      return;
    }
    
    function createTruncatedVersion() {
      let charCount = 0;
      const maxChars = 700;
      let truncatedHTML = '';
      
      for (let i = 0; i < originalParagraphs.length; i++) {
        const p = originalParagraphs[i];
        const text = p.textContent.replace(/\s+/g, ' ').trim();
        
        if (charCount >= maxChars) break;
        
        const remainingChars = maxChars - charCount;
        
        if (text.length <= remainingChars) {
          truncatedHTML += p.outerHTML;
          charCount += text.length;
        } else {
          const textToCheck = text.substring(0, remainingChars);
          const lastSpaceIndex = textToCheck.lastIndexOf(' ');
          const truncateAt = lastSpaceIndex > 30 ? lastSpaceIndex : remainingChars;
          
          const truncatedText = text.substring(0, truncateAt).trim() + '...';
          
          const newP = document.createElement('p');
          newP.className = p.className;
          newP.textContent = truncatedText;
          truncatedHTML += newP.outerHTML;
          
          break; 
        }
      }
      
      return truncatedHTML;
    }
    
    const truncatedHTML = createTruncatedVersion();
    let isExpanded = false;
    
    wrapper.innerHTML = truncatedHTML;
    
    const truncatedHeight = wrapper.scrollHeight;
    
    wrapper.style.height = truncatedHeight + 'px';
    wrapper.classList.add('text-hidden');
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (!isExpanded) {
        wrapper.innerHTML = originalHTML;
        const fullHeight = wrapper.scrollHeight;
        
        wrapper.style.height = truncatedHeight + 'px';
        void wrapper.offsetHeight; 

        wrapper.style.height = fullHeight + 'px';
        wrapper.classList.remove('text-hidden');
        
        btnText.textContent = "Свернуть";
        btn.querySelector('svg')?.classList.add('_active');
        
        setTimeout(() => {
          wrapper.style.height = 'auto';
        }, 400);
        
        isExpanded = true;
      } else {
        const currentHeight = wrapper.scrollHeight;
        wrapper.style.height = currentHeight + 'px';
        void wrapper.offsetHeight;
        
        wrapper.innerHTML = truncatedHTML;
        wrapper.style.height = truncatedHeight + 'px';
        
        btnText.textContent = "Узнать больше";
        btn.querySelector('svg')?.classList.remove('_active');
        wrapper.classList.add('text-hidden');
        
        isExpanded = false;
      }
    });
    
    window.addEventListener('resize', () => {
      if (isExpanded) {
        wrapper.style.height = 'auto';
      }
    });
  });
});