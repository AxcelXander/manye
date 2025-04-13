/**
 * Animation utility functions
 * Provides various animation effects for DOM elements
 */
const animations = {
  /**
   * Fade in an element
   * @param {HTMLElement} element - The element to fade in
   * @param {number} duration - Animation duration in milliseconds
   */
  fadeIn(element, duration = 500) {
    element.style.opacity = 0;
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms ease`;
    
    // Force browser to recognize the display change before changing opacity
    setTimeout(() => {
      element.style.opacity = 1;
    }, 10);
  },
  
  /**
   * Fade out an element
   * @param {HTMLElement} element - The element to fade out
   * @param {number} duration - Animation duration in milliseconds
   * @returns {Promise} - A promise that resolves when the animation is complete
   */
  fadeOut(element, duration = 500) {
    return new Promise(resolve => {
      element.style.opacity = 1;
      element.style.transition = `opacity ${duration}ms ease`;
      
      element.style.opacity = 0;
      
      setTimeout(() => {
        element.style.display = 'none';
        resolve();
      }, duration);
    });
  },
  
  /**
   * Slide in an element from a direction
   * @param {HTMLElement} element - The element to slide in
   * @param {string} direction - Direction to slide from ('left', 'right', 'top', 'bottom')
   * @param {number} duration - Animation duration in milliseconds
   * @param {number} distance - Distance to slide in pixels
   */
  slideIn(element, direction = 'left', duration = 500, distance = 50) {
    let transform;
    
    switch (direction) {
      case 'left':
        transform = `translateX(-${distance}px)`;
        break;
      case 'right':
        transform = `translateX(${distance}px)`;
        break;
      case 'top':
        transform = `translateY(-${distance}px)`;
        break;
      case 'bottom':
        transform = `translateY(${distance}px)`;
        break;
      default:
        transform = `translateX(-${distance}px)`;
    }
    
    element.style.transform = transform;
    element.style.opacity = 0;
    element.style.display = 'block';
    element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
    
    // Force browser to recognize the display change before animation
    setTimeout(() => {
      element.style.transform = 'translate(0)';
      element.style.opacity = 1;
    }, 10);
  },
  
  /**
   * Add a pulsing animation to an element
   * @param {HTMLElement} element - The element to animate
   */
  pulse(element) {
    element.classList.add('pulse-animation');
    
    // Clean up function to remove the animation
    return () => {
      element.classList.remove('pulse-animation');
    };
  }
};

// Add animation-related CSS classes
document.addEventListener('DOMContentLoaded', () => {
  // Create a style element for animations
  const style = document.createElement('style');
  
  // Add animation-related CSS
  style.textContent = `
    .pulse-animation {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
    
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  
  // Append style to head
  document.head.appendChild(style);
});

// Export the animations object
export default animations;
window.animations = animations; 