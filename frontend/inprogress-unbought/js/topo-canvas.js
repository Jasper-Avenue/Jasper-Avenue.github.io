/**
 * topo-canvas.js — Canvas 拓扑三角网格动画
 *
 * 算法：黄金角 (137.508°) 分布顶点 → 简化 Delaunay 三角剖分 → sine 波驱动漂移
 * 动画等级：L3（Canvas 2D，小程序交付时需标注"需开发评估"）
 */
(function() {
  'use strict';

  let _animId = null;

  /**
   * 初始化拓扑 Canvas 动画
   * @param {HTMLCanvasElement} canvas - canvas 元素
   * @returns {function} cleanup 函数
   */
  function initTopoCanvas(canvas) {
    if (!canvas) return function() {};

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    // 黄金角分布顶点，避免规则网格
    var goldenAngle = 137.508 * Math.PI / 180;
    var N = 14;
    var vertices = [];
    for (var i = 0; i < N; i++) {
      var r = Math.sqrt(i / N) * Math.max(W, H) * 0.45;
      var theta = i * goldenAngle;
      vertices.push({
        x: W / 2 + Math.cos(theta) * r,
        y: H / 2 + Math.sin(theta) * r,
        freq: 0.15 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        amp: 3 + Math.random() * 5
      });
    }

    // Delaunay 简化：用距离阈值构建三角形
    function buildTriangles(v) {
      var triangles = [];
      var maxD = Math.max(W, H) * 0.3;
      for (var i = 0; i < v.length; i++) {
        var nearby = [];
        for (var j = 0; j < v.length; j++) {
          if (i === j) continue;
          var d = Math.hypot(v[i].x - v[j].x, v[i].y - v[j].y);
          if (d < maxD) nearby.push({ j: j, d: d });
        }
        nearby.sort(function(a, b) { return a.d - b.d; });
        for (var k = 1; k < Math.min(nearby.length, 3); k++) {
          var a = v[i];
          var b = v[nearby[k - 1].j];
          var c = v[nearby[k].j];
          var area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y));
          if (area > 500) triangles.push([i, nearby[k - 1].j, nearby[k].j]);
        }
      }
      return triangles;
    }

    var triangles = buildTriangles(vertices);
    var colors = [
      'rgba(232,228,220,0.5)',
      'rgba(216,211,203,0.4)',
      'rgba(240,236,228,0.45)'
    ];
    var t = 0;

    function draw() {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      var current = vertices.map(function(v) {
        return {
          x: v.x + Math.sin(t * v.freq + v.phase) * v.amp,
          y: v.y + Math.cos(t * v.freq * 0.7 + v.phase) * v.amp * 0.6
        };
      });

      for (var idx = 0; idx < triangles.length; idx++) {
        var tri = triangles[idx];
        var pa = current[tri[0]];
        var pb = current[tri[1]];
        var pc = current[tri[2]];
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.lineTo(pc.x, pc.y);
        ctx.closePath();
        ctx.fillStyle = colors[idx % colors.length];
        ctx.fill();
      }

      _animId = requestAnimationFrame(draw);
    }

    draw();

    return function cleanup() {
      if (_animId) {
        cancelAnimationFrame(_animId);
        _animId = null;
      }
    };
  }

  // 暴露到全局
  if (typeof window !== 'undefined') {
    window.TopoCanvas = { init: initTopoCanvas };
  }
})();
