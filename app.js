(() => {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ================= 아이콘 (선 2px, currentColor, 24 격자) ================= */
const F = 'fill="currentColor" stroke="none"';
const ICONS = {
  play:`<path d="M8.5 5.8v12.4L18.6 12z" ${F}/>`,
  pause:`<rect x="6.5" y="5.5" width="4" height="13" rx="1" ${F}/><rect x="13.5" y="5.5" width="4" height="13" rx="1" ${F}/>`,
  prev:`<path d="M18 6.5v11L10 12z" ${F}/><path d="M7 6.5v11"/>`,
  next:`<path d="M6 6.5v11l8-5.5z" ${F}/><path d="M17 6.5v11"/>`,
  lock:`<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>`,
  unlock:`<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 6.8-1.2"/>`,
  sheet:`<path d="M6 3.5h8.5l3.5 3.5v13.5H6z"/><path d="M14 3.5V7h4"/><path d="M12.5 16.5V10l3 .8"/><circle cx="10.8" cy="16.6" r="1.7"/>`,
  pen:`<path d="M5 19.5l3.8-.9 10-10a2 2 0 0 0-2.9-2.9l-10 10z"/><path d="M14.5 7.2l2.8 2.8"/>`,
  hl:`<path d="M10 14.5l-4 4V20h5.5l2-2"/><path d="M10 14.5l5.6-9.3 4.2 2.6-6.3 10.2z"/>`,
  erase:`<path d="M9 20h11"/><path d="M4.8 14.6l8.6-8.6a1.8 1.8 0 0 1 2.5 0l2.8 2.8a1.8 1.8 0 0 1 0 2.5L12 18.2H8.4z"/><path d="M9.5 10l4.6 4.6"/>`,
  undo:`<path d="M8.5 6.5L4.5 10.5l4 4"/><path d="M4.5 10.5h9.5a5 5 0 0 1 0 10h-3"/>`,
  tap:`<path d="M4.5 19.5L16 8"/><circle cx="17.6" cy="6.4" r="2.2"/><path d="M12.5 20.5h8M14 17.5l-1.2-1.2M19 17.5l1.2-1.2"/>`,
  sound:`<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6M18.2 6.6a7.6 7.6 0 0 1 0 10.8"/>`,
  mute:`<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M16 9.8l4.4 4.4M20.4 9.8L16 14.2"/>`,
  gear:`<circle cx="12" cy="12" r="3"/><path d="M12 3.2v2.3M12 18.5v2.3M3.2 12h2.3M18.5 12h2.3M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M5.8 18.2l1.6-1.6M16.6 7.4l1.6-1.6"/><circle cx="12" cy="12" r="6.3"/>`,
  more:`<circle cx="5.5" cy="12" r="1.7" ${F}/><circle cx="12" cy="12" r="1.7" ${F}/><circle cx="18.5" cy="12" r="1.7" ${F}/>`,
  link:`<path d="M10.2 13.8a3.8 3.8 0 0 0 5.4 0l3-3a3.8 3.8 0 0 0-5.4-5.4l-1.4 1.4"/><path d="M13.8 10.2a3.8 3.8 0 0 0-5.4 0l-3 3a3.8 3.8 0 0 0 5.4 5.4l1.4-1.4"/>`,
  back:`<path d="M14.5 5.5L8 12l6.5 6.5"/>`,
  paste:`<rect x="5.5" y="4.5" width="13" height="16" rx="2"/><path d="M9.5 4.5V3h5v1.5"/><path d="M9 10h6M9 13.5h6M9 17h4"/>`,
  share:`<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v6.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V12"/>`,
  chevL:`<path d="M14.5 5.5L8 12l6.5 6.5"/>`,
  chevR:`<path d="M9.5 5.5L16 12l-6.5 6.5"/>`,
  list:`<path d="M4.5 7h15M4.5 12h15M4.5 17h15"/>`,
  chevD:`<path d="M6.5 9.5L12 15l5.5-5.5"/>`,
};
const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const setIcon = (el, n) => { if (el) el.innerHTML = ic(n); };
document.querySelectorAll('[data-icon]').forEach(el => { el.insertAdjacentHTML('afterbegin', ic(el.dataset.icon)); });

/* ================= 데이터 ================= */
const KEY = 'countin.v1';
const DEF_SET = {light:false, visual:'pulse', sound:'wood', volume:.8, subVol:.45, vibrate:'down', wake:true, soundOn:true, nextAuto:false, showBar:true, sheetAuto:true, pgBtns:true, visOffset:0, songFlip:2, myName:'', devId:'', role:''};
const VIS = [['pulse','원'],['lane','레인'],['flash','플래시'],['pend','진자'],['bounce','공'],['count','숫자'],['edge','테두리']];
const VISD = {pulse:'원이 박마다 커졌다 줄어요', lane:'리듬게임처럼 박이 흘러와요 · 박에 맞춰 두드리면 판정', flash:'화면 전체가 박마다 번쩍', pend:'진자가 좌우로 흔들려요', bounce:'공이 박 칸을 건너뛰어요', count:'지금 박 번호를 크게', edge:'화면 테두리가 빛나요 · 악보와 같이'};
const SOUNDS = [['wood','우드블록'],['beep','비프'],['cow','카우벨'],['stick','사이드스틱']];
function newSong(o = {}) {
  return Object.assign({id:uid(), title:'', bpm:100, num:4, den:4, pulse:'eighth', sub:'none', countIn:2, muteAfter:false, accent:true, visual:null, memo:'', sheet:null, follow:null}, o);
}
// 밖에서 들어온 값(백업·링크·연동)도 화면이 감당할 범위로: 박자 1~32, BPM 20~300, 글자 길이 제한
const str = (v, n) => String(v ?? '').slice(0, n);
function cleanSong(s) {
  s.id = str(s.id, 40) || uid(); s.title = str(s.title, 80); s.memo = str(s.memo, 200);
  s.bpm = clamp(Math.round(+s.bpm) || 100, 20, 300); s.num = clamp(Math.round(+s.num) || 4, 1, 32);
  s.den = [2, 4, 8, 16].includes(+s.den) ? +s.den : 4; s.sub = ['none', '8', '3', '16'].includes(String(s.sub)) ? String(s.sub) : 'none';
  s.pulse = s.pulse === 'dotted' ? 'dotted' : 'eighth'; s.countIn = clamp(Math.round(+s.countIn) || 0, 0, 8);
  s.muteAfter = !!s.muteAfter; s.accent = s.accent !== false;
  if (s.visual && !VIS.some(v => v[0] === s.visual)) s.visual = null;
  if (s.follow && !['on', 'off'].includes(s.follow)) s.follow = null;
  return s;
}
const cleanSongs = a => (Array.isArray(a) ? a : []).filter(x => x && typeof x === 'object').slice(0, 300).map(x => cleanSong(newSong(x)));
function seed() {
  const s = {id:uid(), name:'예시 콘티', songs:[
    newSong({title:'여는 곡 (예시)', bpm:72, memo:'인트로 드럼만 4마디'}),
    newSong({title:'빠른 곡 (예시)', bpm:128, sub:'8', memo:'브릿지 하프타임'}),
    newSong({title:'셔플 곡 (예시)', bpm:64, num:6, den:8, pulse:'dotted', sub:'3'}),
    newSong({title:'왈츠 곡 (예시)', bpm:84, num:3, den:4, countIn:1}),
  ]};
  return {v:1, setlists:[s], cur:s.id, settings:{...DEF_SET}, library:[]};
}
// 악보함(library): PDF 파일 목록(이 기기에 저장). 콘티는 pdfs:[key…]로 쓸 PDF를 고르고,
// 곡(sheet)은 {items:[{key, page}]}로 여러 PDF의 쪽을 순서대로 가리킴 (page 0 = 그 PDF 전체)
function fix(d) {
  d.settings = Object.assign({...DEF_SET}, d.settings || {});
  d.setlists = (d.setlists || []).filter(x => x && Array.isArray(x.songs)).map(x => ({id:x.id || uid(), name:str(x.name || '콘티', 60), pdfs:Array.isArray(x.pdfs) ? x.pdfs.slice(0, 50).map(k => str(k, 80)) : [], marks:x.marks && typeof x.marks === 'object' ? x.marks : {}, ctl:Object.assign({on:true, start:true, song:true, page:true, bpm:true, cue:true}, x.ctl || {}), linked:x.linked || null, shareFrom:x.shareFrom || null, followUI:typeof x.followUI === 'boolean' ? x.followUI : !!(x.linked || x.shareFrom), songs:cleanSongs(x.songs)}));
  d.setlists.forEach(x => { if (x.name === '예시 셋리스트' || x.name === '예시 프로' + '젝트') x.name = '예시 콘티'; });
  if (!d.setlists.some(x => x.id === d.cur)) d.cur = d.setlists.length ? d.setlists[0].id : null;
  d.practice = Array.isArray(d.practice) ? d.practice.slice(-30) : [];
  d.library = (Array.isArray(d.library) ? d.library : []).filter(x => x && x.key).map(x => ({key:str(x.key, 80), name:str(x.name || '악보', 80), pages:clamp(Math.round(+x.pages) || 0, 0, 2000)}));
  const lk = new Set(d.library.map(x => x.key));
  d.setlists.forEach(sl => {
    sl.songs.forEach(s => {
      const sh = s.sheet;
      if (!sh) { s.sheet = null; return; }
      let items = Array.isArray(sh.items) ? sh.items : sh.key ? (Array.isArray(sh.pages) ? sh.pages.map(page => ({key:sh.key, page})) : [{key:sh.key, page:0}]) : [];
      items = items.filter(it => it && it.key).map(it => ({key:String(it.key), page:Math.max(0, +it.page || 0)}));
      items.forEach(it => { if (!lk.has(it.key)) { d.library.push({key:it.key, name:String(sh.name || '악보'), pages:0}); lk.add(it.key); } });
      s.sheet = items.length ? {items} : null;
    });
    // 곡이 쓰는 PDF는 그 콘티 악보 목록에도 넣어 둠
    sl.songs.forEach(s => s.sheet && s.sheet.items.forEach(it => { if (!sl.pdfs.includes(it.key)) sl.pdfs.push(it.key); }));
    sl.pdfs = sl.pdfs.filter((k, i, a) => lk.has(k) && a.indexOf(k) === i);
  });
  return d;
}
function load() { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.setlists) return fix(d); } catch (e) {} return fix(seed()); }
let D = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { toast('저장 공간이 부족해서 저장하지 못했어요'); } if (window.__syncReady) syncProjChanged(); }
save();
if (!D.settings.devId) { D.settings.devId = uid(); save(); }
const curSL = () => D.setlists.find(x => x.id === D.cur) || D.setlists[0];

const isDotted = s => s.den === 8 && s.pulse === 'dotted' && s.num % 3 === 0;
const bpb = s => isDotted(s) ? s.num / 3 : s.num;
const subsOf = s => ({none:1, '8':2, '3':3, '16':4})[s.sub] || 1;
const SUBL = {none:'', '8':'8분', '3':'3연음', '16':'16분'};
const sigL = s => `${s.num}/${s.den}` + (isDotted(s) ? ' (점4분)' : '');
// [3,4,7] → "3–4, 7쪽" (고른 순서 유지, 이어진 쪽만 묶음)
function pagesLabel(p) {
  if (!p) return '전체 쪽';
  const out = [];
  for (let i = 0; i < p.length; i++) {
    let j = i; while (j + 1 < p.length && p[j + 1] === p[j] + 1) j++;
    out.push(j > i ? `${p[i]}–${p[j]}` : String(p[i])); i = j;
  }
  return out.join(', ') + '쪽';
}
const libOf = k => D.library.find(x => x.key === k);
const projsWith = k => D.setlists.filter(p => p.pdfs.includes(k));
const orphanPdfs = () => D.library.filter(x => !projsWith(x.key).length);
// 어느 콘티에도 없는 PDF 파일 지우기. 지운 개수를 돌려줌
function dropFiles(keys) {
  if (!keys.length) return 0;
  D.library = D.library.filter(x => !keys.includes(x.key));
  D.setlists.forEach(p => { p.pdfs = p.pdfs.filter(k => !keys.includes(k)); p.songs.forEach(s => keys.forEach(k => dropKey(s, k))); });
  keys.forEach(k => DOCS.delete(k));
  save(); gcSheets();
  return keys.length;
}
const pruneLibrary = () => dropFiles(orphanPdfs().map(x => x.key));
const usesKey = (s, k) => !!(s.sheet && s.sheet.items.some(it => it.key === k));
function dropKey(s, k) { if (!s.sheet) return; s.sheet.items = s.sheet.items.filter(it => it.key !== k); if (!s.sheet.items.length) s.sheet = null; }
// 여러 PDF에서 고른 쪽 요약: "3–4쪽" 또는 "콘티 3–4쪽 + 드럼 1쪽"
function sheetLabel(items, withName) {
  const g = [];
  items.forEach(it => { const last = g[g.length - 1]; if (last && last.key === it.key) last.pages.push(it.page); else g.push({key:it.key, pages:[it.page]}); });
  const one = new Set(items.map(it => it.key)).size === 1;
  return g.map(x => { const pl = x.pages.includes(0) ? '전체 쪽' : pagesLabel(x.pages), L = libOf(x.key); return one && !withName ? pl : `${L ? L.name : '악보'} ${pl}`; }).join(' + ');
}
const meta = s => [s.sheet ? '악보 ' + sheetLabel(s.sheet.items) : '', sigL(s), SUBL[s.sub], s.countIn ? `카운트 ${s.countIn}마디` : '', s.memo].filter(Boolean).join(' · ');

/* ================= 공통 UI ================= */
// 알림 띠: 결과가 화면에 보이면 띄우지 않음. 오류·경고·연동 소식과 되돌리기만.
let bandT;
const placeBands = () => $('#bands').classList.toggle('top', !$('#scrPlay').hidden);
function toast(m) { const b = $('#band'); b.firstChild.textContent = m; b.hidden = false; placeBands(); clearTimeout(bandT); bandT = setTimeout(() => b.hidden = true, 2400); }
// 되돌리기 띠: 따로 한 칸이라 다른 알림이 덮지 않음. 새 되돌리기가 오면 이전 것은 바로 확정
let actPending = null;
function bandAction(m, label, onAction, onExpire, ms = 5000) {
  if (actPending) { const p = actPending; actPending = null; clearTimeout(p.t); p.expire && p.expire(); }
  const b = $('#bandAct'); b.querySelector('span').textContent = m;
  const btn = b.querySelector('button'); btn.textContent = label; b.hidden = false; placeBands();
  const me = {expire:onExpire, t:setTimeout(() => { if (actPending === me) { actPending = null; b.hidden = true; onExpire && onExpire(); } }, ms)};
  actPending = me;
  btn.onclick = () => { if (actPending !== me) return; actPending = null; clearTimeout(me.t); b.hidden = true; onAction(); };
}
// 길게 누르기 + 차오르는 고리 (잠금 해제·잠금 중 다음 곡)
function holdRing(el, ms, onDone) {
  el.classList.add('holdring');
  const t0 = performance.now(); let raf, done = false;
  const tick = () => { const p = Math.min(1, (performance.now() - t0) / ms); el.style.setProperty('--hp', (p * 100) + '%'); if (p >= 1) { done = true; stop(); onDone(); } else raf = requestAnimationFrame(tick); };
  const stop = () => { cancelAnimationFrame(raf); el.style.setProperty('--hp', '0%'); el.classList.remove('holdring'); };
  raf = requestAnimationFrame(tick);
  return () => { if (!done) stop(); return done; };
}

// 두드린 시각들 → BPM. 중앙값에서 크게 벗어난 간격(놓친 박·두 번 누름)은 빼고, 두 박 간격은 반으로 나눠 씀
function tapBpm(ts) {
  const iv = [];
  for (let i = 1; i < ts.length; i++) iv.push(ts[i] - ts[i - 1]);
  if (iv.length < 2) return null;
  const sorted = [...iv].sort((a, b) => a - b), med = sorted[sorted.length >> 1];
  const ok = [];
  iv.forEach(x => {
    if (Math.abs(x - med) <= med * .2) ok.push(x);
    else if (Math.abs(x / 2 - med) <= med * .15) ok.push(x / 2);
  });
  if (ok.length < 2) return null;
  const mean = ok.reduce((a, b) => a + b, 0) / ok.length;
  const sd = Math.sqrt(ok.reduce((a, b) => a + (b - mean) ** 2, 0) / ok.length);
  return {bpm:clamp(Math.round(60000 / mean), 20, 300), cv:sd / mean, used:ok.length, dropped:iv.length - ok.length};
}

/* ---------- 탭 패드: 큰 영역 아무 데나 두드려서 템포 재기 ---------- */
const TP = {ts:[], res:null, cb:null, flashT:0};
function openTapPad(start, cb) {
  TP.ts = []; TP.res = null; TP.cb = cb; TP.start = start;
  $('#tpBpm').textContent = start || '—'; $('#tpBpm').classList.add('dim');
  $('#tpSt').textContent = '탭';
  $('#tpDots').innerHTML = '';
  $('#tpApply').disabled = true;
  $('#tpad').hidden = false;
  history.pushState({s:'tap'}, '');
}
function closeTapPad(fromPop) {
  if ($('#tpad').hidden) return;
  $('#tpad').hidden = true;
  if (!fromPop) { ignorePop = true; history.back(); }
}
function tapHit(t) {
  if (TP.ts.length && t - TP.ts[TP.ts.length - 1] > 2500) TP.ts = [];
  TP.ts.push(t); if (TP.ts.length > 12) TP.ts.shift();
  const a = $('#tpArea'); a.classList.add('hit'); clearTimeout(TP.flashT); TP.flashT = setTimeout(() => a.classList.remove('hit'), 90);
  try { navigator.vibrate && navigator.vibrate(8); } catch (e) {}
  const n = TP.ts.length;
  $('#tpDots').innerHTML = Array.from({length:Math.min(n, 8)}, () => '<i class="on"></i>').join('') + Array.from({length:Math.max(0, 4 - n)}, () => '<i></i>').join('');
  const r = tapBpm(TP.ts); TP.res = r;
  if (!r) { $('#tpSt').textContent = n === 1 ? '좋아요, 계속 두드리세요' : '조금만 더 두드리세요'; return; }
  $('#tpBpm').textContent = r.bpm; $('#tpBpm').classList.remove('dim');
  const lv = r.cv < .03 ? '<b>안정적</b>' : r.cv < .07 ? '<b class="warn">조금 흔들림</b>' : '<b class="warn">흔들림 · 계속 두드려 보세요</b>';
  $('#tpSt').innerHTML = `${n}번 두드림 · ${lv}${r.dropped ? ` · 튀는 ${r.dropped}번 뺌` : ''}`;
  $('#tpApply').disabled = false;
}
// 손가락이 닿는 순간(pointerdown)의 시각으로 잼
$('#tpArea').addEventListener('pointerdown', e => { e.preventDefault(); tapHit(e.timeStamp || performance.now()); });
$('#tpArea').addEventListener('contextmenu', e => e.preventDefault());
$('#tpCancel').onclick = () => closeTapPad();
$('#tpApply').onclick = () => { if (TP.res && TP.cb) TP.cb(TP.res.bpm, TP.ts[TP.ts.length - 1]); closeTapPad(); };
// 페달·키보드로도 두드리기 (스페이스·엔터·T·→·PageDown)
document.addEventListener('keydown', e => {
  if ($('#tpad').hidden) return;
  if ([' ', 'Enter', 't', 'T', 'ArrowRight', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) tapHit(e.timeStamp || performance.now()); }
  else if (e.key === 'Escape') { e.preventDefault(); closeTapPad(); }
}, true);

/* ================= 오디오 / 박 엔진 ================= */
const E = {ctx:null, master:null, noise:null, playing:false, start:0, spb:.5, n:0, sub:0, tok:0};
function ensureCtx() {
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  if (!E.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    E.ctx = new AC({latencyHint:'interactive'});
    E.master = E.ctx.createGain(); E.master.gain.value = D.settings.volume; E.master.connect(E.ctx.destination);
    const len = E.ctx.sampleRate * .1, buf = E.ctx.createBuffer(1, len, E.ctx.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    E.noise = buf;
    const s = E.ctx.createBufferSource(); s.buffer = E.ctx.createBuffer(1, 1, 22050); s.connect(E.ctx.destination); s.start(0);
    // 들리지 않는 아주 작은 신호를 계속 흘려서, 멈춘 동안 폰 오디오 출력이 잠들지 않게 (다시 누르면 바로 소리)
    try { const k = E.ctx.createConstantSource(), g = E.ctx.createGain(); g.gain.value = 1e-6; k.connect(g); g.connect(E.ctx.destination); k.start(); } catch (e) {}
  }
  if (E.ctx.state !== 'running') E.ctx.resume();
  return E.ctx;
}
function env(g, t, peak, dec) {
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, .0002), t + .002);
  g.gain.exponentialRampToValueAtTime(.0001, t + dec);
}
// lvl: 2 = 첫 박, 1 = 박, 0 = 쪼개기
function click(t, lvl, kind = D.settings.sound) {
  const c = E.ctx, v = lvl === 0 ? D.settings.subVol : 1, g = c.createGain();
  g.connect(E.master);
  const tone = (type, f, peak, dec) => { const o = c.createOscillator(), og = c.createGain(); o.type = type; o.frequency.value = f; env(og, t, peak, dec); o.connect(og).connect(g); o.start(t); o.stop(t + dec + .02); };
  const noise = (f, q, peak, dec) => { const s = c.createBufferSource(), bp = c.createBiquadFilter(), ng = c.createGain(); s.buffer = E.noise; bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q; env(ng, t, peak, dec); s.connect(bp).connect(ng).connect(g); s.start(t); s.stop(t + dec + .02); };
  const hi = lvl === 2, lo = lvl === 0;
  if (kind === 'wood') { tone('sine', hi ? 1750 : lo ? 1000 : 1250, .9 * v, .05); noise(hi ? 2600 : 2000, 4, .25 * v, .02); }
  else if (kind === 'beep') tone('square', hi ? 2000 : lo ? 1200 : 1500, .22 * v, .035);
  else if (kind === 'cow') { const m = hi ? 1.25 : lo ? .85 : 1; tone('square', 800 * m, .22 * v, .18); tone('square', 540 * m, .22 * v, .18); }
  else { noise(hi ? 3400 : lo ? 2000 : 2600, 1.5, 1.1 * v, .045); tone('sine', hi ? 520 : 440, .3 * v, .03); }
}
function vib(t, accent) {
  if (!navigator.vibrate) return;
  const ms = Math.max(0, (t - outNow()) * 1000 - D.settings.visOffset);
  setTimeout(() => { try { navigator.vibrate(accent ? 70 : 35); } catch (e) {} }, ms);
}
function schedule() {
  if (!E.playing || !E.ctx) return;
  const s = eSong(); if (!s) return;
  const B = bpb(s), subs = subsOf(s), cin = s.countIn * B, ahead = E.ctx.currentTime + .12;
  for (let guard = 0; guard < 64; guard++) {
    const counting = E.n < cin;
    const t = E.start + (E.n + (counting ? 0 : E.sub / subs)) * E.spb;
    if (t > ahead) break;
    const audible = D.settings.soundOn && (counting || !s.muteAfter);
    const late = t < E.ctx.currentTime - .005;
    if (E.sub === 0) {
      const first = E.n % B === 0, accent = first && (s.accent || counting);
      if (audible && !late) click(t, accent ? 2 : 1);
      if (!audible && !late && D.settings.vibrate !== 'off' && (D.settings.vibrate === 'all' || first)) vib(t, first);
    } else if (audible && !late) click(t, 0);
    if (counting) { E.n++; E.sub = 0; }
    else if (++E.sub >= subs) { E.sub = 0; E.n++; }
  }
}
let worker = null;
try { worker = new Worker(URL.createObjectURL(new Blob(['setInterval(()=>postMessage(0),25)'], {type:'text/javascript'}))); worker.onmessage = schedule; }
catch (e) { setInterval(schedule, 25); }

// 누르면 바로: 첫 박은 지금부터 30ms 뒤(오디오가 받아 갈 최소 여유), 바로 예약. 같이 맞추는 리더만 기기들이 받을 시간 0.6초
function start() {
  if (!song()) return;
  const c = ensureCtx(), tok = ++E.tok;
  E.spb = 60 / P.bpm; E.start = Infinity; E.n = 0; E.sub = 0; E.playing = true; P.barOff = 0;
  E.song = JSON.parse(JSON.stringify(song()));
  Object.assign(LG, {combo:0, best:0, t:0, lastN:-9});
  updPlayBtn();
  const go = () => {
    if (tok !== E.tok || !E.playing) return;
    const lead = window.__syncReady && SY.role === 'leader' && SY.conns.length ? .6 : .03;
    E.start = E.ctx.currentTime + lead; schedule(); onTiming();
  };
  // 오디오가 쉬고 있었으면(앱 전환 등) 깨어난 시각 기준으로 시작
  if (c.state !== 'running') { const p = c.resume(); if (p && p.then) { p.then(go, go); return; } }
  go();
}
function stop() { const was = E.playing; E.playing = false; E.tok++; E.song = null; updPlayBtn(); onTiming(); if (was && LG.best >= 8) { toast(`최고 ${LG.best} 콤보!`); LG.best = 0; } }
// 재생 중 박을 낼 때 쓰는 곡 설정: 연주 중 편집해도 박자·카운트인은 다음 시작부터 바뀜 (BPM은 P.bpm)
const eSong = () => (E.playing && E.song) || song();
// 지금 스피커로 나오고 있는 소리의 시각(오디오 시계 기준). getOutputTimestamp로 끊김 없이 이어서 계산
function outNow() {
  const c = E.ctx;
  if (c.getOutputTimestamp) {
    const ts = c.getOutputTimestamp();
    if (ts.contextTime > 0 && ts.performanceTime > 0) return ts.contextTime + (performance.now() - ts.performanceTime) / 1000;
  }
  return c.currentTime - (c.outputLatency || 0) - (c.baseLatency || 0);
}
// 화면에 그릴 박 위치: 그린 뒤 화면에 나오기까지 한 프레임(약 16ms)을 미리 당기고, 사용자 보정값을 더함
const FRAME_AHEAD = .016;
function beatNow() {
  if (!E.playing || !E.ctx) return null;
  return (outNow() + FRAME_AHEAD + D.settings.visOffset / 1000 - E.start) / E.spb;
}

/* ================= 그리기 ================= */
const COL = {};
function readCol() { const cs = getComputedStyle(document.documentElement), g = k => cs.getPropertyValue(k).trim(); Object.assign(COL, {raise:g('--raise'), panel:g('--panel'), line:g('--line'), text:g('--text'), mute:g('--mute'), dim:g('--dim'), beat:g('--beat'), down:g('--down'), cue:g('--cue'), ink:g('--ink')}); }
// 조명 모드: 강한 무대 조명 아래에서 선을 굵게, 회색 글자를 밝게
function applyLight() { const r = document.documentElement; if (D.settings.light) r.dataset.light = '1'; else delete r.dataset.light; readCol(); }
applyLight();
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
const NUMF = getComputedStyle(document.documentElement).getPropertyValue('--f-num');
try { document.fonts.load(`800 40px CountNum`); document.fonts.load(`700 40px CountNum`); } catch (e) {}
const BODYF0 = getComputedStyle(document.documentElement).getPropertyValue('--f-body');
function fit(cv, maxD = 2.5) {
  const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, maxD);
  const w = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  return cv.getContext('2d');
}
// o: {loud, subs, counting, idle}
function draw(cv, mode, b, beats, o) {
  const g = fit(cv), W = cv.width, H = cv.height, m = Math.min(W, H);
  g.clearRect(0, 0, W, H);
  const idx = Math.floor(b), ph = b - idx, k = ((idx % beats) + beats) % beats;
  const col = o.counting ? COL.cue : k === 0 ? COL.down : COL.beat;
  const dec = o.dec || .3, hit = o.idle ? 0 : ph < dec ? Math.pow(1 - ph / dec, 2) : 0;
  const fb = k === 0 && !o.idle, FB = fb ? 1.3 : 1;   // 첫 박: 1.3배 + 바깥 고리 (조명·색약에서도 구분)
  const ring = (x, y, r) => { g.save(); g.globalAlpha = (o.idle ? .35 : 1) * (.4 + .6 * hit); g.beginPath(); g.arc(x, y, r, 0, 7); g.strokeStyle = col; g.lineWidth = m * .016; g.stroke(); g.restore(); };
  g.globalAlpha = o.idle ? .35 : 1;
  g.textAlign = 'center'; g.textBaseline = 'middle';

  if (mode === 'pulse') {
    const base0 = m * (o.loud ? .2 : .16), base = base0 * FB, R = Math.min(base0 * 1.9, m * .46);
    g.beginPath(); g.arc(W / 2, H / 2, base + m * .22 * hit, 0, 7); g.fillStyle = rgba(col, .2 * hit); g.fill();
    g.beginPath(); g.arc(W / 2, H / 2, base * (1 + .25 * hit), 0, 7); g.fillStyle = col; g.globalAlpha = (o.idle ? .35 : 1) * (.35 + .65 * hit); g.fill(); g.globalAlpha = o.idle ? .35 : 1;
    if (fb) ring(W / 2, H / 2, Math.min(base * (1 + .25 * hit) + m * .045, R - m * .02));
    g.lineWidth = m * .014;
    g.beginPath(); g.arc(W / 2, H / 2, R, 0, 7); g.strokeStyle = COL.line; g.stroke();
    if (!o.idle) { g.beginPath(); g.arc(W / 2, H / 2, R, -Math.PI / 2, -Math.PI / 2 + ph * Math.PI * 2); g.strokeStyle = COL.mute; g.stroke(); }
    for (let j = 1; j < o.subs; j++) { const a = -Math.PI / 2 + j / o.subs * Math.PI * 2; g.beginPath(); g.arc(W / 2 + R * Math.cos(a), H / 2 + R * Math.sin(a), m * .018, 0, 7); g.fillStyle = ph >= j / o.subs ? COL.text : COL.dim; g.fill(); }
  } else if (mode === 'flash') {
    g.fillStyle = rgba(col, (o.loud ? .95 : .8) * Math.pow(1 - ph, 2) * (o.idle ? 0 : 1)); g.fillRect(0, 0, W, H);
    g.fillStyle = ph < .25 && !o.idle ? COL.ink : COL.text; g.font = `800 ${m * .5 * (fb ? 1.15 : 1)}px ${NUMF}`;
    g.fillText(String(k + 1), W / 2, H / 2);
    if (fb) ring(W / 2, H / 2, m * .36);
  } else if (mode === 'pend') {
    const px = W / 2, py = H * .1, L = H * .74, A = Math.min(.6, Math.asin(Math.min(1, W * .42 / L)));
    const ang = o.idle ? 0 : A * Math.cos(Math.PI * b);
    g.beginPath(); g.arc(px, py, L, Math.PI / 2 - A, Math.PI / 2 + A); g.strokeStyle = COL.line; g.lineWidth = m * .012; g.stroke();
    [-1, 1].forEach(s => { const x = px + L * Math.sin(s * A), y = py + L * Math.cos(A); g.beginPath(); g.arc(x, y, m * .04, 0, 7); g.fillStyle = !o.idle && Math.abs(ang - s * A) < .1 ? col : COL.line; g.fill(); });
    const x = px + L * Math.sin(ang), y = py + L * Math.cos(ang);
    g.beginPath(); g.moveTo(px, py); g.lineTo(x, y); g.strokeStyle = COL.text; g.lineWidth = m * .02; g.stroke();
    g.beginPath(); g.arc(x, y, m * .075 * FB * (1 + .3 * hit), 0, 7); g.fillStyle = col; g.fill();
    if (fb) ring(x, y, m * .075 * FB * (1 + .3 * hit) + m * .03);
  } else if (mode === 'bounce') {
    const floor = H * .8, pad = W * .12, step = beats > 1 ? (W - pad * 2) / (beats - 1) : 0, sx = j => beats > 1 ? pad + step * j : W / 2;
    for (let j = 0; j < beats; j++) { const rx = Math.min(m * .07, step * .4 || m * .07) * (j === 0 ? 1.45 : 1); g.beginPath(); g.ellipse(sx(j), floor + m * .05, rx, m * .022 * (j === 0 ? 1.45 : 1), 0, 0, 7); g.fillStyle = j === k && !o.idle ? rgba(j === 0 ? COL.down : COL.beat, .3 + .7 * hit) : COL.line; g.fill(); }
    const to = (k + 1) % beats, x = sx(k) + (sx(to) - sx(k)) * (o.idle ? 0 : ph), y = floor - Math.sin(Math.PI * (o.idle ? 0 : ph)) * H * .55;
    g.beginPath(); g.arc(x, y, m * .065, 0, 7); g.fillStyle = to === 0 && ph > .5 ? COL.down : COL.text; g.fill();
  } else if (mode === 'approach') {
    // 따라가기: 칠 박이 오기 한 박 전부터 바깥 원이 좁혀 와서, 닿는 순간 '지금'. 쉬는 박은 작은 점
    const T = o.targets || Array(beats).fill(true), cx = W / 2, cy = H * .46, R = m * .17;
    let nb = Math.ceil(b - 1e-4), guard = 0;
    while (!T[((nb % beats) + beats) % beats] && guard++ < beats * 2) nb++;
    const dt = nb - b, isT = T[k], flash = isT && !o.idle ? Math.pow(1 - ph, 2.2) : 0;
    const tc = o.counting ? COL.cue : k === 0 ? COL.down : COL.beat;
    g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fillStyle = rgba(isT ? tc : COL.line, o.idle ? .25 : .18 + .82 * flash); g.fill();
    g.lineWidth = m * .014; g.strokeStyle = COL.text; g.globalAlpha = o.idle ? .3 : .7; g.stroke(); g.globalAlpha = 1;
    if (!o.idle && dt > .02 && dt <= 1) { g.beginPath(); g.arc(cx, cy, R * (1 + 1.8 * dt), 0, 7); g.strokeStyle = rgba(COL.text, .95 - dt * .6); g.lineWidth = m * .02; g.stroke(); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    if (flash > .25) { g.fillStyle = COL.ink; g.font = `900 ${m * .1}px ${BODYF0}`; g.fillText('지금', cx, cy); }
    else if (!isT && !o.idle) { g.beginPath(); g.arc(cx, cy, m * .025 * (1 + hit), 0, 7); g.fillStyle = COL.mute; g.fill(); }
    // 아래: 마디 안 박 칸 (칠 박은 크게)
    const bw = Math.min(W * .8 / beats, m * .2), y = H * .86, x0 = W / 2 - bw * beats / 2;
    for (let j = 0; j < beats; j++) {
      const on = j === k && !o.idle, rr = (T[j] ? .32 : .14) * bw;
      g.beginPath(); g.arc(x0 + bw * (j + .5), y, rr, 0, 7);
      g.fillStyle = on ? (T[j] ? tc : COL.text) : T[j] ? COL.line : COL.dim; g.fill();
      if (T[j]) { g.lineWidth = m * .006; g.strokeStyle = COL.text; g.globalAlpha = .5; g.stroke(); g.globalAlpha = 1; }
    }
  } else if (mode === 'lane') {
    drawLane(g, W, H, m, b, beats, o);
  } else if (mode === 'edge') {
    // 박은 화면 테두리(edgeCv)가 보여주고, 가운데는 지금 박 번호만 조용히
    g.globalAlpha = o.idle ? .35 : .45 + .55 * hit;
    g.fillStyle = o.idle ? COL.dim : col; g.font = `800 ${m * .4 * (fb ? 1.15 : 1)}px ${NUMF}`;
    g.fillText(String(k + 1), W / 2, H / 2);
    if (fb) ring(W / 2, H / 2, m * .3);
  } else {
    g.fillStyle = col; g.font = `800 ${m * .58 * (fb ? 1.12 : 1) * (1 + .16 * hit)}px ${NUMF}`;
    g.fillText(String(k + 1), W / 2, H * .45);
    if (fb) ring(W / 2, H * .45, m * .36);
    const bw = (W * .84) / beats, y = H * .84;
    for (let j = 0; j < beats; j++) { g.fillStyle = o.idle ? COL.line : j < k ? COL.mute : j === k ? col : COL.line; g.fillRect(W * .08 + j * bw + bw * .1, y, bw * .8, m * .04); }
  }
  g.globalAlpha = 1;
}

// 레인: 박 칸이 판정선으로 흘러와요 (세로 화면은 위→아래, 가로 화면은 오른쪽→왼쪽). 두드리면 판정 글자와 콤보
function drawLane(g, W, H, m, b, beats, o) {
  const vert = H > W * 1.05, LOOK = 3.2;
  const line = vert ? H * .8 : W * .2, span = vert ? line - H * .04 : W * .96 - line, per = span / LOOK;
  const along = vert ? Math.min(per * .3, m * .12) : Math.min(per * .42, m * .2);
  const cross = vert ? Math.min(W * .46, m * .62) : along, cx = W / 2, cy = H / 2;
  const cin = o.cin || 0, now = performance.now();
  const at = d => vert ? [cx, line - d] : [line + d, cy];
  const box = (x, y, a, c, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x - (vert ? c : a) / 2, y - (vert ? a : c) / 2, vert ? c : a, vert ? a : c, r); else g.rect(x - (vert ? c : a) / 2, y - (vert ? a : c) / 2, vert ? c : a, vert ? a : c); };
  // 레일
  g.globalAlpha = 1; g.strokeStyle = COL.line; g.lineWidth = Math.max(2, m * .006);
  if (vert) { [-1, 1].forEach(s => { g.beginPath(); g.moveTo(cx + s * (cross / 2 + m * .04), 0); g.lineTo(cx + s * (cross / 2 + m * .04), H); g.stroke(); }); }
  else { g.beginPath(); g.moveTo(0, cy); g.lineTo(W, cy); g.stroke(); }
  // 지금 박이 닿는 자리 번쩍임
  const idx = Math.floor(b), ph = b - idx, k = ((idx % beats) + beats) % beats;
  const colOf = n => n < cin ? COL.cue : ((n % beats) + beats) % beats === 0 ? COL.down : COL.beat;
  const dec = o.dec || .3, hit = o.idle ? 0 : ph < dec ? Math.pow(1 - ph / dec, 2) : 0;
  if (hit > 0) { const [x, y] = at(0); g.fillStyle = rgba(colOf(idx), .16 * hit); if (vert) g.fillRect(0, y - along * .8, W, along * 1.6); else g.fillRect(x - along * .8, 0, along * 1.6, H); }
  // 판정선
  g.fillStyle = COL.text; g.globalAlpha = o.idle ? .5 : 1;
  { const [x, y] = at(0), t = Math.max(3, m * .012); if (vert) g.fillRect(cx - cross / 2 - m * .06, y - t / 2, cross + m * .12, t); else g.fillRect(x - t / 2, H * .16, t, H * .68); }
  // 쪼개기 점
  const subs = o.subs || 1;
  for (let n = Math.floor(b); n <= Math.ceil(b + LOOK); n++) for (let j = 1; j < subs; j++) {
    const d = (n + j / subs - b) * per; if (d < 0 || d > span) continue;
    const [x, y] = at(d); g.globalAlpha = o.idle ? .35 : .8; g.beginPath(); g.arc(x, y, m * .012, 0, 7); g.fillStyle = COL.dim; g.fill();
  }
  // 박 칸
  for (let n = Math.max(0, Math.floor(b - .7)); n <= Math.ceil(b + LOOK); n++) {
    const p = n - b, d = p * per; if (d > span + along) continue;
    const down = ((n % beats) + beats) % beats === 0, col = colOf(n), a = along * (down && !vert ? 1.3 : 1), c = cross * (down && vert ? 1.15 : 1);
    const [x, y] = at(Math.max(d, 0));
    if (p >= -.02) {
      g.globalAlpha = o.idle ? .4 : 1;
      box(x, y, a, c, Math.min(a, c) * .22); g.lineWidth = Math.max(2.5, m * .011);
      g.strokeStyle = down || n < cin ? col : rgba(COL.text, .75); g.stroke();
    } else {
      const f = Math.max(0, 1 + p / .7);
      g.globalAlpha = f; box(x, y, a * (1 + .25 * (1 - f)), c, Math.min(a, c) * .22); g.fillStyle = col; g.fill();
    }
  }
  g.globalAlpha = 1;
  // 판정 글자 · 콤보
  const J = o.judge;
  if (J && J.t && now - J.t < 750 && !o.idle) {
    // 판정 글자는 박 칸이 지나가지 않는 판정선 아래(가로 화면은 레인 아래)에
    const q = (now - J.t) / 750, sc = 1 + .25 * Math.max(0, 1 - q * 5);
    const ty = vert ? line + (H - line) * .5 : cy + (H - cy) * .62, fs = Math.min(m * (J.big ? .12 : .09), (vert ? H - line : H - cy) * .5);
    g.globalAlpha = 1 - Math.pow(q, 3); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `800 ${fs * sc}px ${BODYF0}`; g.fillStyle = J.good ? COL.text : COL.mute; g.fillText(J.txt, W / 2, ty);
    g.globalAlpha = 1;
  }
  // 콤보: 오른쪽 아래 구석
  if (J && J.combo >= 2 && !o.idle) {
    const fs = Math.min(m * .075, 44);
    g.textAlign = 'right'; g.textBaseline = 'alphabetic'; g.fillStyle = COL.text;
    g.font = `800 ${fs}px ${NUMF}`; g.fillText(`${J.combo}`, W - m * .05, H - m * .05);
    const nw = g.measureText(`${J.combo}`).width;
    g.font = `600 ${fs * .4}px ${BODYF0}`; g.fillStyle = COL.mute; g.fillText('콤보', W - m * .05 - nw - 6, H - m * .05);
  }
  if (o.idle) {
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = COL.mute; g.font = `600 ${Math.max(13, m * .04)}px ${BODYF0}`;
    const [x, y] = at(0); g.fillText('시작하고 박에 맞춰 화면을 두드려 보세요', vert ? cx : W / 2, vert ? y + (H - y) / 2 : H * .9);
  }
}
// 레인에서 두드린 박 판정: 귀에 들린 박과 같은 시계(박 체크와 같은 계산)
const LG = {txt:'', t:0, good:false, big:false, combo:0, best:0, lastN:-9};
function judgeTap(t) {
  if (!E.playing || !E.ctx) return;
  const clk = outNow() - (performance.now() - t) / 1000 + D.settings.visOffset / 1000;
  const bp = (clk - E.start) / E.spb, n = Math.round(bp), err = (bp - n) * E.spb;
  if (n < 0 || n === LG.lastN) return;
  const a = Math.abs(err), P1 = Math.max(.035, E.spb * .07), P2 = Math.max(.075, E.spb * .14);
  let txt, good = true;
  if (a <= P1) txt = '딱!'; else if (a <= P2) txt = '좋아요'; else { txt = err < 0 ? '빨라요' : '늦어요'; good = false; }
  LG.combo = good ? LG.combo + 1 : 0; LG.best = Math.max(LG.best, LG.combo);
  Object.assign(LG, {txt, good, big:a <= P1, t:performance.now(), lastN:n, ms:Math.round(err * 1000)});
}

// 화면 전체 테두리 빛: 악보를 보면서 곁눈으로 박을 잡도록
function drawEdge(cv, b, beats, o) {
  const g = fit(cv, 1), W = cv.width, H = cv.height, m = Math.min(W, H);
  g.clearRect(0, 0, W, H);
  const idx = Math.floor(b), ph = b - idx, k = ((idx % beats) + beats) % beats;
  const col = o.counting ? COL.cue : k === 0 ? COL.down : COL.beat, hit = Math.pow(1 - ph, 2.2);
  const lw = m * (o.loud ? .045 : .032) * (1 + .5 * hit) * (k === 0 ? 1.6 : 1);
  g.globalAlpha = .12 + .88 * hit; g.strokeStyle = col; g.lineWidth = lw;
  g.shadowColor = col; g.shadowBlur = lw * 1.2;
  g.beginPath();
  if (g.roundRect) g.roundRect(lw / 2, lw / 2, W - lw, H - lw, m * .06); else g.rect(lw / 2, lw / 2, W - lw, H - lw);
  g.stroke(); g.shadowBlur = 0; g.globalAlpha = 1;
}

/* ================= 악보 PDF ================= */
const IDB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('countin', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('sheets');
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onerror = () => rej(r.error);
    });
  },
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => { const q = fn(db.transaction('sheets', mode).objectStore('sheets')); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
  },
  get(k) { return this.tx('readonly', s => s.get(k)); },
  put(k, v) { return this.tx('readwrite', s => s.put(v, k)); },
  del(k) { return this.tx('readwrite', s => s.delete(k)); },
  keys() { return this.tx('readonly', s => s.getAllKeys()); },
};
// 악보함에 없는 PDF 파일 지우기
async function gcSheets() {
  try {
    const used = new Set(D.library.map(x => x.key));
    for (const k of await IDB.keys()) if (!used.has(k)) await IDB.del(k);
  } catch (e) {}
}
const DOCS = new Map();
function getDoc(key) {
  if (!DOCS.has(key)) DOCS.set(key, (async () => {
    const buf = await IDB.get(key);
    if (!buf) throw new Error('missing');
    const lib = await loadPdfJs();
    const doc = await lib.getDocument({data:new Uint8Array(buf), isEvalSupported:false}).promise;
    const L = D.library.find(x => x.key === key);
    if (L && L.pages !== doc.numPages) { L.pages = doc.numPages; save(); }
    return doc;
  })().catch(e => { DOCS.delete(key); throw e; }));
  return DOCS.get(key);
}
// PDF 파일을 악보함에 넣기. 성공하면 악보함 항목을 돌려줌
async function addPdf(f) {
  if (f.type && f.type !== 'application/pdf' && !/\.pdf$/i.test(f.name)) { toast('PDF 파일만 넣을 수 있어요'); return null; }
  toast('PDF 읽는 중…');
  const buf = await f.arrayBuffer();
  let doc;
  try { const lib = await loadPdfJs(); doc = await lib.getDocument({data:new Uint8Array(buf.slice(0)), isEvalSupported:false}).promise; }
  catch (e) { toast('이 PDF는 열 수 없어요'); return null; }
  const key = 'pdf_' + uid();
  try { await IDB.put(key, buf); } catch (e) { toast('PDF를 저장하지 못했어요 (저장 공간 확인)'); return null; }
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
  const entry = {key, name:f.name.replace(/\.pdf$/i, ''), pages:doc.numPages};
  D.library.push(entry); save();
  DOCS.set(key, Promise.resolve(doc));
  toast(`"${entry.name}" ${entry.pages}쪽을 악보함에 넣었어요`);
  return entry;
}
let pdfTarget = null;
$('#pdfIn').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  const entry = await addPdf(f);
  if (entry && pdfTarget) pdfTarget(entry);
};
function pickPdfFile(cb) { pdfTarget = cb; $('#pdfIn').click(); }
let pdfLib = null;
function loadPdfJs() {
  if (pdfLib) return Promise.resolve(pdfLib);
  return new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = 'vendor/pdf.min.js';
    s.onload = () => { pdfLib = window.pdfjsLib; pdfLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js'; res(pdfLib); };
    s.onerror = () => rej(new Error('pdf.js'));
    document.head.appendChild(s);
  });
}
const SV = {sig:null, doc:null, list:[], fit:'page', tok:0, per:1};
SV.fit = 'page';
try { if (localStorage.getItem('countin.fit') === 'width') SV.fit = 'width'; } catch (e) {}
const sheetSig = s => JSON.stringify(s.sheet.items);
async function showSheet() {
  const s = song(), pages = $('#pages');
  if (!s || !s.sheet) return;
  const sig = sheetSig(s);
  if (SV.sig !== sig || !SV.doc) {
    SV.doc = null; SV.sig = null; SV.tok++;
    pages.innerHTML = '<p class="sheetmsg">악보 여는 중…</p>';
    const list = [];
    let missing = 0;
    for (const it of s.sheet.items) {
      try {
        const doc = await getDoc(it.key);
        if (it.page) { if (it.page <= doc.numPages) list.push({doc, p:it.page, key:it.key}); }
        else for (let p = 1; p <= doc.numPages; p++) list.push({doc, p, key:it.key});
      } catch (e) { missing++; }
    }
    if (!song() || !song().sheet || sheetSig(song()) !== sig) return;
    if (!list.length) {
      pages.innerHTML = `<p class="sheetmsg">${missing ? '이 기기에 악보 파일이 없어요.<br>콘티 관리에서 PDF를 다시 넣고 쪽을 골라 주세요.' : '악보를 열지 못했어요.<br>PDF 파일이 맞는지 확인해 주세요.'}</p>`;
      updPg(); return;
    }
    if (missing) toast('일부 악보 파일이 이 기기에 없어서 빼고 보여줘요');
    SV.doc = true; SV.sig = sig; SV.list = list;
    $('#sheetBox').scrollTop = 0; $('#sheetBox').scrollLeft = 0;
  }
  await renderPages();
}
async function renderPages() {
  if (!SV.doc) return;
  const tok = ++SV.tok, box = $('#sheetBox'), pages = $('#pages');
  const W = box.clientWidth, Hh = box.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  if (W < 10 || Hh < 10) return;
  const horiz = SV.fit === 'page';
  const pos = horiz ? box.scrollLeft : box.scrollTop, span = horiz ? box.scrollWidth - W : box.scrollHeight - Hh;
  const ratio = span > 0 ? pos / span : 0;
  box.classList.toggle('fitpage', horiz);
  $('#pgFit').textContent = horiz ? '한 쪽씩' : '이어보기';
  // 가로로 넓으면 두 쪽씩 나란히
  SV.per = horiz && W > Hh * 1.15 && SV.list.length > 1 ? 2 : 1;
  const pw = W / SV.per;
  const frag = [];
  for (let idx = 0; idx < SV.list.length; idx++) {
    const i = idx + 1, pg = await SV.list[idx].doc.getPage(SV.list[idx].p);
    if (tok !== SV.tok) return;
    const v1 = pg.getViewport({scale:1});
    const sc = horiz ? Math.min(pw / v1.width, Hh / v1.height) : W / v1.width;
    const vp = pg.getViewport({scale:sc * dpr});
    const wrap = document.createElement('div'); wrap.className = 'pg';
    if (horiz) { wrap.style.width = pw + 'px'; if (idx % SV.per === 0) wrap.classList.add('snap'); if (SV.per === 2) wrap.style.justifyContent = idx % 2 ? 'flex-start' : 'flex-end'; }
    const c = document.createElement('canvas'), inner = document.createElement('div'), mk = document.createElement('canvas');
    c.width = mk.width = Math.floor(vp.width); c.height = mk.height = Math.floor(vp.height);
    inner.className = 'pgin'; inner.style.width = c.style.width = Math.floor(v1.width * sc) + 'px'; inner.style.height = c.style.height = Math.floor(v1.height * sc) + 'px';
    mk.className = 'mk'; mk.dataset.mk = SV.list[idx].key + ':' + SV.list[idx].p;
    inner.append(c, mk); wrap.appendChild(inner); frag.push([pg, c, vp]);
    drawMarks(mk, (curSL().marks || {})[mk.dataset.mk]);
    if (i === 1) pages.innerHTML = '';
    pages.appendChild(wrap);
  }
  if (horiz) { const sp = box.scrollWidth - W; box.scrollLeft = sp > 0 ? Math.round(ratio * sp / W) * W : 0; }
  else if (box.scrollHeight > Hh) box.scrollTop = ratio * (box.scrollHeight - Hh);
  updPg();
  for (const [pg, c, vp] of frag) {
    if (tok !== SV.tok) return;
    try { await pg.render({canvasContext:c.getContext('2d'), viewport:vp}).promise; } catch (e) {}
  }
}
function updPg() {
  const box = $('#sheetBox'), wraps = [...$('#pages').querySelectorAll('.pg')];
  if (!wraps.length) { $('#pgNo').textContent = '-'; return; }
  let cur = 1;
  if (SV.fit === 'page') {
    const x = box.scrollLeft + box.clientWidth * .3;
    wraps.forEach((w, i) => { if (w.offsetLeft <= x) cur = i + 1; });
    const last = Math.min(wraps.length, cur + (SV.per || 1) - 1);
    $('#pgNo').textContent = last > cur ? `${cur}–${last} / ${wraps.length}` : `${cur} / ${wraps.length}`;
  } else {
    const top = box.scrollTop + box.clientHeight * .3;
    wraps.forEach((w, i) => { if (w.offsetTop <= top) cur = i + 1; });
    $('#pgNo').textContent = `${cur} / ${wraps.length}`;
  }
  SV.cur = cur - 1;
  if (window.__syncReady) syncPage();
}
// 악보에서 k번째(0부터) 쪽으로 이동
function gotoPageIdx(k) {
  const box = $('#sheetBox'), wraps = [...$('#pages').querySelectorAll('.pg')];
  if (!wraps[k]) return;
  if (SV.fit === 'page') box.scrollTo({left:Math.floor(k / (SV.per || 1)) * box.clientWidth, behavior:'smooth'});
  else box.scrollTo({top:wraps[k].offsetTop, behavior:'smooth'});
}
// 악보 넘기기 (쪽 맞춤은 옆으로 한 화면, 폭 맞춤은 아래로 85%). 맨 끝이면 false
function turnPage(d) {
  const box = $('#sheetBox');
  if (SV.fit === 'page') {
    const W = box.clientWidth, max = box.scrollWidth - W;
    if (d > 0 && box.scrollLeft >= max - 4) return false;
    if (d < 0 && box.scrollLeft <= 4) return false;
    box.scrollTo({left:clamp(Math.round(box.scrollLeft / W + d) * W, 0, max), behavior:'smooth'});
    return true;
  }
  const Hh = box.clientHeight, max = box.scrollHeight - Hh;
  if (d > 0 && box.scrollTop >= max - 4) return false;
  if (d < 0 && box.scrollTop <= 4) return false;
  box.scrollTo({top:clamp(box.scrollTop + d * Hh * .85, 0, max), behavior:'smooth'});
  return true;
}
// 넘기다 끝에 닿으면: 설정한 횟수(1~3번)만큼 넘겨야 곡 이동 (2.5초 안에 이어서, 무대 실수 방지)
let edgeArm = null, edgeArmT = 0, edgeCnt = 0;
function flip(d) {
  if (turnPage(d)) { edgeArm = null; edgeCnt = 0; return; }
  const list = curSL().songs, j = P.i + d;
  if (j < 0 || j >= list.length) { toast(d > 0 ? '마지막 곡의 마지막 쪽이에요' : '첫 쪽이에요'); return; }
  const need = clamp(+D.settings.songFlip || 2, 1, 3), now = performance.now();
  edgeCnt = edgeArm === d && now - edgeArmT < 2500 ? edgeCnt + 1 : 1;
  edgeArm = d; edgeArmT = now;
  const name = list[j].title || '제목 없음';
  if (edgeCnt >= need) { edgeArm = null; edgeCnt = 0; go(j); toast(`${j + 1}. ${name}`); return; }
  const left = need - edgeCnt;
  toast(`${left === 1 ? '한 번' : '두 번'} 더 넘기면 ${d > 0 ? '다음' : '이전'} 곡 · ${name}`);
}
$('#sheetBox').addEventListener('scroll', updPg, {passive:true});
$('#pgPrev').onclick = () => { flip(-1); kickUi(); };
$('#pgNext').onclick = () => { flip(1); kickUi(); };
$('#pgFit').onclick = () => { SV.fit = SV.fit === 'width' ? 'page' : 'width'; try { localStorage.setItem('countin.fit', SV.fit); } catch (e) {} const b = $('#sheetBox'); b.scrollTop = 0; b.scrollLeft = 0; renderPages(); kickUi(); };

// 악보 화면 조작 막대: 악보를 탭하면 보이고/숨고, 재생 중엔 4초 뒤 저절로 숨김
let uiT;
function setUi(on) {
  $('#scrPlay').classList.toggle('ui', on);
  clearTimeout(uiT);
  if (on && E.playing) uiT = setTimeout(() => setUi(false), 4000);
}
function kickUi() { if ($('#scrPlay').classList.contains('ui')) setUi(true); }
['.ph', '.side'].forEach(s => $('#scrPlay').querySelector(s).addEventListener('pointerdown', kickUi));
(() => {
  const b = $('#sheetBox');
  let x0 = null, y0 = 0, t0 = 0, startEdge = 0;
  const atEnd = () => SV.fit === 'page' ? (b.scrollLeft >= b.scrollWidth - b.clientWidth - 4 ? 1 : 0) - (b.scrollLeft <= 4 ? 1 : 0) : 0;
  const down = (x, y) => { if (P.markOn) { x0 = null; return; } x0 = x; y0 = y; t0 = performance.now(); startEdge = atEnd(); };
  const up = (x, y) => {
    if (x0 === null) return;
    const dx = x - x0, dy = y - y0, dt = performance.now() - t0; x0 = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 400) { setUi(!$('#scrPlay').classList.contains('ui')); return; }
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
    const d = dx < 0 ? 1 : -1;
    if (SV.fit !== 'page') flip(d);                 // 폭 맞춤: 옆으로 밀면 아래/위로 넘김
    else if ((d > 0 && startEdge === 1) || (d < 0 && startEdge === -1) || SV.list.length === 1) flip(d); // 쪽 맞춤 끝에서 더 밀면
  };
  let lastTouch = 0;
  b.addEventListener('touchstart', e => { lastTouch = performance.now(); const t = e.touches[0]; if (e.touches.length === 1) down(t.clientX, t.clientY); else x0 = null; }, {passive:true});
  b.addEventListener('touchend', e => { lastTouch = performance.now(); const t = e.changedTouches[0]; up(t.clientX, t.clientY); }, {passive:true});
  b.addEventListener('mousedown', e => { if (performance.now() - lastTouch > 800) down(e.clientX, e.clientY); });
  b.addEventListener('mouseup', e => { if (performance.now() - lastTouch > 800) up(e.clientX, e.clientY); });
})();
let rsT;
new ResizeObserver(() => { if (!P.sheetOn) return; clearTimeout(rsT); rsT = setTimeout(renderPages, 200); }).observe($('#sheetBox'));

function onTiming() { if (window.__syncReady) syncSendState(); }

/* ================= 역할 카드 (따라가기 화면) ================= */
const ROLES = {
  beat:{short:'박 따라가기', name:'박 따라가기', desc:'모든 박에 원이 다가와요. 닿는 순간 손뼉·발·악기로 박을 짚어요.'},
  shaker:{short:'셰이커 2·4박', name:'셰이커·탬버린', desc:'2박과 4박에만 흔들어요(3박자는 2·3박). 쉬는 박은 작은 점으로만 보여요.'},
};
function roleTargets(B) {
  if (!P.followOn || (D.settings.role || 'beat') === 'beat') return Array(B).fill(true);
  return B === 3 ? [false, true, true] : Array.from({length:B}, (_, j) => j % 2 === 1 || B === 1);
}
function openRolePick() {
  const cur = D.settings.role || 'beat';
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><span></span><h2>내 역할</h2><button class="txtbtn" data-act="close">닫기</button></div>
  <div class="sh-body">
    ${Object.entries(ROLES).map(([k, r]) => `<button type="button" class="rolecard" data-act="pickRole" data-k="${k}" aria-pressed="${k === cur}"><b>${r.name}</b><small>${r.desc}</small></button>`).join('')}
    <button type="button" class="pill" data-act="fullUI" style="align-self:flex-start">모든 기능 화면으로 보기</button>
  </div>`;
  openSheet('role');
}
$('#bRole').onclick = openRolePick;

/* ================= 꾹 눌러 끌어서 순서 바꾸기 ================= */
// li[data-i]를 0.38초 누르고 있으면 들려서 따라오고, 놓으면 onDrop(새 순서의 원래 번호 배열)
function sortable(ul, onDrop) {
  let st = null, suppress = false;
  const items = () => [...ul.children].filter(x => x.dataset.i !== undefined);
  const cancel = () => { if (st) clearTimeout(st.timer); st = null; };
  ul.addEventListener('pointerdown', e => {
    const li = e.target.closest('li[data-i]');
    if (!li || e.button > 0 || items().length < 2) return;
    st = {li, x0:e.clientX, y0:e.clientY, y:e.clientY, pid:e.pointerId, dragging:false};
    st.timer = setTimeout(begin, 380);
  });
  function begin() {
    if (!st) return;
    st.dragging = true;
    st.grab = st.y - st.li.getBoundingClientRect().top;
    st.li.classList.add('dragging'); ul.classList.add('sorting');
    try { st.li.setPointerCapture(st.pid); } catch (e) {}
    try { navigator.vibrate && navigator.vibrate(15); } catch (e) {}
    requestAnimationFrame(auto);
  }
  function place() {
    const li = st.li, ur = ul.getBoundingClientRect(), mid = st.y - st.grab + li.offsetHeight / 2;
    for (let g = 0; g < 50; g++) {
      const its = items(), k = its.indexOf(li), prev = its[k - 1], next = its[k + 1];
      if (next) { const r = next.getBoundingClientRect(); if (mid > r.top + r.height / 2) { ul.insertBefore(next, li); continue; } }
      if (prev) { const r = prev.getBoundingClientRect(); if (mid < r.top + r.height / 2) { ul.insertBefore(li, prev); continue; } }
      break;
    }
    li.style.transform = `translateY(${st.y - st.grab - (ur.top + li.offsetTop - ul.scrollTop)}px)`;
  }
  // 위·아래 끝으로 끌면 목록이 따라 스크롤
  function auto() {
    if (!st || !st.dragging) return;
    const r = ul.getBoundingClientRect();
    if (st.y < r.top + 56) { ul.scrollTop -= 8; place(); }
    else if (st.y > r.bottom - 56) { ul.scrollTop += 8; place(); }
    requestAnimationFrame(auto);
  }
  ul.addEventListener('pointermove', e => {
    if (!st || e.pointerId !== st.pid) return;
    st.y = e.clientY;
    if (!st.dragging) { if (Math.hypot(e.clientX - st.x0, e.clientY - st.y0) > 8) cancel(); return; }
    place();
  });
  function finish() {
    if (!st) return;
    clearTimeout(st.timer);
    if (st.dragging) {
      const order = items().map(x => +x.dataset.i);
      st.li.classList.remove('dragging'); st.li.style.transform = ''; ul.classList.remove('sorting');
      suppress = true; setTimeout(() => suppress = false, 400);
      st = null;
      if (order.some((v, i) => v !== i)) onDrop(order);
    } else st = null;
  }
  ul.addEventListener('pointerup', finish);
  ul.addEventListener('pointercancel', () => { if (st && st.dragging) finish(); else cancel(); });
  ul.addEventListener('click', e => { if (suppress) { e.stopPropagation(); e.preventDefault(); suppress = false; } }, true);
  ul.addEventListener('touchmove', e => { if (st && st.dragging) e.preventDefault(); }, {passive:false});
  ul.addEventListener('contextmenu', e => e.preventDefault());
}
const reorder = (arr, order) => order.map(i => arr[i]);

/* ================= 홈 (콘티 목록) ================= */
function renderHome() {
  const ul = $('#projList');
  ul.innerHTML = D.setlists.map((p, i) => {
    const n = p.songs.length, sh = p.pdfs.length;
    const bpms = p.songs.slice(0, 6).map(s => s.bpm).join(' · ') + (n > 6 ? ' …' : '');
    return `<li data-i="${i}"${p.id === D.cur ? ' class="cur"' : ''}>
      <button class="pcard" data-act="open"><span class="pn">${esc(p.name)}</span>
        <span class="pm">${syncTag(p)}${n ? n + '곡 · BPM' : '곡 없음'}${sh ? ` · PDF ${sh}개` : ''}</span>
        ${n ? `<span class="bpms num">${bpms}</span>` : ''}</button>
      <div class="pact"><button class="pplay" data-act="go" aria-label="${esc(p.name)} 1번부터 시작" ${n ? '' : 'disabled'}>${ic('play')}</button></div>
    </li>`;
  }).join('') + (D.setlists.length > 1 ? '<li class="tip">꾹 눌러 끌면 순서를 바꿀 수 있어요</li>' : '');
  const empty = !D.setlists.length;
  $('#emptyHome').hidden = !empty; ul.hidden = empty;
}
$('#projList').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const p = D.setlists[+b.closest('li').dataset.i]; if (!p) return;
  if (b.dataset.act === 'open') openProject(p.id);
  else if (b.dataset.act === 'go') { openProject(p.id); openPlay(0, true); }
  else openProjMenu(p.id);
});
sortable($('#projList'), order => { D.setlists = reorder(D.setlists, order); save(); renderHome(); });
function openProject(id) {
  D.cur = id; save();
  show('list'); renderList(); history.pushState({s:'list'}, '');
}
function goHome() { show('home'); renderHome(); }
$('#bNewProj').onclick = openNewProj;
$('#homeHint').onclick = openNewProj;
$('#bSettingsH').onclick = openSettings;
$('#bHome').onclick = () => history.back();

/* ================= 콘티 안 (곡 목록) ================= */
function renderList() {
  const sl = curSL(); if (!sl) return;
  $('#slName').textContent = sl.name;
  $('#slSub').textContent = `${syncTag(sl)}${sl.songs.length}곡${sl.pdfs.length ? ` · PDF ${sl.pdfs.length}개` : ''}`;
  const ul = $('#songList'), cur = -1;
  ul.innerHTML = sl.songs.map((s, i) => `<li data-i="${i}"${i === cur ? ' class="cur"' : ''}>
    <button class="row" data-act="play"><span class="i">${i + 1}</span><span class="mid"><span class="tt">${esc(s.title) || '제목 없음'}</span><span class="mm">${miniLamp(s)}<span class="mt">${esc(meta(s))}</span></span></span><span class="b num">${s.bpm}<small>BPM</small></span></button>
    <button class="more" data-act="edit" aria-label="편집">${ic('more')}</button></li>`).join('')
    + (sl.songs.length > 1 ? '<li class="tip">꾹 눌러 끌면 순서를 바꿀 수 있어요</li>' : '');
  const empty = !sl.songs.length;
  $('#emptyList').hidden = !empty; ul.hidden = empty;
  $('#bStart').disabled = empty;
  $('#bStart').textContent = sl.followUI ? '따라가기 시작' : '1번부터 시작';
}
// 박 램프 미리보기: 첫 박은 넓고 빨간 칸, 6/8·12/8은 셋씩 묶음
const grouped = s => s.den === 8 && s.num % 3 === 0 && !isDotted(s) && s.num > 3;
function miniLamp(s) { const B = Math.min(bpb(s), 12), g = grouped(s); return `<span class="mini" aria-hidden="true">${Array.from({length:B}, (_, j) => `<i class="${j === 0 ? 'd' : ''}${g && j && j % 3 === 0 ? ' g' : ''}"></i>`).join('')}</span>`; }
$('#songList').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const i = +b.closest('li').dataset.i;
  if (b.dataset.act === 'play') openPlay(i, false);
  else if (b.dataset.act === 'edit') openEditor(i);
});
sortable($('#songList'), order => { const sl = curSL(); sl.songs = reorder(sl.songs, order); save(); renderList(); });
$('#bAdd').onclick = () => openEditor(-1);
$('#bStart').onclick = () => openPlay(0, true);
$('#bSettings').onclick = openSettings;
$('#slPick').onclick = () => openProjMenu(D.cur);
$('#bProjMenu').onclick = () => openProjMenu(D.cur);

/* ================= 플레이 화면 ================= */
const P = {i:0, bpm:100, locked:false, barOff:0, sheetOn:false, markOn:false};
const song = () => curSL().songs[P.i];
const effMode = s => s.visual || D.settings.visual;
// VIEW: 지금 보는 화면(home/list/play). 곡은 어느 기기든 재생 화면 하나로 크게, 곡 옮기기는 ☰ 목록에서
let VIEW = 'home', LAY = 'compact';
function show(name) {
  VIEW = name;
  $('#scrHome').hidden = name !== 'home'; $('#scrList').hidden = name !== 'list'; $('#scrPlay').hidden = name !== 'play';
}
function layout() {
  const w = innerWidth, h = innerHeight;
  const l = w >= 1100 && h >= 700 ? 'wide' : w >= 700 && h >= 600 ? 'regular' : 'compact';
  if (l === LAY) return;
  LAY = l; document.body.dataset.lay = l;
  if (!$('#scrPlay').hidden && song()) applySheet();   // 가로 아이패드는 악보가 박 화면 옆 칸
}
let layT; addEventListener('resize', () => { clearTimeout(layT); layT = setTimeout(layout, 80); });
function openPlay(i, autoplay) {
  P.i = i; P.followOn = !!(curSL() && curSL().followUI); loadSong();
  show('play'); history.pushState({s:'play'}, '');
  if (P.followOn && !D.settings.role) setTimeout(openRolePick, 200);
  requestWake();
  if (autoplay) start();
}
function closePlay() { if (P.markOn) setMarking(false); stop(); setLock(false); show('list'); renderList(); releaseWake(); onTiming(); }
function loadSong() { stop(); const s = song(); if (!s) return; P.bpm = s.bpm; P.barOff = 0; P.sheetOn = !!s.sheet && D.settings.sheetAuto; renderPlay(); }
function applySheet() {
  const s = song(), on = P.sheetOn && !!(s && s.sheet), side = on && LAY === 'wide';
  P.side = side;
  $('#scrPlay').classList.toggle('sheeton', on && !side); $('#scrPlay').classList.toggle('sheetside', side);
  $('#viz').hidden = on && !side; $('#sheetBox').hidden = !on; $('#pgNav').hidden = !on; $('#pgFit').hidden = !on; $('#bMark').hidden = !on;
  if (!on && P.markOn) setMarking(false);
  $('#bSheet').hidden = !(s && s.sheet); $('#bSheet').setAttribute('aria-pressed', on);
  $('#scrPlay').classList.toggle('nobtns', !D.settings.pgBtns);
  if (!on || side) setUi(false);
  if (on) showSheet();
}
function renderPlay() {
  const s = song(), list = curSL().songs; if (!s) return;
  $('#pTitle').textContent = s.title || '제목 없음';
  $('#pSub').textContent = `${syncTag(curSL())}${P.i + 1} / ${list.length} · ${sigL(s)}${SUBL[s.sub] ? ' · ' + SUBL[s.sub] : ''}${s.countIn ? ' · 카운트 ' + s.countIn : ''}${s.muteAfter ? ' · 이후 무음' : ''}`;
  $('#pMemo').hidden = !s.memo; $('#pMemo').textContent = s.memo;
  const nx = list[P.i + 1];
  $('#pNext').innerHTML = nx ? `다음 <b>${esc(nx.title || '제목 없음')}</b> <span class="num">${nx.bpm}</span>` : '마지막 곡이에요';
  $('#bNext').disabled = !nx; $('#bPrev').disabled = P.i === 0;
  const dots = $('#dots'), B = bpb(eSong()), TG = P.followOn ? roleTargets(B) : null;
  const gp = grouped(eSong());
  dots.innerHTML = Array.from({length:B}, (_, j) => `<span class="${j === 0 ? 'd' : ''}${TG && TG[j] ? ' tg' : ''}${gp && j && j % 3 === 0 ? ' g' : ''}"><i></i><em>${j + 1}</em></span>`).join('');
  dots.classList.toggle('many', B > 8);
  $('#scrPlay').classList.toggle('follow', !!P.followOn);
  $('#bRole').hidden = !P.followOn; $('#bRole').textContent = ROLES[D.settings.role || 'beat'].short;
  $('#scrPlay').classList.toggle('leading', !!(window.__syncReady && SY.role === 'leader' && D.cur === SY.projId));
  $('#modes').innerHTML = VIS.map(([v, l]) => `<button data-m="${v}" aria-pressed="${effMode(s) === v}">${l}</button>`).join('');
  updBpm(); updSnd(); updPlayBtn(); updVisChip(); lastK = -2;
  applySheet();
}
function updVisChip() { const s = song(); if (!s) return; const v = effMode(s), l = (VIS.find(x => x[0] === v) || VIS[0])[1]; $('#bVis').innerHTML = `${esc(l)}${ic('chevD')}`; }
$('#bVis').onclick = openVisPick;
// ☰ 곡 목록: 재생 화면에서 바로 다른 곡으로
$('#bSongs').onclick = () => {
  const list = curSL().songs;
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><span></span><h2>${esc(curSL().name)}</h2><button class="txtbtn" data-act="close">닫기</button></div>
  <div class="sh-body"><div class="songpick">${list.map((x, i) => `<button type="button" data-act="pickSong" data-i="${i}" aria-current="${i === P.i}"><span class="n">${i + 1}</span><span class="t">${esc(x.title) || '제목 없음'}<small>${esc(meta(x))}</small></span><span class="b">${x.bpm}</span></button>`).join('')}</div></div>`;
  openSheet('songs');
  const cur = sheet.querySelector('[aria-current="true"]'); if (cur) cur.scrollIntoView({block:'center'});
};
function openVisPick() {
  const s = song(); if (!s) return; const cur = effMode(s);
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><span></span><h2>비주얼</h2><button class="txtbtn" data-act="close">닫기</button></div>
  <div class="sh-body">
    <div class="visgrid">${VIS.map(([v, l]) => `<button type="button" class="rolecard" data-act="pickVis" data-v="${v}" aria-pressed="${v === cur}"><b>${l}</b><small>${VISD[v]}</small></button>`).join('')}</div>
    <p class="note">${s.visual ? '이 곡만 따로 정한 비주얼이에요. 곡 편집에서 "기본"으로 돌릴 수 있어요.' : '모든 곡에 같이 쓰는 기본 비주얼이에요. 곡마다 다르게 하려면 곡 편집에서 골라요.'} 카운트인 동안에도 비주얼은 그대로예요.</p>
  </div>`;
  openSheet('vis');
}
$('#bSheet').onclick = () => { P.sheetOn = !P.sheetOn; applySheet(); };
$('#barMinus').onclick = () => { P.barOff--; };
$('#barPlus').onclick = () => { P.barOff++; };
function updBpm() { $('#pBpm').textContent = P.bpm; const s = song(), diff = s && s.bpm !== P.bpm; $('#bSaveBpm').hidden = !diff; $('.bpmbox small').textContent = diff ? `원래 ${s.bpm}` : 'BPM'; }
function updSnd() { const on = D.settings.soundOn; $('#bSnd').setAttribute('aria-pressed', on); $('#bSnd').setAttribute('aria-label', on ? '소리 켜짐' : '소리 꺼짐'); setIcon($('#bSnd .ic'), on ? 'sound' : 'mute'); $('#sndLbl').textContent = on ? '소리' : '무음'; }
function updPlayBtn() { const b = $('#bPlay'), on = E.playing; b.innerHTML = `${ic(on ? 'pause' : 'play')}<span>${on ? '멈춤' : '시작'}</span>`; b.classList.toggle('on', on); b.setAttribute('aria-label', on ? '멈춤' : '시작'); }
function setBpm(v) {
  v = clamp(Math.round(v), 20, 300);
  if (E.playing && E.ctx) { const now = E.ctx.currentTime, b = (now - E.start) / E.spb; E.spb = 60 / v; E.start = now - b * E.spb; }
  P.bpm = v; updBpm(); onTiming();
}
// 연주 중 두드려서 맞추기: 새 템포로 바꾸고, 마지막으로 두드린 순간이 박이 되도록 위상까지 맞춤 (마디 번호는 이어감)
function retime(v, tapPerf) {
  v = clamp(Math.round(v), 20, 300);
  if (!E.playing || !E.ctx) { setBpm(v); return; }
  const tapOut = outNow() - (performance.now() - tapPerf) / 1000;
  const bi = Math.round((tapOut - E.start) / E.spb);
  E.spb = 60 / v; E.start = tapOut - bi * E.spb;
  E.n = Math.max(0, Math.ceil((E.ctx.currentTime + .01 - E.start) / E.spb)); E.sub = 0;
  P.bpm = v; updBpm(); onTiming();
}
function go(i) {
  const list = curSL().songs; if (i < 0 || i >= list.length) return;
  const was = E.playing; P.i = i; loadSong();
  if (was && D.settings.nextAuto) start();
}
$('#bPlay').onclick = () => {
  E.playing ? stop() : start();
  // 악보 화면에서 재생을 누르면 막대를 곧 숨겨 악보를 꽉 채움
  if (P.sheetOn && E.playing) { clearTimeout(uiT); uiT = setTimeout(() => setUi(false), 1200); }
};
// 다음 곡: 평소엔 한 번, 잠금 중엔 0.7초 길게 (페달·키보드는 그대로 한 번)
(() => {
  const b = $('#bNext'); let cancel = null, held = false;
  b.addEventListener('pointerdown', () => { if (P.locked && !b.disabled) cancel = holdRing(b, 700, () => { held = true; go(P.i + 1); }); });
  const end = () => { if (cancel) { cancel(); cancel = null; } };
  b.addEventListener('pointerup', end); b.addEventListener('pointerleave', end); b.addEventListener('pointercancel', end);
  b.addEventListener('contextmenu', e => e.preventDefault());
  b.onclick = () => { if (held) { held = false; return; } if (P.locked) { toast('잠금 중엔 다음을 길게 누르세요'); return; } go(P.i + 1); };
})();
$('#bPrev').onclick = () => go(P.i - 1);
$('#bBack').onclick = () => history.back();
$('#bTitle').onclick = () => openEditor(P.i);
$('#bSnd').onclick = () => { D.settings.soundOn = !D.settings.soundOn; save(); updSnd(); if (D.settings.soundOn) ensureCtx(); };
$('#bSaveBpm').onclick = () => { song().bpm = P.bpm; save(); updBpm(); };
$('#modes').addEventListener('click', e => {
  const b = e.target.closest('button[data-m]'); if (!b) return;
  const s = song(); if (s.visual) s.visual = b.dataset.m; else D.settings.visual = b.dataset.m;
  save(); $('#modes').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
});
$('#bTap').onclick = () => openTapPad(P.bpm, (v, tapT) => {
  if (E.playing) retime(v, tapT); else setBpm(v);
});
function holdBtn(el, step) {
  let t1, t2, fired = false;
  const end = () => { clearTimeout(t1); clearInterval(t2); };
  el.addEventListener('pointerdown', () => { fired = false; t1 = setTimeout(() => { fired = true; setBpm(P.bpm + step * 5); t2 = setInterval(() => setBpm(P.bpm + step * 5), 320); }, 450); });
  el.addEventListener('pointerup', () => { end(); if (!fired) setBpm(P.bpm + step); });
  el.addEventListener('pointerleave', end); el.addEventListener('pointercancel', end);
  el.addEventListener('click', e => { if (e.detail === 0) setBpm(P.bpm + step); });
  el.addEventListener('contextmenu', e => e.preventDefault());
}
holdBtn($('#bMinus'), -1); holdBtn($('#bPlus'), 1);

// 레인 비주얼: 재생 중 화면을 박에 맞춰 두드리면 판정
$('#viz').addEventListener('pointerdown', e => {
  if (e.target.closest('button')) return;
  const s = song(); if (!s || !E.playing || P.followOn || effMode(s) !== 'lane') return;
  judgeTap(e.timeStamp || performance.now());
});
// 스와이프로 곡 이동
[$('#viz')].forEach(v => {
  let x0 = null, y0 = 0;
  v.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; });
  v.addEventListener('pointercancel', () => { x0 = null; });
  v.addEventListener('pointerup', e => {
    if (x0 === null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 60) return;
    if (P.locked) return;   // 잠금 중엔 스틱이 스쳐도 곡이 안 넘어가게
    if (dx < 0) go(P.i + 1); else go(P.i - 1);
  });
});

// 잠금: 누르면 잠기고, 길게 눌러야 풀림
function setLock(on) {
  P.locked = on; $('#scrPlay').classList.toggle('locked', on);
  $('#bLock').setAttribute('aria-pressed', on); setIcon($('#bLock'), on ? 'lock' : 'unlock'); $('#lockHint').hidden = !on;
}
(() => {
  const b = $('#bLock'); let cancel = null, justUnlocked = false;
  b.addEventListener('pointerdown', () => { if (P.locked) cancel = holdRing(b, 700, () => { setLock(false); justUnlocked = true; }); });
  const end = () => { if (cancel) { cancel(); cancel = null; } };
  b.addEventListener('pointerup', end); b.addEventListener('pointerleave', end); b.addEventListener('pointercancel', end);
  b.addEventListener('click', () => { if (justUnlocked) { justUnlocked = false; return; } if (!P.locked) setLock(true); else toast('자물쇠를 길게 누르면 풀려요'); });
  b.addEventListener('contextmenu', e => e.preventDefault());
})();

// 키보드 · 블루투스 페달 (키보드로 인식되는 페달)
document.addEventListener('keydown', e => {
  if ($('#scrPlay').hidden || !$('#shw').hidden) return;
  if (e.target.closest && e.target.closest('input,textarea')) return;
  const onBtn = e.target.tagName === 'BUTTON';
  if ((e.key === ' ' || e.key === 'Enter') && !onBtn) { e.preventDefault(); E.playing ? stop() : start(); }
  else if (P.sheetOn && ['ArrowRight', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); flip(1); }
  else if (P.sheetOn && ['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); flip(-1); }
  else if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(P.i + 1); }
  else if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && !P.locked) { e.preventDefault(); go(P.i - 1); }
  else if (e.key === 'ArrowUp' && !P.locked) { e.preventDefault(); setBpm(P.bpm + 1); }
  else if (e.key === 'ArrowDown' && !P.locked) { e.preventDefault(); setBpm(P.bpm - 1); }
});

// 화면 꺼짐 방지
let wl = null;
const nativeAwake = () => window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.KeepAwake;
async function requestWake() {
  if (!D.settings.wake || document.visibilityState !== 'visible') return;
  if (nativeAwake()) { try { await nativeAwake().keepAwake(); } catch (e) {} return; }
  if (!('wakeLock' in navigator)) return;
  try { wl = await navigator.wakeLock.request('screen'); } catch (e) {}
}
function releaseWake() {
  if (nativeAwake()) { try { nativeAwake().allowSleep(); } catch (e) {} }
  try { wl && wl.release(); } catch (e) {} wl = null;
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && !$('#scrPlay').hidden) requestWake(); });

/* ================= 그리기 루프 ================= */
let lastK = -2;
function frame() {
  requestAnimationFrame(frame);
  const ec = $('#edgeCv');
  if ($('#scrPlay').hidden) { if (!ec.hidden) ec.hidden = true; return; }
  const s = song(); if (!s) return;
  const sheetOn = P.sheetOn && !!s.sheet && !P.side;
  const es = eSong(), B = bpb(es), cin = es.countIn * B, mode = sheetOn ? 'edge' : P.followOn ? 'approach' : effMode(s), subs = subsOf(es), targets = roleTargets(B);
  const dec = Math.min(.5, .15 / (60 / P.bpm));
  let b = beatNow(), k = -1, counting = false, lbl = '', audible = false, bar = 0;
  if (b === null || b < 0) {
    if (!sheetOn) draw($('#cv'), mode, 0, B, {idle:true, subs, loud:false, targets, cin, dec});
    lbl = b === null ? (s.countIn ? `카운트 ${s.countIn}마디` : '바로 시작') : '';
  } else {
    counting = b < cin;
    audible = D.settings.soundOn && (counting || !es.muteAfter);
    // 레인: 두드리다 박을 두 번 넘게 놓치면 콤보가 끊겨요
    if (mode === 'lane' && LG.combo > 0 && b - LG.lastN > 2.6) Object.assign(LG, {combo:0, txt:'놓쳤어요', good:false, big:false, t:performance.now(), lastN:Math.floor(b)});
    if (!sheetOn) draw($('#cv'), mode, b, B, {loud:!audible, subs, counting, targets, cin, dec, judge:LG});
    k = Math.floor(b) % B;
    if (counting) lbl = `카운트 ${Math.floor(b / B) + 1}/${es.countIn}`;
    else { bar = Math.max(1, Math.floor((b - cin) / B) + 1 + P.barOff); }
  }
  $('#vizLbl').textContent = lbl;
  // 테두리 빛 (테두리 비주얼이거나 악보 화면일 때)
  if (mode === 'edge' && b !== null && b >= 0) { ec.hidden = false; drawEdge(ec, b, B, {loud:!audible, counting}); }
  else if (!ec.hidden) ec.hidden = true;
  // 마디 번호: 카운트인 중엔 카운트 마디, 본박부터는 1마디부터
  const bn = $('#barNo'), showBar = D.settings.showBar && (bar > 0 || counting);
  if (bn.hidden === showBar) bn.hidden = !showBar;
  if (showBar) {
    const txt = counting ? String(Math.floor(b / B) + 1) : String(bar), l = counting ? '카운트' : '마디';
    if ($('#barV').textContent !== txt) $('#barV').textContent = txt;
    if ($('#barL').textContent !== l) { $('#barL').textContent = l; bn.classList.toggle('cnt', counting); }
  }
  const key = k + (counting ? 100 : 0);
  if (key !== lastK) {
    lastK = key;
    const d = $('#dots'); d.classList.toggle('cnt', counting);
    d.querySelectorAll('span').forEach((x, j) => x.classList.toggle('on', j === k));
  }
}
requestAnimationFrame(frame);

/* ================= 시트 ================= */
let sheetKind = null, ignorePop = false;
const ONPLAY = ['vis', 'role', 'editor', 'settings', 'songs'];
function openSheet(kind) { sheetKind = kind; $('#shw').classList.toggle('onplay', !$('#scrPlay').hidden && ONPLAY.includes(kind)); $('#shw').hidden = false; history.pushState({s:'sheet'}, ''); }
function closeSheet(fromPop) { if ($('#shw').hidden) return; if (sheetKind === 'calib') stopCal(); if (sheetKind === 'check') stopCheck(); $('#shw').hidden = true; sheetKind = null; $('#sheet').innerHTML = ''; if (!fromPop) { ignorePop = true; history.back(); } }
$('#shw').addEventListener('click', e => { if (e.target.id === 'shw') { if (sheetKind === 'editor' && !edGuard()) return; closeSheet(); } });
window.addEventListener('popstate', () => {
  if (ignorePop) { ignorePop = false; return; }
  if (!$('#tpad').hidden) { closeTapPad(true); return; }
  if (!$('#shw').hidden) { if (sheetKind === 'editor' && !edGuard()) { history.pushState({s:'sheet'}, ''); return; } closeSheet(true); return; }
  if (VIEW === 'play') {
    if (P.locked) { history.pushState({s:'play'}, ''); toast('잠금 중이에요 · 자물쇠를 길게 눌러 풀어요'); return; }
    closePlay(); return;
  }
  if (VIEW === 'list') goHome();
});
// 안드로이드 앱(뒤로 버튼): 시트 닫기 → 재생 → 콘티 → 홈 순으로 한 단계씩, 홈에선 두 번 눌러야 종료
(() => {
  const CapApp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (!CapApp) return;
  let exitArm = 0;
  CapApp.addListener('backButton', () => {
    if (!$('#scrHome').hidden && $('#shw').hidden) {
      if (performance.now() - exitArm < 2000) { CapApp.exitApp(); return; }
      exitArm = performance.now(); toast('한 번 더 누르면 종료돼요'); return;
    }
    history.back();
  });
})();
const sheet = $('#sheet');
const seg = (k, label, opts, cur, dis) => `<div class="fld"><span>${label}</span><div class="seg" data-k="${k}">${opts.map(([v, l]) => `<button type="button" data-act="seg" data-v="${v}" aria-pressed="${String(v) === String(cur)}"${dis ? ' disabled' : ''}>${l}</button>`).join('')}</div></div>`;
const tgl = (k, label, on, sub = '') => `<button type="button" class="tg" data-act="tgl" data-k="${k}" role="switch" aria-checked="${!!on}"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><span class="sw"></span></button>`;
const H = {};
H.pickSong = b => { const i = +b.dataset.i; closeSheet(); if (i !== P.i) go(i); };
H.pickVis = b => { const s = song(); if (!s) return; if (s.visual) s.visual = b.dataset.v; else D.settings.visual = b.dataset.v; save(); closeSheet(); updVisChip(); lastK = -2; };
H.pickRole = b => { D.settings.role = b.dataset.k; save(); closeSheet(); renderPlay(); };
H.fullUI = () => { const p = curSL(); p.followUI = false; P.followOn = false; save(); closeSheet(); renderPlay(); };
sheet.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b && H[b.dataset.act]) H[b.dataset.act](b, e); });
H.close = () => { if (sheetKind === 'editor' && !edGuard()) return; closeSheet(); };

/* ---------- 곡 편집 ---------- */
let draft = null, draftIdx = -1, delArm = false;
const SIGS = [[2, 4], [3, 4], [4, 4], [6, 8], [12, 8]];
function openEditor(i) {
  const songs = curSL().songs;
  draftIdx = i; delArm = false;
  draft = i >= 0 ? {...songs[i]} : newSong({bpm: songs.length ? songs[songs.length - 1].bpm : 100});
  draft._custom = !SIGS.some(([n, d]) => n === draft.num && d === draft.den);
  edOrig = JSON.stringify(draft); edDiscard = false;
  renderEditor(); openSheet('editor');
  if (i < 0) setTimeout(() => { const t = $('#fTitle'); t && t.focus(); }, 250);
}
let edOrig = '', edDiscard = false;
function edDirty() { if (sheetKind !== 'editor' || !draft) return false; syncDraft(); return JSON.stringify(draft) !== edOrig; }
// 바뀐 게 있으면 한 번은 막고 알려줌. 다시 하면 버림
function edGuard() {
  if (edDiscard || !edDirty()) return true;
  edDiscard = true;
  const c = sheet.querySelector('.sh-head [data-act="close"]'); if (c) c.textContent = '버리기';
  toast('고친 내용이 있어요 · 한 번 더 하면 버려요');
  return false;
}
function syncDraft() {
  const v = id => { const el = $('#' + id); return el ? el.value : null; };
  if (v('fTitle') !== null) draft.title = v('fTitle');
  if (v('fBpm') !== null) draft.bpm = clamp(parseInt(v('fBpm'), 10) || draft.bpm, 20, 300);
  if (v('fMemo') !== null) draft.memo = v('fMemo');
  if (v('fNum') !== null) draft.num = clamp(parseInt(v('fNum'), 10) || draft.num, 1, 16);
  if (v('fDen') !== null) draft.den = +v('fDen');
}
function renderEditor() {
  const d = draft, sigCur = d._custom ? 'custom' : `${d.num}/${d.den}`;
  const LK = !!(curSL() && curSL().linked) && draftIdx >= 0, dis = LK ? ' disabled' : '';
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><button class="txtbtn" data-act="close">취소</button><h2>${draftIdx >= 0 ? '곡 편집' : '새 곡'}</h2><button class="txtbtn strong" data-act="saveSong">저장</button></div>
  <div class="sh-body">
    ${LK ? '<p class="note">제목·BPM·박자·쪼개기는 리더가 정해요. 메모·악보·비주얼·카운트인은 내 기기에만 저장돼요.</p>' : ''}
    <label class="fld"><span>곡 제목</span><input id="fTitle" type="text" value="${esc(d.title)}" placeholder="예: 여는 찬양" maxlength="60" autocomplete="off"${dis}></label>
    <div class="fld"><span>BPM</span><div class="bpmedit">
      <button type="button" class="rbtn" data-act="bpm" data-v="-1" aria-label="BPM 내리기"${dis}>−</button>
      <input id="fBpm" type="number" inputmode="numeric" min="20" max="300" value="${d.bpm}" aria-label="BPM"${dis}>
      <button type="button" class="rbtn" data-act="bpm" data-v="1" aria-label="BPM 올리기"${dis}>+</button>
      <button type="button" class="tapbtn" data-act="tap" id="fTap"${dis}>두드려서 재기</button></div></div>
    ${seg('sig', '박자', [...SIGS.map(([n, de]) => [`${n}/${de}`, `${n}/${de}`]), ['custom', '직접']], sigCur, LK)}
    ${d._custom ? `<div class="row2"><input id="fNum" class="inp num" type="number" inputmode="numeric" min="1" max="16" value="${d.num}" aria-label="한 마디 박 수"><span style="flex:0;color:var(--mute)">/</span>
      <select id="fDen" class="inp" aria-label="박 단위">${[2, 4, 8, 16].map(x => `<option value="${x}" ${x === d.den ? 'selected' : ''}>${x}</option>`).join('')}</select></div>` : ''}
    ${d.den === 8 && d.num % 3 === 0 ? seg('pulse', 'BPM 기준', [['eighth', `8분음표 (${d.num}박)`], ['dotted', `점4분음표 (${d.num / 3}박)`]], d.pulse, LK) : ''}
    ${seg('sub', '쪼개기', [['none', '없음'], ['8', '8분'], ['3', '3연음'], ['16', '16분']], d.sub, LK)}
    ${seg('countIn', '카운트인', [[0, '없음'], [1, '1마디'], [2, '2마디']], d.countIn)}
    ${tgl('muteAfter', '카운트인 끝나면 소리 끄기', d.muteAfter)}
    ${tgl('accent', '첫 박 강조', d.accent)}
    ${seg('visual', '이 곡 비주얼', [['', '기본'], ...VIS], d.visual || '')}
    ${seg('follow', '같이 맞출 때 이 곡은 리더를', [['', '콘티 설정대로'], ['on', '따라가기'], ['off', '따라가지 않기']], d.follow || '')}
    <label class="fld"><span>메모</span><input id="fMemo" type="text" value="${esc(d.memo)}" placeholder="예: 브릿지 하프타임" maxlength="40" autocomplete="off"></label>
    ${(() => { const sh = d.sheet;
      const txt = sh ? esc(sheetLabel(sh.items, true)) : '없음';
      return `<div class="fld"><span>악보</span><div class="row2">
        <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:${sh ? 'var(--text)' : 'var(--mute)'}">${txt}</span>
        <button type="button" class="pill" style="flex:0 0 auto" data-act="pickPages">${sh ? '쪽 바꾸기' : '쪽 고르기'}</button>
        ${sh ? '<button type="button" class="pill danger" style="flex:0 0 auto" data-act="rmSheet">빼기</button>' : ''}</div></div>`; })()}
    ${draftIdx >= 0 ? `<div class="sh-actions"><button type="button" data-act="dupSong">복제</button><button type="button" class="danger" data-act="delSong">${delArm ? '한 번 더 누르면 삭제' : '삭제'}</button></div>` : ''}
  </div>`;
}
H.seg = b => {
  const k = b.parentElement.dataset.k, v = b.dataset.v;
  if (sheetKind === 'settings') return setSeg(k, v, b);
  if (sheetKind === 'calib') { CAL.off = +v; CAL.upd(); b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); return; }
  syncDraft();
  if (k === 'sig') {
    if (v === 'custom') draft._custom = true;
    else { const [n, de] = v.split('/').map(Number); draft.num = n; draft.den = de; draft._custom = false; if (de === 8) { draft.pulse = 'dotted'; if (draft.sub === 'none') draft.sub = '3'; } }
  } else if (k === 'countIn') draft.countIn = +v;
  else if (k === 'visual') draft.visual = v || null;
  else if (k === 'follow') draft.follow = v || null;
  else draft[k] = v;
  const st = sheet.scrollTop; renderEditor(); sheet.scrollTop = st;
};
H.tgl = b => {
  const k = b.dataset.k, on = b.getAttribute('aria-checked') !== 'true';
  b.setAttribute('aria-checked', on);
  if (sheetKind === 'settings') { D.settings[k] = on; save(); if (k === 'wake') on ? requestWake() : releaseWake(); if (k === 'pgBtns') $('#scrPlay').classList.toggle('nobtns', !on); if (k === 'light') applyLight(); }
  else draft[k] = on;
};
H.bpm = b => { syncDraft(); draft.bpm = clamp(draft.bpm + +b.dataset.v, 20, 300); $('#fBpm').value = draft.bpm; };
H.tap = () => {
  syncDraft();
  openTapPad(draft.bpm, v => { draft.bpm = v; const el = $('#fBpm'); if (el) el.value = v; });
};
H.rmSheet = () => { syncDraft(); draft.sheet = null; const st = sheet.scrollTop; renderEditor(); sheet.scrollTop = st; };

/* ---------- 쪽 고르기 (곡 편집 안의 두 번째 화면) ---------- */
// PK.sel = [{key, page}] — 여러 PDF를 오가며 누른 순서대로
const PK = {key:null, sel:[], n:0, tok:0, imp:false};
const projPdfs = () => { const p = curSL(); return p ? p.pdfs.filter(k => libOf(k)) : []; };
function attachPdf(key) { const p = curSL(); if (p && !p.pdfs.includes(key)) { p.pdfs.push(key); save(); } }
H.pickPages = () => {
  syncDraft();
  const sh = draft.sheet, pdfs = projPdfs();
  PK.sel = sh ? sh.items.map(it => ({...it})) : [];
  PK.key = sh && pdfs.includes(sh.items[0].key) ? sh.items[0].key : (pdfs[pdfs.length - 1] || null);
  PK.imp = !pdfs.length && D.library.length > 0;
  edScroll = sheet.scrollTop;
  renderPicker();
  if (!pdfs.length && !D.library.length) H.pkAdd();
};
let edScroll = 0;
function backToForm() { renderEditor(); sheet.scrollTop = edScroll; }
// 같은 콘티에서 이 PDF의 각 쪽을 쓰는 다른 곡 번호
function usedBy(key) {
  const m = {};
  curSL().songs.forEach((s, j) => {
    if (j === draftIdx || !s.sheet) return;
    s.sheet.items.forEach(it => {
      if (it.key !== key) return;
      (it.page ? [it.page] : Array.from({length:PK.n}, (_, i) => i + 1)).forEach(p => { (m[p] = m[p] || []); if (!m[p].includes(j + 1)) m[p].push(j + 1); });
    });
  });
  return m;
}
const selCount = sel => sel.reduce((a, it) => a + (it.page ? 1 : ((libOf(it.key) || {}).pages || 1)), 0);
function renderPicker() {
  const pdfs = projPdfs(), others = D.library.filter(x => !pdfs.includes(x.key));
  const nSel = k => PK.sel.filter(it => it.key === k).length;
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><button class="txtbtn" data-act="pkBack">‹ 뒤로</button><h2>악보 쪽 고르기</h2><button class="txtbtn strong" data-act="pkDone">완료</button></div>
  <div class="sh-body">
    ${pdfs.length ? `<div class="fld"><span>이 콘티의 PDF (${pdfs.length}개)</span><select id="pkPdf" class="inp">${pdfs.map(k => { const x = libOf(k); return `<option value="${esc(k)}" ${k === PK.key ? 'selected' : ''}>${esc(x.name)}${x.pages ? ` (${x.pages}쪽)` : ''}${nSel(k) ? ` · ${nSel(k)}개 고름` : ''}</option>`; }).join('')}</select></div>` : ''}
    <div class="row2" style="flex-wrap:wrap">
      <button type="button" class="pill" style="flex:0 0 auto" data-act="pkAdd">＋ 새 PDF 넣기</button>
      ${others.length ? `<button type="button" class="pill" style="flex:0 0 auto" data-act="pkImp" aria-pressed="${PK.imp}">다른 콘티 악보 가져오기</button>` : ''}
    </div>
    ${PK.imp && others.length ? `<div class="slrows">${others.map(x => `<button type="button" class="slrow" data-act="pkImpOne" data-k="${esc(x.key)}"><span>${esc(x.name)}<small style="display:block;color:var(--mute);font-size:12px">${esc(projsWith(x.key).map(p => p.name).join(', ') || '콘티 없음')}</small></span><span>${x.pages ? x.pages + '쪽 · ' : ''}가져오기</span></button>`).join('')}</div>` : ''}
    ${pdfs.length ? `<p class="note" id="pkInfo">불러오는 중…</p><div class="thumbs" id="thumbs"></div>
      <div class="sh-actions"><button type="button" data-act="pkNone">이 PDF 선택 해제</button><button type="button" data-act="pkAll">이 PDF 전부</button></div>
      ${PK.sel.length ? '<button type="button" class="pill danger" data-act="pkClear" style="align-self:flex-start">고른 쪽 모두 해제</button>' : ''}`
      : `<p class="note">이 콘티에 넣은 PDF가 없어요. 콘티나 악보집 PDF를 넣으면 곡마다 필요한 쪽만 골라 쓸 수 있어요. 여러 PDF에서 섞어 골라도 돼요.</p>`}
  </div>`;
  const selEl = $('#pkPdf');
  if (selEl) selEl.onchange = () => { PK.key = selEl.value; renderPicker(); };
  if (pdfs.length && PK.key) renderThumbs();
}
async function renderThumbs() {
  const tok = ++PK.tok, box = $('#thumbs');
  let doc;
  try { doc = await getDoc(PK.key); }
  catch (e) { if (tok === PK.tok && $('#pkInfo')) $('#pkInfo').textContent = e.message === 'missing' ? '이 기기에 이 PDF 파일이 없어요. 새로 넣어 주세요.' : 'PDF를 열지 못했어요.'; return; }
  if (tok !== PK.tok || !box.isConnected) return;
  PK.n = doc.numPages;
  // "전체 쪽"(page 0)은 낱장으로 펼쳐서 하나씩 뺄 수 있게
  const k0 = PK.sel.findIndex(it => it.key === PK.key && !it.page);
  if (k0 >= 0) PK.sel.splice(k0, 1, ...Array.from({length:PK.n}, (_, i) => ({key:PK.key, page:i + 1})));
  const seen = new Set();
  PK.sel = PK.sel.filter(it => { if (it.key !== PK.key) return true; if (it.page > PK.n || seen.has(it.page)) return false; seen.add(it.page); return true; });
  const used = usedBy(PK.key);
  box.innerHTML = Array.from({length:PK.n}, (_, i) => `<button type="button" class="thumb" data-act="pkTog" data-p="${i + 1}" aria-label="${i + 1}쪽">
    <canvas></canvas><span class="pn num">${i + 1}</span><span class="ord num"></span>${used[i + 1] ? `<span class="usedby">${used[i + 1].join('·')}번 곡</span>` : ''}</button>`).join('');
  updPick();
  const cvs = [...box.querySelectorAll('canvas')], cw = (cvs[0] ? cvs[0].getBoundingClientRect().width : 100) * Math.min(devicePixelRatio || 1, 2);
  for (let i = 0; i < cvs.length; i++) {
    if (tok !== PK.tok || !box.isConnected) return;
    try {
      const pg = await doc.getPage(i + 1), v1 = pg.getViewport({scale:1}), vp = pg.getViewport({scale:cw / v1.width});
      cvs[i].width = Math.floor(vp.width); cvs[i].height = Math.floor(vp.height);
      await pg.render({canvasContext:cvs[i].getContext('2d'), viewport:vp}).promise;
    } catch (e) {}
  }
}
const pkIdx = p => PK.sel.findIndex(it => it.key === PK.key && it.page === p);
function updPick() {
  const box = $('#thumbs'); if (!box) return;
  box.querySelectorAll('.thumb').forEach(t => {
    const o = pkIdx(+t.dataset.p);
    t.classList.toggle('on', o >= 0); t.setAttribute('aria-pressed', o >= 0);
    t.querySelector('.ord').textContent = o >= 0 ? o + 1 : '';
  });
  $('#pkInfo').textContent = PK.sel.length ? `${selCount(PK.sel)}쪽 골랐어요 · ${sheetLabel(PK.sel, new Set(PK.sel.map(i => i.key)).size > 1)} · 누른 순서대로 보여요` : '이 곡에 쓸 쪽을 순서대로 눌러 주세요 · 위에서 PDF를 바꿔 가며 섞어 골라도 돼요';
  const selEl = $('#pkPdf');
  if (selEl) [...selEl.options].forEach(o => { const x = libOf(o.value), n = PK.sel.filter(it => it.key === o.value).length; o.textContent = `${x.name}${x.pages ? ` (${x.pages}쪽)` : ''}${n ? ` · ${n}개 고름` : ''}`; });
}
H.pkTog = b => { const p = +b.dataset.p, o = pkIdx(p); if (o >= 0) PK.sel.splice(o, 1); else PK.sel.push({key:PK.key, page:p}); updPick(); };
H.pkAll = () => { for (let p = 1; p <= PK.n; p++) if (pkIdx(p) < 0) PK.sel.push({key:PK.key, page:p}); updPick(); };
H.pkNone = () => { PK.sel = PK.sel.filter(it => it.key !== PK.key); updPick(); };
H.pkClear = () => { PK.sel = []; renderPicker(); };
H.pkAdd = () => pickPdfFile(e => { attachPdf(e.key); PK.key = e.key; PK.imp = false; if (sheetKind === 'editor') renderPicker(); });
H.pkImp = () => { PK.imp = !PK.imp; renderPicker(); };
H.pkImpOne = b => { attachPdf(b.dataset.k); PK.key = b.dataset.k; PK.imp = false; renderPicker(); toast(`"${libOf(b.dataset.k).name}"을(를) 이 콘티에 넣었어요`); };
H.pkBack = () => { PK.tok++; backToForm(); };
H.pkDone = () => {
  PK.tok++;
  draft.sheet = PK.sel.length ? {items:PK.sel.map(it => ({...it}))} : null;
  backToForm();
};

H.saveSong = () => {
  syncDraft();
  const s = {...draft}; delete s._custom;
  s.title = s.title.trim(); s.memo = s.memo.trim();
  if (!isDotted(s)) s.pulse = 'eighth';
  const songs = curSL().songs, old = draftIdx >= 0 ? songs[draftIdx] : null;
  const sheetChanged = JSON.stringify(old && old.sheet) !== JSON.stringify(s.sheet);
  if (draftIdx >= 0) songs[draftIdx] = s; else songs.push(s);
  save(); closeSheet(); renderList();
  if (!$('#scrPlay').hidden && draftIdx === P.i) {
    if (E.playing) {
      if (old && old.bpm !== s.bpm) setBpm(s.bpm);
      if (old && ['num', 'den', 'pulse', 'sub', 'countIn'].some(k => old[k] !== s[k])) toast('박자·카운트인은 다음 시작부터 바뀌어요');
    } else P.bpm = s.bpm;
    if (s.sheet && sheetChanged) P.sheetOn = true;
    renderPlay();
  }
};
H.dupSong = () => {
  const songs = curSL().songs, c = newSong({...songs[draftIdx], id:uid(), title:(songs[draftIdx].title || '제목 없음') + ' 복사', sheet:songs[draftIdx].sheet ? {items:songs[draftIdx].sheet.items.map(it => ({...it}))} : null});
  songs.splice(draftIdx + 1, 0, c); save(); closeSheet(); renderList(); if (!$('#scrPlay').hidden) renderPlay();
};
H.delSong = () => {
  if (!delArm) { delArm = true; syncDraft(); renderEditor(); return; }
  const sl = curSL(), songs = sl.songs, at = draftIdx, gone = songs.splice(at, 1)[0];
  save(); closeSheet(); renderList();
  if (!$('#scrPlay').hidden) { if (!songs.length) { history.back(); } else { P.i = Math.min(P.i, songs.length - 1); loadSong(); } }
  bandAction(`"${gone.title || '제목 없음'}" 지웠어요`, '되돌리기', () => {
    sl.songs.splice(Math.min(at, sl.songs.length), 0, gone); save();
    if (D.cur === sl.id) { if (!$('#scrList').hidden) renderList(); if (!$('#scrPlay').hidden) renderPlay(); }
    renderHome();
  });
};

/* ---------- 콘티 만들기·관리 ---------- */
let pmId = null, pmDelArm = false, pmPdfArm = null, pmImp = false;
function openNewProj() {
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><button class="txtbtn" data-act="close">취소</button><h2>새 콘티</h2><button class="txtbtn strong" data-act="mkProj">만들기</button></div>
  <div class="sh-body">
    <label class="fld"><span>콘티 이름</span><input id="npName" type="text" placeholder="예: 주일 2부 예배 · 11월 2일" maxlength="40" autocomplete="off"></label>
    <label class="fld"><span>콘티 붙여넣기 (선택)</span><textarea id="npConti" class="inp" placeholder="1. 주님의 선하심 (G)&#10;2. 은혜 (A) 72&#10;3. …"></textarea></label>
    <p class="note">단톡방 콘티를 그대로 붙여넣으면 곡 목록을 만들어 줘요. 예전에 쓴 곡은 BPM·악보를 그대로 가져와요.</p>
  </div>`;
  openSheet('newproj');
  setTimeout(() => { const t = $('#npName'); t && t.focus(); }, 250);
  $('#npName').addEventListener('keydown', e => { if (e.key === 'Enter') H.mkProj(); });
}
H.mkProj = () => {
  const ct = ($('#npConti') && $('#npConti').value || '').trim();
  const n = ($('#npName').value || '').trim() || (ct && parseConti(ct).header) || '새 콘티';
  const x = {id:uid(), name:n, pdfs:[], marks:{}, ctl:{on:true, start:true, song:true, page:true, bpm:true}, songs:[]}; D.setlists.push(x); save();
  closeSheet(); renderHome();
  setTimeout(() => { openProject(x.id); if (ct) setTimeout(() => openPaste(ct), 80); }, 60);
};
function openProjMenu(id) { pmId = id; pmDelArm = false; pmPdfArm = null; pmImp = false; renderProjMenu(); openSheet('projmenu'); }
function renderProjMenu() {
  const p = D.setlists.find(x => x.id === pmId); if (!p) return;
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><span></span><h2>콘티 관리</h2><button class="txtbtn" data-act="close">닫기</button></div>
  <div class="sh-body">
    <div class="fld"><span>이름</span><div class="row2"><input id="pmName" class="inp" type="text" value="${esc(p.name)}" maxlength="40" autocomplete="off"><button type="button" class="pill" style="flex:0 0 auto" data-act="pmRen">변경</button></div></div>
    <p class="note">${p.songs.length}곡${p.songs.length ? ' · ' + p.songs.map(s => s.bpm).join(' → ') + ' BPM' : ''}</p>
    <div class="sec-t">이 콘티 악보 (PDF ${p.pdfs.length}개)</div>
    ${p.pdfs.length ? `<div class="slrows">${p.pdfs.map(k => { const x = libOf(k); if (!x) return ''; const n = p.songs.filter(s => usesKey(s, k)).length;
      return `<div class="librow"><span class="nm"><b>${esc(x.name)}</b><small>${x.pages ? x.pages + '쪽' : '쪽 수 확인 전'} · ${n ? n + '곡에서 사용' : '쓰는 곡 없음'}</small></span>
        <button type="button" class="danger" data-act="pmPdfOut" data-k="${esc(k)}">${pmPdfArm === k ? [n ? `${n}곡에서 빠져요` : '', projsWith(k).length > 1 ? '빼기' : '파일 삭제'].filter(Boolean).join(' · ') : (projsWith(k).length > 1 ? '빼기' : '삭제')}</button></div>`; }).join('')}</div>`
      : '<p class="note">예배 콘티, 드럼 악보처럼 이 콘티에서 쓸 PDF를 여러 개 넣어 두고, 곡마다 쪽을 골라 쓰세요.</p>'}
    <div class="row2" style="flex-wrap:wrap">
      <button type="button" class="pill" style="flex:0 0 auto" data-act="pmPdfAdd">＋ PDF 넣기</button>
      ${D.library.some(x => !p.pdfs.includes(x.key)) ? `<button type="button" class="pill" style="flex:0 0 auto" data-act="pmImp" aria-pressed="${pmImp}">다른 콘티 악보 가져오기</button>` : ''}
    </div>
    ${pmImp ? `<div class="slrows">${D.library.filter(x => !p.pdfs.includes(x.key)).map(x => `<button type="button" class="slrow" data-act="pmImpOne" data-k="${esc(x.key)}"><span>${esc(x.name)}<small style="display:block;color:var(--mute);font-size:12px">${esc(projsWith(x.key).map(q => q.name).join(', ') || '콘티 없음')}</small></span><span>${x.pages ? x.pages + '쪽 · ' : ''}가져오기</span></button>`).join('')}</div>` : ''}
    <button type="button" class="tg" data-act="pmFollow" role="switch" aria-checked="${!!p.followUI}"><span>이 기기에선 따라가기 화면으로<small>조작 없이 박·역할만 크게 보여요 (팀원용)</small></span><span class="sw"></span></button>
    <div class="sec-t">이번 주 콘티 보내기</div>
    <button type="button" class="pill" data-act="pmShare" style="align-self:flex-start;display:inline-flex;align-items:center;gap:6px">${ic('share')}링크·QR로 보내기</button>
    <p class="note">받은 사람이 링크를 열면 이 곡 목록과 BPM이 그 기기에 저장돼요. 악보 PDF는 들어가지 않아요.</p>
    ${syncSection(p)}
    <button type="button" class="pill" data-act="pmExport" style="align-self:flex-start">악보 PDF로 내보내기 (표기 포함)</button>
    <p class="note">표지(곡 목록·BPM) + 곡 순서대로 고른 쪽을 한 파일로 합쳐요. 곡 첫 쪽엔 제목·BPM 표시가 붙어요.</p>
    <div class="sh-actions"><button type="button" data-act="pmDup">복사해서 새로 만들기</button><button type="button" class="danger" data-act="pmDel">${pmDelArm ? ([p.songs.length ? `${p.songs.length}곡` : '', p.pdfs.filter(k => projsWith(k).length === 1).length ? `PDF ${p.pdfs.filter(k => projsWith(k).length === 1).length}개` : ''].filter(Boolean).join('·') || '콘티') + '도 지워져요 · 삭제' : '삭제'}</button></div>
  </div>`;
}
const refreshLists = () => { renderHome(); if (!$('#scrList').hidden) renderList(); };
const pmProj = () => D.setlists.find(x => x.id === pmId);
H.pmFollow = () => { const p = pmProj(); p.followUI = !p.followUI; save(); rerenderPM(); if (!$('#scrList').hidden) renderList(); };
const rerenderPM = () => { const st = sheet.scrollTop; renderProjMenu(); sheet.scrollTop = st; };
H.pmPdfAdd = () => pickPdfFile(e => { const p = pmProj(); if (p && !p.pdfs.includes(e.key)) p.pdfs.push(e.key); save(); refreshLists(); if (sheetKind === 'projmenu') rerenderPM(); });
H.pmImp = () => { pmImp = !pmImp; rerenderPM(); };
H.pmImpOne = b => { const p = pmProj(); if (!p.pdfs.includes(b.dataset.k)) p.pdfs.push(b.dataset.k); pmImp = false; save(); refreshLists(); rerenderPM(); toast(`"${libOf(b.dataset.k).name}"을(를) 가져왔어요`); };
// 콘티에서 빼기: 파일은 악보함에 남고, 이 콘티 곡들에서만 그 PDF 쪽이 빠짐
H.pmPdfOut = b => {
  const k = b.dataset.k, p = pmProj();
  if (pmPdfArm !== k) { pmPdfArm = k; rerenderPM(); return; }
  pmPdfArm = null; p.pdfs = p.pdfs.filter(x => x !== k); p.songs.forEach(s => dropKey(s, k));
  const shared = projsWith(k).length > 0;
  save(); if (!shared) dropFiles([k]);
  refreshLists(); rerenderPM(); toast(shared ? '이 콘티에서 뺐어요 (다른 콘티엔 그대로)' : 'PDF를 지웠어요');
  if (!$('#scrPlay').hidden) renderPlay();
};
H.pmRen = () => { const n = $('#pmName').value.trim(); if (!n) return; D.setlists.find(x => x.id === pmId).name = n; save(); refreshLists(); renderProjMenu(); };
H.pmDup = () => {
  const i = D.setlists.findIndex(x => x.id === pmId), c = D.setlists[i];
  D.setlists.splice(i + 1, 0, {id:uid(), name:c.name + ' 복사', pdfs:[...c.pdfs], marks:JSON.parse(JSON.stringify(c.marks || {})), ctl:{...c.ctl}, songs:c.songs.map(s => ({...s, id:uid(), sheet:s.sheet ? {items:s.sheet.items.map(it => ({...it}))} : null}))});
  save(); refreshLists(); closeSheet();
};
H.pmDel = () => {
  if (!pmDelArm) { pmDelArm = true; renderProjMenu(); return; }
  const wasOpen = !$('#scrList').hidden && D.cur === pmId, wasCur = D.cur === pmId;
  const before = new Set(orphanPdfs().map(x => x.key));
  const at = D.setlists.findIndex(x => x.id === pmId), gone = D.setlists[at];
  D.setlists.splice(at, 1);
  if (wasCur) D.cur = D.setlists.length ? D.setlists[0].id : null;
  // 이 콘티만 쓰던 PDF는 되돌리기 시간이 지난 뒤에 파일까지 지움
  const only = orphanPdfs().filter(x => !before.has(x.key)).map(x => x.key);
  save(); closeSheet(); renderHome();
  bandAction(`"${gone.name}" 지웠어요`, '되돌리기', () => {
    D.setlists.splice(Math.min(at, D.setlists.length), 0, gone); if (wasCur) D.cur = gone.id; save(); renderHome();
  }, () => { const still = only.filter(k => !projsWith(k).length); if (still.length) dropFiles(still); });
  if (wasOpen) setTimeout(() => history.back(), 60);
};

/* ---------- 설정 ---------- */
let libDelArm = null;
function openSettings() { libDelArm = null; renderSettings(); openSheet('settings'); }
function rerenderSettings() { const st = sheet.scrollTop; renderSettings(); sheet.scrollTop = st; }
H.libPrune = () => {
  if (libDelArm !== 'prune') { libDelArm = 'prune'; rerenderSettings(); return; }
  libDelArm = null; const n = pruneLibrary(); rerenderSettings(); toast(`PDF ${n}개를 지웠어요`);
};
function renderSettings() {
  const S = D.settings, canVib = !!navigator.vibrate;
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><span></span><h2>설정</h2><button class="txtbtn" data-act="close">닫기</button></div>
  <div class="sh-body">
    ${seg('visual', '기본 비주얼', VIS, S.visual)}
    ${seg('sound', '클릭 소리', SOUNDS, S.sound)}
    <button type="button" class="pill" data-act="preview" style="align-self:flex-start">▶ 들어보기</button>
    <label class="fld"><span>볼륨</span><input id="sVol" type="range" min="0" max="1" step="0.05" value="${S.volume}"></label>
    <label class="fld"><span>쪼개기 볼륨</span><input id="sSub" type="range" min="0" max="1" step="0.05" value="${S.subVol}"></label>
    <div class="fld"><span>소리·화면 박 맞추기 · 지금 ${S.visOffset > 0 ? '+' : ''}${S.visOffset}ms</span><button type="button" class="pill" data-act="calOpen" style="align-self:flex-start">블루투스·스피커에 맞추기</button></div>
    <p class="note">블루투스 스피커·이어폰은 소리가 늦게 나와요. 쓰는 스피커를 연결하고 한 번 맞춰 두세요.</p>
    ${seg('vibrate', '소리 꺼졌을 때 진동', [['off', '끔'], ['down', '첫 박만'], ['all', '매 박']], S.vibrate)}
    ${canVib ? '' : '<p class="note">이 폰(브라우저)은 진동을 지원하지 않아요. 아이폰 웹앱은 진동이 안 돼요.</p>'}
    ${tgl('showBar', '마디 번호 표시', S.showBar, '본박부터 1마디. 반복 구간에서 어긋나면 ±로 맞춰요')}
    ${tgl('sheetAuto', '악보 있는 곡은 악보 화면으로 열기', S.sheetAuto, '악보 화면에선 화면 테두리가 박을 보여줘요')}
    ${tgl('pgBtns', '악보 위 ‹ › 넘김 버튼', S.pgBtns, '끄면 옆으로 밀기·페달로만 넘겨요')}
    ${seg('songFlip', '마지막 쪽에서 다음 곡으로 넘어가려면', [[1, '1번 넘김'], [2, '2번 넘김'], [3, '3번 넘김']], S.songFlip)}
    <p class="note">버튼·옆으로 밀기·페달 모두 같아요. 1번이면 바로 넘어가고, 2~3번이면 실수로 곡이 바뀌는 걸 막아줘요.</p>
    ${tgl('light', '조명 모드', S.light, '밝은 무대 조명 아래에서 선을 굵게, 회색 글자를 밝게')}
    ${tgl('wake', '재생 화면에서 화면 꺼짐 방지', S.wake)}
    ${tgl('nextAuto', '재생 중 다음 곡으로 넘기면 바로 시작', S.nextAuto, '끄면 넘긴 뒤 정지 상태로 기다려요')}
    <div class="sec-t">악보 (PDF)</div>
    <p class="note">악보는 콘티마다 따로 넣고 빼요. 콘티 화면 오른쪽 위 ⋯ → "이 콘티 악보".</p>
    ${(() => { const o = orphanPdfs(); return o.length ? `<div class="librow"><span class="nm"><b>어느 콘티에도 없는 PDF ${o.length}개</b><small>${esc(o.map(x => x.name).join(', '))}</small></span>
      <button type="button" class="danger" data-act="libPrune">${libDelArm === 'prune' ? '한 번 더 누르면 지우기' : '지우기'}</button></div>` : ''; })()}
    <div class="sec-t">백업</div>
    <div class="sh-actions" style="padding-top:0"><button type="button" data-act="exportD">내보내기</button><button type="button" data-act="importD">불러오기</button></div>
    <p class="note">불러온 콘티는 지금 목록에 추가돼요 (기존 것은 그대로). 악보 PDF는 백업 파일에 들어가지 않으니 원본 PDF는 따로 보관하세요.</p>
    <div class="sec-t">조작</div>
    <div class="keys"><span><kbd>SPACE</kbd> 재생</span><span><kbd>→</kbd> 다음</span><span><kbd>←</kbd> 이전</span><span><kbd>↑↓</kbd> BPM</span><span>밀기 곡 이동</span><span>± 길게 5씩</span></div>
    <p class="note" style="color:var(--dim)">카운트인 v3.3 · 데이터는 이 기기에만 저장돼요<br>숫자 글꼴 Barlow Condensed (SIL Open Font License 1.1)</p>
  </div>`;
  $('#sVol').oninput = e => { S.volume = +e.target.value; if (E.master) E.master.gain.value = S.volume; save(); };
  $('#sSub').oninput = e => { S.subVol = +e.target.value; save(); };

}
function setSeg(k, v, b) {
  D.settings[k] = v; save();
  b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
  if (k === 'sound') H.preview();
  if (!$('#scrPlay').hidden) renderPlay();
}
H.preview = () => { ensureCtx(); const t = E.ctx.currentTime + .05; for (let j = 0; j < 4; j++) click(t + j * .5, j === 0 ? 2 : 1); };
H.exportD = async () => {
  const d = new Date(), name = `countin-backup-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.json`;
  await saveFile(new Blob([JSON.stringify(D, null, 1)], {type:'application/json'}), name);
};
H.importD = () => $('#fileIn').click();
$('#fileIn').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try {
    const d = fix(JSON.parse(await f.text()));
    const add = d.setlists.map(x => ({...x, id:uid(), songs:x.songs.map(s => ({...s, id:uid()}))}));
    D.setlists.push(...add);
    d.library.forEach(x => { if (!D.library.some(y => y.key === x.key)) D.library.push(x); });
    save(); renderList(); closeSheet(); toast(`콘티 ${add.length}개를 불러왔어요`);
  } catch (err) { toast('카운트인 백업 파일이 아니에요'); }
};

/* ================= 악보에 표기하기 ================= */
const BODYF = getComputedStyle(document.documentElement).getPropertyValue('--f-body');
// 표기는 쪽 크기에 대한 비율(0~1)로 저장: {s:[{c, w, h(형광), p:[x,y,x,y…]}], t:[{x, y, v, c, z}]}
function drawMarks(cv, m) {
  const g = cv.getContext('2d'), W = cv.width, H = cv.height;
  g.clearRect(0, 0, W, H);
  if (!m) return;
  g.lineCap = 'round'; g.lineJoin = 'round';
  for (const st of m.s || []) {
    const p = st.p; if (!p || p.length < 2) continue;
    g.strokeStyle = st.c; g.globalAlpha = st.h ? .38 : 1; g.lineWidth = st.w * W;
    g.beginPath(); g.moveTo(p[0] * W, p[1] * H);
    for (let i = 2; i < p.length; i += 2) g.lineTo(p[i] * W, p[i + 1] * H);
    if (p.length === 2) g.lineTo(p[0] * W + .5, p[1] * H);
    g.stroke();
  }
  g.globalAlpha = 1;
  for (const t of m.t || []) {
    const fs = t.z * W;
    g.font = `700 ${fs}px ${BODYF}`; g.textBaseline = 'top';
    g.lineWidth = fs * .25; g.strokeStyle = 'rgba(255,255,255,.92)'; g.strokeText(t.v, t.x * W, t.y * H);
    g.fillStyle = t.c; g.fillText(t.v, t.x * W, t.y * H);
  }
}
const MK = {tool:'pen', c:'#E5484D', undo:[], cur:null};
const marksOf = id => { const p = curSL(); p.marks = p.marks || {}; return p.marks[id] || (p.marks[id] = {s:[], t:[]}); };
const redrawMk = id => document.querySelectorAll(`#pages canvas.mk[data-mk="${id}"]`).forEach(cv => drawMarks(cv, curSL().marks[id]));
const snap = id => { MK.undo.push({id, before:JSON.stringify(marksOf(id))}); if (MK.undo.length > 60) MK.undo.shift(); };
function setTool(b) {
  MK.tool = b.dataset.tool; if (b.dataset.c) MK.c = b.dataset.c;
  $('#mkBar').querySelectorAll('[data-tool]').forEach(x => x.setAttribute('aria-pressed', x === b));
}
function setMarking(on) {
  P.markOn = on;
  $('#scrPlay').classList.toggle('marking', on); $('#mkBar').hidden = !on;
  if (on) { setUi(false); const b = $('#mkBar').querySelector(`[data-tool="${MK.tool}"]${MK.tool === 'pen' ? `[data-c="${MK.c}"]` : ''}`) || $('#mkBar [data-tool]'); setTool(b); }
  else { $('#txtDlg').hidden = true; save(); }
}
$('#bMark').onclick = () => setMarking(true);
$('#mkDone').onclick = () => setMarking(false);
$('#mkBar').addEventListener('click', e => { const b = e.target.closest('[data-tool]'); if (b) setTool(b); });
$('#mkUndo').onclick = () => { const u = MK.undo.pop(); if (!u) { toast('되돌릴 게 없어요'); return; } curSL().marks[u.id] = JSON.parse(u.before); save(); redrawMk(u.id); };
function eraseAt(id, x, y, ar) {
  const m = marksOf(id), r = .025; let hit = false;
  m.s = m.s.filter(st => { for (let i = 0; i < st.p.length; i += 2) if (Math.hypot(st.p[i] - x, (st.p[i + 1] - y) * ar) < r + st.w / 2) { hit = true; return false; } return true; });
  m.t = m.t.filter(t => { const inside = x >= t.x - .01 && x <= t.x + t.v.length * t.z * .95 + .01 && y >= t.y - .01 && y <= t.y + t.z * 1.3 / ar + .01; if (inside) hit = true; return !inside; });
  return hit;
}
function textHit(id, x, y, ar) { const m = marksOf(id); return m.t.findIndex(t => x >= t.x - .01 && x <= t.x + t.v.length * t.z * .95 + .01 && y >= t.y - .01 && y <= t.y + t.z * 1.3 / ar + .01); }
let TD = null;
function openTextDlg(id, idx, x, y) {
  TD = {id, idx, x, y};
  $('#txtIn').value = idx >= 0 ? marksOf(id).t[idx].v : '';
  $('#txtDel').hidden = idx < 0;
  $('#txtDlg').hidden = false; setTimeout(() => $('#txtIn').focus(), 50);
}
$('#txtCancel').onclick = () => { $('#txtDlg').hidden = true; };
$('#txtDel').onclick = () => { if (!TD) return; snap(TD.id); marksOf(TD.id).t.splice(TD.idx, 1); save(); redrawMk(TD.id); $('#txtDlg').hidden = true; };
$('#txtOk').onclick = () => {
  if (!TD) return; const v = $('#txtIn').value.trim(); snap(TD.id);
  const m = marksOf(TD.id);
  if (TD.idx >= 0) { if (v) m.t[TD.idx].v = v; else m.t.splice(TD.idx, 1); }
  else if (v) m.t.push({x:+TD.x.toFixed(4), y:+TD.y.toFixed(4), v, c:MK.c, z:.042});
  save(); redrawMk(TD.id); $('#txtDlg').hidden = true;
};
$('#txtIn').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#txtOk').click(); } });
(() => {
  const pages = $('#pages');
  const pos = (cv, e) => { const r = cv.getBoundingClientRect(); return [clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1), r.height / r.width]; };
  pages.addEventListener('pointerdown', e => {
    let cv = e.target.closest('canvas.mk');
    if (!P.markOn) {
      if (e.pointerType !== 'pen' || !P.sheetOn) return;
      const pin = e.target.closest('.pgin'); cv = pin && pin.querySelector('canvas.mk'); if (!cv) return;
      setMarking(true); toast('펜으로 표기해요 · 다 하면 완료');
    }
    if (!cv) return;
    e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    const id = cv.dataset.mk, [x, y, ar] = pos(cv, e);
    if (MK.tool === 'text') { const k = textHit(id, x, y, ar); openTextDlg(id, k, x, y); return; }
    snap(id);
    if (MK.tool === 'erase') { MK.cur = {cv, id, erase:true, hit:eraseAt(id, x, y, ar)}; redrawMk(id); return; }
    const st = {c:MK.tool === 'hl' ? '#FFD400' : MK.c, w:MK.tool === 'hl' ? .022 : .0035, p:[+x.toFixed(4), +y.toFixed(4)]};
    if (MK.tool === 'hl') st.h = 1;
    marksOf(id).s.push(st); MK.cur = {cv, id, st}; redrawMk(id);
  });
  pages.addEventListener('pointermove', e => {
    const c = MK.cur; if (!c) return;
    const [x, y, ar] = pos(c.cv, e);
    if (c.erase) { if (eraseAt(c.id, x, y, ar)) { c.hit = true; redrawMk(c.id); } return; }
    const p = c.st.p;
    if (Math.hypot(x - p[p.length - 2], y - p[p.length - 1]) < .002) return;
    p.push(+x.toFixed(4), +y.toFixed(4)); redrawMk(c.id);
  });
  const end = () => { const c = MK.cur; if (!c) return; MK.cur = null; if (c.erase && !c.hit) MK.undo.pop(); save(); };
  pages.addEventListener('pointerup', end); pages.addEventListener('pointercancel', end);
})();

/* ================= 파일 저장 (웹: 공유·다운로드 / 앱: 공유 시트) ================= */
const SCR = {};
function loadScript(src, glob) {
  if (window[glob]) return Promise.resolve(window[glob]);
  return SCR[src] || (SCR[src] = new Promise((res, rej) => {
    const el = document.createElement('script'); el.src = src;
    el.onload = () => res(window[glob]); el.onerror = () => { delete SCR[src]; rej(new Error(src)); };
    document.head.appendChild(el);
  }));
}
async function saveFile(blob, name) {
  const C = window.Capacitor && window.Capacitor.Plugins;
  if (C && C.Filesystem && C.Share) {
    const b64 = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result).split(',')[1]); fr.readAsDataURL(blob); });
    const w = await C.Filesystem.writeFile({path:name.replace(/[\\/:*?"<>|]/g, '_'), data:b64, directory:'CACHE'});
    try { await C.Share.share({title:name, files:[w.uri]}); } catch (e) {}
    return;
  }
  try {
    const f = new File([blob], name, {type:blob.type});
    if (navigator.canShare && navigator.canShare({files:[f]})) { await navigator.share({files:[f], title:name}); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
const busy = m => { const b = $('#busy'); b.hidden = !m; b.textContent = m || ''; };

/* ================= 콘티 악보를 PDF 하나로 (표기 포함) ================= */
function coverCanvas(p) {
  const W = 1240, H = 1754, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.fillStyle = '#111'; g.textBaseline = 'top';
  g.font = `800 64px ${BODYF}`; g.fillText(p.name, 90, 110);
  const d = new Date();
  g.font = `400 26px ${BODYF}`; g.fillStyle = '#666'; g.fillText(`카운트인 · ${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} · ${p.songs.length}곡`, 92, 200);
  g.fillStyle = '#E5484D'; g.fillRect(90, 260, 1060, 4);
  let y = 300;
  p.songs.forEach((s, j) => {
    if (y > H - 120) return;
    g.fillStyle = '#111'; g.font = `700 34px ${BODYF}`; g.fillText(`${j + 1}. ${s.title || '제목 없음'}`, 90, y);
    g.font = `800 34px ${BODYF}`; g.textAlign = 'right'; g.fillText(`${s.bpm} BPM`, 1150, y); g.textAlign = 'left';
    g.font = `400 24px ${BODYF}`; g.fillStyle = '#666';
    g.fillText([sigL(s), SUBL[s.sub], s.countIn ? `카운트 ${s.countIn}마디` : '', s.memo, s.sheet ? '' : '악보 없음'].filter(Boolean).join(' · '), 128, y + 46);
    y += 104;
  });
  return c;
}
async function canvasPng(c) { const b = await new Promise(r => c.toBlob(r, 'image/png')); return new Uint8Array(await b.arrayBuffer()); }
H.pmExport = async () => {
  const p = pmProj(); if (!p) return;
  if (!p.songs.some(s => s.sheet)) { toast('악보를 고른 곡이 없어요'); return; }
  busy('악보 PDF 만드는 중…');
  try {
    const L = await loadScript('vendor/pdf-lib.min.js', 'PDFLib');
    const out = await L.PDFDocument.create();
    const cv = coverCanvas(p), cp0 = out.addPage([595.28, 841.89]);
    cp0.drawImage(await out.embedPng(await canvasPng(cv)), {x:0, y:0, width:595.28, height:841.89});
    const src = {};
    let n = 0;
    for (const [j, s] of p.songs.entries()) {
      if (!s.sheet) continue;
      let first = true;
      for (const it of s.sheet.items) {
        if (!src[it.key]) { const buf = await IDB.get(it.key); if (!buf) continue; src[it.key] = await L.PDFDocument.load(buf, {ignoreEncryption:true}); }
        const sd = src[it.key], pagesNo = it.page ? [it.page] : Array.from({length:sd.getPageCount()}, (_, i) => i + 1);
        for (const pn of pagesNo) {
          if (pn > sd.getPageCount()) continue;
          busy(`악보 PDF 만드는 중… ${j + 1}. ${s.title || ''}`);
          const [pg] = await out.copyPages(sd, [pn - 1]); out.addPage(pg);
          const {width, height} = pg.getSize(), sc = 1600 / width;
          const ov = document.createElement('canvas'); ov.width = 1600; ov.height = Math.round(height * sc);
          drawMarks(ov, p.marks[it.key + ':' + pn]);
          if (first) {
            const g = ov.getContext('2d'), fs = 26, label = `${j + 1}. ${s.title || '제목 없음'} · ${s.bpm} BPM · ${sigL(s)}`;
            g.font = `700 ${fs}px ${BODYF}`; const w = g.measureText(label).width;
            g.fillStyle = 'rgba(255,255,255,.95)'; g.fillRect(16, 14, w + 28, fs + 20);
            g.strokeStyle = '#E5484D'; g.lineWidth = 3; g.strokeRect(16, 14, w + 28, fs + 20);
            g.fillStyle = '#111'; g.textBaseline = 'top'; g.fillText(label, 30, 24);
            first = false;
          }
          pg.drawImage(await out.embedPng(await canvasPng(ov)), {x:0, y:0, width, height});
          n++;
        }
      }
    }
    const bytes = await out.save();
    busy('');
    await saveFile(new Blob([bytes], {type:'application/pdf'}), `${p.name}-악보.pdf`);
    toast(`표지 + 악보 ${n}쪽을 PDF로 만들었어요`);
  } catch (e) { busy(''); toast('PDF를 만들지 못했어요' + (e && e.message === 'vendor/pdf-lib.min.js' ? ' (인터넷 연결 확인)' : '')); }
};

/* ================= 함께 연주 (기기 연동) ================= */
// 리더 기기가 4자리 코드로 세션을 열면(PeerJS, 기기끼리 직접 연결) 참여 기기는 콘티·PDF를 받고,
// 콘티 설정(ctl)과 곡별 설정(follow)에 따라 리더의 시작·정지·곡 이동·악보 넘김·BPM을 따라감.
// 박 맞추기: 참여 기기가 리더와 시계 차이(offset)를 재고, 리더는 "박 0이 스피커로 나오는 리더 시각(t0)"을 보냄.
const SY = {peer:null, role:null, code:null, projId:null, conns:[], conn:null, offset:0, rtt:1e9, members:{}, leader:'', hb:0, cs:0, lastPage:-1, joinArm:false, wait:[], okDev:new Set(), need:new Set()};
window.__syncReady = true;
const myName = () => D.settings.myName || ('기기 ' + D.settings.devId.slice(-4).toUpperCase());
const peerId = code => 'countin-v1-' + code;
function syncTag(p) {
  if (!p) return '';
  if (SY.role === 'leader' && SY.projId === p.id) return `LINK ${SY.code} 리더 · `;
  if (SY.role === 'member' && SY.projId === p.id) return 'LINK 따라감 · ';
  return p.linked ? '연동 · ' : '';
}
async function newPeer(id) {
  const g = await loadScript('vendor/peerjs.min.js', 'peerjs');
  return new Promise((res, rej) => {
    const pr = id ? new g.Peer(id, {debug:0}) : new g.Peer({debug:0});
    const t = setTimeout(() => { pr.destroy(); rej({type:'timeout'}); }, 12000);
    pr.on('open', () => { clearTimeout(t); res(pr); });
    pr.on('error', e => { clearTimeout(t); pr.destroy(); rej(e); });
  });
}
function syncLeave(silent) {
  clearInterval(SY.hb); clearInterval(SY.cs);
  const was = SY.role;
  try { SY.conn && SY.conn.close(); } catch (e) {}
  try { SY.peer && SY.peer.destroy(); } catch (e) {}
  Object.assign(SY, {peer:null, role:null, code:null, projId:null, conns:[], conn:null, members:{}, rtt:1e9, lastPage:-1, wait:[], okDev:new Set(), need:new Set()});
  const jb = $('#bandJoin'); if (jb) jb.hidden = true;
  if (!silent && was) toast(was === 'leader' ? '세션을 닫았어요' : '세션에서 나왔어요');
  refreshSyncViews();
}
function refreshSyncViews() {
  renderHome();
  if (!$('#scrList').hidden) renderList();
  if (!$('#scrPlay').hidden) { const s = song(), list = curSL().songs; if (s) $('#pSub').textContent = `${syncTag(curSL())}${P.i + 1} / ${list.length} · ${sigL(s)}`; $('#scrPlay').classList.toggle('leading', SY.role === 'leader' && D.cur === SY.projId); }
  if (sheetKind === 'projmenu') rerenderPM();
}

/* ---- 리더 ---- */
async function syncHost(projId) {
  syncLeave(true);
  for (let i = 0; i < 6; i++) {
    const code = String(1000 + Math.floor(Math.random() * 9000));
    try {
      const peer = await newPeer(peerId(code));
      Object.assign(SY, {peer, role:'leader', code, projId, conns:[], members:{}});
      peer.on('connection', hostConn);
      peer.on('disconnected', () => { try { peer.reconnect(); } catch (e) {} });
      peer.on('error', e => { if (e.type !== 'peer-unavailable') toast('연동 연결이 불안정해요'); });
      SY.hb = setInterval(() => sendState(), 2000);
      refreshSyncViews();
      return code;
    } catch (e) { if (e.type !== 'unavailable-id') throw e; }
  }
  throw {type:'no-code'};
}
// 코드는 4자리라 맞혀서 들어올 수 있음 → 리더가 "들여보내기"를 눌러야 콘티·악보를 보냄
// (한 번 허락한 기기는 이 세션 동안 다시 묻지 않음 · 대기 중 요청은 25초 뒤 자동 거절)
function hostConn(conn) {
  const hold = setTimeout(() => { if (!conn.ok && !conn.asked) conn.close(); }, 15000);
  conn.on('data', d => {
    if (!d || typeof d.t !== 'string') return;
    if (d.t === 'hello' && !conn.ok && !conn.asked) {
      clearTimeout(hold); conn.asked = true;
      const name = str(d.name, 20).trim() || '참여자', dev = str(d.dev, 40);
      if (Object.keys(SY.members).length + SY.wait.length >= 30) { conn.close(); return; }
      if (dev && SY.okDev.has(dev)) admit(conn, name); else { SY.wait.push({conn, name, dev}); if (SY.wait.length === 1) nextJoin(); }
    }
    else if (!conn.ok) return;
    else if (d.t === 'ping') conn.send({t:'pong', a:+d.a || 0, b:performance.now()});
    else if (d.t === 'getpdf') {
      const p = D.setlists.find(x => x.id === SY.projId), key = str(d.key, 80);
      if (!p || !p.pdfs.includes(key)) return;   // 이 콘티 악보만
      IDB.get(key).then(buf => { if (buf && conn.open) conn.send({t:'pdf', key, name:(libOf(key) || {}).name || '악보', data:buf}); });
    }
  });
  conn.on('close', () => {
    clearTimeout(hold);
    SY.conns = SY.conns.filter(c => c !== conn);
    const w = SY.wait.findIndex(x => x.conn === conn); if (w >= 0) { SY.wait.splice(w, 1); if (w === 0) nextJoin(); }
    const n = SY.members[conn.peer]; delete SY.members[conn.peer]; refreshSyncViews(); if (n) toast(`${n} 님이 나갔어요`);
  });
  conn.on('error', () => {});
}
function admit(conn, name, dev) {
  conn.ok = true; if (dev) SY.okDev.add(dev);
  SY.members[conn.peer] = name; SY.conns.push(conn);
  sendProj(conn); sendState(conn); refreshSyncViews(); toast(`${name} 님이 들어왔어요`);
}
let joinT;
function nextJoin() {
  const b = $('#bandJoin'); clearTimeout(joinT);
  const w = SY.wait[0]; if (!w) { b.hidden = true; return; }
  b.querySelector('span').textContent = `${w.name} 님이 팀 연결로 들어오려고 해요`; b.hidden = false; placeBands();
  const done = ok => {
    if (SY.wait[0] !== w) return; SY.wait.shift(); clearTimeout(joinT);
    if (ok && w.conn.open) admit(w.conn, w.name, w.dev);
    else { try { w.conn.send({t:'deny'}); } catch (e) {} setTimeout(() => { try { w.conn.close(); } catch (e) {} }, 400); }
    nextJoin();
  };
  b.querySelector('.yes').onclick = () => done(true);
  b.querySelector('.no').onclick = () => done(false);
  joinT = setTimeout(() => done(false), 25000);
}
function projSnap() {
  const p = D.setlists.find(x => x.id === SY.projId); if (!p) return null;
  return {id:p.id, name:p.name, pdfs:[...p.pdfs], ctl:{...p.ctl}, songs:p.songs.map(s => JSON.parse(JSON.stringify(s))), lib:p.pdfs.map(libOf).filter(Boolean)};
}
function sendProj(conn) {
  const sn = projSnap(); if (!sn) return;
  (conn ? [conn] : SY.conns).forEach(c => { try { c.send({t:'proj', p:sn, leader:myName()}); } catch (e) {} });
}
function leaderState() {
  const inProj = D.cur === SY.projId && !$('#scrPlay').hidden;
  const st = {t:'state', i:inProj ? P.i : -1, bpm:P.bpm, playing:!!(inProj && E.playing), page:inProj && P.sheetOn ? (SV.cur || 0) : -1};
  if (st.playing && E.ctx) st.t0 = performance.now() + (E.start - outNow()) * 1000;
  return st;
}
function sendState(conn) {
  if (SY.role !== 'leader') return;
  const st = leaderState();
  (conn ? [conn] : SY.conns).forEach(c => { try { c.send(st); } catch (e) {} });
}
function syncSendState() { if (SY.role === 'leader') sendState(); }
function syncPage() {
  if (SY.role !== 'leader' || !P.sheetOn || D.cur !== SY.projId || SV.cur === SY.lastPage) return;
  SY.lastPage = SV.cur;
  SY.conns.forEach(c => { try { c.send({t:'page', k:SV.cur, i:P.i}); } catch (e) {} });
}
// 리더가 곡·BPM을 고치면 참여자에게 다시 보냄
let projPushT;
function syncProjChanged() { if (SY.role !== 'leader' || D.cur !== SY.projId) return; clearTimeout(projPushT); projPushT = setTimeout(() => sendProj(), 400); }

/* ---- 참여자 ---- */
async function syncJoin(code) {
  syncLeave(true);
  ensureCtx();
  const peer = await newPeer();
  const conn = peer.connect(peerId(code), {reliable:true, serialization:'binary'});
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej({type:'timeout'}), 12000);
    conn.on('open', () => { clearTimeout(t); res(); });
    conn.on('error', e => { clearTimeout(t); rej(e); });
    peer.on('error', e => { clearTimeout(t); rej(e); });
  }).catch(e => { try { peer.destroy(); } catch (x) {} throw e; });
  Object.assign(SY, {peer, conn, role:'member', code});
  conn.send({t:'hello', name:myName(), dev:D.settings.devId});
  conn.on('data', memberData);
  conn.on('close', () => { if (SY.role === 'member') { toast('리더와 연결이 끊겼어요'); syncLeave(true); } });
  clockSync(); SY.cs = setInterval(clockSync, 15000);
}
function clockSync() {
  if (!SY.conn) return;
  SY.rtt = 1e9;
  for (let i = 0; i < 8; i++) setTimeout(() => { try { SY.conn && SY.conn.send({t:'ping', a:performance.now()}); } catch (e) {} }, i * 120);
}
function memberData(d) {
  if (!d || !d.t) return;
  if (d.t === 'pong') {
    const c = performance.now(), rtt = c - d.a;
    if (rtt < SY.rtt) { SY.rtt = rtt; SY.offset = d.b - (d.a + c) / 2; }
  }
  else if (d.t === 'deny') { toast('리더가 들여보내지 않았어요'); syncLeave(true); }
  else if (d.t === 'proj' && d.p && typeof d.p === 'object') applyProj(d.p, d.leader);
  else if (d.t === 'pdf') receivePdf(d);
  else if (d.t === 'state') applyState(d);
  else if (d.t === 'page') applyPage(d);
  else if (d.t === 'cue') { const p = linkedProj(); if (p && p.ctl.on && p.ctl.cue !== false && D.cur === p.id && !$('#scrPlay').hidden) { showCue(d.c); try { navigator.vibrate && navigator.vibrate([60, 40, 60]); } catch (e) {} } }
}
const linkedProj = () => D.setlists.find(x => x.id === SY.projId);
// 리더 곡 목록을 받되, 같은 곡(id)의 내 개인 설정은 남김
const PERSONAL = ['memo', 'sheet', 'follow', 'visual', 'countIn', 'muteAfter', 'accent'];
function mergeSongs(mine, theirs) {
  const old = new Map((mine || []).map(x => [x.id, x]));
  return theirs.map(x => { const n = newSong(x), o = old.get(x.id); if (o) PERSONAL.forEach(k => { n[k] = o[k]; }); return n; });
}
async function applyProj(sn, leader) {
  const id = 'link-' + str(sn.id, 40);
  let p = D.setlists.find(x => x.id === id);
  const fresh = !p;
  if (!p) { p = {id, marks:{}}; D.setlists.unshift(p); }
  const pdfs = (Array.isArray(sn.pdfs) ? sn.pdfs : []).slice(0, 50).map(k => str(k, 80)), C = sn.ctl && typeof sn.ctl === 'object' ? sn.ctl : {};
  const ctl = {}; ['on', 'start', 'song', 'page', 'bpm', 'cue'].forEach(k => { ctl[k] = C[k] !== false; });
  Object.assign(p, {name:str(sn.name || '받은 콘티', 60), pdfs, ctl, songs:mergeSongs(p.songs, cleanSongs(sn.songs)), linked:{leader:str(leader || '리더', 20)}});
  if (typeof p.followUI !== 'boolean') p.followUI = true;
  SY.projId = id; SY.leader = p.linked.leader;
  const need = [];
  for (const L0 of (Array.isArray(sn.lib) ? sn.lib : []).slice(0, 50)) {
    if (!L0 || !pdfs.includes(str(L0.key, 80))) continue;
    const L = {key:str(L0.key, 80), name:str(L0.name || '악보', 80), pages:clamp(Math.round(+L0.pages) || 0, 0, 2000)};
    if (!D.library.some(x => x.key === L.key)) D.library.push(L);
    try { if (!(await IDB.get(L.key))) need.push(L.key); } catch (e) { need.push(L.key); }
  }
  save();
  need.forEach(k => { SY.need.add(k); try { SY.conn.send({t:'getpdf', key:k}); } catch (e) {} });
  if (fresh) toast(`"${sn.name}" 콘티를 받았어요${need.length ? ` · 악보 ${need.length}개 받는 중` : ''}`);
  refreshSyncViews();
  if (!$('#scrPlay').hidden && D.cur === id) { const s = song(); if (s && !E.playing) { P.bpm = s.bpm; } renderPlay(); }
}
async function receivePdf(d) {
  // 내가 달라고 한 악보만, PDF 파일이 맞고 80MB 이하일 때만 저장
  const key = str(d.key, 80); if (!SY.need.has(key)) return;
  const buf = d.data instanceof ArrayBuffer ? d.data : d.data && d.data.buffer instanceof ArrayBuffer ? new Uint8Array(d.data).buffer : null;
  if (!buf || buf.byteLength > 80e6 || String.fromCharCode(...new Uint8Array(buf, 0, Math.min(4, buf.byteLength))) !== '%PDF') return;
  SY.need.delete(key); d.key = key; d.name = str(d.name || '악보', 80);
  try { await IDB.put(key, buf); } catch (e) { toast('악보를 저장하지 못했어요 (저장 공간 확인)'); return; }
  DOCS.delete(d.key);
  const L = libOf(d.key); if (L && d.name) L.name = d.name;
  save();
  if (!$('#scrPlay').hidden && P.sheetOn) { SV.sig = null; applySheet(); }
  toast(`악보 "${d.name}" 받았어요`);
}
// 따라갈지: 리더 제어 전체가 꺼지면 안 따름 → 곡별 설정(따라가기/안 따라가기)이 있으면 그것 → 없으면 콘티 항목 설정
function follows(p, s, what) {
  if (!p || !p.ctl.on) return false;
  if (s && s.follow === 'off') return false;
  if (s && s.follow === 'on') return true;
  return !!p.ctl[what];
}
function startAtLeader(t0Local, bpm) {
  ensureCtx();
  const spb = 60 / bpm, ns = outNow() + (t0Local - performance.now()) / 1000;
  if (E.playing && Math.abs(spb - E.spb) < 1e-6 && Math.abs(ns - E.start) < .015) return;
  const was = E.playing;
  E.tok++; E.spb = spb; E.start = ns; E.n = Math.max(0, Math.ceil((E.ctx.currentTime + .01 - E.start) / E.spb)); E.sub = 0; E.playing = true;
  if (!was) E.song = JSON.parse(JSON.stringify(song()));
  if (!was) P.barOff = 0;
  P.bpm = bpm; updBpm(); updPlayBtn();
}
function applyState(st) {
  const p = linkedProj(); if (!p || !p.ctl.on || sheetKind === 'check') return;
  if (st.i < 0 || st.i >= p.songs.length) { if (E.playing && D.cur === p.id && follows(p, song(), 'start')) stop(); return; }
  const target = p.songs[st.i];
  if (follows(p, target, 'song')) {
    const inPlay = !$('#scrPlay').hidden && D.cur === p.id;
    if (!inPlay) { if ($('#scrList').hidden || D.cur !== p.id) { if (!$('#scrPlay').hidden) closePlay(); D.cur = p.id; renderList(); show('list'); history.pushState({s:'list'}, ''); } openPlay(st.i, false); }
    else if (P.i !== st.i) go(st.i);
  }
  if (D.cur !== p.id || $('#scrPlay').hidden || P.i !== st.i) return;
  if (follows(p, target, 'bpm') && !st.playing && P.bpm !== st.bpm) { P.bpm = st.bpm; updBpm(); }
  if (follows(p, target, 'start')) {
    if (st.playing && st.t0) startAtLeader(st.t0 - SY.offset, follows(p, target, 'bpm') ? st.bpm : P.bpm);
    else if (!st.playing && E.playing) stop();
  }
  if (st.page >= 0 && follows(p, target, 'page') && P.sheetOn && SV.cur !== st.page) gotoPageIdx(st.page);
}
function applyPage(d) {
  const p = linkedProj(); if (!p || D.cur !== p.id || $('#scrPlay').hidden || P.i !== d.i) return;
  if (follows(p, song(), 'page') && P.sheetOn) gotoPageIdx(d.k);
}

const CUES = {chorus:'후렴', again:'한 번 더', bridge:'브릿지', end:'엔딩'};
let cueT;
function showCue(c) {
  const el = $('#cueCard'); el.textContent = CUES[c] || c; el.hidden = false;
  el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  clearTimeout(cueT); cueT = setTimeout(() => el.hidden = true, 2600);
}
$('#cueRow').addEventListener('click', e => {
  const b = e.target.closest('[data-cue]'); if (!b) return;
  showCue(b.dataset.cue);
  if (SY.role === 'leader') SY.conns.forEach(c => { try { c.send({t:'cue', c:b.dataset.cue}); } catch (x) {} });
});

/* ---- 화면 ---- */
function syncSection(p) {
  const isLeader = SY.role === 'leader' && SY.projId === p.id, isMember = SY.role === 'member' && SY.projId === p.id;
  const c = p.ctl, t = (k, label, sub) => `<button type="button" class="tg" data-act="ctlTgl" data-k="${k}" role="switch" aria-checked="${!!c[k]}"${k !== 'on' && !c.on ? ' disabled' : ''}><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><span class="sw"></span></button>`;
  const names = Object.values(SY.members);
  return `<div class="sec-t">팀 연결 (다른 기기와 같이 맞추기)</div>
    ${isLeader ? `<div class="librow"><span class="nm"><b style="font-family:var(--f-num);font-size:34px;letter-spacing:.12em">${SY.code}</b><small>참여 코드 · ${names.length ? names.length + '명: ' + esc(names.join(', ')) : '아직 들어온 사람 없음'}</small></span><button type="button" class="danger" data-act="syncClose">세션 닫기</button></div>
      <p class="note">다른 기기에서 홈 → 팀 연결 → 이 코드를 넣으면 이 콘티(곡·BPM·악보)를 받아요. 인터넷(데이터) 연결이 필요해요.</p>`
    : isMember ? `<div class="librow"><span class="nm"><b>리더: ${esc(SY.leader)}</b><small>코드 ${SY.code} · 연결됨 · 시계 차이 ${Math.round(SY.rtt / 2)}ms 이내로 맞춤</small></span><button type="button" class="danger" data-act="syncClose">나가기</button></div>`
    : p.linked ? `<p class="note">리더 ${esc(p.linked.leader)}에게서 받은 콘티예요. 다시 연결하려면 홈 → 팀 연결.</p>`
    : `<button type="button" class="pill" data-act="syncHost" style="align-self:flex-start">리더로 열기</button>`}
    <div class="sec-t" style="margin-top:2px">리더가 제어할 것 ${isMember ? '(리더 설정을 받아요)' : ''}</div>
    ${t('on', '리더 제어 전체', '끄면 참여 기기가 아무것도 따라가지 않아요')}
    ${t('start', '시작·정지 (박 맞춰 동시에)')}
    ${t('song', '곡 이동')}
    ${t('page', '악보 넘김')}
    ${t('bpm', 'BPM 변경')}
    ${t('cue', '큐 카드 (후렴·한 번 더·브릿지·엔딩)')}
    <p class="note">곡마다 따로 정하려면 곡 편집 → "같이 맞출 때 이 곡은 리더를".</p>`;
}
H.ctlTgl = b => {
  const p = pmProj(), k = b.dataset.k; p.ctl[k] = !p.ctl[k]; save(); rerenderPM();
  if (SY.role === 'leader' && SY.projId === p.id) sendProj();
};
H.syncHost = async () => {
  const p = pmProj(); busy('세션 여는 중…');
  try { const code = await syncHost(p.id); busy(''); rerenderPM(); toast(`참여 코드 ${code}`); }
  catch (e) { busy(''); toast(e && e.type === 'network' || e && e.type === 'timeout' ? '인터넷 연결을 확인해 주세요' : '세션을 열지 못했어요'); }
};
H.syncClose = () => { syncLeave(); };
$('#bJoin').onclick = () => {
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><button class="txtbtn" data-act="close">취소</button><h2>같이 맞추기 참여</h2><button class="txtbtn strong" data-act="doJoin">참여</button></div>
  <div class="sh-body">
    ${SY.role ? `<p class="note">지금 ${SY.role === 'leader' ? '리더 세션(' + SY.code + ')을 열고' : '세션(' + SY.code + ')에 참여하고'} 있어요. 새로 참여하면 끊어져요.</p>` : ''}
    <label class="fld"><span>리더의 참여 코드 (숫자 4자리)</span><input id="joinCode" type="text" inputmode="numeric" maxlength="4" placeholder="1234" autocomplete="off" style="font-family:var(--f-num);font-size:30px;letter-spacing:.2em;text-align:center"></label>
    <label class="fld"><span>내 이름 (리더 화면에 보여요)</span><input id="joinName" type="text" maxlength="20" value="${esc(D.settings.myName)}" placeholder="${esc(myName())}" autocomplete="off"></label>
    <p class="note">리더의 콘티(곡·BPM·악보)를 받아 연동 콘티로 만들어요. 메모·표기는 내 기기에만 남아요.</p>
  </div>`;
  openSheet('join');
  const ci = $('#joinCode'); ci.addEventListener('keydown', e => { if (e.key === 'Enter') H.doJoin(); });
};
H.doJoin = async () => {
  const code = ($('#joinCode').value || '').replace(/\D/g, '');
  const nm = ($('#joinName').value || '').trim(); D.settings.myName = nm; save();
  if (code.length !== 4) { toast('코드 4자리를 넣어 주세요'); return; }
  busy('리더에게 연결하는 중…');
  try {
    await syncJoin(code);
    busy(''); closeSheet(); toast('리더에게 요청했어요 · 리더가 들여보내면 콘티를 받아요');
  } catch (e) {
    busy('');
    toast(e && e.type === 'peer-unavailable' ? '그 코드의 세션을 찾지 못했어요' : e && (e.type === 'network' || e.type === 'timeout') ? '연결하지 못했어요 · 인터넷 연결을 확인해 주세요' : '연결하지 못했어요');
  }
};

/* ================= 콘티 붙여넣기 ================= */
// "1. 주님의 선하심 (G) 72" 같은 줄 → {제목, 키, BPM}. 번호 붙은 줄이 있으면 그것만 곡, 첫 줄 제목은 콘티 이름 후보
function parseConti(text) {
  const lines = String(text || '').split(/\r?\n/).map(l => l.replace(/​/g, '').trim()).filter(Boolean);
  const NUM = /^(?:\d{1,2}\s*[.)\]:．、]|[①-⑳]|[-•·*▶►▷○●])\s*/;
  const numbered = lines.some(l => NUM.test(l));
  let header = ''; const items = [];
  lines.forEach((l, i) => {
    const song = numbered ? NUM.test(l) : !(i === 0 && /콘티|예배|주일|찬양|집회|수련회|\d{1,2}\s*[\/.월]\s*\d{1,2}/.test(l));
    if (!song) { if (!header) header = l.replace(/[<>\[\]【】]/g, '').trim().slice(0, 40); return; }
    let t = l.replace(NUM, ''), key = null, bpm = null;
    const km = t.match(/[(\[（]\s*([A-G](?:[#♯b♭])?m?(?:\s*(?:[-→>~/]|에서)\s*[A-G](?:[#♯b♭])?m?)*)\s*(?:key|키)?\s*[)\]）]/i) || t.match(/(?:^|\s)([A-G](?:[#♯b♭])?m?)\s*(?:key|키)(?=\s|$)/i);
    if (km) { key = km[1].replace(/\s+/g, ''); t = t.replace(km[0], ' '); }
    const bm = t.match(/(?:bpm|♩\s*=?|템포)\s*:?\s*(\d{2,3})/i) || t.match(/(\d{2,3})\s*bpm/i) || t.match(/(?:^|\s|[-/·|])(\d{2,3})\s*$/);
    if (bm && +bm[1] >= 30 && +bm[1] <= 260) { bpm = +bm[1]; t = t.replace(bm[0], ' '); }
    t = t.replace(/\s*[-–—|·/]+\s*$/, '').replace(/\s{2,}/g, ' ').trim();
    if (t) items.push({title:t, key, bpm});
  });
  return {header, items};
}
const normT = t => String(t || '').replace(/[\s\p{P}\p{S}]/gu, '').toLowerCase();
// 예전에 쓴 같은 곡 (제목 기준, 위쪽 콘티 우선)
function findPast(title) {
  const n = normT(title); if (!n) return null;
  for (const p of D.setlists) { const s = p.songs.find(x => normT(x.title) === n); if (s) return s; }
  return null;
}
let PS = null;
function openPaste(text = '') { PS = {text, edits:{}}; renderPaste(); openSheet('paste'); setTimeout(() => { const t = $('#pasteIn'); if (t && !text) t.focus(); }, 250); }
function pasteRows() {
  return parseConti(PS.text).items.map(it => {
    const k = normT(it.title), past = findPast(it.title), e = PS.edits[k] || {};
    return {...it, k, past, on:e.on !== false, bpm:e.bpm || it.bpm || (past && past.bpm) || null};
  });
}
function renderPaste() {
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><button class="txtbtn" data-act="close">취소</button><h2>콘티 붙여넣기</h2><button class="txtbtn strong" data-act="pasteAdd" id="pasteGo">넣기</button></div>
  <div class="sh-body">
    <textarea id="pasteIn" class="inp" placeholder="단톡방 콘티를 그대로 붙여넣으세요&#10;&#10;11/2 주일 2부&#10;1. 주님의 선하심 (G)&#10;2. 은혜 (A) 72">${esc(PS.text)}</textarea>
    <div class="slrows" id="pasteList"></div>
  </div>`;
  $('#pasteIn').addEventListener('input', e => { PS.text = e.target.value; renderPasteList(); });
  renderPasteList();
}
function renderPasteList() {
  const rows = pasteRows(), on = rows.filter(r => r.on).length;
  $('#pasteGo').textContent = on ? `${on}곡 넣기` : '넣기';
  $('#pasteList').innerHTML = rows.length ? rows.map((r, i) => `<div class="prow${r.on ? '' : ' off'}">
      <button type="button" class="pchk" data-act="pasteTog" data-k="${esc(r.k)}" aria-pressed="${r.on}" aria-label="${esc(r.title)} 넣기">${r.on ? '✓' : ''}</button>
      <div style="min-width:0"><b>${i + 1}. ${esc(r.title)}</b><small class="${r.past ? 'past' : ''}">${[r.key ? r.key + '키' : '', r.past ? `지난번 ${r.past.bpm} BPM${r.past.sheet ? ' · 악보' : ''}` : '새 곡'].filter(Boolean).join(' · ')}</small></div>
      <input type="number" inputmode="numeric" min="30" max="260" placeholder="BPM" value="${r.bpm || ''}" data-k="${esc(r.k)}" aria-label="${esc(r.title)} BPM">
    </div>`).join('') : '<p class="note">번호(1. 2. …)가 붙은 줄을 곡으로 읽어요. 괄호 안 키(G)와 줄 끝 숫자(BPM)도 알아서 골라내요.</p>';
  $('#pasteList').querySelectorAll('input').forEach(inp => inp.addEventListener('change', e => { const k = e.target.dataset.k; PS.edits[k] = {...(PS.edits[k] || {}), bpm:clamp(+e.target.value || 0, 0, 260) || null}; }));
}
H.pasteTog = b => { const k = b.dataset.k, cur = PS.edits[k] || {}; PS.edits[k] = {...cur, on:cur.on === false}; renderPasteList(); };
H.pasteAdd = () => {
  const p = curSL(), rows = pasteRows().filter(r => r.on);
  if (!rows.length) { toast('넣을 곡이 없어요'); return; }
  const noBpm = rows.filter(r => !r.bpm).length;
  for (const r of rows) {
    const keyMemo = r.key ? r.key + '키' : '';
    let s;
    if (r.past) {
      const pm = (r.past.memo || '').replace(/^[A-G][#♯b♭]?m?키(\s*·\s*)?/, '');
      s = newSong({...JSON.parse(JSON.stringify(r.past)), id:uid(), title:r.title, bpm:r.bpm || r.past.bpm, memo:[keyMemo, pm].filter(Boolean).join(' · ')});
      if (s.sheet) s.sheet.items.forEach(it => { if (!p.pdfs.includes(it.key) && libOf(it.key)) p.pdfs.push(it.key); });
    } else s = newSong({title:r.title, bpm:r.bpm || 100, memo:keyMemo});
    p.songs.push(s);
  }
  save(); closeSheet(); renderList();
  if (noBpm) toast(`새 곡 ${noBpm}개는 100 BPM으로 넣었어요 · 곡을 눌러 고쳐 주세요`);
};
$('#bPaste').onclick = () => openPaste('');
$('#bPasteEmpty').onclick = () => openPaste('');

/* ================= 이번 주 콘티 링크 ================= */
const SHARE_BASE = 'https://chocotea101.github.io/count-in/';
const shareBase = () => /^(chocotea101\.github\.io|localhost|127\.0\.0\.1)$/.test(location.hostname) ? location.origin + location.pathname : SHARE_BASE;
const b64u = bytes => { let s = ''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64u = str => { const s = atob(str.replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(s, c => c.charCodeAt(0)); };
// 링크 안에 곡 정보를 압축해서 담음 (서버 없음). 앞 글자 1 = deflate, 0 = 압축 안 함
async function packConti(obj) {
  let bytes = new TextEncoder().encode(JSON.stringify(obj)), z = '0';
  if (window.CompressionStream) { try { bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer()); z = '1'; } catch (e) {} }
  return z + b64u(bytes);
}
async function unpackConti(code) {
  if (code.length > 24000) throw 0;   // 콘티 하나로는 나올 수 없는 길이
  let bytes = unb64u(code.slice(1));
  if (code[0] === '1') {
    // 압축 폭탄 방지: 풀다가 400KB를 넘으면 멈춤
    const rd = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader(), parts = []; let n = 0;
    for (;;) { const {done, value} = await rd.read(); if (done) break; n += value.length; if (n > 400000) { rd.cancel(); throw 0; } parts.push(value); }
    bytes = new Uint8Array(n); let o = 0; parts.forEach(x => { bytes.set(x, o); o += x.length; });
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function contiLink(p) {
  const payload = {v:1, id:p.shareFrom || p.id, n:p.name, s:p.songs.map(s => [s.id, s.title, s.bpm, s.num, s.den, s.pulse === 'dotted' ? 1 : 0, s.sub, s.countIn, s.memo || ''])};
  return shareBase() + '#c=' + await packConti(payload);
}
const sigShort = s => s.num === 4 && s.den === 4 ? '' : ` · ${s.num}/${s.den}`;
const contiText = (p, url) => `[카운트인] ${p.name} · ${p.songs.length}곡\n` + p.songs.map((s, i) => `${i + 1}. ${s.title || '제목 없음'} — ${s.bpm} BPM${sigShort(s)}`).join('\n') + `\n\n열기: ${url}`;
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch (e) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (x) {} ta.remove(); return ok; }
}
let SH = null;
H.pmShare = async () => {
  const p = pmProj(); if (!p) return;
  if (!p.songs.length) { toast('보낼 곡이 없어요'); return; }
  const url = await contiLink(p);
  SH = {p, url, text:contiText(p, url)};
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><span></span><h2>콘티 보내기</h2><button class="txtbtn" data-act="close">닫기</button></div>
  <div class="sh-body">
    <div class="qrbox"><canvas id="qrCv"></canvas></div>
    <p class="note" style="text-align:center">리허설 때 이 QR을 보여 주거나, 아래 버튼으로 단톡방에 보내세요.</p>
    <div class="sh-actions" style="padding-top:0"><button type="button" data-act="shShare">공유하기</button><button type="button" data-act="shCopyMsg">메시지 복사</button><button type="button" data-act="shCopyUrl">링크 복사</button></div>
    <div class="librow" style="align-items:flex-start"><span class="nm"><b>${esc(p.name)}</b><small style="white-space:pre-line">${esc(p.songs.map((s, i) => `${i + 1}. ${s.title || '제목 없음'} — ${s.bpm} BPM${sigShort(s)}`).join('\n'))}</small></span></div>
    <p class="note">받은 기기에 같은 콘티가 있으면 새로 만들지 않고 업데이트돼요(그 사람의 메모·악보는 그대로). 악보 PDF는 들어가지 않아요.</p>
  </div>`;
  sheetKind = 'share';
  try {
    const qrcode = await loadScript('vendor/qrcode.js', 'qrcode');
    const qr = qrcode(0, 'L'); qr.addData(url); qr.make();
    const n = qr.getModuleCount(), q = 4, cell = Math.max(3, Math.floor(600 / (n + q * 2))), c = $('#qrCv');
    if (!c) return;
    c.width = c.height = (n + q * 2) * cell; const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#0F1217';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) g.fillRect((x + q) * cell, (y + q) * cell, cell, cell);
  } catch (e) { const b = $('.qrbox'); if (b) b.hidden = true; }
};
H.shShare = async () => {
  const C = window.Capacitor && window.Capacitor.Plugins;
  try {
    if (C && C.Share) { await C.Share.share({title:SH.p.name, text:SH.text}); return; }
    if (navigator.share) { await navigator.share({title:SH.p.name, text:SH.text}); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  if (await copyText(SH.text)) toast('공유를 열 수 없어서 메시지를 복사했어요');
};
H.shCopyMsg = async () => { toast(await copyText(SH.text) ? '메시지를 복사했어요 · 단톡방에 붙여넣으세요' : '복사하지 못했어요'); };
H.shCopyUrl = async () => { toast(await copyText(SH.url) ? '링크를 복사했어요' : '복사하지 못했어요'); };

/* ---- 링크로 받은 콘티 ---- */
let RC = null;
async function handleConti(hash) {
  if (!hash || !hash.startsWith('#c=')) return;
  history.replaceState(history.state || {s:'home'}, '', location.pathname + location.search);
  let d;
  try { d = await unpackConti(hash.slice(3)); if (!d || !Array.isArray(d.s)) throw 0; d.s = d.s.filter(Array.isArray).slice(0, 300); d.n = str(d.n || '받은 콘티', 60); d.id = str(d.id, 40); }
  catch (e) { toast('콘티 링크를 읽지 못했어요 · 링크가 잘렸는지 확인해 주세요'); return; }
  RC = d;
  const mine = D.setlists.find(x => x.id === d.id), same = D.setlists.find(x => x.shareFrom === d.id);
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><button class="txtbtn" data-act="close">닫기</button><h2>콘티를 받았어요</h2><button class="txtbtn strong" data-act="rcvSave">${mine ? '열기' : same ? '업데이트' : '저장'}</button></div>
  <div class="sh-body">
    <div class="librow" style="align-items:flex-start"><span class="nm"><b>${esc(d.n)}</b><small style="white-space:pre-line">${esc(d.s.map((a, i) => `${i + 1}. ${a[1] || '제목 없음'} — ${a[2]} BPM${a[3] === 4 && a[4] === 4 ? '' : ` · ${a[3]}/${a[4]}`}`).join('\n'))}</small></span></div>
    <p class="note">${mine ? '이 기기에서 만든 콘티예요.' : same ? `이미 받은 콘티예요. 업데이트하면 곡 순서·BPM이 바뀌고, 내 메모·악보·표기는 그대로예요.` : '저장하면 이 기기에 콘티로 생겨요. 악보 PDF는 들어 있지 않아요.'}</p>
  </div>`;
  openSheet('receive');
}
H.rcvSave = () => {
  const d = RC; if (!d) return;
  const mine = D.setlists.find(x => x.id === d.id);
  if (mine) { closeSheet(); setTimeout(() => openProject(mine.id), 60); return; }
  const songs = d.s.map(a => cleanSong(newSong({id:a[0], title:a[1], bpm:a[2], num:a[3], den:a[4], pulse:a[5] ? 'dotted' : 'eighth', sub:a[6], countIn:a[7], memo:a[8]})));
  let p = D.setlists.find(x => x.shareFrom === d.id);
  if (p) { p.name = d.n; p.songs = mergeSongs(p.songs, songs); }
  else { p = {id:uid(), shareFrom:d.id, name:d.n, pdfs:[], marks:{}, ctl:{on:true, start:true, song:true, page:true, bpm:true, cue:true}, linked:null, followUI:true, songs}; D.setlists.unshift(p); }
  save(); closeSheet(); renderHome();
  setTimeout(() => openProject(p.id), 60);
};
window.addEventListener('hashchange', () => handleConti(location.hash));

/* ================= 소리·화면 박 맞추기 (블루투스 지연 보정) ================= */
// 보정 화면이 열려 있는 동안 90 BPM 클릭을 내고, 원이 박마다 번쩍임.
// 자동: 들리는 소리에 맞춰 8번 두드리면 "소리가 늦게 들리는 만큼"을 재서 보정값으로.
const CAL = {on:false, start:0, spb:60 / 90, n:0, t:0, raf:0, off:0, errs:[], flashT:0};
function stopCal() { CAL.on = false; clearInterval(CAL.t); cancelAnimationFrame(CAL.raf); }
H.calOpen = () => {
  if (E.playing) stop();
  ensureCtx();
  CAL.off = D.settings.visOffset; CAL.errs = [];
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><button class="txtbtn" data-act="calCancel">취소</button><h2>소리·화면 박 맞추기</h2><button class="txtbtn strong" data-act="calSave">저장</button></div>
  <div class="sh-body">
    <p class="note">실제로 쓸 스피커·이어폰을 연결하고 시작하세요. 지금 클릭이 계속 나오고 있어요.</p>
    ${seg('calPreset', '시작점', [['0', '폰 스피커·유선'], ['-180', '블루투스']], CAL.off === -180 ? '-180' : CAL.off === 0 ? '0' : '')}
    <div class="calviz"><canvas id="calCv"></canvas></div>
    <div class="sec-t">1. 자동으로 맞추기</div>
    <div class="caltap" id="calTap"><b style="font-size:17px">소리가 들리는 순간 두드리세요</b><span class="num" id="calCnt" style="color:var(--mute)">0 / 8</span></div>
    <div class="calres" id="calRes"></div>
    <div class="sec-t">2. 눈으로 확인</div>
    <p class="note">원이 번쩍이는 순간과 클릭 소리가 같이 오면 끝. 원이 먼저 번쩍이면 −, 늦으면 +.</p>
    <div class="bpmedit" style="justify-content:center">
      <button type="button" class="rbtn" data-act="calStep" data-v="-5">−</button>
      <div style="text-align:center;min-width:120px"><div class="num" id="calV" style="font-family:var(--f-num);font-weight:800;font-size:34px"></div><small style="color:var(--mute)">ms</small></div>
      <button type="button" class="rbtn" data-act="calStep" data-v="5">+</button>
    </div>
    <input id="calRange" type="range" min="-300" max="150" step="5">
  </div>`;
  if ($('#shw').hidden) openSheet('calib'); else sheetKind = 'calib';
  const upd = () => { $('#calV').textContent = (CAL.off > 0 ? '+' : '') + CAL.off; $('#calRange').value = CAL.off; };
  CAL.upd = upd; upd();
  $('#calRange').oninput = e => { CAL.off = +e.target.value; upd(); };
  $('#calTap').addEventListener('pointerdown', e => { e.preventDefault(); calTap(e.timeStamp || performance.now()); });
  // 클릭 소리 + 번쩍이는 원
  CAL.on = true; CAL.start = E.ctx.currentTime + .3; CAL.n = 0;
  CAL.t = setInterval(() => {
    if (!CAL.on) return;
    while (CAL.start + CAL.n * CAL.spb < E.ctx.currentTime + .12) { const t = CAL.start + CAL.n * CAL.spb; if (t >= E.ctx.currentTime - .005) click(t, CAL.n % 4 === 0 ? 2 : 1); CAL.n++; }
  }, 25);
  const cv = $('#calCv');
  const frame = () => {
    if (!CAL.on || !cv.isConnected) return;
    const b = (outNow() + FRAME_AHEAD + CAL.off / 1000 - CAL.start) / CAL.spb;
    draw(cv, 'pulse', b < 0 ? 0 : b, 4, {idle:b < 0, subs:1, loud:true});
    CAL.raf = requestAnimationFrame(frame);
  };
  CAL.raf = requestAnimationFrame(frame);
};
function calTap(t) {
  const a = $('#calTap'); a.classList.add('hit'); clearTimeout(CAL.flashT); CAL.flashT = setTimeout(() => a.classList.remove('hit'), 90);
  const tapOut = outNow() - (performance.now() - t) / 1000, k = Math.round((tapOut - CAL.start) / CAL.spb);
  if (k < 1) return;
  CAL.errs.push(tapOut - (CAL.start + k * CAL.spb));
  const used = CAL.errs.slice(2);              // 처음 두 번은 손이 맞춰 가는 중이라 뺌
  $('#calCnt').textContent = `${Math.min(used.length, 8)} / 8`;
  if (used.length < 8) return;
  const sorted = [...used].sort((x, y) => x - y), med = sorted[sorted.length >> 1];
  const spread = sorted[sorted.length - 2] - sorted[1];
  CAL.errs = [];
  if (spread > .12) { $('#calRes').innerHTML = '두드림이 고르지 않아요. 소리에 집중해서 다시 8번 두드려 보세요.'; $('#calCnt').textContent = '0 / 8'; return; }
  const late = Math.round(med * 1000);
  // 사람은 박보다 살짝 먼저 두드리는 편이라, 조금 이른 건 '맞음'으로 봄. 너무 벗어나면 박을 잘못 짚은 것
  if (late > 320 || late < -90) { $('#calRes').innerHTML = '박을 잘못 짚은 것 같아요. 클릭 소리 하나하나에 맞춰 다시 8번 두드려 보세요.'; $('#calCnt').textContent = '0 / 8'; return; }
  CAL.off = late > 15 ? clamp(Math.round(-late / 5) * 5, -300, 150) : 0; CAL.upd();
  $('#calRes').innerHTML = late > 15 ? `소리가 약 <b>${late}ms</b> 늦게 들려요 → <b>${CAL.off}ms</b>로 맞췄어요. 아래 원과 소리가 같이 오는지 확인해 보세요.`
    : `소리가 늦지 않아요 (${late}ms). 보정 없이 <b>0ms</b>로 두었어요.`;
  $('#calCnt').textContent = '다시 하려면 또 두드리세요';
}
H.calStep = b => { CAL.off = clamp(CAL.off + +b.dataset.v, -300, 150); CAL.upd(); };
// 저장·취소하면 설정 화면으로 돌아감 (같은 시트 안에서)
H.calSave = () => { stopCal(); D.settings.visOffset = CAL.off; save(); sheetKind = 'settings'; renderSettings(); };
H.calCancel = () => { stopCal(); sheetKind = 'settings'; renderSettings(); };

/* ================= 8박 박 체크 (참여자용) ================= */
// 준비 4박 뒤 8박 동안 두드림. 판정은 스피커 지연 보정(visOffset)을 빼고, 결과는 말로 격려 (ms는 '자세히'에서만, 기기 밖으로 안 나감)
const CK = {on:false, t:0, raf:0, start:0, spb:.75, n:0, pre:4, len:8, taps:[], done:false, showMs:false, last:null};
function stopCheck() { CK.on = false; clearInterval(CK.t); cancelAnimationFrame(CK.raf); }
function openCheck() {
  if (E.playing) stop();
  ensureCtx();
  const s = song(), bt = (E.ctx.outputLatency || 0) > .1 && !D.settings.visOffset;
  sheet.innerHTML = `<div class="grab"></div>
  <div class="sh-head"><span></span><h2>박 체크</h2><button class="txtbtn" data-act="close">닫기</button></div>
  <div class="sh-body">
    <p class="note">준비 4박 다음, 8박 동안 소리와 원에 맞춰 아래 칸을 두드려요. 점수가 아니라 감을 잡는 연습이에요. 결과는 이 기기에서 나만 봐요.</p>
    ${bt ? `<div class="librow"><span class="nm"><b>블루투스로 듣고 있나요?</b><small>소리가 늦게 나오면 판정이 틀려져요. 먼저 한 번 맞춰 두세요.</small></span><button type="button" data-act="calOpen">맞추러 가기</button></div>` : ''}
    <div class="calviz" style="height:170px"><canvas id="chkCv"></canvas><div class="vizlbl" id="chkLbl" style="font-size:15px;color:var(--text)"></div></div>
    <div class="caltap" id="chkTap" style="height:140px"><b style="font-size:17px" id="chkTapL">시작을 누르세요</b><span class="num" id="chkCnt" style="color:var(--mute)"></span></div>
    <button type="button" class="go" data-act="chkStart" id="chkGo">시작 · ${P.bpm} BPM</button>
    <div id="chkRes" class="sh-body" style="gap:12px"></div>
  </div>`;
  openSheet('check');
  $('#chkTap').addEventListener('pointerdown', e => { e.preventDefault(); chkTap(e.timeStamp || performance.now()); });
  drawCheck(true);
}
function drawCheck(idle) {
  const cv = $('#chkCv'); if (!cv) return;
  const b = idle ? 0 : (outNow() + FRAME_AHEAD + D.settings.visOffset / 1000 - CK.start) / CK.spb;
  draw(cv, 'approach', b < 0 ? 0 : b, 4, {idle:idle || b < 0, subs:1, loud:true, counting:b < CK.pre, targets:[true, true, true, true]});
  const lbl = $('#chkLbl');
  if (lbl) lbl.textContent = idle || b < 0 ? '' : b < CK.pre ? `준비 ${CK.pre - Math.floor(b)}` : b < CK.pre + CK.len ? `${Math.floor(b) - CK.pre + 1} / ${CK.len}` : '';
}
H.chkStart = () => {
  if (CK.on) return;
  ensureCtx();
  CK.spb = 60 / P.bpm; CK.start = E.ctx.currentTime + .4; CK.n = 0; CK.taps = []; CK.done = false; CK.on = true; CK.showMs = false;
  $('#chkRes').innerHTML = ''; $('#chkGo').disabled = true; $('#chkTapL').textContent = '원이 닿을 때 두드리세요'; $('#chkCnt').textContent = '';
  const total = CK.pre + CK.len;
  CK.t = setInterval(() => {
    if (!CK.on) return;
    while (CK.n < total && CK.start + CK.n * CK.spb < E.ctx.currentTime + .12) {
      const t = CK.start + CK.n * CK.spb; if (t >= E.ctx.currentTime - .005) click(t, CK.n % 4 === 0 ? 2 : 1); CK.n++;
    }
    if (CK.n >= total && E.ctx.currentTime > CK.start + total * CK.spb + .4) { stopCheck(); finishCheck(); }
  }, 25);
  const fr = () => { if (!CK.on) return; drawCheck(false); CK.raf = requestAnimationFrame(fr); };
  CK.raf = requestAnimationFrame(fr);
};
function chkTap(t) {
  if (!CK.on) return;
  const a = $('#chkTap'); a.classList.add('hit'); setTimeout(() => a.classList.remove('hit'), 90);
  // 두드린 순간을 '귀에 들린 박'과 같은 시계로: 스피커 지연(visOffset<0이면 소리가 늦음)만큼 당김
  CK.taps.push(outNow() - (performance.now() - t) / 1000 + D.settings.visOffset / 1000);
  const n = CK.taps.filter(x => x > CK.start + (CK.pre - .5) * CK.spb).length;
  $('#chkCnt').textContent = n ? `${Math.min(n, CK.len)} / ${CK.len}` : '';
}
function finishCheck() {
  const tol = Math.max(.045, CK.spb * .09), used = new Set(), cells = [];
  for (let j = 0; j < CK.len; j++) {
    const bt = CK.start + (CK.pre + j) * CK.spb;
    let best = -1, bd = 1e9;
    CK.taps.forEach((x, i) => { const d = Math.abs(x - bt); if (!used.has(i) && d < CK.spb * .5 && d < bd) { bd = d; best = i; } });
    if (best < 0) { cells.push({c:'miss'}); continue; }
    used.add(best);
    const e = CK.taps[best] - bt;
    cells.push({c:Math.abs(e) <= tol ? 'ok' : e < 0 ? 'early' : 'late', e});
  }
  const ok = cells.filter(c => c.c === 'ok').length, hits = cells.filter(c => c.c !== 'miss');
  const early = cells.filter(c => c.c === 'early').length, late = cells.filter(c => c.c === 'late').length, miss = cells.filter(c => c.c === 'miss').length;
  const mean = hits.length ? hits.reduce((a, c) => a + c.e, 0) / hits.length : 0;
  const prev = D.practice.length ? D.practice[D.practice.length - 1] : null;
  D.practice.push({at:new Date().toISOString().slice(0, 10), bpm:P.bpm, ok, song:(song() || {}).title || ''}); save();
  let head, tip;
  if (ok >= 6) { head = `좋아요! 8박 중 ${ok}박이 딱 맞았어요`; tip = '이 느낌 그대로 들어가면 돼요. 원보다 소리를 더 믿어 봐도 좋아요.'; }
  else if (ok >= 3) { head = `${ok}박이 딱 맞았어요`; tip = early > late ? '조금 서두르는 편이에요. 원이 안쪽 원에 닿을 때까지 한 템포 기다렸다 쳐 보세요.' : late > early ? '살짝 늦게 따라오는 편이에요. 원이 다가오는 걸 보면서 미리 손을 준비해 두세요.' : '박을 잘 따라오고 있어요. 한 번 더 하면 더 맞을 거예요.'; }
  else { head = '괜찮아요, 처음엔 다 그래요'; tip = miss >= 4 ? '두드리는 걸 잊어도 괜찮아요. 소리보다 원이 닿는 순간만 보고 쳐 보세요.' : late >= early + 2 ? '소리를 듣고 따라 치느라 조금씩 늦어요. 원이 다가오는 걸 보면서 닿기 직전에 손을 내려 보세요.' : early >= late + 2 ? '마음이 앞서서 조금씩 빨라요. 원이 안쪽 원에 완전히 닿을 때까지 기다려 보세요.' : '소리를 따라가기보다 원이 닿는 순간에 맞춰 보세요. 몇 번 하면 금방 잡혀요.'; }
  const better = prev && ok > prev.ok ? `<p class="chktip" style="color:var(--cue)">지난번(${prev.ok}박)보다 ${ok - prev.ok}박 더 맞았어요.</p>` : '';
  const mark = {ok:['✓', '맞음'], early:['←', '빠름'], late:['→', '느림'], miss:['·', '놓침']};
  $('#chkRes').innerHTML = `<div class="chkhead">${head}</div>
    <div class="chkcells">${cells.map((c, i) => `<div class="chkcell ${c.c}"><i>${mark[c.c][0]}</i>${i + 1}</div>`).join('')}</div>
    <p class="chktip">${tip}</p>${better}
    <div class="row2"><button type="button" class="pill" data-act="chkMs" style="flex:0 0 auto">자세히</button><span></span></div>
    <div class="chkms" id="chkMs" hidden>${cells.map((c, i) => `${i + 1}박 ${c.c === 'miss' ? '–' : (c.e > 0 ? '+' : '') + Math.round(c.e * 1000) + 'ms'}`).join(' · ')}<br>평균 ${mean > 0 ? '+' : ''}${Math.round(mean * 1000)}ms (−는 빠름, +는 느림) · 맞음 기준 ±${Math.round(tol * 1000)}ms${D.settings.visOffset ? ` · 스피커 보정 ${D.settings.visOffset}ms 반영` : ''}</div>`;
  $('#chkGo').disabled = false; $('#chkGo').textContent = '한 번 더'; $('#chkTapL').textContent = '한 번 더 하려면 아래 버튼'; $('#chkCnt').textContent = '';
  drawCheck(true);
}
H.chkMs = () => { const m = $('#chkMs'); if (m) m.hidden = !m.hidden; };
$('#bCheck').onclick = openCheck;

/* ================= 키보드 ================= */
// 키보드가 화면을 줄여 주지 않는 환경(아이폰 사파리, 일부 안드로이드 앱)에서 키보드 높이만큼 창을 올림
(() => {
  const root = document.documentElement;
  let baseH = innerHeight, nativeKb = 0;
  const set = px => root.style.setProperty('--kb', Math.max(0, Math.round(px)) + 'px');
  const calc = () => {
    const vv = window.visualViewport;
    let kb = vv ? innerHeight - vv.height - vv.offsetTop : 0;
    // 앱 키보드 높이: 화면이 이미 그만큼 줄었으면 빼고
    if (nativeKb) kb = Math.max(kb, nativeKb - Math.max(0, baseH - innerHeight));
    set(kb > 60 ? kb : 0);
  };
  window.addEventListener('resize', () => { if (!nativeKb && !(document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))) baseH = innerHeight; calc(); });
  if (window.visualViewport) { visualViewport.addEventListener('resize', calc); visualViewport.addEventListener('scroll', calc); }
  const KB = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Keyboard;
  if (KB) {
    KB.addListener('keyboardDidShow', i => { nativeKb = i.keyboardHeight || 0; calc(); setTimeout(calc, 200); });
    KB.addListener('keyboardDidHide', () => { nativeKb = 0; set(0); });
  }
  // 입력칸을 누르면 창 안에서 그 칸이 보이게
  document.addEventListener('focusin', e => {
    const el = e.target;
    if (!el.matches || !el.matches('input:not([type=range]):not([type=file]),textarea')) return;
    setTimeout(() => { calc(); try { el.scrollIntoView({block:'center', behavior:'smooth'}); } catch (err) {} }, 320);
  });
  document.addEventListener('focusout', () => setTimeout(calc, 120));
})();

// 점검용: 지금 박 위치·BPM 읽기 (화면에는 영향 없음)
// 재생 화면에서 처음 화면을 만지는 순간 오디오를 미리 깨워 둠 → 첫 시작도 바로 (다른 앱 음악을 끊지 않게 재생 화면에서만)
document.addEventListener('pointerdown', () => { if (!$('#scrPlay').hidden && !E.ctx) ensureCtx(); }, true);
window.__countin = {beat:() => beatNow(), bpm:() => P.bpm, offset:() => SY.offset, rtt:() => SY.rtt};

/* ================= 시작 ================= */
layout(); renderHome(); show('home');
if (location.hash.startsWith('#c=')) setTimeout(() => handleConti(location.hash), 300);
history.replaceState({s:'home'}, '');
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') && !window.Capacitor) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
})();
