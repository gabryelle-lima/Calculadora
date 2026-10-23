export function alarmLink(time, label, iphone = false) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Horário de alarme inválido.');
  if (iphone) return `alarme-iphone.html?horario=${encodeURIComponent(time)}`;
  const [hour, minute] = time.split(':').map(Number);
  const fallback = new URL('alarme.html', globalThis.location.href);
  fallback.searchParams.set('horario', time);
  return `intent:#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.alarm.HOUR=${hour};i.android.intent.extra.alarm.MINUTES=${minute};S.android.intent.extra.alarm.MESSAGE=${encodeURIComponent(label)};B.android.intent.extra.alarm.SKIP_UI=false;S.browser_fallback_url=${encodeURIComponent(fallback.href)};end`;
}
