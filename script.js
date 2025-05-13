// Mobile menu toggle (for responsive nav)
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('nav ul');
    const menuBtn = document.createElement('button');
    const closeBtn = document.createElement('button');
    
    // Setup menu button
    menuBtn.innerHTML = '<span class="menu-icon">☰</span>';
    menuBtn.className = 'menu-btn';
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    
    // Setup close button
    closeBtn.innerHTML = '×';
    closeBtn.className = 'close-btn';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.style.display = 'none';
    
    const headerContainer = document.querySelector('header .header-container');
    headerContainer.appendChild(menuBtn);
    headerContainer.appendChild(closeBtn);
  
    // Only show menu button on small screens
    function handleMenuBtnDisplay() {
      if (window.innerWidth <= 900) {
        menuBtn.style.display = 'block';
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        menuBtn.style.display = 'none';
        closeBtn.style.display = 'none';
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  
    function openMenu() {
      nav.classList.add('open');
      menuBtn.style.display = 'none';
      closeBtn.style.display = 'block';
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  
    function closeMenu() {
      nav.classList.remove('open');
      menuBtn.style.display = 'block';
      closeBtn.style.display = 'none';
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restore scrolling
    }
  
    handleMenuBtnDisplay();
    window.addEventListener('resize', handleMenuBtnDisplay);
  
    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && 
          !nav.contains(e.target) && 
          !menuBtn.contains(e.target) && 
          !closeBtn.contains(e.target)) {
        closeMenu();
      }
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });
  });
  
  // Notification placeholder
  function showNotification(message, type = 'info') {
    let notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerText = message;
    document.body.appendChild(notif);
    setTimeout(() => {
      notif.remove();
    }, 3000);
  }
  
  // Example usage (remove or replace with real triggers)
  setTimeout(() => {
    showNotification('Welcome to NIGHTMARE! Discover the best nightlife experiences.', 'success');
  }, 1000);