// ═══════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════

/**
 * 页面入场动画：给 page-container 添加 class 触发 CSS transition
 */
function initPageEntrance() {
  setTimeout(() => {
    const container = document.querySelector('.page-container');
    if (container) container.classList.add('page-entered');
  }, 50);
}

/**
 * Canvas DPR 适配
 */
function setupCanvas(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
