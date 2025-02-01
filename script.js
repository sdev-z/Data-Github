document.addEventListener('DOMContentLoaded', function() {
  const smoothScroll = document.getElementById('smooth-scroll');
  
  smoothScroll.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});






      