const player = { x: 238, y: 278, direction: 3, moving: false, frame: 0, avatar: 'traveler' };
const directions = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right'
};

function canWalk(x, y, obstacles) {
  const radius = 3;
  return x >= 6 && x <= 474 && y >= 8 && y <= 311 &&
    obstacles.every(([left, top, right, bottom]) =>
      x + radius <= left || x - radius >= right ||
      y + radius <= top || y - radius >= bottom);
}

function bindMovement({ canMove, getObstacles, render }) {
  const held = new Map();
  let frameRequest = 0;
  let previousTime = null;
  let walkTime = 0;

  function stop() {
    held.clear();
    cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    previousTime = null;
    if (player.moving) {
      player.moving = false;
      player.frame = 0;
      render();
    }
  }

  function tick(time) {
    frameRequest = 0;
    if (!held.size || !canMove()) return stop();
    const dt = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.04);
    previousTime = time;
    const active = new Set(held.values());
    const dx = Number(active.has('right')) - Number(active.has('left'));
    const dy = Number(active.has('down')) - Number(active.has('up'));
    const speed = 92 * dt / (dx && dy ? Math.SQRT2 : 1);
    const obstacles = getObstacles();
    const oldX = player.x, oldY = player.y;
    if (dx && canWalk(oldX + dx * speed, oldY, obstacles)) player.x += dx * speed;
    if (dy && canWalk(player.x, oldY + dy * speed, obstacles)) player.y += dy * speed;
    if (dx || dy) player.direction = dx ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
    player.moving = player.x !== oldX || player.y !== oldY;
    walkTime = player.moving ? walkTime + dt : 0;
    player.frame = player.moving ? 1 + Math.floor(walkTime * 10) % 2 : 0;
    render();
    frameRequest = requestAnimationFrame(tick);
  }

  function begin(key, direction) {
    held.set(key, direction);
    if (!frameRequest) frameRequest = requestAnimationFrame(tick);
  }

  function release(key) {
    if (held.delete(key) && !held.size) stop();
  }

  window.addEventListener('keydown', event => {
    const direction = directions[event.code];
    if (!direction || !canMove() || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('button, a, input, select, textarea, [contenteditable]')) return;
    event.preventDefault();
    if (!event.repeat) begin(event.code, direction);
  });
  window.addEventListener('keyup', event => release(event.code));
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  document.querySelectorAll('.dpad button').forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (!canMove() || event.button !== 0) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      begin(event.pointerId, button.dataset.dir);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(type, event => release(event.pointerId));
    }
  });
  return stop;
}
