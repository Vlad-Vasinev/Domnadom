
class MarqueeFixed {
  constructor(container) {
    this.container = container
    this.blocks = container.querySelectorAll('.marquee__block')
    this.speed = 0
    if(window.innerWidth <= 768) {
      this.speed = 1.3
    }
    else {
      this.speed = 1.7
    }
    this.init()
    this.animate()
  }
  
  init() {
    this.blocks.forEach((block, index) => {
      const direction = index === 0 ? 'left' : 'right'
      const images = Array.from(block.querySelectorAll('img'))
      console.log(`Original images: ${images.length}`)
      if (direction === 'right') {
        block.innerHTML = ''
        
        const wrapper = document.createElement('div')
        wrapper.style.display = 'flex'
        wrapper.style.gap = '80px'
        images.forEach(img => {
          const clone = img.cloneNode(true)
          wrapper.appendChild(clone)
        })
        
        images.forEach(img => {
          const clone = img.cloneNode(true)
          wrapper.appendChild(clone)
        })
        
        images.forEach(img => {
          const clone = img.cloneNode(true)
          wrapper.appendChild(clone)
        })
        
        block.appendChild(wrapper)
        
        const tempDiv = document.createElement('div')
        tempDiv.style.display = 'flex'
        tempDiv.style.gap = '80px'
        tempDiv.style.position = 'absolute'
        tempDiv.style.left = '-9999px'
        
        images.forEach(img => {
          const testImg = img.cloneNode(true)
          tempDiv.appendChild(testImg)
        })
        
        document.body.appendChild(tempDiv)
        const oneSetWidth = tempDiv.offsetWidth
        document.body.removeChild(tempDiv)
        
        console.log(`Right-moving block: oneSetWidth = ${oneSetWidth}px`)
      
        block._wrapper = wrapper
        block._oneSetWidth = oneSetWidth
        block._position = -oneSetWidth 
        block._direction = 'right'
      
        wrapper.style.transform = `translateX(${block._position}px)`
        
      } else {
        const images = Array.from(block.querySelectorAll('img'))

        images.forEach(img => {
          const clone = img.cloneNode(true)
          block.appendChild(clone)
        })
        
        const tempDiv = document.createElement('div')
        tempDiv.style.display = 'flex'
        tempDiv.style.gap = '80px'
        tempDiv.style.position = 'absolute'
        tempDiv.style.left = '-9999px'
        
        const originalImages = images.slice(0, images.length / 2)
        originalImages.forEach(img => {
          const testImg = img.cloneNode(true)
          tempDiv.appendChild(testImg)
        })
        
        document.body.appendChild(tempDiv)
        const oneSetWidth = tempDiv.offsetWidth
        document.body.removeChild(tempDiv)
        
        block._oneSetWidth = oneSetWidth
        block._position = 0
        block._direction = 'left'
        
        block.style.transform = 'translateX(0)'
      }
    })
  }
  
  animate = () => {
    const leftBlock = this.blocks[0]
    leftBlock._position -= this.speed
    
    if (leftBlock._position <= -leftBlock._oneSetWidth) {
      leftBlock._position = 0
    }
    
    if (leftBlock._wrapper) {
      leftBlock._wrapper.style.transform = `translateX(${leftBlock._position}px)`
    } else {
      leftBlock.style.transform = `translateX(${leftBlock._position}px)`
    }
    
    const rightBlock = this.blocks[1]
    rightBlock._position += this.speed 
    
    if (rightBlock._position >= 0) {
      rightBlock._position = -rightBlock._oneSetWidth
    }
    
    rightBlock._wrapper.style.transform = `translateX(${rightBlock._position}px)`
    
    requestAnimationFrame(this.animate)
  }
}

window.addEventListener('load', () => {
  const marquees = document.querySelectorAll('.marquee')
  marquees.forEach(marquee => new MarqueeFixed(marquee))
})