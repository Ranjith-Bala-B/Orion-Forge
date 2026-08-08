export const triggerScreenShake = () => {
  document.body.animate(
    [
      { transform: 'translate(0, 0) rotate(0deg)' },
      { transform: 'translate(-20px, 10px) rotate(-1deg)' },
      { transform: 'translate(20px, -10px) rotate(1deg)' },
      { transform: 'translate(-20px, 10px) rotate(-1deg)' },
      { transform: 'translate(20px, -10px) rotate(1deg)' },
      { transform: 'translate(-10px, 5px) rotate(-0.5deg)' },
      { transform: 'translate(10px, -5px) rotate(0.5deg)' },
      { transform: 'translate(0, 0) rotate(0deg)' }
    ],
    {
      duration: 500,
      easing: 'ease-in-out'
    }
  );
};

export const playStampSound = () => {
  // Sound and screen shake intentionally disabled based on user preference
};
