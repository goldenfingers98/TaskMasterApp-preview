document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('year').textContent = new Date().getFullYear();

    // Test - add click to body to see if events work at all
    document.body.addEventListener('click', (e) => {
        console.log('Body clicked, target:', e.target.tagName, e.target.className);
    });

    // Modal functionality - define globally
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');

    // Try using event delegation instead
    document.addEventListener('click', (e) => {
        if (e.target.matches('.carousel-slide img')) {
            console.log('Image clicked via delegation!', e.target.src);
            e.preventDefault();
            e.stopPropagation();
            modalImage.src = e.target.src;
            modalImage.alt = e.target.alt;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    });

    // Make images clickable
    const slideImages = document.querySelectorAll('.carousel-slide img');
    slideImages.forEach(img => {
        img.style.cursor = 'pointer';
    });

    // Close modal functionality
    function closeModalFunction() {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }

    closeModal.addEventListener('click', closeModalFunction);
    
    // Close modal when clicking on the scrim
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunction();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalFunction();
        }
    });

    (function() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return; // Exit if carousel not found
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    if (!track || !prevBtn || !nextBtn || slides.length === 0) return;

    let slidesToShow = 1;      // number of slides visible at once
    let index = 0;             // current left-most visible slide
    let autoPlayInterval;      // for auto-play timer

    // read gap from computed style (in px)
    function getGap() {
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap || style.columnGap || 0);
      return isNaN(gap) ? 0 : gap;
    }

    // set each slide's width based on carousel width and slidesToShow
    function resizeSlides() {
      const gap = getGap();
      const containerWidth = carousel.clientWidth;
      const minSlideWidth = 285; // Minimum width for a slide in pixels

      // Calculate how many slides can fit
      slidesToShow = Math.max(1, Math.floor((containerWidth + gap) / (minSlideWidth + gap)));

      slides.forEach(slide => {
        slide.style.width = `${minSlideWidth}px`;
      });

      // Make sure index is valid after resize
      const maxIndex = Math.max(0, slides.length - slidesToShow);
      if (index > maxIndex) index = maxIndex;

      updateTrackPosition();
      startAutoPlay(); // Restart autoplay with new settings
    }

    function updateTrackPosition() {
      // compute the offset using the current left-most slide's bounding box
      // using getBoundingClientRect to include current computed width
      const gap = getGap();
      if (slides.length === 0) return;
      const firstSlideRect = slides[0].getBoundingClientRect();
      // slide width from DOM
      const slideWidth = firstSlideRect.width;
      const offset = index * (slideWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
    }

    function showNext() {
      const maxIndex = Math.max(0, slides.length - slidesToShow);
      index = (index + 1) > maxIndex ? 0 : index + 1; // loop back to start
      updateTrackPosition();
    }

    function showPrev() {
      const maxIndex = Math.max(0, slides.length - slidesToShow);
      index = (index - 1) < 0 ? maxIndex : index - 1; // loop to end
      updateTrackPosition();
    }

    prevBtn.addEventListener('click', () => {
      showPrev();
      resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      showNext();
      resetAutoPlay();
    });

    function startAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(showNext, 3000); // Change slide every 3 seconds
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    // Allow pointer events on images but not on track dragging
    track.style.pointerEvents = 'auto';
    
    // Add pointer events back to images specifically
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.style.pointerEvents = 'auto';
        }
    });

    // Recalculate on load & resize
    window.addEventListener('resize', resizeSlides);
    window.addEventListener('orientationchange', resizeSlides);
    // Initialize
    resizeSlides();
  })();
});
