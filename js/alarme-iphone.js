const time = new URLSearchParams(location.search).get('horario');
const valid = /^([01]\d|2[0-3]):[0-5]\d$/.test(time || '');
document.getElementById('horario').textContent = valid ? time : 'Volte e calcule novamente.';
if (valid) {
  const link = document.getElementById('executar');
  link.href = `shortcuts://run-shortcut?name=${encodeURIComponent('Alarme Jornada')}&input=text&text=${encodeURIComponent(time)}`;
  link.hidden = false;
}
