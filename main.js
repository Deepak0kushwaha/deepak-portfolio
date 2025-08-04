// Dynamic media display script with fixed window and Prev/Next controls.

/**
 * This script initialises the tsParticles background and manages a
 * carousel of images, videos and other media stored in the `media`
 * folder.  The media are displayed inside a fixed‑size container
 * (see media.css for styling).  Both “Prev” and “Next” buttons are
 * always visible, allowing the user to navigate through the
 * collection.  Images advance automatically after a short delay
 * unless the user hovers over the container.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialise the animated particle background.  These settings are
  // unchanged from the original implementation.
  tsParticles.load('tsparticles', {
    fullScreen: { enable: true, zIndex: -1 },
    detectRetina: true,
    fpsLimit: 60,
    background: { color: '#081a2c' },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        onClick: { enable: true, mode: 'push' },
        resize: true,
      },
      modes: {
        repulse: { distance: 100 },
        push: { quantity: 4 },
      },
    },
    particles: {
      number: { value: 70, density: { enable: true, area: 800 } },
      color: { value: ['#3ea6ff', '#ff7acc'] },
      shape: { type: 'circle' },
      opacity: { value: 0.5 },
      size: { value: 2.5, random: { enable: true, minimumValue: 1 } },
      links: {
        enable: true,
        distance: 130,
        color: '#3ea6ff',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.3,
        direction: 'none',
        random: false,
        straight: false,
        outModes: { default: 'out' },
      },
    },
  });

  // Locate an existing media container or convert the static hero image
  // into a dynamic media container.  This allows the script to be
  // retro‑fitted onto the existing page without editing HTML.
  let container = document.getElementById('media-container');
  if (!container) {
    const heroDiv = document.querySelector('.hero-image');
    if (heroDiv) {
      container = document.createElement('div');
      container.id = 'media-container';
      container.className = 'media-container';
      heroDiv.parentNode.replaceChild(container, heroDiv);
    }
  }
  // Abort if there is still no place to mount the carousel.
  if (!container) return;

  // Append the dedicated stylesheet for the carousel.  Doing this
  // dynamically ensures that the portfolio loads correctly even if the
  // developer forgets to add media.css to the HTML.
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'media.css';
  document.head.appendChild(cssLink);

  // Create a dedicated media window and a separate navigation bar.
  // The media window holds the currently displayed media and handles
  // slide animations.  Navigation buttons sit below the window in
  // their own container so that layout remains consistent across
  // different media types.  See media.css for sizing.
  const mediaWindow = document.createElement('div');
  mediaWindow.className = 'media-window';
  container.appendChild(mediaWindow);

  const navDiv = document.createElement('div');
  navDiv.className = 'media-nav';
  container.appendChild(navDiv);

  // Create navigation controls.  Both Prev and Next buttons are
  // appended into the navigation bar.  They remain visible at
  // all times, allowing the user to move backwards or forwards
  // through the carousel.
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Prev';
  prevBtn.classList.add('media-prev-btn');
  navDiv.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.classList.add('media-next-btn');
  navDiv.appendChild(nextBtn);

  // Media state tracking variables
  let mediaFiles = [];
  let currentIndex = 0;
  let hoverPaused = false;
  let timerId;

  // Helper to schedule automatic advancement for images.
  function scheduleNext() {
    clearTimeout(timerId);
    const current = mediaFiles[currentIndex];
    if (!current) return;
    if (isImage(current) && !hoverPaused) {
      timerId = setTimeout(() => {
        advanceMedia();
      }, 2000);
    }
  }

  // Media type helper functions
  function isImage(media) {
    return ['jpg', 'jpeg', 'png', 'webp'].includes(media.type);
  }
  function isGif(media) {
    return media.type === 'gif';
  }
  function isVideo(media) {
    return ['mp4', 'webm'].includes(media.type);
  }
  function requiresManualAdvance(media) {
    return isGif(media) || (!isVideo(media) && !isImage(media));
  }

  /**
   * Render the currently selected media into the mediaWindow.  When
   * transitioning from one item to another, a sliding animation is
   * applied.  The direction parameter determines whether the new
   * item slides in from the right (for next) or from the left (for
   * previous).  Existing media items are removed once the
   * transition completes.
   *
   * @param {('next'|'prev')} direction The direction to animate
   *   the transition. Defaults to 'next' if omitted.
   */
  function showMedia(direction = 'next') {
    const currentMedia = mediaFiles[currentIndex];
    if (!currentMedia) return;

    // Build a new element based on the media type.
    let newEl;
    const { url, name } = currentMedia;
    if (isImage(currentMedia) || isGif(currentMedia)) {
      newEl = document.createElement('img');
      newEl.src = url;
      newEl.alt = name;
    } else if (isVideo(currentMedia)) {
      newEl = document.createElement('video');
      newEl.src = url;
      newEl.autoplay = true;
      newEl.muted = true;
      newEl.controls = true;
      newEl.loop = false;
      newEl.onended = () => {
        advanceMedia();
      };
    } else {
      newEl = document.createElement('a');
      newEl.href = url;
      newEl.textContent = name;
      newEl.target = '_blank';
      newEl.rel = 'noopener noreferrer';
    }
    newEl.classList.add('media-item');

    // Determine animation classes based on direction.  Incoming
    // element slides in from the appropriate side; outgoing element
    // slides out the opposite way.
    const inClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
    const outClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';

    const currentEl = mediaWindow.querySelector('.media-item');
    if (!currentEl) {
      // Initial load: no animation needed.
      mediaWindow.innerHTML = '';
      mediaWindow.appendChild(newEl);
      scheduleNext();
      return;
    }

    // Prepare new element for sliding.
    newEl.classList.add(inClass);
    mediaWindow.appendChild(newEl);
    // Apply outgoing class to current element.
    currentEl.classList.add(outClass);

    // Once the animation ends, remove the old element and clean up
    // classes on the new element.
    function onAnimationEnd() {
      currentEl.remove();
      newEl.classList.remove(inClass);
      newEl.removeEventListener('animationend', onAnimationEnd);
    }
    newEl.addEventListener('animationend', onAnimationEnd);
    scheduleNext();
  }

  // Advance to the next media item.  Pass the direction so the
  // sliding animation moves from right to left.
  function advanceMedia() {
    currentIndex = (currentIndex + 1) % mediaFiles.length;
    showMedia('next');
  }

  // Navigate to the previous media item.  Sliding animation moves
  // from left to right.
  function rewindMedia() {
    currentIndex = (currentIndex - 1 + mediaFiles.length) % mediaFiles.length;
    showMedia('prev');
  }

  // Attach click handlers to the navigation buttons
  prevBtn.addEventListener('click', rewindMedia);
  nextBtn.addEventListener('click', advanceMedia);

  // Hover behaviour: pause auto‑advance while the user hovers
  container.addEventListener('mouseenter', () => {
    hoverPaused = true;
    clearTimeout(timerId);
  });
  container.addEventListener('mouseleave', () => {
    hoverPaused = false;
    scheduleNext();
  });

  // Fetch the list of media files from the GitHub repository.  Only
  // supported formats are retained.  Once loaded, the first media is
  // displayed.
  fetch(
    'https://api.github.com/repos/Deepak0kushwaha/deepak-portfolio/contents/media'
  )
    .then((response) => response.json())
    .then((files) => {
      if (!Array.isArray(files)) {
        throw new Error('Unexpected response format');
      }
      mediaFiles = files
        .filter((file) => {
          const name = file.name.toLowerCase();
          return [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp',
            '.gif',
            '.mp4',
            '.webm',
            '.ppt',
            '.pptx',
          ].some((ext) => name.endsWith(ext));
        })
        .map((file) => {
          const name = file.name;
          const ext = name.split('.').pop().toLowerCase();
          return { url: file.download_url, type: ext, name };
        });
      if (mediaFiles.length === 0) {
        console.warn('No media files found in media folder');
        return;
      }
      currentIndex = 0;
      showMedia();
    })
    .catch((err) => {
      console.error('Failed to load media from GitHub API:', err);
    });
});