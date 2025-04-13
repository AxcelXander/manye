/**
 * ScrollEffects utility
 * Uses the Intersection Observer API to add effects when elements come into view
 */
class ScrollEffects {
  /**
   * Observe elements with a given selector and run a callback when they enter viewport
   * @param {string} selector - CSS selector for elements to observe
   * @param {Function} callback - Function to run when element is visible
   * @param {Object} options - Intersection Observer options
   */
  static observeElements(selector, callback, options = { threshold: 0.1 }) {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
      console.warn(`No elements found matching selector: "${selector}"`);
      return;
    }
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          
          // If once option is true, stop observing this element after it's been seen
          if (options.once) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, options);
    
    // Start observing each element
    elements.forEach(element => observer.observe(element));
    
    // Return a function to stop observing
    return {
      disconnect: () => observer.disconnect(),
      elements
    };
  }
  
  /**
   * Add a fade-in effect to elements as they scroll into view
   * @param {string} selector - CSS selector for elements to animate
   * @param {boolean} once - Whether to only animate once (true) or every time the element enters viewport (false)
   */
  static addFadeInEffect(selector = '.fade-in', once = true) {
    return ScrollEffects.observeElements(selector, (element) => {
      element.classList.add('visible');
    }, { threshold: 0.1, once });
  }
  
  /**
   * Add a custom class to elements as they scroll into view
   * @param {string} selector - CSS selector for elements to animate
   * @param {string} className - CSS class to add when element is in view
   * @param {boolean} once - Whether to only animate once (true) or every time the element enters viewport (false)
   */
  static addClassOnScroll(selector, className, once = true) {
    return ScrollEffects.observeElements(selector, (element) => {
      element.classList.add(className);
    }, { threshold: 0.1, once });
  }
  
  /**
   * Add a sequence animation to a list of elements (animate one after another)
   * @param {string} selector - CSS selector for container of elements
   * @param {string} itemSelector - CSS selector for individual items within container
   * @param {string} className - Class to add to each item
   * @param {number} delay - Delay between animations in milliseconds
   */
  static animateSequence(selector, itemSelector, className, delay = 100) {
    return ScrollEffects.observeElements(selector, (container) => {
      const items = container.querySelectorAll(itemSelector);
      
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add(className);
        }, index * delay);
      });
    }, { threshold: 0.1, once: true });
  }
}

// Initialize scroll effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add fade-in effect to various elements
  ScrollEffects.addFadeInEffect('.fade-in');
  
  // Animate items in sequence
  ScrollEffects.animateSequence('.post-feed', '.post-card', 'visible', 150);
});

// Export the ScrollEffects class
export default ScrollEffects;

// Make ScrollEffects available globally
window.ScrollEffects = ScrollEffects; 