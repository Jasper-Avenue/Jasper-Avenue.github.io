/**
 * 活动入口弹窗 - 动画逻辑 v2
 *
 * 动画序列：
 * 1. 0ms    - overlay 淡入，信封弹入
 * 2. 800ms  - 火漆印缩小消失
 * 3. 1000ms - 丝带淡出
 * 4. 1300ms - 翻盖往后翻 + mask渐隐
 * 5. 2200ms - 信件往上抽出（translateY -110px）
 * 6. 3000ms - 闪烁粒子效果
 */
(function () {
  'use strict';

  var overlay = document.getElementById('popupOverlay');
  var wrapper = document.getElementById('envelopeWrapper');

  if (!overlay || !wrapper) return;

  function playAnimation() {
    // Phase 1: Show overlay + envelope entrance
    requestAnimationFrame(function () {
      overlay.classList.add('visible');
    });

    // Phase 2: Wax seal pops away
    setTimeout(function () {
      var seal = document.getElementById('waxSeal');
      if (seal) seal.classList.add('popped');
    }, 800);

    // Phase 3: Ribbon fades
    setTimeout(function () {
      wrapper.classList.add('opened');
    }, 1300);

    // Phase 4: Sparkle particles
    setTimeout(function () {
      spawnSparkles();
    }, 3000);
  }

  /**
   * 生成闪烁粒子
   */
  function spawnSparkles() {
    var container = document.getElementById('sparkleContainer');
    if (!container) return;

    var count = 14;
    for (var i = 0; i < count; i++) {
      (function (index) {
        setTimeout(function () {
          var sparkle = document.createElement('div');
          sparkle.className = 'sparkle';

          // 围绕信封中心散发
          var angle = (index / count) * Math.PI * 2;
          var radius = 55 + Math.random() * 75;
          var cx = 180 + Math.cos(angle) * radius;
          var cy = 140 + Math.sin(angle) * radius;

          sparkle.style.left = cx + 'px';
          sparkle.style.top = cy + 'px';
          sparkle.style.setProperty('--dx', (Math.random() * 20 - 10) + 'px');
          sparkle.style.setProperty('--dy', (Math.random() * 20 - 10) + 'px');

          container.appendChild(sparkle);

          requestAnimationFrame(function () {
            sparkle.classList.add('animate');
          });

          setTimeout(function () {
            if (sparkle.parentNode) {
              sparkle.parentNode.removeChild(sparkle);
            }
          }, 1600);
        }, index * 70);
      })(i);
    }
  }

  // Auto-play on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(playAnimation, 300);
    });
  } else {
    setTimeout(playAnimation, 300);
  }

  // CTA button click
  var ctaBtn = document.getElementById('ctaButton');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function () {
      overlay.classList.remove('visible');
    });
  }

  // Secondary link click
  var secondaryLink = document.getElementById('secondaryLink');
  if (secondaryLink) {
    secondaryLink.addEventListener('click', function () {
      overlay.classList.remove('visible');
    });
  }
})();
