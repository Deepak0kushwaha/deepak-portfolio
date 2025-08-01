// Initialize tsParticles for interactive network effect in the hero section.
// The configuration defines particles that link to each other to evoke
// neural networks and circuitry, reinforcing the AI theme.
document.addEventListener('DOMContentLoaded', function () {
  tsParticles.load('tsparticles', {
    fullScreen: { enable: false },
    detectRetina: true,
    fpsLimit: 60,
    background: {
      color: '#081a2c',
    },
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
      number: { value: 60, density: { enable: true, area: 800 } },
      color: { value: ['#3ea6ff', '#ff7acc'] },
      shape: { type: 'circle' },
      opacity: { value: 0.6 },
      size: { value: 3, random: { enable: true, minimumValue: 1 } },
      links: {
        enable: true,
        distance: 120,
        color: '#3ea6ff',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none',
        random: false,
        straight: false,
        outModes: { default: 'out' },
      },
    },
  });

  // Image slider for hero section. Cycle through AI illustrations to add motion.
  const heroImg = document.querySelector('.hero-image img');
  // Define the list of images used in the hero slider. These AI-themed
  // illustrations rotate every few seconds to give the page a sense of
  // motion and dynamism. The filenames correspond to assets stored in
  // the repository root; if you add or remove images here be sure to
  // update this array accordingly. Note that hero2.jpg is retained as
  // a fallback image.
  const images = [
    'illustration1.jpg',
    'illustration2.jpg',
    'illustration3.jpg',
    'ai1.jpg',
    'ai2.jpg',
    'ai3.jpg',
    'hero2.jpg',
  ];
  let imgIndex = 0;
  setInterval(() => {
    // fade out
    heroImg.classList.add('fade-out');
    setTimeout(() => {
      imgIndex = (imgIndex + 1) % images.length;
      heroImg.src = images[imgIndex];
      // fade in
      heroImg.classList.remove('fade-out');
    }, 500);
  }, 7000);
});