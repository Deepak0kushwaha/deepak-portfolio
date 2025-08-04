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

  // Create navigation controls.  Prev and Next buttons are always
  // visible so users can navigate through all media types.  The
  // buttons are appended before any media is shown.
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Prev';
  prevBtn.classList.add('media-prev-btn');
  container.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.classList.add('media-next-btn');
  container.appendChild(nextBtn);

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
   * Render the currently selected media.  Existing media elements are
   * removed, but navigation buttons remain.  Depending on the file
   * type, an <img>, <video> or <a> tag is constructed and inserted
   * before the Prev button so that buttons stay at the bottom.
   */
  function showMedia() {
    // Remove everything except the navigation controls
    const toRemove = Array.from(container.children).filter(
      (el) => el !== nextBtn && el !== prevBtn
    );
    toRemove.forEach((el) => el.remove());
    const current = mediaFiles[currentIndex];
    if (!current) return;
    const { url, name } = current;
    if (isImage(current) || isGif(current)) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = name;
      container.insertBefore(img, prevBtn);
    } else if (isVideo(current)) {
      const video = document.createElement('video');
      video.src = url;
      video.autoplay = true;
      video.muted = true;
      video.controls = true;
      video.loop = false;
      video.onended = () => {
        advanceMedia();
      };
      container.insertBefore(video, prevBtn);
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      container.insertBefore(link, prevBtn);
    }
    scheduleNext();
  }

  // Advance to the next media item
  function advanceMedia() {
    currentIndex = (currentIndex + 1) % mediaFiles.length;
    showMedia();
  }

  // Navigate to the previous media item
  function rewindMedia() {
    currentIndex = (currentIndex - 1 + mediaFiles.length) % mediaFiles.length;
    showMedia();
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