import { useRef, useEffect } from "react";

export default function NeuralBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let nodes = [];
    let particles = [];

    const mouse = {
      x: -9999,
      y: -9999,
      radius: 140, // slightly increased
    };

    // Balanced settings
    const NODE_COUNT = 60;
    const CONNECTION_DISTANCE = 110;
    const HOVER_DISTANCE = 130;
    const PARTICLE_COUNT = 25;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Node {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.life = 35;
        this.maxLife = 35;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.vx *= 0.97;
        this.vy *= 0.97;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = "#00f5ff";

        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    const init = () => {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(new Node());
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connections
      ctx.strokeStyle = "rgba(0,245,255,0.18)";
      ctx.lineWidth = 0.8;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            ctx.globalAlpha =
              (CONNECTION_DISTANCE - dist) / CONNECTION_DISTANCE;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      // Mouse connections
      ctx.strokeStyle = "rgba(0,255,240,0.7)";
      ctx.lineWidth = 1.2;

      nodes.forEach((node) => {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < HOVER_DISTANCE) {
          ctx.globalAlpha = (HOVER_DISTANCE - dist) / HOVER_DISTANCE;

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;

      // Nodes glow
      ctx.fillStyle = "#00f5ff";
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur = 8;

      nodes.forEach((node) => {
        node.update();
        node.draw();
      });

      ctx.shadowBlur = 0;

      // Particles
      particles = particles.filter((p) => p.life > 0);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    resize();
    init();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        opacity: 0.65, // slightly stronger
      }}
    />
  );
}