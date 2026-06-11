/**
 * BMI Calculator — Frontend
 * Sends weight + height to Java servlet, renders result.
 */

const API = 'http://localhost:8080/bmi-calculator/api/bmi';

// Category → color var mapping
const COLOR = {
  'Underweight':  'var(--under)',
  'Normal weight':'var(--normal)',
  'Overweight':   'var(--over)',
  'Obese':        'var(--obese)'
};

// BMI range → % position on scale bar (0–100)
function bmiToPercent(bmi) {
  // Scale: 10 → 0%, 40 → 100%  (covers all practical values)
  const min = 10, max = 40;
  return Math.min(100, Math.max(0, ((bmi - min) / (max - min)) * 100));
}

// ── Theme Toggle ─────────────────────────────────────────────────
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

themeBtn.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.textContent = isDark ? '☾' : '☀';
});

// ── Calculate ────────────────────────────────────────────────────
document.getElementById('calcBtn').addEventListener('click', calculate);

// Allow Enter key in inputs
document.querySelectorAll('input').forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
});

async function calculate() {
  const weight = document.getElementById('weight').value.trim();
  const height = document.getElementById('height').value.trim();
  const errorEl = document.getElementById('errorMsg');

  errorEl.textContent = '';

  if (!weight || !height) {
    errorEl.textContent = 'Please enter both weight and height.';
    return;
  }

  const body = new URLSearchParams({ weight, height });

  try {
    const res  = await fetch(API, { method: 'POST', body });
    const data = await res.json();

    if (data.error) {
      errorEl.textContent = data.error;
      return;
    }

    renderResult(data);
  } catch (err) {
    errorEl.textContent = 'Could not reach the server. Is Tomcat running?';
  }
}

function renderResult({ bmi, category, idealMin, idealMax, tip }) {
  const color = COLOR[category] || 'var(--normal)';

  // BMI number + category
  const bmiValueEl    = document.getElementById('bmiValue');
  const bmiCategoryEl = document.getElementById('bmiCategory');
  bmiValueEl.textContent    = bmi;
  bmiValueEl.style.color    = color;
  bmiCategoryEl.textContent = category;
  bmiCategoryEl.style.color = color;

  // Scale pointer
  const pointer = document.getElementById('scalePointer');
  pointer.style.display = 'block';
  pointer.style.left    = bmiToPercent(bmi) + '%';

  // Highlight active scale segment
  const segMap = {
    'Underweight':   's-under',
    'Normal weight': 's-normal',
    'Overweight':    's-over',
    'Obese':         's-obese'
  };
  document.querySelectorAll('.scale-segment').forEach(s => s.classList.remove('active'));
  const activeEl = document.querySelector('.' + segMap[category]);
  if (activeEl) activeEl.classList.add('active');

  // Ideal weight range
  document.getElementById('idealRange').textContent = idealMin + ' – ' + idealMax + ' kg';

  // Health tip
  document.getElementById('healthTip').textContent = tip;

  // Show result panel
  const result = document.getElementById('result');
  result.classList.remove('visible');
  // Trigger reflow for re-animation
  void result.offsetWidth;
  result.classList.add('visible');
}
