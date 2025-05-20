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

  // Hero section animations
  document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    const features = document.querySelectorAll('.feature');
    const buttons = document.querySelectorAll('.cta-button');

    // Parallax effect on mouse move
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;
      
      hero.style.backgroundPosition = `${xPos}px ${yPos}px`;
    });

    // Animate features on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    features.forEach(feature => {
      feature.style.opacity = '0';
      feature.style.transform = 'translateY(20px)';
      feature.style.transition = 'all 0.5s ease';
      observer.observe(feature);
    });

    // Button hover effects
    buttons.forEach(button => {
      button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.05) translateY(-2px)';
      });
      
      button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1) translateY(0)';
      });
    });
  });

  // Clubs page functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clubCards = document.querySelectorAll('.club-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.textContent.toLowerCase();
        
        // Filter clubs
        clubCards.forEach(card => {
          const type = card.querySelector('.club-type').textContent.toLowerCase();
          if (filter === 'all' || type === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase();
      
      clubCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('.club-location').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || location.includes(searchTerm)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    // View Details button
    const viewDetailsBtns = document.querySelectorAll('.view-details');
    viewDetailsBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const clubCard = btn.closest('.club-card');
        const clubName = clubCard.querySelector('h3').textContent;
        showNotification(`Loading details for ${clubName}...`, 'info');
        // Add your club details page navigation here
      });
    });
  });

  // Authentication Pages Functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
      button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
      });
    });

    // Form validation and submission
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Basic form validation
        const inputs = this.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
          } else {
            input.classList.remove('error');
          }
        });

        if (!isValid) {
          showNotification('Please fill in all required fields', 'error');
          return;
        }

        // Get form data
        const formData = new FormData(this);
        const data = {
          email: formData.get('email'),
          password: formData.get('password')
        };

        try {
          // Send login request
          const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Login failed');
          }

          // Store token in localStorage
          localStorage.setItem('token', result.token);

          // Show success message
          showNotification('Login successful! Redirecting...', 'success');

          // Redirect to user profile page (updated path)
          setTimeout(() => {
            window.location.href = '../user.html';
          }, 1000);

        } catch (error) {
          console.error('Login error:', error);
          showNotification(error.message || 'Login failed. Please try again.', 'error');
        }
      });
    });

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
      button.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
        console.log(`Logging in with ${provider}`);
        // Here you would implement the actual social login functionality
      });
    });
  });

  // Events page functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.textContent.toLowerCase();
        
        // Filter events
        eventCards.forEach(card => {
          const type = card.querySelector('.event-type').textContent.toLowerCase();
          if (filter === 'all' || type.includes(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase();
      
      eventCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('.event-location').textContent.toLowerCase();
        const description = card.querySelector('.event-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || 
            location.includes(searchTerm) || 
            description.includes(searchTerm)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    // Get Tickets button
    const ticketBtns = document.querySelectorAll('.view-details');
    ticketBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const eventCard = btn.closest('.event-card');
        const eventName = eventCard.querySelector('h3').textContent;
        showNotification(`Redirecting to ticket purchase for ${eventName}...`, 'info');
        // Add your ticket purchase page navigation here
      });
    });
  });

  // User Dashboard Functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Profile Avatar Upload
    const editAvatarBtn = document.querySelector('.edit-avatar');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.querySelector('.profile-avatar img').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // Quick Action Buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            switch(action) {
                case 'My Tickets':
                    showNotification('Viewing your tickets...', 'info');
                    break;
                case 'My Calendar':
                    showNotification('Opening your calendar...', 'info');
                    break;
                case 'Favorites':
                    showNotification('Viewing your favorites...', 'info');
                    break;
                case 'Settings':
                    showNotification('Opening settings...', 'info');
                    break;
            }
        });
    });

    // View Ticket Buttons
    const viewTicketButtons = document.querySelectorAll('.view-ticket');
    viewTicketButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventName = this.closest('.event-item').querySelector('h4').textContent;
            showNotification(`Viewing ticket for ${eventName}`, 'info');
        });
    });

    // Logout Functionality
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Logging out...', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
  });