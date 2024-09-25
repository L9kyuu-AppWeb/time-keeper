let timerDisplay = document.getElementById('timer');
let largeTimerDisplay = document.getElementById('largeTimer');
let hoursInput = document.getElementById('hoursInput');
let minutesInput = document.getElementById('minutesInput');
let secondsInput = document.getElementById('secondsInput');
let titleInput = document.getElementById('titleInput'); // Input judul
let fullscreenTitle = document.getElementById('fullscreenTitle'); // Elemen judul di fullscreen
let setTimeBtn = document.getElementById('setTimeBtn');
let startBtn = document.getElementById('startBtn');
let setupContainer = document.getElementById('setupContainer');
let fullscreenTimer = document.getElementById('fullscreenTimer');
let timer; // Variable to store interval
let timeLeft = localStorage.getItem('timeLeft') || 305; // Default 1 hour (in seconds)

// Function to format time in hh:mm:ss
function formatTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Function to update the timer display and change color if time < 5 minutes
function updateTimer() {
    let fiveMinutes = 5 * 60; // 5 minutes in seconds
    let timeString = formatTime(timeLeft);
    
    timerDisplay.textContent = timeString;
    largeTimerDisplay.textContent = timeString;

    // When less than 5 minutes remaining, change background and make text blink
    if (timeLeft <= fiveMinutes) {
        fullscreenTimer.classList.add('bg-white'); // Change background to white
        largeTimerDisplay.classList.remove('text-white');
        largeTimerDisplay.classList.add('text-red-600', 'blinking'); // Change text color to red and blink
        fullscreenTitle.classList.add('text-black'); // Change title color to black
    } else {
        fullscreenTimer.classList.remove('bg-white');
        largeTimerDisplay.classList.remove('text-red-600', 'blinking');
        largeTimerDisplay.classList.add('text-white');
        fullscreenTitle.classList.remove('text-black');
    }

    localStorage.setItem('timeLeft', timeLeft);
}

// Function to start the countdown
function startTimer() {
    setupContainer.classList.add('hidden'); // Hide the setup form
    fullscreenTimer.classList.remove('hidden'); // Show the fullscreen timer

    // Set the title from input
    fullscreenTitle.textContent = titleInput.value || 'Countdown Timer'; // Use default if empty

    if (timer) clearInterval(timer); // Clear any existing timer
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(timer);
            // Optionally send data to server
            $.ajax({
                url: 'your-server-endpoint.php',
                method: 'POST',
                data: { time: timeLeft },
                success: function(response) {
                    console.log('Timer data sent to server', response);
                }
            });
        }
    }, 1000); // Update every 1 second
}

// Function to set the timer from input
function setTime() {
    let hours = parseInt(hoursInput.value) || 0;
    let minutes = parseInt(minutesInput.value) || 0;
    let seconds = parseInt(secondsInput.value) || 0;
    
    timeLeft = (hours * 3600) + (minutes * 60) + seconds;
    if (timeLeft > 0) {
        updateTimer();
    } else {
        alert('Please enter a valid time.');
    }
}

// Initialize the display with the last saved time
updateTimer();

// Event listener for the Set Time button
setTimeBtn.addEventListener('click', setTime);

// Event listener for the Start Timer button
startBtn.addEventListener('click', startTimer);
