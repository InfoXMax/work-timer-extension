const startTimeInput = document.getElementById('startTime');
const startBtn = document.getElementById('startBtn');
const elapsedSpan = document.getElementById('elapsed');
const timeLeftSpan = document.getElementById('timeLeft');
const leaveAtSpan = document.getElementById('leaveAt');

let timerInterval;

function updateTimer(startTime) {
  clearInterval(timerInterval);

  const start = new Date();
  const [h, m] = startTime.split(':').map(Number);
  start.setHours(h);
  start.setMinutes(m);
  start.setSeconds(0);

  const leave = new Date(start.getTime() + 9 * 60 * 60 * 1000);
  leaveAtSpan.textContent = leave.toTimeString().substring(0, 5);

  timerInterval = setInterval(() => {
    const now = new Date();
    let elapsedMs = now - start;
    let timeLeftMs = leave - now;

    if (elapsedMs < 0) elapsedMs = 0;
    if (timeLeftMs < 0) timeLeftMs = 0;

    elapsedSpan.textContent = formatTime(elapsedMs);
    timeLeftSpan.textContent = formatTime(timeLeftMs);
  }, 1000);
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

startBtn.onclick = () => {
  const startTime = startTimeInput.value;
  if (!startTime) return alert('Please enter your start time');

  chrome.storage.local.set({ workStartTime: startTime });
  updateTimer(startTime);
};

// Load saved time on popup open
chrome.storage.local.get('workStartTime', data => {
  if (data.workStartTime) {
    startTimeInput.value = data.workStartTime;
    updateTimer(data.workStartTime);
  }
});