import { calculateExitTime } from './calculadora.js';
import { displayResult, hideResult, toggleCampoExtra, mostrarErro, ocultarErro, duration } from './ui.js';
const form = document.getElementById('jornada-form');
const settingsPanel = document.getElementById('configuracoes');
const calculatorPanel = document.getElementById('calculadora-panel');
const settingsButton = document.getElementById('abrir-configuracoes');
const manualPanel = document.getElementById('manual');
const manualButton = document.getElementById('abrir-manual');
const calculatorButton = document.getElementById('abrir-calculadora');
const menuToggle = document.getElementById('menu-toggle');
const header = document.querySelector('.topbar');
function setMenu(open) {
  header.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  document.getElementById('menu-label').textContent = open ? 'Fechar' : 'Menu';
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('click', event => { if (!header.contains(event.target)) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { setMenu(false); menuToggle.focus(); }
});
document.getElementById('main-nav').addEventListener('click', event => {
  if (event.target.closest('a,button')) setMenu(false);
});
calculatorButton.addEventListener('click', () => showPanel('calculator'));
function showPanel(panel) {
  setMenu(false);
  for (const [button, name] of [[calculatorButton, 'calculator'], [settingsButton, 'settings'], [manualButton, 'manual']]) {
    if (name === panel) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
  settingsPanel.hidden = panel !== 'settings';
  manualPanel.hidden = panel !== 'manual';
  calculatorPanel.hidden = panel !== 'calculator';
  settingsButton.setAttribute('aria-expanded', String(panel === 'settings'));
  manualButton.setAttribute('aria-expanded', String(panel === 'manual'));
}
settingsButton.addEventListener('click', () => showPanel(settingsPanel.hidden ? 'settings' : 'calculator'));
manualButton.addEventListener('click', () => showPanel(manualPanel.hidden ? 'manual' : 'calculator'));
for (const [id, trigger] of [['voltar-calculadora', settingsButton], ['voltar-manual', manualButton]]) {
  document.getElementById(id).addEventListener('click', () => { showPanel('calculator'); (window.matchMedia('(max-width: 760px)').matches ? menuToggle : trigger).focus(); });
}
const value = id => document.getElementById(id).value;
function getConfig() {
  return { jornada: Number(value('jornada')), extras: Number(value('extras')), margem: Number(value('margem')), noturno: document.getElementById('noturno').checked };
}
function updateRules() {
  const config = getConfig();
  document.getElementById('rule-jornada').textContent = `${duration(config.jornada)} de jornada`;
  document.getElementById('rule-extras').textContent = `Até ${duration(config.extras)} de extras`;
  document.getElementById('margin-note').textContent = `Saídas arredondadas para baixo, com ${config.margem} minutos de antecedência. A margem pode deixar saldo negativo; confira seu ponto.`;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  ocultarErro();
  try {
    const six = document.getElementById('seis-marcacoes').checked;
    const config = getConfig();
    const result = calculateExitTime(value('entrada'), value('saida-cafe'), value('entrada-cafe'), six ? value('segunda-saida') : null, six ? value('segunda-entrada') : null, config);
    displayResult(result, config);
  } catch (error) {
    hideResult();
    mostrarErro(error.message);
  }
});
document.querySelector('main').addEventListener('input', () => { hideResult(); ocultarErro(); updateRules(); });
form.addEventListener('change', toggleCampoExtra);
// O evento reset acontece antes de o navegador restaurar os valores iniciais.
form.addEventListener('reset', () => queueMicrotask(() => {
  hideResult(); ocultarErro(); toggleCampoExtra(); updateRules();
}));
document.querySelector('main').addEventListener('invalid', event => {
  hideResult();
  showPanel(settingsPanel.contains(event.target) ? 'settings' : 'calculator');
}, true);
toggleCampoExtra();
updateRules();
