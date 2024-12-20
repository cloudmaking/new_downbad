/* 
  script.js
  This updated file includes:
    - "Super useful" tips for each phase.
    - Logic that sets the 'currentDate' field on page load.
    - The same day-count logic to determine the current phase.
*/

// Constants for cycle phases and their details, with expanded tips and advice
const CYCLE_PHASES = {
  menstrual: {
    name: "Menstrual Phase",
    tips: [
      "Prioritize self-care and rest",
      "Keep track of menstrual supplies (pads, tampons, etc.)",
      "Encourage gentle stretches or yoga to ease cramps",
      "Support a nutrient-rich diet (iron, vitamins)",
      "Stay hydrated to reduce bloating",
      "Offer comforts like a warm bath or cozy blankets",
    ],
    symptoms: [
      "Cramping or lower back pain",
      "Fatigue / Low energy",
      "Mood fluctuations (irritability, sadness)",
      "Bloating or breast tenderness",
    ],
    partnerTips: [
      "Offer to handle chores or errands so she can rest",
      "Provide a heating pad or hot water bottle for cramps",
      "Check if she has enough menstrual supplies",
      "Suggest relaxation activities (watch a movie, read together)",
      "Be patient and responsive to mood changes",
      "Keep the environment calm—light candles or play soothing music",
    ],
  },
  follicular: {
    name: "Follicular Phase",
    tips: [
      "This is a time of renewed energy—plan tasks that need focus",
      "Encourage setting new goals or starting projects",
      "Support gentle exercise routines",
      "Maintain balanced meals to keep energy levels steady",
      "Stay properly hydrated",
      "Take advantage of this more optimistic mood to plan outings or events",
    ],
    symptoms: [
      "Gradual increase in energy and motivation",
      "Improved mood and mental clarity",
      "Possible increase in libido",
    ],
    partnerTips: [
      "Engage in brainstorming or creative activities together",
      "Join her in active pursuits (walks, yoga, light workouts)",
      "Offer positive reinforcement for her goals",
      "Suggest fun dates or outings—visiting a museum, going to a new restaurant",
      "Respect her personal growth space; encourage her ambitions",
      "Celebrate small victories to maintain momentum",
    ],
  },
  ovulatory: {
    name: "Ovulatory Phase",
    tips: [
      "Peak energy—ideal time for social activities or big tasks",
      "Stay hydrated and consider adding fresh fruits/vegetables",
      "Use this natural confidence boost to tackle challenges",
      "Balance activity with proper rest—avoid burnout",
      "If trying to conceive, note that this is the most fertile window",
      "Maintain open communication about any family planning goals",
    ],
    symptoms: [
      "High energy and mental alertness",
      "Elevated mood and increased confidence",
      "Potential mild twinges or abdominal discomfort (ovulation pain)",
    ],
    partnerTips: [
      "Plan social gatherings or fun group activities",
      "Offer support if there's any family-planning discussion",
      "Encourage or join her in more dynamic exercises (jogging, dancing)",
      "Compliment her confidence and celebrate achievements",
      "Be receptive to intimacy—this is often a high-libido phase",
      "Engage in mutual goal-setting while spirits are high",
    ],
  },
  luteal: {
    name: "Luteal Phase",
    tips: [
      "Wind down—energy levels begin to fall",
      "Prepare for possible PMS by having comfort items ready",
      "Prioritize stress management or calming hobbies (journaling, light reading)",
      "Maintain consistent sleep patterns",
      "Increase magnesium intake (leafy greens, nuts) to help with mood",
      "Gentle self-care remains crucial to ease into the menstrual phase",
    ],
    symptoms: [
      "PMS symptoms (mood swings, cramps, bloating)",
      "Lower energy levels",
      "Possible cravings or increased appetite",
      "Breast tenderness",
    ],
    partnerTips: [
      "Offer emotional support—listen to her concerns without judgment",
      "Be patient if mood fluctuations occur",
      "Surprise her with small gestures (warm tea, favorite snack)",
      "Help stock up on comfort items (pain relievers, heating pad)",
      "Suggest low-key activities (reading, board games, or simple crafts)",
      "Reduce household or social stress where possible",
    ],
  },
};

// Element references
const lastPeriodInput = document.getElementById("lastPeriod");
const cycleLengthInput = document.getElementById("cycleLength");

// On page load, set valid max for date input, reset info, and display current date
document.addEventListener("DOMContentLoaded", () => {
  // Limit last period date to today or earlier
  lastPeriodInput.max = new Date().toISOString().split("T")[0];

  // Initialize with a default placeholder so the user sees something initially
  resetPhaseInfo();

  // Set the current date in the #currentDate element
  const currentDateEl = document.getElementById("currentDate");
  if (currentDateEl) {
    currentDateEl.textContent = formatDate(new Date());
  }
});

// Listen for date or cycle-length changes, then recalc
[lastPeriodInput, cycleLengthInput].forEach((input) => {
  input.addEventListener("change", calculateAndDisplay);
});

/**
 * Validate inputs and display the phase info or reset.
 */
function calculateAndDisplay() {
  const lastPeriodValue = lastPeriodInput.value;
  const cycleLengthValue = parseInt(cycleLengthInput.value);

  // If fields aren't valid yet, just reset
  if (!lastPeriodValue || isNaN(cycleLengthValue)) {
    resetPhaseInfo();
    return;
  }

  const lastPeriodDate = new Date(lastPeriodValue);

  // Basic validation
  if (
    !isValidDate(lastPeriodDate) ||
    cycleLengthValue < 21 ||
    cycleLengthValue > 35
  ) {
    resetPhaseInfo("Invalid Input", "Check your dates");
    return;
  }

  // Calculate & display details
  const phaseDetails = calculatePhase(lastPeriodDate, cycleLengthValue);
  displayPhaseInfo(phaseDetails);
}

/**
 * Determine which phase we're in based on the number of days since last period,
 * then return the phase data plus the next period date.
 */
function calculatePhase(lastPeriod, cycleLength) {
  const today = new Date();
  const daysSinceStart = Math.floor(
    (today - lastPeriod) / (1000 * 60 * 60 * 24)
  );
  const currentCycleDay = daysSinceStart % cycleLength;

  // Calculate next period date by adding whole cycles
  const nextPeriod = new Date(lastPeriod);
  const cyclesPassed = Math.floor(daysSinceStart / cycleLength);
  nextPeriod.setDate(nextPeriod.getDate() + (cyclesPassed + 1) * cycleLength);

  let currentPhase;
  if (currentCycleDay < 5) {
    currentPhase = CYCLE_PHASES.menstrual;
  } else if (currentCycleDay < 13) {
    currentPhase = CYCLE_PHASES.follicular;
  } else if (currentCycleDay < 17) {
    currentPhase = CYCLE_PHASES.ovulatory;
  } else {
    currentPhase = CYCLE_PHASES.luteal;
  }

  return { phase: currentPhase, nextPeriod };
}

/**
 * Update the UI with the correct phase details.
 */
function displayPhaseInfo({ phase, nextPeriod }) {
  document.getElementById("phaseName").textContent = phase.name;
  document.getElementById("nextPeriod").textContent = formatDate(nextPeriod);

  // Fill the lists in the new vertical order from HTML
  updateList("partnerTips", phase.partnerTips);
  updateList("tips", phase.tips);
  updateList("symptoms", phase.symptoms);
}

/**
 * Resets the display to default or error values.
 */
function resetPhaseInfo(
  phaseName = "Enter or adjust inputs to see info",
  nextPeriod = "N/A"
) {
  document.getElementById("phaseName").textContent = phaseName;
  document.getElementById("nextPeriod").textContent = nextPeriod;

  // Clear the lists
  updateList("partnerTips", []);
  updateList("tips", []);
  updateList("symptoms", []);
}

/**
 * Replaces a list element's content with given items.
 * @param {String} elementId - The ID of the UL element.
 * @param {String[]} items - The array of strings to display.
 */
function updateList(elementId, items) {
  const element = document.getElementById(elementId);
  element.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

/**
 * Returns a user-friendly date string (e.g., Monday, January 1, 2024).
 */
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Checks if a date is a valid Date object.
 */
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}
