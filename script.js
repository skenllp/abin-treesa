var WA_NUMBER = ""; // SET ME: couple's WhatsApp number with country code, no + or spaces, e.g. 919876543210

function $(i) {
  return document.getElementById(i);
}

// Background Music Engine
var bgMusic = $("bg-music");
var musicToggle = $("music-toggle");
var wasPlayingBeforeHidden = false;
var userManuallyPaused = false;
var hasOpened = false;

function updateMusicUI(playing) {
  if (!musicToggle) return;
  var playIcon = musicToggle.querySelector(".music-icon-play");
  var pauseIcon = musicToggle.querySelector(".music-icon-pause");
  if (playing) {
    musicToggle.classList.add("playing");
    musicToggle.setAttribute("aria-label", "Pause background music");
    musicToggle.setAttribute("title", "Pause music");
    if (playIcon) playIcon.style.display = "block";
    if (pauseIcon) pauseIcon.style.display = "none";
  } else {
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-label", "Play background music");
    musicToggle.setAttribute("title", "Play music");
    if (playIcon) playIcon.style.display = "none";
    if (pauseIcon) pauseIcon.style.display = "block";
  }
}

function startMusic() {
  if (!bgMusic) return;
  if (musicToggle) {
    musicToggle.style.display = "flex";
  }
  bgMusic.volume = 0.75;
  var promise = bgMusic.play();
  if (promise !== undefined) {
    promise
      .then(function () {
        updateMusicUI(true);
      })
      .catch(function (err) {
        console.warn("Background music play prevented or pending interaction:", err);
        updateMusicUI(false);
      });
  }
}

function pauseMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  updateMusicUI(false);
}

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    userManuallyPaused = false;
    startMusic();
  } else {
    userManuallyPaused = true;
    pauseMusic();
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
}

if (bgMusic) {
  bgMusic.addEventListener("play", function () {
    updateMusicUI(true);
  });
  bgMusic.addEventListener("pause", function () {
    updateMusicUI(false);
  });
}

// Stop / pause audio when the tab or browser is closed, hidden, or minimized
document.addEventListener("visibilitychange", function () {
  if (!bgMusic) return;
  if (document.hidden) {
    // When the browser window is minimized or tab is hidden, stop/pause audio
    if (!bgMusic.paused) {
      wasPlayingBeforeHidden = true;
      pauseMusic();
    }
  } else {
    // When tab/browser is restored, resume playing if it was playing before minimize and wasn't manually paused
    if (hasOpened && wasPlayingBeforeHidden && !userManuallyPaused) {
      wasPlayingBeforeHidden = false;
      startMusic();
    }
  }
});

// Stop audio on tab/browser close or navigation
window.addEventListener("pagehide", function () {
  if (bgMusic && !bgMusic.paused) {
    pauseMusic();
  }
});

window.addEventListener("beforeunload", function () {
  if (bgMusic && !bgMusic.paused) {
    pauseMusic();
  }
});

function openInv() {
  hasOpened = true;
  var cover = $("cover");
  if (cover) cover.classList.add("open");
  document.body.classList.remove("lock");
  startMusic();
  setTimeout(function () {
    if (cover) cover.style.display = "none";
    initScratch();
  }, 1250);
}

// Falling petals animation in hero
var h = document.getElementById("top");
if (h) {
  for (var i = 0; i < 14; i++) {
    var p = document.createElement("i");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 8 + "s";
    p.style.animationDelay = -Math.random() * 12 + "s";
    h.appendChild(p);
  }
}

// Live Countdown
var t = new Date("2026-11-28T11:00:00+05:30");
function tick() {
  var s = Math.max(0, ((t - new Date()) / 1000) | 0);
  var q = [
    [86400, "Days"],
    [3600, "Hrs"],
    [60, "Min"],
    [1, "Sec"]
  ];
  var cd = $("cd");
  if (cd) {
    cd.innerHTML = q
      .map(function (x) {
        var v = Math.floor(s / x[0]);
        s -= v * x[0];
        return "<div><b>" + v + "</b><small>" + x[1] + "</small></div>";
      })
      .join("");
  }
}
tick();
setInterval(tick, 1000);

// Scratch Card Engine & Dual Confetti Poppers
var cv = $("cv"),
  cx,
  down = false,
  done = false,
  lastX = 0,
  lastY = 0,
  lastCheck = 0;

function initScratch() {
  if (!cv) return;
  var scEl = $("sc");
  if (!scEl) return;
  var b = scEl.getBoundingClientRect();
  cv.width = b.width;
  cv.height = b.height;
  cx = cv.getContext("2d", { willReadFrequently: true });
  var g = cx.createLinearGradient(0, 0, b.width, b.height);
  g.addColorStop(0, "#e6d5a3");
  g.addColorStop(0.5, "#b89a5a");
  g.addColorStop(1, "#d9c58f");
  cx.fillStyle = g;
  cx.fillRect(0, 0, b.width, b.height);
  cx.fillStyle = "#6e0f25";
  cx.textAlign = "center";
  cx.font = "30px 'Pinyon Script',cursive";
  cx.fillText("Scratch here ✦", b.width / 2, b.height / 2 + 8);
}

function getPointerPos(e) {
  var r = cv.getBoundingClientRect();
  var clientX =
    e.clientX !== undefined
      ? e.clientX
      : e.touches
      ? e.touches[0].clientX
      : 0;
  var clientY =
    e.clientY !== undefined
      ? e.clientY
      : e.touches
      ? e.touches[0].clientY
      : 0;
  return { x: clientX - r.left, y: clientY - r.top };
}

function scratchBrush(x, y) {
  if (done || !cx) return;
  cx.save();
  cx.globalCompositeOperation = "destination-out";
  cx.lineWidth = 50;
  cx.lineCap = "round";
  cx.lineJoin = "round";
  cx.beginPath();
  if (lastX && lastY) {
    cx.moveTo(lastX, lastY);
    cx.lineTo(x, y);
    cx.stroke();
  } else {
    cx.arc(x, y, 25, 0, Math.PI * 2);
    cx.fill();
  }
  cx.restore();
  lastX = x;
  lastY = y;
}

function onPointerDown(e) {
  if (done) return;
  if (e.cancelable) e.preventDefault();
  down = true;
  if (cv.setPointerCapture && e.pointerId) {
    try {
      cv.setPointerCapture(e.pointerId);
    } catch (_) {}
  }
  var p = getPointerPos(e);
  lastX = p.x;
  lastY = p.y;
  scratchBrush(p.x, p.y);
}

function onPointerMove(e) {
  if (!down || done) return;
  if (e.cancelable) e.preventDefault();
  var p = getPointerPos(e);
  scratchBrush(p.x, p.y);
  checkCleared();
}

function onPointerUp(e) {
  if (!down) return;
  down = false;
  lastX = 0;
  lastY = 0;
  if (cv.releasePointerCapture && e && e.pointerId) {
    try {
      cv.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }
  checkCleared();
}

function checkCleared() {
  if (done || !cx) return;
  var now = Date.now();
  if (now - lastCheck < 100) return;
  lastCheck = now;
  try {
    var d = cx.getImageData(0, 0, cv.width, cv.height).data;
    var clear = 0,
      tot = 0;
    for (var i = 3; i < d.length; i += 16) {
      tot++;
      if (d[i] < 128) clear++;
    }
    if (clear / tot >= 0.5) reveal();
  } catch (_) {}
}

function triggerDualPartyPoppers() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  var duration = 2000;
  var end = Date.now() + duration;
  var colors = [
    "#6e0f25",
    "#8e1a35",
    "#cdb98a",
    "#d4af37",
    "#ffd700",
    "#f4ecd2",
    "#ffffff"
  ];
  function frame() {
    if (typeof window.confetti === "function") {
      var leftCount = Math.floor(Math.random() * 2) + 3;
      var rightCount = Math.floor(Math.random() * 2) + 3;
      window.confetti({
        particleCount: leftCount,
        angle: 60,
        spread: 55,
        startVelocity: 55,
        gravity: 0.9,
        ticks: 200,
        origin: { x: 0, y: 0.65 },
        colors: colors,
        shapes: ["square", "circle"],
        scalar: Math.random() * 0.4 + 0.8,
        disableForReducedMotion: true
      });
      window.confetti({
        particleCount: rightCount,
        angle: 120,
        spread: 55,
        startVelocity: 55,
        gravity: 0.9,
        ticks: 200,
        origin: { x: 1, y: 0.65 },
        colors: colors,
        shapes: ["square", "circle"],
        scalar: Math.random() * 0.4 + 0.8,
        disableForReducedMotion: true
      });
    }
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }
  frame();
}

function reveal() {
  if (done) return;
  done = true;
  cv.style.transition = "opacity .6s ease";
  cv.style.opacity = "0";
  cv.style.pointerEvents = "none";
  setTimeout(function () {
    cv.style.display = "none";
  }, 600);
  triggerDualPartyPoppers();
}

if (cv) {
  if (window.PointerEvent) {
    cv.addEventListener("pointerdown", onPointerDown);
    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerup", onPointerUp);
    cv.addEventListener("pointercancel", onPointerUp);
  } else {
    cv.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    cv.addEventListener("touchstart", onPointerDown, { passive: false });
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
  }
}

var scBox = $("sc");
if (scBox) {
  scBox.addEventListener("dblclick", reveal);
}

// RSVP form submission: logs to Google Sheet AND opens WhatsApp
var SHEET_URL =
  "https://script.google.com/macros/s/AKfycbx0CSKIZg_EOiiRe7c8LPgyZcThdAMReNxxAeDjkgo8oTOCrH9BfWTaObxIY4H-JMkBng/exec";

function logRsvp(payload) {
  // no-cors + text/plain avoids a CORS preflight so Apps Script accepts the write
  return fetch(SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
}

var form = $("f");
if (form) {
  form.onsubmit = function (e) {
    e.preventDefault();

    var btn = form.querySelector("button[type=submit]");
    var status = $("rsvp-status");
    var name = $("n").value.trim();
    var attend = $("a").value;
    var guests = $("g").value;
    var message = $("m").value.trim();

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Submitting...";
    }
    if (status) {
      status.style.display = "block";
      status.style.color = "var(--sage)";
      status.textContent = "Sending your RSVP...";
    }

    logRsvp({ name: name, attend: attend, guests: guests, message: message })
      .then(function () {
        if (status) {
          status.style.color = "var(--wine)";
          status.textContent = "✦ Thank you! Your RSVP has been received.";
        }
        form.reset();
      })
      .catch(function () {
        if (status) {
          status.style.color = "var(--wine)";
          status.textContent = "Could not submit right now. Please try again.";
        }
      })
      .then(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Submit RSVP";
        }
      });
  };
}

// Scroll fade-in animations
var io = new IntersectionObserver(
  function (es) {
    es.forEach(function (x) {
      if (x.isIntersecting) x.target.classList.add("v");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".fade").forEach(function (el) {
  io.observe(el);
});
