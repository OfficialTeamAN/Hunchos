import React, { useEffect, useRef } from "react";

export default function HeroCanvasBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");

    const COLS = 40;
    const ROWS = 25;
    const NUM_PARTICLES = 1600;

    let animationFrame;

    const gridU = new Float32Array(COLS * ROWS);
    const gridV = new Float32Array(COLS * ROWS);

    const particles = [];

    const mouse = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      vx: 0,
      vy: 0,
      active: false,
      moved: false,
    };

    const sweep = {
      active: false,
      t: 0,
      speed: 0.02,
      p0: { x: 0, y: 0 },
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 },
      lastX: 0,
      lastY: 0,
    };

    let lastMouseTime = Date.now();
    let idleDelay = 1500;

    let w = 0;
    let h = 0;

    const initParticle = (p) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;

      p.px = p.x;
      p.py = p.y;

      p.vx = 0;
      p.vy = 0;

      p.speed = 0.5 + Math.random() * 1.5;
      p.life = 100 + Math.random() * 200;
      p.thickness = 1 + Math.random() * 1.5;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();

      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      w = rect.width;
      h = rect.height;

      particles.length = 0;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = {};
        initParticle(p);
        particles.push(p);
      }
    };

    const injectVelocity = (
      targetX,
      targetY,
      vx,
      vy,
      radiusMultiplier = 1
    ) => {
      const cellW = w / COLS;
      const cellH = h / ROWS;

      const mc = Math.floor(targetX / cellW);
      const mr = Math.floor(targetY / cellH);

      const radius = Math.round(3 * radiusMultiplier);

      for (let r = -radius; r <= radius; r++) {
        for (let c = -radius; c <= radius; c++) {
          const col = mc + c;
          const row = mr + r;

          if (
            col >= 0 &&
            col < COLS &&
            row >= 0 &&
            row < ROWS
          ) {
            const idx = row * COLS + col;

            const dist = Math.hypot(c, r);

            if (dist < radius) {
              const force = 1 - dist / radius;

              gridU[idx] += vx * force * 0.12;
              gridV[idx] += vy * force * 0.12;

              const swirl = 0.32;

              gridU[idx] +=
                -r *
                force *
                swirl *
                Math.hypot(vx, vy);

              gridV[idx] +=
                c *
                force *
                swirl *
                Math.hypot(vx, vy);
            }
          }
        }
      }
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();

      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      lastMouseTime = Date.now();

      sweep.active = false;

      if (mouse.active) {
        mouse.vx = mouse.x - mouse.px;
        mouse.vy = mouse.y - mouse.py;
        mouse.moved = true;
      } else {
        mouse.active = true;
      }

      mouse.px = mouse.x;
      mouse.py = mouse.y;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const draw = () => {
      const now = Date.now();

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(7,7,8,0.022)";
      ctx.fillRect(0, 0, w, h);

      if (Math.random() < 0.22) {
        const c = Math.floor(Math.random() * COLS);
        const idx = (ROWS - 1) * COLS + c;

        gridV[idx] = -3.5 - Math.random() * 4;
        gridU[idx] = (Math.random() - 0.5) * 1.5;
      }

      if (
        !mouse.active &&
        now - lastMouseTime > idleDelay
      ) {
        if (!sweep.active) {
          sweep.active = true;

          sweep.t = 0;
          sweep.speed =
            0.01 + Math.random() * 0.015;

          sweep.p0 = {
            x: Math.random() * w,
            y: Math.random() * h,
          };

          sweep.p1 = {
            x: Math.random() * w,
            y: Math.random() * h,
          };

          sweep.p2 = {
            x: Math.random() * w,
            y: Math.random() * h,
          };

          sweep.lastX = sweep.p0.x;
          sweep.lastY = sweep.p0.y;
        }

        sweep.t += sweep.speed;

        if (sweep.t >= 1) {
          sweep.active = false;
          lastMouseTime = Date.now();
          idleDelay = 1000 + Math.random() * 3000;
        } else {
          const t = sweep.t;
          const mt = 1 - t;

          const x =
            mt * mt * sweep.p0.x +
            2 * mt * t * sweep.p1.x +
            t * t * sweep.p2.x;

          const y =
            mt * mt * sweep.p0.y +
            2 * mt * t * sweep.p1.y +
            t * t * sweep.p2.y;

          const vx = x - sweep.lastX;
          const vy = y - sweep.lastY;

          injectVelocity(x, y, vx, vy, 1.2);

          sweep.lastX = x;
          sweep.lastY = y;
        }
      }

      if (mouse.active && mouse.moved) {
        injectVelocity(
          mouse.x,
          mouse.y,
          mouse.vx,
          mouse.vy
        );

        mouse.moved = false;
      }

      const tempU = new Float32Array(gridU.length);
      const tempV = new Float32Array(gridV.length);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;

          const left = c > 0 ? i - 1 : i;
          const right = c < COLS - 1 ? i + 1 : i;
          const up = r > 0 ? i - COLS : i;
          const down = r < ROWS - 1 ? i + COLS : i;

          tempU[i] =
            (gridU[i] * 0.88 +
              (gridU[left] +
                gridU[right] +
                gridU[up] +
                gridU[down]) *
              0.03) *
            0.95;

          tempV[i] =
            (gridV[i] * 0.88 +
              (gridV[left] +
                gridV[right] +
                gridV[up] +
                gridV[down]) *
              0.03) *
            0.95;
        }
      }

      gridU.set(tempU);
      gridV.set(tempV);

      ctx.globalCompositeOperation =
        "destination-out";

      ctx.lineCap = "round";

      const cellW = w / COLS;
      const cellH = h / ROWS;

      for (const p of particles) {
        const col = Math.floor(p.x / cellW);
        const row = Math.floor(p.y / cellH);

        let tvx = 0;
        let tvy = 0;

        if (
          col >= 0 &&
          col < COLS &&
          row >= 0 &&
          row < ROWS
        ) {
          const idx = row * COLS + col;

          tvx = gridU[idx];
          tvy = gridV[idx];
        }

        p.vx = p.vx * 0.92 + tvx * 0.08;
        p.vy = p.vy * 0.92 + tvy * 0.08;

        p.vx += (Math.random() - 0.5) * 0.03;
        p.vy += (Math.random() - 0.5) * 0.03;

        p.px = p.x;
        p.py = p.y;

        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        p.life--;

        const speed = Math.hypot(p.vx, p.vy);
        const alpha = Math.min(
          1,
          p.life / 30
        );

        ctx.strokeStyle =
          `rgba(255,255,255,${alpha * (0.32 + speed * 0.28)
          })`;

        ctx.lineWidth =
          p.thickness *
          (1 + speed * 0.45);

        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (
          p.x < 0 ||
          p.x > w ||
          p.y < 0 ||
          p.y > h ||
          p.life <= 0
        ) {
          initParticle(p);
        }
      }

      animationFrame =
        requestAnimationFrame(draw);
    };

    resize();

    window.addEventListener("resize", resize);
    container.addEventListener(
      "mousemove",
      handleMouseMove
    );
    container.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    draw();

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      container.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      container.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 w-full h-full pointer-events-auto overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
        style={{
          filter: "blur(5px) contrast(1.5)",
          transform: "scale(1.02)",
        }}
      />
    </div>
  );
}