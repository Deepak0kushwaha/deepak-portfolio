// Modified main.js to include dynamic media display
// This script initializes the tsParticles effect and rotates through media
// files stored in the `media` folder of this repository. It fetches the
// list of files from the GitHub API at runtime and cycles through
// supported formats (images, videos, GIFs). Unsupported formats are
// presented as download links.

document.addEventListener('DOMContentLoaded', () => {
  // Initialize tsParticles for the animated background
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

  // Dynamic media loader with hover and playback controls
  const container = document.getElementById('media-container');
  if (!container) return;

  // Create a next button for manually advancing through non‑image content
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.style.display = 'none';
  nextBtn.classList.add('media-next-btn');
  nextBtn.addEventListener('click', () => {
    advanceMedia();
  });
  container.appendChild(nextBtn);

  let mediaFiles = [];
  let currentIndex = 0;
  let hoverPaused = false;
  let timerId;

  function scheduleNext() {
    clearTimeout(timerId);
    const current = mediaFiles[currentIndex];
    if (!current) return;
    // Only auto‑advance for images when not hovered
    if (isImage(current) && !hoverPaused) {
      timerId = setTimeout(() => {
        advanceMedia();
      }, 2000);
    }
  }

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
    // GIFs and PPTs (if supported in future) require manual advance
    // Video ends trigger auto advance on ended event
    return isGif(media) || (!isVideo(media) && !isImage(media));
  }

  function showMedia() {
    // Clear existing content except the next button
    const toRemove = Array.from(container.children).filter(
      (el) => el !== nextBtn
    );
    toRemove.forEach((el) => el.remove());
    const current = mediaFiles[currentIndex];
    if (!current) return;
    const { url, type, name } = current;
    nextBtn.style.display = 'none';
    // For images and GIFs use img tag
    if (isImage(current) || isGif(current)) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = name;
      container.insertBefore(img, nextBtn);
      if (isGif(current) || requiresManualAdvance(current)) {
        // GIFs stay until manually advanced
        nextBtn.style.display = 'inline-block';
      }
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
      container.insertBefore(video, nextBtn);
      nextBtn.style.display = 'inline-block';
    } else {
      // Unsupported types: provide a link and manual advance
      const link = document.createElement('a');
      link.href = url;
      link.textContent = name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      container.insertBefore(link, nextBtn);
      nextBtn.style.display = 'inline-block';
    }
    scheduleNext();
  }

  function advanceMedia() {
    currentIndex = (currentIndex + 1) % mediaFiles.length;
    showMedia();
  }

  // Hover behaviour: pause rotation on hover, resume on leave
  container.addEventListener('mouseenter', () => {
    hoverPaused = true;
    clearTimeout(timerId);
  });
  container.addEventListener('mouseleave', () => {
    hoverPaused = false;
    scheduleNext();
  });

  // Fetch list of media files from GitHub
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