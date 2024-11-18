const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const player = {
  x: 400,
  y: 350,
  width: 40,
  height: 40,
  color: "blue",
  speed: 5
};

const bullets = [];
const targets = [];
let score = 0;

// Initialize targets
for (let i = 0; i < 5; i++) {
  targets.push({
    x: 100 + i * 150,
    y: 100,
    width: 40,
    height: 40,
    color: "red"
  });
}

// Event listeners
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Move player
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;

  // Shoot bullets
  if (keys[" "] && bullets.length === 0) {
    bullets.push({
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 10,
      height: 20,
      color: "yellow"
    });
  }

  // Update and draw bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= 10;
    if (bullet.y + bullet.height < 0) bullets.splice(index, 1);

    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Update and draw targets
  targets.forEach((target, index) => {
    ctx.fillStyle = target.color;
    ctx.fillRect(target.x, target.y, target.width, target.height);

    // Check collision with bullets
    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < target.x + target.width &&
        bullet.x + bullet.width > target.x &&
        bullet.y < target.y + target.height &&
        bullet.y + bullet.height > target.y
      ) {
        targets.splice(index, 1); // Remove target
        bullets.splice(bulletIndex, 1); // Remove bullet
        score += 10; // Increase score
      }
    });
  });

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // End game if all targets are destroyed
  if (targets.length === 0) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("You Win!", canvas.width / 2 - 70, canvas.height / 2);
    return; // Stop game loop
  }

  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
