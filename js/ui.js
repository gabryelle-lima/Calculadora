import { alarmLink } from './alarme.js';
export function duration(minutes) {
  const rounded = Math.floor(minutes);
  return `${Math.floor(rounded / 60)}h${String(rounded % 60).padStart(2, '0')}`;
}
export function displayResult(result, config) {
  document.getElementById('empty-result').hidden = true;
  const target = document.getElementById('resultado');
  target.hidden = false;
  const day = value => value ? `Dia seguinte (+${value})` : 'Mesmo dia';
  const warnings = [];
  if (result.limiteJaUltrapassado) warnings.push('O limite com extras já foi ultrapassado antes do último retorno. Não é possível recuperar a margem. Confira seu ponto.');
  else if (!result.margemLimiteCompleta) warnings.push('O último retorno já está dentro da margem do limite. Não é possível aplicar toda a antecedência configurada. Confira seu ponto.');
  if (result.jornadaJaCumprida) warnings.push('A jornada já foi cumprida antes do último retorno. A saída exibida é o horário desse retorno.');
  const android = /Android/i.test(navigator.userAgent);
  const alarm = (time, label) => android ? `<a class="alarm-button" href="${alarmLink(time, label)}">Criar alarme · ${time}</a>` : "";
  target.innerHTML = `
    <div class="result-label">Saída sugerida · ${config.margem} min de margem</div>
    <div class="result-time">${result.saidaSugerida}</div>
    <div class="day-label">${day(result.diaSaida)}</div>${alarm(result.saidaSugerida, "Hora de sair")}
    <div class="limit"><div class="result-label">${result.limiteJaUltrapassado ? 'Limite já ultrapassado' : 'Limite com extras · com margem'}</div><strong class="result-time">${result.limiteJaUltrapassado ? '—' : result.horarioLimite}</strong><div class="day-label">${day(result.diaLimite)}</div>${result.limiteJaUltrapassado ? "" : alarm(result.horarioLimite, "Limite com extras")}</div>
    ${android ? '<p class="alarm-help">Alarme em teste no Android. Confira o horário e os dias no Relógio. Se não abrir, configure manualmente; nenhum alarme foi confirmado pelo site.</p>' : ""}
    ${warnings.map(text => `<p class="warning">${text}</p>`).join('')}`;
}
export function hideResult() {
  document.getElementById('resultado').hidden = true;
  document.getElementById('resultado').replaceChildren();
  document.getElementById('empty-result').hidden = false;
}
export function mostrarErro(message) {
  const element = document.getElementById('mensagemErro');
  element.textContent = message;
  element.hidden = false;
}
export function ocultarErro() {
  document.getElementById('mensagemErro').hidden = true;
  document.getElementById('mensagemErro').textContent = '';
}
export function toggleCampoExtra() {
  const extra = document.getElementById('campoExtra');
  extra.hidden = !document.getElementById('seis-marcacoes').checked;
  extra.disabled = extra.hidden;
}
