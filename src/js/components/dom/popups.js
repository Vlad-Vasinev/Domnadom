import { enableScroll } from '../../functions/disable-scroll';
import { disableScroll } from '../../functions/disable-scroll';
import { onDocLoad } from '../../functions/onDocLoad';

import applyPhoneMask from '../../functions/applyMask';

import JustValidate from 'just-validate';

onDocLoad(() => {
  const modalContainer = document.getElementById('modal-popup')

  function closePopup(popupElement) {
    modalContainer.classList.remove('_active')
    document.removeEventListener('keydown', escapeBtn)
    setTimeout(() => {
      if (popupElement && modalContainer.contains(popupElement)) {
        modalContainer.removeChild(popupElement)
        modalContainer.style.zIndex = 1
        enableScroll()
      }
    }, 400)
  }

  function escapeBtn (e, popupElement) {
    if(e.key === "Escape") {
      closePopup(popupElement)
    }
  }

document.querySelectorAll('[data-modal-side]').forEach((modalBtn) => {
  modalBtn.addEventListener('click', () => {
    const popupId = modalBtn.getAttribute('data-modal-side');
    const template = document.getElementById(popupId);

    if (template) {
      disableScroll();

      let popupElement = undefined;
      let smartCaptchaWidgetId = null;
      let captchaInitialized = false;

      const templateContent = template.content.cloneNode(true);
      modalContainer.appendChild(templateContent);
      modalContainer.style.zIndex = 11;

      setTimeout(() => {
        popupElement = modalContainer.querySelector('.popup');
        
        if (popupElement) {
          if(popupId === 'consult-form') {
            const catalogForm = popupElement.querySelector('.catalog-form');
            const formEl = catalogForm.querySelectorAll('.form__block input[type="text"]');

            const captchaContainer = document.getElementById('smartcaptcha');
            if (captchaContainer) {
              captchaContainer.style.display = 'none';
            }

            formEl.forEach((el) => {
              el.addEventListener('input', () => {
                el.parentElement.querySelector('label').classList.add('_active');
                el.parentElement.querySelector('input').classList.add('_active');
              });
              el.addEventListener('keydown', function(event) {
                if (event.key === 'Backspace') {
                  setTimeout(() => {
                    if (el.value === '') {
                      el.parentElement.querySelector('label').classList.remove('_active');
                      el.parentElement.querySelector('input').classList.remove('_active');
                    }
                  }, 0);
                }
              });
            });

            const phoneInput = catalogForm.querySelector('input[name="phone"]');
            if (phoneInput) {
              applyPhoneMask(phoneInput);
            }

            const validation = new JustValidate('.form');

            validation
              .addField('input[name="name"]', [
                {
                  rule: 'required',
                  errorMessage: 'Please enter your name',
                },
                {
                  rule: 'minLength',
                  value: 2,
                  errorMessage: 'The name must contain at least 2 characters.',
                },
              ])
              .addField('input[name="phone"]', [
                {
                  rule: 'required',
                  errorMessage: 'Please enter your phone number.',
                },
                {
                  validator: (value) => {
                    const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
                    return phoneRegex.test(value);
                  },
                  errorMessage: 'Please enter a valid phone number.',
                },
              ])
              .addField('input[name="permission"]', [
                {
                  rule: 'required',
                  errorMessage: 'You must consent to the processing of data',
                },
              ])
              .onSuccess((event) => {
                event.preventDefault();
                
                const form = event.target;
                const submitButton = form.querySelector('button[type="submit"]');
                
                const smartToken = document.querySelector('[name="smart-token"]')?.value;
                
                if (!smartToken) {
                  const captchaContainer = document.getElementById('smartcaptcha');
                  if (captchaContainer) {
                    const existingError = captchaContainer.querySelector('.captcha-error');
                    if (existingError) existingError.remove();
                    
                    const errorElement = document.createElement('div');
                    errorElement.className = 'captcha-error';
                    errorElement.textContent = 'Please confirm that you are not a robot.';
                    errorElement.style.color = '#f00';
                    errorElement.style.marginTop = '10px';
                    errorElement.style.fontSize = '14px';
                    errorElement.style.textAlign = 'center';
                    
                    captchaContainer.appendChild(errorElement);
                    
                    captchaContainer.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'center' 
                    });
                  }
                  
                  return; 
                }
                
                const formData = new FormData(form);
                formData.append('smart-token', smartToken);
                
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                const ulr = form.dataset.action;
                const urlThanks = form.dataset.thanksUrl;
                
                fetch(`${ulr}`, { 
                  method: 'POST',
                  body: formData
                })
                .then(response => {
                  if (!response.ok) {
                    return response.json().then(errorData => {
                      throw new Error(errorData.message || 'Error submitting form');
                    });
                  }
                  return response.json();
                })
                .then(data => {
                  console.log('Form submitted successfully:', data);
                  
                  if (smartCaptchaWidgetId !== null && typeof window.smartCaptcha !== 'undefined') {
                    window.smartCaptcha.reset(smartCaptchaWidgetId);
                  }
                  
                  closePopup(popupElement);
                  window.location.href = urlThanks;
                })
                .catch(error => {
                  console.error('Form submission error:', error);
                  
                  if (smartCaptchaWidgetId !== null && typeof window.smartCaptcha !== 'undefined') {
                    window.smartCaptcha.reset(smartCaptchaWidgetId);
                  }
                  
                  const captchaContainer = document.getElementById('smartcaptcha');
                  const existingError = captchaContainer?.querySelector('.captcha-error');
                  if (existingError) existingError.remove();
                })
                .finally(() => {
                  submitButton.disabled = false;
                  submitButton.textContent = 'Отправить';
                });
              });

            validation.onValidate(({ fields }) => {
              const nameValid = fields['input[name="name"]']?.isValid;
              const phoneValid = fields['input[name="phone"]']?.isValid;
              const permissionValid = fields['input[name="permission"]']?.isValid;
              
              const allFieldsValid = nameValid && phoneValid && permissionValid;
              const captchaContainer = document.getElementById('smartcaptcha');
              
              if (allFieldsValid && captchaContainer && !captchaInitialized) {
                captchaContainer.style.display = 'block';
                captchaContainer.style.opacity = '0';
                captchaContainer.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                  captchaContainer.style.opacity = '1';
                }, 10);
                
                setTimeout(() => {
                  if (typeof window.smartCaptcha !== 'undefined' && !captchaInitialized) {
                    smartCaptchaWidgetId = window.smartCaptcha.render('smartcaptcha', {
                      sitekey: 'ysc1_xivlEqjPFS3UG0CWcyjFVeXeCoqZIekaOJjKiUpvbc9822e0',
                      hl: 'ru',
                    });
                    captchaInitialized = true;
                    
                    setTimeout(() => {
                      captchaContainer.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                      });
                    }, 500);
                  }
                }, 100);
              }
              
              if (!allFieldsValid && captchaContainer && captchaInitialized) {
                captchaContainer.style.display = 'none';
              }
            });
          }

          if(popupElement.querySelector('.popup__close')) {
            popupElement.querySelector('.popup__close').addEventListener('click', () => {
              if (smartCaptchaWidgetId !== null && typeof window.smartCaptcha !== 'undefined') {
                window.smartCaptcha.reset(smartCaptchaWidgetId);
              }
              captchaInitialized = false;
              closePopup(popupElement);
              if(document.querySelector('.popup._layer-mob')) {
                const filtered = Array.from(document.querySelectorAll('.layer-map__path')).filter(el => el.classList.contains('house-path_active'))
                console.log(filtered)
                filtered.forEach((el) => {
                  el.classList.remove('house-path_active')
                  if(el.parentElement.querySelector('.badge-rect')) {
                    el.parentElement.querySelector('.badge-rect').setAttribute('fill', '#0000004d')
                  }
                })
              }
            });
          }

          if(window.innerWidth >= 1028) {
            document.addEventListener('keydown', (e) => escapeBtn(e, popupElement));

            document.addEventListener('click', (e) => {
              const popup = document.querySelector('.popup');
              if(popup && !popup.contains(e.target)) {
                if (smartCaptchaWidgetId !== null && typeof window.smartCaptcha !== 'undefined') {
                  window.smartCaptcha.reset(smartCaptchaWidgetId);
                }
                captchaInitialized = false;
                closePopup(popupElement);
              }
            });
          }
        }

        modalContainer.classList.add('_active');
      }, 150);
    }
  });
});
})

window.onloadFunction = function() {
  console.log('Yandex SmartCaptcha loaded and ready');
}