export default function applyPhoneMask(phoneInput) {
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('7') || value.startsWith('8')) {
      value = value.substring(1);
    }
    
    let formattedValue = '+7 ';
    
    if (value.length > 0) {
      formattedValue += '(' + value.substring(0, 3);
    }
    if (value.length > 3) {
      formattedValue += ') ' + value.substring(3, 6);
    }
    if (value.length > 6) {
      formattedValue += '-' + value.substring(6, 8);
    }
    if (value.length > 8) {
      formattedValue += '-' + value.substring(8, 10);
    }
    
    e.target.value = formattedValue;
  });

  phoneInput.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace') {
      setTimeout(() => {
        if (phoneInput.value === '+7 (' || phoneInput.value === '+7') {
          phoneInput.value = '';
        }
      }, 0);
    }
  });
}