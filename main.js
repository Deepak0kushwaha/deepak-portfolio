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
});