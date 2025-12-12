// Get form and result elements
const form = document.getElementById("calculator-form");
const resultContainer = document.getElementById("result");
const errorContainer = document.getElementById("error");
const resultValue = document.getElementById("result-value");
const resultDetails = document.getElementById("result-details");

// Helper function to format numbers with commas
function formatNumber(num) {
  return Math.round(num).toLocaleString("no-NO");
}

// Parse number from formatted string (removes spaces and formatting)
function parseFormattedNumber(str) {
  return parseFloat(str.replace(/\s/g, "").replace(/,/g, ""));
}

// Format number input with Norwegian locale
function formatNumberInput(input) {
  const value = input.value.replace(/\s/g, "").replace(/,/g, "");
  if (value === "" || isNaN(value)) {
    return;
  }
  const num = parseFloat(value);
  if (!isNaN(num)) {
    input.value = Math.round(num).toLocaleString("no-NO");
  }
}

// Calculate days between two dates (inclusive)
function daysBetween(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / oneDay) + 1; // +1 to include both start and end dates
}

// Get the first day of the year
function getFirstDayOfYear() {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
}

// Get the last day of the year
function getLastDayOfYear() {
  const now = new Date();
  return new Date(now.getFullYear(), 11, 31);
}

// Get total days in the current year
function getTotalDaysInYear() {
  const now = new Date();
  const year = now.getFullYear();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return isLeapYear ? 366 : 365;
}

// Calculate steps needed
function calculateSteps() {
  // Get form values and parse formatted numbers
  const goalAverageInput = document.getElementById("yearly-goal");
  const currentAverageInput = document.getElementById("current-average");

  const goalAverage = parseFormattedNumber(goalAverageInput.value);
  const currentAverage = parseFormattedNumber(currentAverageInput.value);
  const startDateToggle = document.getElementById("start-date-toggle");
  const startDateOption = startDateToggle.value;

  // Validate inputs
  if (isNaN(goalAverage) || goalAverage <= 0) {
    showError("Vennligst oppgi et gyldig målgjennomsnitt større enn 0.");
    return;
  }

  if (isNaN(currentAverage) || currentAverage < 0) {
    showError("Vennligst oppgi et gyldig gjennomsnitt (0 eller større).");
    return;
  }

  // Get current date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  // Determine start date for remaining days calculation
  let startDate;
  let daysElapsedEndDate;

  if (startDateOption === "today") {
    // Include today: remaining days from today to Dec 31
    startDate = new Date(today);
    // Days elapsed: Jan 1 to yesterday (since we're including today in remaining)
    daysElapsedEndDate = new Date(today);
    daysElapsedEndDate.setDate(daysElapsedEndDate.getDate() - 1);
  } else {
    // From tomorrow: remaining days from tomorrow to Dec 31
    startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 1);
    // Days elapsed: Jan 1 to today (since we're starting from tomorrow)
    daysElapsedEndDate = new Date(today);
  }

  // Calculate days elapsed
  const firstDay = getFirstDayOfYear();
  const daysElapsed = daysBetween(firstDay, daysElapsedEndDate);

  // Calculate remaining days
  const lastDay = getLastDayOfYear();
  const remainingDays = daysBetween(startDate, lastDay);

  // Check if we're past the year end
  if (remainingDays <= 0) {
    showError("Året har allerede endt!");
    return;
  }

  // Calculate total yearly goal from average
  const totalDaysInYear = getTotalDaysInYear();
  const yearlyGoal = goalAverage * totalDaysInYear;

  // Calculate steps taken so far
  const stepsTaken = currentAverage * daysElapsed;

  // Calculate steps remaining
  const stepsRemaining = yearlyGoal - stepsTaken;

  // Check if goal is already achieved
  if (stepsRemaining <= 0) {
    showResult(
      `Gratulerer! Du har allerede nådd målet ditt!`,
      `Du har tatt ${formatNumber(
        stepsTaken
      )} skritt, som overgår målet ditt på ${formatNumber(
        goalAverage
      )} skritt per dag.`
    );
    return;
  }

  // Calculate average needed per day
  const averageNeeded = stepsRemaining / remainingDays;

  // Display result
  showResult(
    `${formatNumber(averageNeeded)} skritt per dag`,
    `Du trenger ${formatNumber(
      stepsRemaining
    )} flere skritt over ${remainingDays} gjenstående dager.`
  );
}

// Show result
function showResult(value, details) {
  errorContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  resultValue.textContent = value;
  resultDetails.textContent = details;
}

// Show error
function showError(message) {
  resultContainer.classList.add("hidden");
  errorContainer.classList.remove("hidden");
  errorContainer.textContent = message;
}

// Toggle button functionality
const toggleOptionToday = document.getElementById("toggle-option-today");
const toggleOptionTomorrow = document.getElementById("toggle-option-tomorrow");
const startDateToggle = document.getElementById("start-date-toggle");

function updateToggleState(selectedValue) {
  // Update hidden input
  startDateToggle.value = selectedValue;

  // Update button states
  if (selectedValue === "today") {
    toggleOptionToday.classList.add("active");
    toggleOptionTomorrow.classList.remove("active");
  } else {
    toggleOptionToday.classList.remove("active");
    toggleOptionTomorrow.classList.add("active");
  }
}

// Event listeners for toggle buttons
toggleOptionToday.addEventListener("click", () => {
  updateToggleState("today");
});

toggleOptionTomorrow.addEventListener("click", () => {
  updateToggleState("tomorrow");
});

// Format number inputs on blur
const yearlyGoalInput = document.getElementById("yearly-goal");
const currentAverageInput = document.getElementById("current-average");

yearlyGoalInput.addEventListener("blur", () => {
  formatNumberInput(yearlyGoalInput);
});

currentAverageInput.addEventListener("blur", () => {
  formatNumberInput(currentAverageInput);
});

// Allow only numbers while typing
yearlyGoalInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^\d]/g, "");
});

currentAverageInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^\d]/g, "");
});

// Event listener for form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  calculateSteps();
});
