/**
 * BMI Calculator — Pure Frontend (No server needed)
 */

// ── BMI Logic ──────────────────────────────────────────────────
function calculateBMI(weight, height) {
  const h   = height / 100;
  const bmi = Math.round((weight / (h * h)) * 10) / 10;
  const idealMin = Math.round(18.5 * h * h * 10) / 10;
  const idealMax = Math.round(24.9 * h * h * 10) / 10;
  return { bmi, category: getCategory(bmi), idealMin, idealMax, tips: getTips(getCategory(bmi)) };
}

function getCategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25.0) return 'Normal weight';
  if (bmi < 30.0) return 'Overweight';
  return 'Obese';
}

function getTips(category) {
  const tips = {
    'Underweight': [
      'Eat calorie-dense, nutrient-rich foods like nuts, seeds, avocados, whole grains, and lean proteins to gain healthy weight.',
      'Add strength training 3 times a week — building muscle increases your healthy body weight more effectively than fat.',
      'Eat 5–6 smaller meals throughout the day instead of 3 large ones to increase your total daily calorie intake.',
      'Consult a doctor or dietician to rule out any underlying condition causing low weight and get a personalised meal plan.'
    ],
    'Normal weight': [
      'Keep up your balanced diet with plenty of vegetables, whole grains, lean proteins, and healthy fats to maintain your weight.',
      'Stay active with at least 150 minutes of moderate exercise per week — walking, cycling, or swimming all count.',
      'Get 7–8 hours of quality sleep every night. Poor sleep increases hunger hormones and can lead to gradual weight gain.',
      'Stay hydrated — drink 2–3 litres of water daily. Proper hydration supports metabolism and keeps energy levels stable.'
    ],
    'Overweight': [
      'Reduce portion sizes gradually and avoid eating while distracted — mindful eating helps you recognise fullness earlier.',
      'Replace sugary drinks, juices, and sodas with water or unsweetened beverages to cut hidden calories immediately.',
      'Add 30 minutes of brisk walking daily. Even light activity consistently can make a significant difference over time.',
      'Track your meals for 2 weeks using a free app like MyFitnessPal — awareness of what you eat is the first step to change.'
    ],
    'Obese': [
      'Start with small, sustainable changes — reducing 500 calories per day through diet and exercise can lead to steady weight loss.',
      'Prioritise whole foods over processed ones. Vegetables, legumes, and lean proteins keep you full longer with fewer calories.',
      'Consult your doctor before starting any exercise programme. Low-impact activities like swimming or cycling are easier on joints.',
      'Seek support from a registered dietician or weight management programme — professional guidance improves long-term outcomes significantly.'
    ]
  };
  return tips[category] || tips['Normal weight'];
}

// ── Color map ──────────────────────────────────────────────────
const COLOR = {
  'Underweight':   'var(--c-under)',
  'Normal weight': 'var(--c-normal)',
  'Overweight':    'var(--c-over)',
  'Obese':         'var(--c-obese)'
};

function bmiToDeg(bmi) {
  const min = 10, max = 40;
  return -90 + (Math.min(max, Math.max(min, bmi)) - min) / (max - min) * 180;
}

// ── Theme ──────────────────────────────────────────────────────
const html = document.documentElement;
document.getElementById('themeBtn').addEventListener('click', () => {
  const dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  document.getElementById('iconSun').style.display  = dark ? 'none' : '';
  document.getElementById('iconMoon').style.display = dark ? ''     : 'none';
});

// ── Gender ─────────────────────────────────────────────────────
let selectedGender = 'male';
document.querySelectorAll('.gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach(b => {
      b.classList.remove('active'); b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    selectedGender = btn.dataset.gender;
  });
});

// ── Enter key ──────────────────────────────────────────────────
document.querySelectorAll('.inp').forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
});
document.getElementById('calcBtn').addEventListener('click', calculate);

// ── Calculate ──────────────────────────────────────────────────
function calculate() {
  const ageEl    = document.getElementById('age');
  const weightEl = document.getElementById('weight');
  const heightEl = document.getElementById('height');
  const errorEl  = document.getElementById('errorMsg');
  errorEl.textContent = '';

  const age = ageEl.value.trim(), weight = weightEl.value.trim(), height = heightEl.value.trim();

  if (!age)    { showError('Please enter your age.',    ageEl);    return; }
  if (!weight) { showError('Please enter your weight.', weightEl); return; }
  if (!height) { showError('Please enter your height.', heightEl); return; }
  if (+age < 1 || +age > 120)        { showError('Age must be between 1 and 120.',        ageEl);    return; }
  if (+weight < 1 || +weight > 300)  { showError('Weight must be between 1 and 300 kg.',  weightEl); return; }
  if (+height < 50 || +height > 300) { showError('Height must be between 50 and 300 cm.', heightEl); return; }

  const result = calculateBMI(+weight, +height);
  renderResult(result, +weight);
}

function showError(msg, el) {
  document.getElementById('errorMsg').textContent = msg;
  if (el) {
    el.focus();
    const row = el.closest('.input-row');
    row.style.borderColor = 'var(--c-obese)';
    row.style.boxShadow   = '0 0 0 3px color-mix(in srgb, var(--c-obese) 12%, transparent)';
    setTimeout(() => { row.style.borderColor = ''; row.style.boxShadow = ''; }, 2000);
  }
}

// ── Render Result ──────────────────────────────────────────────
function renderResult({ bmi, category, idealMin, idealMax, tips }, weight) {
  const color = COLOR[category] || 'var(--c-normal)';

  // Gauge needle
  document.getElementById('gaugeNeedle').style.transform = `rotate(${bmiToDeg(bmi)}deg)`;

  // Active segment
  const segKey = { 'Underweight':'g-under','Normal weight':'g-normal','Overweight':'g-over','Obese':'g-obese' };
  document.querySelectorAll('.gseg').forEach(s => s.classList.remove('active'));
  document.querySelector('.' + segKey[category])?.classList.add('active');

  // BMI count-up
  countUp('bmiNumber', bmi, color);

  // Category pill
  const pill = document.getElementById('categoryBadge');
  document.getElementById('categoryText').textContent = category;
  document.getElementById('catDot').style.background  = color;
  pill.style.color = color; pill.style.borderColor = color;
  pill.style.background = `color-mix(in srgb, ${color} 10%, transparent)`;

  // Result badge
  document.getElementById('resultBadge').style.color = color;

  // Stats
  document.getElementById('idealRange').textContent = `${idealMin} – ${idealMax} kg`;

  const diffEl = document.getElementById('weightDiff');
  const diff = +(weight - idealMax).toFixed(1);
  const gain = +(idealMin - weight).toFixed(1);
  if (category === 'Normal weight') {
    diffEl.textContent = 'On track ✓'; diffEl.style.color = color;
  } else if (diff > 0) {
    diffEl.textContent = `↓ ${diff} kg`; diffEl.style.color = 'var(--c-obese)';
  } else {
    diffEl.textContent = `↑ ${gain} kg`; diffEl.style.color = 'var(--c-under)';
  }

  const catShort = document.getElementById('categoryShort');
  catShort.textContent = category; catShort.style.color = color;

  const statusMap = { 'Underweight':'⚠ Below range','Normal weight':'✓ Healthy','Overweight':'⚠ Above range','Obese':'✕ High risk' };
  const statusEl = document.getElementById('statusText');
  statusEl.textContent = statusMap[category]; statusEl.style.color = color;

  // Show result panel
  document.getElementById('emptyState').style.display = 'none';
  const rb = document.getElementById('resultContent');
  rb.classList.remove('visible'); void rb.offsetWidth; rb.classList.add('visible');


  // ── Render Step 3: Health Tips ────────────────────────────────
  const grid = document.getElementById('tipsGrid');
  grid.innerHTML = '';
  tips.forEach((tip, i) => {
    const div = document.createElement('div');
    div.className = 'tip-item';
    div.innerHTML = `
      <div class="tip-num" style="background:color-mix(in srgb,${color} 14%,var(--surface3));color:${color};border-color:color-mix(in srgb,${color} 22%,transparent)">${i + 1}</div>
      <p class="tip-text">${tip}</p>
    `;
    grid.appendChild(div);
  });

  document.getElementById('tipsEmpty').style.display  = 'none';
  const tb = document.getElementById('tipsContent');
  tb.classList.remove('visible'); void tb.offsetWidth; tb.classList.add('visible');
}

// ── Count-up animation ─────────────────────────────────────────
function countUp(id, target, color) {
  const el = document.getElementById(id);
  const dur = 800, t0 = performance.now();
  el.style.color = color;
  (function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(1);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(performance.now());
}
