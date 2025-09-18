document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    let lastScroll = 0;
  
    window.addEventListener("scroll", function () {
      const currentScroll = window.scrollY;
  
      if (currentScroll > lastScroll) {
        // Scrolling down
        if (currentScroll > 0 && currentScroll < 500) {
          header.classList.add("sticky");
          header.classList.remove("sticked");
        } else if (currentScroll >= 500) {
          header.classList.add("sticked");
          header.classList.remove("sticky");
        }
      } else {
        // Scrolling up
        if (currentScroll < 500 && currentScroll > 0) {
          header.classList.add("sticky");
          header.classList.remove("sticked");
        } else if (currentScroll <= 0) {
          header.classList.remove("sticky", "sticked");
        }
      }
  
      lastScroll = currentScroll;
    });
  });