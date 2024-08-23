// content.js
(function() {
    function getElementLocator(element) {
      let locators = [];
  
      // Use ID if it exists
      if (element.id) {
        locators.push(`#${element.id}`);
        return locators.join(' > ');
      }
  
      // Use tag name
      locators.push(element.tagName.toLowerCase());
  
      // Use class names if any
      if (element.className) {
        locators.push(...element.className.trim().split(/\s+/).map(cls => `.${cls}`));
      }
  
      // Generate XPath
      let path = [];
      while (element && element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.tagName.toLowerCase();
        if (element.id) {
          selector += `#${element.id}`;
          path.unshift(selector);
          break;
        } else {
          let sibling = element;
          let nth = 1;
          while (sibling.previousElementSibling) {
            sibling = sibling.previousElementSibling;
            nth++;
          }
          if (nth > 1) {
            selector += `:nth-of-type(${nth})`;
          }
          path.unshift(selector);
          element = element.parentElement;
        }
      }
      let xpath = path.join(' / ');
  
      return {
        css: locators.join(' > '),
        xpath: xpath
      };
    }
  
    function handleClick(event) {
      const element = event.target;
      const locators = getElementLocator(element);
      console.log('Click event detected on element:', {
        css: locators.css,
        xpath: locators.xpath
      });
    }
  
    function handleInput(event) {
      const element = event.target;
      const locators = getElementLocator(element);
      const value = element.value;
      console.log('Input event detected on element:', {
        css: locators.css,
        xpath: locators.xpath,
        value: value
      });
    }
  
    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
  })();
  