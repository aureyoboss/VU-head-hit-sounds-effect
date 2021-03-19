const w = window.innerWidth;
const h = window.innerHeight;

var soundNumberPlay = 0;

window.MyGlobalFunction = function(data) {
  soundNumberPlay = data;
};

const config = {
  fps: 60,
  canvasSize: Math.floor(Math.min(w / 2, h / 2)),
  maxMult: 120,
  baseMs: 800,
  randMs: 300,
  minFontSize: 3.8,
  maxFontSize: 5,
  minDamageThreshold: 16,
  maxDamageThreshold: 42,
  fadeOutMs: 200,
};

const canvas = document.getElementById("hithead");
canvas.width = config.canvasSize;
canvas.height = config.canvasSize;
const ctx = canvas.getContext("2d");

function playSound(file) {
  const audio = document.createElement("audio");
  audio.src = file;
  audio.autoplay = true;
  audio.controls = false;
  audio.addEventListener("complete", () => audio.remove());

  document.body.appendChild(audio);
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playHeadshot() {
  playSound('/sounds/' + soundNumberPlay + '.mp3');
}

function getFontSize(damage, isHeadshot) {
  damage = Math.min(
    config.maxDamageThreshold,
    Math.max(config.minDamageThreshold, damage)
  );
  const prc =
    1 -
    (config.maxDamageThreshold - damage) /
      (config.maxDamageThreshold - config.minDamageThreshold);
  const fontSize =
    config.minFontSize + prc * (config.maxFontSize - config.minFontSize);

  return `${fontSize * (isHeadshot ? 1.2 : 1)}vh`;
}

function drawStroked(damage, x, y, isHeadshot, timeLeft) {
  const alpha = Math.min(timeLeft / config.fadeOutMs, 1.0);

  ctx.font = `${getFontSize(damage, isHeadshot)} big_noodle_titling`;
  ctx.fillStyle = isHeadshot ? `rgba(255, 0, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
  
  if (isHeadshot) ctx.fillText('Head hit', x, y);
}

class HitEffect {
  constructor(damage, isHeadshot = false) {
    this.damage = damage;
    this.isHeadshot = isHeadshot;
    this.slopeVector = this.randomSlopeVector();
    this.startMs = Date.now();
    this.endMs = this.randomEndMs();
  }

  randomSlopeVector() {
    const degrees = 10 + Math.floor(Math.random() * 70);
    const rads = (degrees * Math.PI) / 180;
    return [Math.cos(rads), Math.sin(rads)];
  }

  randomEndMs() {
    const randomMs = Math.floor(Math.random() * config.randMs) * (this.isHeadshot ? 1.4 : 1);
    return this.startMs + config.baseMs + randomMs;
  }

  getCoordinates() {
    const prc = (Date.now() - this.startMs) / (this.endMs - this.startMs);
    const mult = 1 + d3.easeExpOut(prc) * config.maxMult;
    return this.slopeVector.map(
      (n, i) => i * config.canvasSize + (1 + i * -2) * (n * mult)
    );
  }

  draw() {
    const [x, y] = this.getCoordinates();
    drawStroked(
      this.damage,
      x,
      y - 100,
      this.isHeadshot,
      this.endMs - Date.now()
    );
  }
}

let hits = [];

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (hits.length < 1) return;

  hits = hits.filter((hit) => Date.now() <= hit.endMs);
  hits.forEach((hit) => hit.draw());
}

function addHit(damage, isHeadshot) {
  if (damage <= 1) return;
  
  if (isHeadshot) playHeadshot();
  
  hits.push(new HitEffect(damage, isHeadshot));
}

setInterval(updateCanvas, 1000 / config.fps);