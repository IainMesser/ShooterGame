const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game objects
const player = {
  x: 50,
  y: 300,
  width: 40,
  height: 40,
  color: "blue",
  speed: 4,
  jumpSpeed: -12,
  gravity: 0.5,
  velocityY: 0,
  isJumping: false,
  onGround: false,
  platform: null,
  isShieldActive: false,
  shieldTimer: 0
};

const bullets = [];
const enemies = [];
const platforms = [
  { x: 150, y: 250, width: 100, height: 10 },
  { x: 300, y: 200, width: 100, height: 10 },
  { x: 500, y: 300, width: 100, height: 10 }
];
const powerUps = [];
let score = 0;
let level = 1;
let enemyFrequency = 1000; 

// Game paused and game over state
let gamePaused = false;
let gameOverFlag = false;

// Controls
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Spawn enemies periodically
let enemyInterval = setInterval(spawnEnemy, enemyFrequency);

// Spawn power-ups periodically
let powerUpInterval = setInterval(spawnPowerUp, 5000);

function spawnEnemy() {
  enemies.push({
    x: canvas.width,
    y: Math.random() * 300 + 50,
    width: 40,
    height: 40,
    color: "red",
    speed: 2 + Math.random() * 2
  });
}

function spawnPowerUp() {
  const powerUpType = "shield"; 
  const x = Math.random() * (canvas.width - 50);
  const y = Math.random() * (canvas.height - 100) + 50;
  powerUps.push({
    x: x,
    y: y,
    width: 30,
    height: 30,
    color: "blue",
    type: powerUpType
  });
}

// Game loop
function gameLoop() {
  if (gameOverFlag || gamePaused) return; // Stop the game if game is over or paused
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;

  if (keys["ArrowUp"]) {
    if (player.onGround) {
      player.velocityY = player.jumpSpeed;
      player.onGround = false;
      player.platform = null;
    }
  }

  if (!player.onGround) {
    player.velocityY += player.gravity;
    player.y += player.velocityY;
  }

  player.onGround = false;

  platforms.forEach((platform) => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height <= platform.y &&
      player.y + player.height + player.velocityY >= platform.y
    ) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.onGround = true;
      player.platform = platform;
    }
  });

  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
    player.onGround = true;
    player.platform = null;
  }

  if (keys[" "] && bullets.length < 5) {
    bullets.push({
      x: player.x + player.width,
      y: player.y + player.height / 2 - 5,
      width: 10,
      height: 5,
      color: "yellow",
      speed: 6
    });
  }

  bullets.forEach((bullet, index) => {
    bullet.x += bullet.speed;
    if (bullet.x > canvas.width) bullets.splice(index, 1);
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  enemies.forEach((enemy, eIndex) => {
    enemy.x -= enemy.speed;
    bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemies.splice(eIndex, 1);
        bullets.splice(bIndex, 1);
        score += 10;
      }
    });

    if (enemy.x + enemy.width < 0) enemies.splice(eIndex, 1);
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  powerUps.forEach((powerUp, pIndex) => {
    ctx.fillStyle = powerUp.color;
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      if (powerUp.type === "shield") {
        player.isShieldActive = true;
        player.shieldTimer = 200;
      }
      powerUps.splice(pIndex, 1);
    }
  });

  platforms.forEach((platform) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  ctx.fillStyle = player.isShieldActive ? "rgba(0, 0, 255, 0.5)" : player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Level: " + level, canvas.width - 100, 30);

  if (score >= level * 50) {
    levelUp();
  }

  if (!player.isShieldActive) {
    enemies.forEach((enemy) => {
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        gameOver();
      }
    });
  }

  if (player.isShieldActive) {
    player.shieldTimer--;
    if (player.shieldTimer <= 0) {
      player.isShieldActive = false;
    }
  }

  requestAnimationFrame(gameLoop);
}

// Game Over Function
function gameOver() {
  // Set game over flag
  gameOverFlag = true;

  // Display game over screen with score
  document.getElementById('gameOverScreen').style.display = 'block';
  document.getElementById('finalScore').textContent = "Final Score: " + score;
}

// Restart game or return to main menu
document.getElementById('playAgainButton').addEventListener('click', function() {
  location.reload(); // Reload the page to start again
});

document.getElementById('backToMenuButton').addEventListener('click', function() {
  window.location.href = './index.html'; // Redirect to main menu
});

// Level Up Function
function levelUp() {
  level++;
  if (level > 10) {
    alert("You won the game! Final Score: " + score);
    document.location.reload();
  } else {
    enemyFrequency = Math.max(500, 1000 - level * 100);
    clearInterval(enemyInterval);
    enemyInterval = setInterval(spawnEnemy, enemyFrequency);
    score += 20;
  }
}

// Select the menu button and dropdown menu
const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');

// Toggle dropdown menu visibility
menuButton.addEventListener('click', () => {
  menuButton.classList.toggle('open');
  dropdownMenu.classList.toggle('open');

  // Pause game when dropdown menu is opened
  gamePaused = !gamePaused;
  
  if (!gamePaused) {
    gameLoop(); // Restart the game loop if resumed
  }
});

// Start the game loop initially
gameLoop();
