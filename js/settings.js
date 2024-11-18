// Get DOM elements
const volumeSlider = document.getElementById('volume');
const soundCheckbox = document.getElementById('sound');
const difficultySelect = document.getElementById('difficulty');
const saveButton = document.getElementById('saveSettings');
const backButton = document.getElementById('backToMenu');

// Load saved settings from localStorage (if any)
window.addEventListener('load', () => {
  const savedVolume = localStorage.getItem('volume');
  const savedSound = localStorage.getItem('sound');
  const savedDifficulty = localStorage.getItem('difficulty');

  if (savedVolume !== null) {
    volumeSlider.value = savedVolume;
  }
  if (savedSound !== null) {
    soundCheckbox.checked = savedSound === 'true';
  }
  if (savedDifficulty !== null) {
    difficultySelect.value = savedDifficulty;
  }
});

// Save settings to localStorage when clicked on Save Settings
saveButton.addEventListener('click', () => {
  const volume = volumeSlider.value;
  const sound = soundCheckbox.checked;
  const difficulty = difficultySelect.value;

  // Save settings to localStorage
  localStorage.setItem('volume', volume);
  localStorage.setItem('sound', sound);
  localStorage.setItem('difficulty', difficulty);

  alert('Settings saved!');
});

// Go back to the main menu (or previous page)
backButton.addEventListener('click', () => {
  window.location.href = 'index.html'; // Change this to your main game page URL
});
