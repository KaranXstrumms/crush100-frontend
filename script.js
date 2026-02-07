document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("start-btn");

  btn.addEventListener("click", (e) => {
    // Create a burst of hearts
    createHeartBurst(e.clientX, e.clientY);

    // Button text change for feedback
    const originalText = btn.innerText;
    btn.innerText = "Loading Compatibility...";
    btn.style.opacity = "0.8";

    // Simulate navigation or action (resetting for demo purposes)
    setTimeout(() => {
        window.location.href = 'details.html';
    }, 1500);
  });

  function createHeartBurst(x, y) {
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement("span");
      heart.classList.add("heart-burst");
      heart.innerText = ["💖", "💘", "💝", "💕", "💗"][
        Math.floor(Math.random() * 5)
      ];
      document.body.appendChild(heart);

      const destinationX = (Math.random() - 0.5) * 100;
      const destinationY = (Math.random() - 0.5) * 100 - 50; // Move generally upwards

      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;

      // Randomize animation slightly
      heart.animate(
        [
          { transform: "translate(0, 0) scale(0)", opacity: 1 },
          {
            transform: `translate(${destinationX}px, ${destinationY}px) scale(1.5)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000 + Math.random() * 500,
          easing: "cubic-bezier(0, .9, .57, 1)",
        },
      ).onfinish = () => heart.remove();
    }
  }
});
