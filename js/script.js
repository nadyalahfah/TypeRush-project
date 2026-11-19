(() => {
  'use strict';

  const KEYS = { history: 'typerush_history', theme: 'typerush_theme' };
  const $ = (selector) => document.querySelector(selector);
  const els = {
    input: $('#typing-input'), copy: $('#typing-copy'), shell: $('#typing-shell'), overlay: $('#typing-overlay'),
    wpm: $('#wpm-stat'), accuracy: $('#accuracy-stat'), timer: $('#timer-stat'), errors: $('#errors-stat'),
    progress: $('#progress-bar'), status: $('#test-status'), result: $('#result-view'), test: $('#test-view'), history: $('#history-view'),
    historyContent: $('#history-content'), dialog: $('#clear-dialog')
  };
  const state = { status: 'ready', duration: 30, timeLeft: 30, typedText: '', targetText: '', startedAt: 0, elapsed: 0, interval: null, saved: false };
  let history = readHistory();
  let activeView = 'test';

  function safeGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function safeSet(key, value) { try { localStorage.setItem(key, value); } catch { /* The test still works when storage is unavailable. */ } }
  function readHistory() {
    try {
      const value = JSON.parse(safeGet(KEYS.history) || '[]');
      if (!Array.isArray(value)) return [];
      return value.filter((item) => item && typeof item.id === 'string' && Number.isFinite(item.wpm) && Number.isFinite(item.accuracy));
    } catch { return []; }
  }
  function saveHistory() { safeSet(KEYS.history, JSON.stringify(history)); }
  function makePassage(count = 180) {
    const words = window.TYPE_WORDS || [];
    const result = [];
    for (let i = 0; i < count; i += 1) result.push(words[Math.floor(Math.random() * words.length)]);
    return result.join(' ') + ' ';
  }
  function setStatus(text, running = false) {
    els.status.classList.toggle('running', running);
    els.status.lastChild.textContent = ` ${text}`;
  }
  function resetTest(newPassage = true) {
    clearInterval(state.interval);
    state.status = 'ready'; state.timeLeft = state.duration; state.typedText = ''; state.startedAt = 0; state.elapsed = 0; state.saved = false;
    if (newPassage || !state.targetText) state.targetText = makePassage();
    els.input.value = ''; els.input.disabled = false;
    els.timer.innerHTML = `${state.duration}<span class="unit">s</span>`;
    els.wpm.textContent = '0'; els.accuracy.innerHTML = '100<span class="unit">%</span>'; els.errors.textContent = '0';
    els.progress.style.width = '0%'; els.overlay.classList.remove('hidden');
    setStatus('Ready when you are'); renderText();
  }
  function renderText() {
    const typed = state.typedText;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < state.targetText.length; i += 1) {
      const char = state.targetText[i];
      const span = document.createElement('span');
      span.textContent = char;
      if (i < typed.length) span.className = typed[i] === char ? 'correct' : 'incorrect';
      else if (i === typed.length) span.className = 'current';
      fragment.append(span);
    }
    els.copy.replaceChildren(fragment);
  }
  function measure() {
    let correct = 0;
    for (let i = 0; i < state.typedText.length; i += 1) if (state.typedText[i] === state.targetText[i]) correct += 1;
    const errors = state.typedText.length - correct;
    const accuracy = state.typedText.length ? Math.round(correct / state.typedText.length * 100) : 100;
    const minutes = Math.max(state.elapsed, 0.01) / 60;
    const wpm = state.status === 'ready' ? 0 : Math.round((correct / 5) / minutes);
    return { correct, errors, accuracy, wpm };
  }
  function updateStats() {
    const stats = measure();
    els.wpm.textContent = String(stats.wpm);
    els.accuracy.innerHTML = `${stats.accuracy}<span class="unit">%</span>`;
    els.errors.textContent = String(stats.errors);
    els.timer.innerHTML = `${Math.max(0, Math.ceil(state.timeLeft))}<span class="unit">s</span>`;
    els.progress.style.width = `${Math.min(100, state.elapsed / state.duration * 100)}%`;
  }
  function startTimer() {
    if (state.status !== 'ready') return;
    state.status = 'running'; state.startedAt = performance.now();
    els.overlay.classList.add('hidden'); setStatus('Test in progress', true);
    state.interval = window.setInterval(tick, 50);
  }
  function tick() {
    if (state.status !== 'running') return;
    state.elapsed = (performance.now() - state.startedAt) / 1000;
    state.timeLeft = Math.max(0, state.duration - state.elapsed);
    updateStats();
    if (state.timeLeft <= 0) finishTest();
  }
  function finishTest() {
    if (state.status === 'finished') return;
    if (state.status === 'running') {
      state.elapsed = Math.min(state.duration, (performance.now() - state.startedAt) / 1000);
    }
    state.timeLeft = 0; state.status = 'finished'; clearInterval(state.interval);
    els.input.disabled = true; els.overlay.classList.add('hidden'); setStatus('Session complete'); updateStats();
    const stats = measure();
    const result = { id: `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString(), duration: state.duration, wpm: stats.wpm, accuracy: stats.accuracy, correctCharacters: stats.correct, incorrectCharacters: stats.errors };
    if (!state.saved) { history = [result, ...history].slice(0, 20); saveHistory(); state.saved = true; }
    showResult(result);
  }
  function showResult(result) {
    $('#final-wpm').textContent = String(result.wpm); $('#final-accuracy').textContent = `${result.accuracy}%`;
    $('#final-correct').textContent = String(result.correctCharacters); $('#final-errors').textContent = String(result.incorrectCharacters);
    $('#final-duration').textContent = `${result.duration}s`;
    els.test.classList.add('hidden'); els.history.classList.add('hidden'); els.result.classList.remove('hidden'); activeView = 'result';
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('active', link.dataset.view === 'test'));
  }
  function onInput() {
    if (state.status === 'finished') return;
    const value = els.input.value.slice(0, state.targetText.length);
    if (value !== els.input.value) els.input.value = value;
    state.typedText = value;
    if (value.length && state.status === 'ready') startTimer();
    if (state.status === 'running') {
      state.elapsed = (performance.now() - state.startedAt) / 1000;
      state.timeLeft = Math.max(0, state.duration - state.elapsed);
    }
    renderText(); updateStats();
    if (state.typedText.length >= state.targetText.length) finishTest();
    else if (state.status === 'running' && state.targetText.length - value.length < 260) state.targetText += makePassage(90);
  }
  function navigate(view) {
    if (view === 'test' && state.status === 'finished') resetTest();
    activeView = view;
    els.test.classList.toggle('hidden', view !== 'test'); els.result.classList.add('hidden'); els.history.classList.toggle('hidden', view !== 'history');
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('active', link.dataset.view === view));
    if (view === 'history') renderHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
  }
  function renderHistory() {
    const best = history.reduce((value, item) => Math.max(value, item.wpm), 0);
    const average = history.length ? Math.round(history.reduce((sum, item) => sum + item.accuracy, 0) / history.length) : null;
    $('#personal-best').innerHTML = `${best}<small> WPM</small>`; $('#total-tests').textContent = String(history.length);
    $('#average-accuracy').innerHTML = average === null ? '—<small>%</small>' : `${average}<small>%</small>`;
    $('#history-count').textContent = `${history.length} ${history.length === 1 ? 'session' : 'sessions'}`;
    if (!history.length) {
      els.historyContent.innerHTML = '<div class="empty-state"><div class="empty-icon" aria-hidden="true">⌁</div><h3>No sessions yet</h3><p>No typing tests yet. Complete your first test to see your progress.</p></div>';
      return;
    }
    const rows = history.map((item) => `<tr><td>${formatDate(item.date)}</td><td>${item.duration}s</td><td class="mono ${item.wpm === best ? 'best-score' : ''}">${item.wpm} <small>WPM</small></td><td><span class="accuracy-pill">${item.accuracy}%</span></td><td class="mono">${item.correctCharacters ?? 0}</td><td class="mono">${item.incorrectCharacters ?? 0}</td></tr>`).join('');
    els.historyContent.innerHTML = `<div class="table-scroll"><table class="history-table"><thead><tr><th>DATE</th><th>TIME</th><th>SPEED</th><th>ACCURACY</th><th>CORRECT</th><th>ERRORS</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function loadTheme() {
    const theme = safeGet(KEYS.theme) === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    $('.theme-icon').textContent = theme === 'dark' ? '☼' : '☾';
    $('.theme-toggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  }

  document.querySelectorAll('[data-view]').forEach((element) => element.addEventListener('click', (event) => { event.preventDefault(); navigate(element.dataset.view); }));
  document.querySelectorAll('.duration-button').forEach((button) => button.addEventListener('click', () => {
    state.duration = Number(button.dataset.duration);
    document.querySelectorAll('.duration-button').forEach((item) => { const selected = item === button; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', String(selected)); });
    navigate('test'); resetTest();
  }));
  $('#restart-button').addEventListener('click', () => { navigate('test'); resetTest(); els.input.focus(); });
  $('#try-again-button').addEventListener('click', () => { navigate('test'); resetTest(); els.input.focus(); });
  $('#view-history-button').addEventListener('click', () => navigate('history'));
  els.input.addEventListener('input', onInput);
  els.shell.addEventListener('click', () => { if (state.status !== 'finished') els.input.focus(); });
  $('.theme-toggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme; safeSet(KEYS.theme, theme); loadTheme();
  });
  $('#clear-history-button').addEventListener('click', () => { if (typeof els.dialog.showModal === 'function') els.dialog.showModal(); });
  $('#cancel-clear').addEventListener('click', () => els.dialog.close());
  $('#confirm-clear').addEventListener('click', () => { history = []; saveHistory(); els.dialog.close(); renderHistory(); });
  els.dialog.addEventListener('click', (event) => { if (event.target === els.dialog) els.dialog.close(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && state.status === 'running') tick(); });

  loadTheme(); resetTest(); renderHistory();
})();
