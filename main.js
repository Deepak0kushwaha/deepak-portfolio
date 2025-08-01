// This script initializes the particle network effect and manages image sliders
// for both the hero illustration and a full-page background. By placing all
// initialization inside the DOMContentLoaded handler, we ensure elements
// exist before querying them. The image arrays are shared between the hero and
// background sliders so that both cycle through the same AI-themed artwork.

document.addEventListener('DOMContentLoaded', () => {
  // Configure tsParticles to render a full-screen network of nodes and lines.
  // Setting fullScreen.enable to true ensures the effect spans the entire
  // document; the zIndex pushes the canvas behind all other elements.
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
});