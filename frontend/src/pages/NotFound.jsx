import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─── Live starfield canvas ─────────────────────────────────── */
function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Stars
    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.4 + 0.05,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Shooting stars
    const shoots = [];
    const spawnShoot = () => {
      shoots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 8 + 6,
        alpha: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
      });
    };

    let frame = 0;
    let raf;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach((s) => {
        const twinkle =
          0.3 + 0.7 * Math.abs(Math.sin(frame * 0.012 + s.twinkleOffset));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.9})`;
        ctx.fill();
      });

      // Shooting stars
      if (frame % 90 === 0) spawnShoot();
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i];
        const tail = {
          x: sh.x - Math.cos(sh.angle) * sh.len,
          y: sh.y - Math.sin(sh.angle) * sh.len,
        };
        const grad = ctx.createLinearGradient(tail.x, tail.y, sh.x, sh.y);
        grad.addColorStop(0, `rgba(103,232,249,0)`);
        grad.addColorStop(1, `rgba(200,230,255,${sh.alpha})`);
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(sh.x, sh.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        sh.x += Math.cos(sh.angle) * sh.speed;
        sh.y += Math.sin(sh.angle) * sh.speed;
        sh.alpha -= 0.015;
        if (sh.alpha <= 0) shoots.splice(i, 1);
      }

      frame++;
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Floating lost spacecraft SVG ──────────────────────────── */
function LostCraft() {
  return (
    <div
      style={{
        animation: "craftDrift 6s ease-in-out infinite",
        filter: "drop-shadow(0 0 22px rgba(103,232,249,0.55))",
        marginBottom: "2rem",
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Engine glow */}
        <ellipse
          cx="60"
          cy="98"
          rx="14"
          ry="5"
          fill="rgba(103,232,249,0.18)"
          style={{ animation: "enginePulse 1.4s ease-in-out infinite" }}
        />
        {/* Thruster flame */}
        <ellipse
          cx="60"
          cy="95"
          rx="5"
          ry="9"
          fill="url(#flameGrad)"
          style={{ animation: "flamePulse 0.7s ease-in-out infinite alternate" }}
        />
        {/* Body */}
        <ellipse cx="60" cy="64" rx="18" ry="32" fill="url(#bodyGrad)" />
        {/* Window */}
        <circle cx="60" cy="52" r="9" fill="url(#windowGrad)" />
        <circle cx="60" cy="52" r="6" fill="rgba(147,210,255,0.55)" />
        <circle cx="57" cy="49" r="2" fill="rgba(255,255,255,0.7)" />
        {/* Wings */}
        <path
          d="M42 72 L30 88 L44 80 Z"
          fill="url(#wingGrad)"
          stroke="rgba(103,232,249,0.4)"
          strokeWidth="0.8"
        />
        <path
          d="M78 72 L90 88 L76 80 Z"
          fill="url(#wingGrad)"
          stroke="rgba(103,232,249,0.4)"
          strokeWidth="0.8"
        />
        {/* Nose */}
        <path d="M60 28 L74 46 L46 46 Z" fill="url(#noseGrad)" />
        {/* Detail lines */}
        <line x1="48" y1="60" x2="48" y2="82" stroke="rgba(103,232,249,0.25)" strokeWidth="0.8" />
        <line x1="72" y1="60" x2="72" y2="82" stroke="rgba(103,232,249,0.25)" strokeWidth="0.8" />

        <defs>
          <linearGradient id="bodyGrad" x1="42" y1="32" x2="78" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c8e6ff" />
            <stop offset="50%" stopColor="#6db8e8" />
            <stop offset="100%" stopColor="#1e3560" />
          </linearGradient>
          <radialGradient id="windowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0f4ff" />
            <stop offset="100%" stopColor="#2a6ea6" />
          </radialGradient>
          <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#3a7bd5" />
            <stop offset="100%" stopColor="#1a2a50" />
          </linearGradient>
          <linearGradient id="noseGrad" x1="60" y1="28" x2="60" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e8f4ff" />
            <stop offset="100%" stopColor="#6db8e8" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="60" y1="86" x2="60" y2="104" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="60%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Signal dots (SOS animation) ───────────────────────────── */
function SignalDots() {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "rgba(103,232,249,0.9)",
            boxShadow: "0 0 10px rgba(103,232,249,0.8)",
            animation: `signalBlink 1.8s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Orbiting debris ring ───────────────────────────────────── */
function OrbitRing() {
  return (
    <div
      style={{
        position: "absolute",
        width: 340,
        height: 340,
        borderRadius: "50%",
        border: "1px solid rgba(103,232,249,0.12)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: "orbitSpin 18s linear infinite",
        pointerEvents: "none",
      }}
    >
      {/* Debris dot */}
      <span
        style={{
          position: "absolute",
          top: -4,
          left: "50%",
          transform: "translateX(-50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "rgba(167,139,250,0.85)",
          boxShadow: "0 0 12px rgba(167,139,250,0.7)",
        }}
      />
    </div>
  );
}

/* ─── Counter-orbit ring ─────────────────────────────────────── */
function OrbitRingOuter() {
  return (
    <div
      style={{
        position: "absolute",
        width: 480,
        height: 480,
        borderRadius: "50%",
        border: "1px solid rgba(148,163,184,0.07)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: "orbitSpin 32s linear infinite reverse",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -3,
          left: "50%",
          transform: "translateX(-50%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "rgba(103,232,249,0.6)",
          boxShadow: "0 0 8px rgba(103,232,249,0.5)",
        }}
      />
    </div>
  );
}

/* ─── Main 404 page ──────────────────────────────────────────── */
const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;
    if (countdown === 0) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, autoRedirect, navigate]);

  return (
    <>
      {/* Keyframe styles injected via style tag */}
      <style>{`
        @keyframes craftDrift {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-22px) rotate(2deg); }
        }
        @keyframes enginePulse {
          0%, 100% { rx: 14; opacity: 0.18; }
          50%       { rx: 18; opacity: 0.38; }
        }
        @keyframes flamePulse {
          0%   { ry: 9; opacity: 0.9; }
          100% { ry: 14; opacity: 0.5; }
        }
        @keyframes signalBlink {
          0%, 80%, 100% { opacity: 0.15; transform: scale(0.8); }
          40%            { opacity: 1;    transform: scale(1.3); }
        }
        @keyframes orbitSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes glitchNum {
          0%, 90%, 100% { clip-path: none; transform: none; text-shadow: 0 0 60px rgba(103,232,249,0.35); }
          91%  { clip-path: inset(10% 0 60% 0); transform: translateX(-6px); text-shadow: 4px 0 0 rgba(167,139,250,0.8); }
          93%  { clip-path: inset(60% 0 5%  0); transform: translateX(6px);  text-shadow: -4px 0 0 rgba(103,232,249,0.8); }
          95%  { clip-path: none; transform: none; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nebulaShift {
          0%   { transform: translate3d(0,0,0) scale(1); }
          50%  { transform: translate3d(0,-12px,0) scale(1.06); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes progressBar {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        .not-found-404 {
          animation: glitchNum 6s ease-in-out infinite;
          font-size: clamp(6rem, 22vw, 14rem);
          font-weight: 100;
          line-height: 1;
          letter-spacing: -0.06em;
          color: #fff;
          margin: 0;
          font-family: "Trebuchet MS", sans-serif;
        }
        .nf-card {
          animation: fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) both;
        }
        .nf-card:nth-child(2) { animation-delay: 0.15s; }
        .nf-card:nth-child(3) { animation-delay: 0.28s; }
        .nf-card:nth-child(4) { animation-delay: 0.40s; }
        .nf-btn {
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .nf-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(0,0,0,0.4);
        }
      `}</style>

      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top, #2a1256 0%, #12071f 40%, #04030a 100%)",
        }}
      >
        {/* Live starfield */}
        <StarCanvas />

        {/* Nebula blobs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-8%",
              top: "15%",
              width: 480,
              height: 480,
              borderRadius: "50%",
              background: "rgba(103,232,249,0.055)",
              filter: "blur(80px)",
              animation: "nebulaShift 14s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "-10%",
              top: "20%",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background: "rgba(167,139,250,0.07)",
              filter: "blur(90px)",
              animation: "nebulaShift 18s ease-in-out infinite reverse",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              left: "30%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.05)",
              filter: "blur(70px)",
              animation: "nebulaShift 22s ease-in-out infinite 3s",
            }}
          />
        </div>

        {/* Orbit rings centered on spacecraft */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <OrbitRing />
          <OrbitRingOuter />
        </div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "2rem 1.5rem",
            maxWidth: 620,
          }}
        >
          {/* Status badge */}
          <div
            className="nf-card"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              padding: "8px 18px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#f87171",
                boxShadow: "0 0 12px rgba(248,113,113,0.8)",
                display: "inline-block",
                animation: "signalBlink 2s ease-in-out infinite",
              }}
            />
            Signal Lost — Sector 404
          </div>

          {/* Lost craft */}
          <div className="nf-card">
            <LostCraft />
          </div>

          {/* 404 glitch number */}
          <h1 className="not-found-404 nf-card">404</h1>

          {/* Signal dots */}
          <div className="nf-card">
            <SignalDots />
          </div>

          {/* Copy */}
          <div className="nf-card" style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.3rem, 3.5vw, 1.75rem)",
                fontWeight: 400,
                letterSpacing: "-0.04em",
                color: "#fff",
                margin: "0 0 0.75rem",
              }}
            >
              Lost in the Void
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "#a1a1aa",
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              Mission Control cannot locate the coordinates you entered. This sector of
              Cosmovoid may have drifted out of range — or perhaps it never existed in our
              star charts.
            </p>
          </div>

          {/* CTA buttons */}
          <div
            className="nf-card"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginBottom: "2.5rem",
            }}
          >
            <Link
              to="/"
              className="nf-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                background: "#fff",
                color: "#09090b",
                padding: "12px 26px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Return to Base
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="nf-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                color: "#e4e4e7",
                padding: "12px 26px",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Last Known Position
            </button>
            <Link
              to="/explore"
              className="nf-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: "1px solid rgba(103,232,249,0.2)",
                background: "rgba(103,232,249,0.06)",
                backdropFilter: "blur(12px)",
                color: "#67e8f9",
                padding: "12px 26px",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Explore Charts
            </Link>
          </div>

          {/* Auto-redirect bar */}
          {autoRedirect && (
            <div
              className="nf-card"
              style={{
                width: "100%",
                maxWidth: 380,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "14px 18px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "#71717a", letterSpacing: "0.12em" }}>
                  AUTO-RETURN IN
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#67e8f9",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(countdown).padStart(2, "0")}s
                  </span>
                  <button
                    onClick={() => setAutoRedirect(false)}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 6,
                      color: "#71717a",
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      cursor: "pointer",
                      letterSpacing: "0.1em",
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
              {/* Progress bar */}
              <div
                style={{
                  height: 3,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #67e8f9, #a78bfa)",
                    borderRadius: 4,
                    transformOrigin: "left",
                    animation: `progressBar ${15}s linear forwards`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default NotFound;
