/* Background music for every page.
   1) Put your song in the same folder as the pages and name it song.mp3
      (or change SONG below).
   2) Every page loads this file with:  <script src="music.js"></script>
*/
(function () {
  var SONG = "song.mpeg";   // your song file name
  var VOLUME = 0.6;        // 0 (silent) to 1 (full)
  var KEY = "bd_music_v1";

  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  var muted = !!saved.muted, ducked = false, started = false, ready = false;

  var a = new Audio();
  a.src = SONG; a.loop = true; a.preload = "auto"; a.volume = 0;

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ t: a.currentTime || saved.t || 0, muted: muted })); } catch (e) {}
  }

  // ---- floating mute button ----
  var b = document.createElement("button");
  b.type = "button"; b.setAttribute("aria-label", "Music on or off");
  b.style.cssText = "position:fixed;z-index:60;top:calc(env(safe-area-inset-top,0px) + 10px);right:10px;width:42px;height:42px;border-radius:50%;" +
    "border:1.5px solid rgba(240,217,154,.75);background:rgba(43,10,16,.55);color:#f0d99a;font-size:19px;line-height:1;cursor:pointer;" +
    "backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:0;-webkit-tap-highlight-color:transparent";
  function icon() { b.textContent = muted ? "\uD83D\uDD07" : "\uD83C\uDFB5"; b.style.opacity = muted ? ".65" : "1"; }
  icon();
  b.addEventListener("click", function (e) {
    e.stopPropagation();
    muted = !muted; icon(); save();
    if (muted) { fadeTo(0, 250, function () { a.pause(); }); }
    else { play(); }
  });
  function addBtn() { if (document.body) document.body.appendChild(b); else addEventListener("DOMContentLoaded", addBtn); }
  addBtn();

  // ---- volume fading ----
  var fadeT;
  function fadeTo(v, ms, done) {
    clearInterval(fadeT);
    var from = a.volume, steps = Math.max(1, ms / 40), i = 0;
    fadeT = setInterval(function () {
      i++; a.volume = Math.min(1, Math.max(0, from + (v - from) * (i / steps)));
      if (i >= steps) { clearInterval(fadeT); a.volume = v; if (done) done(); }
    }, 40);
  }

  function play() {
    if (muted || ducked) return;
    var p = a.play();
    if (p && p.then) p.then(function () { started = true; fadeTo(VOLUME, 1200); }).catch(function () { started = false; });
  }

  // resume where the last page left off
  // a.addEventListener("loadedmetadata", function () {
  //   ready = true;
  //   if (saved.t && isFinite(a.duration) && saved.t < a.duration - 1) { try { a.currentTime = saved.t; } catch (e) {} }
  //   play();
  // });
  // a.addEventListener("error", function () { b.remove(); });   // no song file found -> hide the button
  // if (a.readyState >= 1) { ready = true; }

  // resume where the last page left off
a.addEventListener("loadedmetadata", function () {
  ready = true;
  if (saved.t && isFinite(a.duration) && saved.t < a.duration - 1) { try { a.currentTime = saved.t; } catch (e) {} }
  play();                       // try autoplay as soon as the file is ready
});
a.addEventListener("canplay", function () { if (!started) play(); });
a.addEventListener("error", function () { b.remove(); });
if (a.readyState >= 1) { ready = true; }

// 1) try to autoplay immediately on load (works if the browser allows it)
play();

// 2) if blocked, start on the very first tap / click / key / touch
var evs = ["pointerdown", "pointerup", "touchstart", "touchend", "mousedown", "click", "keydown"];
function onGesture() { if (!started) play(); }
function off() { evs.forEach(function (n) { removeEventListener(n, onGesture, true); }); }
evs.forEach(function (n) { addEventListener(n, onGesture, true); });
a.addEventListener("playing", function () { started = true; off(); });

  // browsers block sound until the first tap, so wait for it
  function onGesture() { if (!started) play(); if (started) off(); }
  var evs = ["pointerup", "touchend", "click", "keydown"];
  function off() { evs.forEach(function (n) { removeEventListener(n, onGesture, true); }); }
  evs.forEach(function (n) { addEventListener(n, onGesture, true); });

  setInterval(function () { if (!a.paused) save(); }, 500);
  addEventListener("pagehide", save);
  addEventListener("beforeunload", save);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { a.pause(); save(); } else if (started) { play(); }
  });

  // other pages can pause the music for a moment (the candle page uses this while it listens to the mic)
  window.BDMusic = {
    duck: function (on) {
      ducked = !!on;
      if (on) { fadeTo(0, 300, function () { a.pause(); }); } else { play(); }
    }
  };
})();