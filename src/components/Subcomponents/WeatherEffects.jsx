import { useEffect, useRef } from "react";

export default function WeatherEffects({ condition = "clear", isDay = true, windSpeed = 0, windDirection = 0 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrame;
        let particles = [];
        let stars = [];
        let sunRays = [];

        // --- Utils ---
        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = Math.max(parent.offsetWidth, 300);
            canvas.height = Math.max(parent.offsetHeight, 200);

            if (!isDay) {
                initStars();
            }
            else {
                initSunRays();
            }
        };

        const createParticles = (count, generator) =>
            Array.from({ length: count }, generator);

        const moveParticle = (p, dx = 0, dy = 0) => {
            p.x += dx ?? 0;
            p.y += dy ?? 0;

            const size = p.r || p.len || 0;

            // Wrap around horizontally and vertically
            if (p.x > canvas.width + size) p.x = -size;
            if (p.x < -size) p.x = canvas.width + size;
            if (p.y > canvas.height + size) p.y = -size;
            if (p.y < -size) p.y = canvas.height + size;

        };

        // --- Drawing functions ---
        // --- Rain, Thunder & Drizzle ---
        const drawRain = (p) => {
            const dx = Math.cos(p.angle) * p.speed; // x-axis
            const dy = Math.sin(p.angle) * p.speed; // y-axis

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - dx * (p.len / p.speed), p.y - dy * (p.len / p.speed));
            ctx.stroke();

            p.angle += (Math.random() - 0.5) * 0.01; // wobble

            moveParticle(p, dx, dy);
        };

        // Snow
        const drawSnow = (p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            p.y += p.speed;
            p.x += Math.sin(p.y * 0.01) * 0.5 + p.swing * 0.1 + p.windInfluence;
            moveParticle(p);
        };

        // Enhanced drawFog function:
        const drawFog = (p) => {
            // Create a more realistic fog appearance with gradient
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);

            if (isDay) {
                gradient.addColorStop(0, `rgba(250,250,250,${p.opacity})`);
                gradient.addColorStop(0.5, `rgba(240,240,240,${p.opacity * 0.7})`);
                gradient.addColorStop(1, `rgba(230,230,230,0)`);
            } else {
                gradient.addColorStop(0, `rgba(220,220,220,${p.opacity})`);
                gradient.addColorStop(0.5, `rgba(200,200,200,${p.opacity * 0.7})`);
                gradient.addColorStop(1, `rgba(180,180,180,0)`);
            }

            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            moveParticle(p, p.dx, p.dy);
        };
        // Clouds
        const drawCloud = (p) => {
            ctx.globalAlpha = p.opacity;
            ctx.shadowBlur = 50;
            ctx.shadowColor = isDay ? "rgba(255,255,255,0.8)" : "rgba(200,200,200,0.7)";
            ctx.fillStyle = isDay ? "rgba(255,255,255,0.9)" : "rgba(200,200,200,0.85)";

            ctx.beginPath();
            // Main cloud body
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            // Left side puff
            ctx.moveTo(p.x - p.r * 0.8, p.y);
            ctx.arc(p.x - p.r * 0.8, p.y + p.r * 0.2, p.r * 0.9, 0, Math.PI * 2);
            // Right side puff
            ctx.moveTo(p.x + p.r * 0.8, p.y);
            ctx.arc(p.x + p.r * 0.8, p.y + p.r * 0.2, p.r * 0.9, 0, Math.PI * 2);

            // Top puffs
            ctx.moveTo(p.x, p.y - p.r * 0.5);
            ctx.arc(p.x, p.y - p.r * 0.5, p.r * 0.7, 0, Math.PI * 2);
            ctx.moveTo(p.x + p.r * 0.4, p.y - p.r * 0.6);
            ctx.arc(p.x + p.r * 0.4, p.y - p.r * 0.6, p.r * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // FIX: Use cosine for x-axis, sine for y-axis (consistent with rain)
            const dx = Math.cos(p.angle) * p.speed;
            const dy = Math.sin(p.angle) * p.speed;

            moveParticle(p, dx, dy);

            ctx.globalAlpha = 1;// p.opacity;
        };

        // Initialize stars
        const initStars = () => {
            stars = [];
            for (let i = 0; i < 40; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.8,
                    r: Math.random() * 1.5,
                    baseOpacity: Math.random() * 0.5 + 0.3,
                    currentOpacity: Math.random() * 0.5 + 0.3,
                    twinkleSpeed: Math.random() * 0.02 + 0.01,
                    twinkleDirection: Math.random() > 0.5 ? 1 : -1,
                    twinkleDelay: Math.floor(Math.random() * 100) // Stagger the twinkling
                });
            }
        };

        // Update stars with more controlled twinkling
        const updateStars = () => {
            stars.forEach((star, index) => {
                // Only update some stars each frame to reduce flickering
                if (index % 3 === (animationFrame % 3)) {
                    // Add a delay before starting to twinkle
                    if (animationFrame > star.twinkleDelay) {
                        star.currentOpacity += star.twinkleSpeed * star.twinkleDirection;

                        // Reverse direction when reaching limits
                        if (star.currentOpacity >= star.baseOpacity + 0.2 ||
                            star.currentOpacity <= star.baseOpacity - 0.2) {
                            star.twinkleDirection *= -1;
                        }

                        // Clamp opacity to valid range
                        star.currentOpacity = Math.max(0.1, Math.min(0.8, star.currentOpacity));
                    }
                }
            });
        };


        // Initialize sun rays with fixed values (no randomness between frames)
        const initSunRays = () => {
            sunRays = [];
            const rayCount = 6;

            // Main rays
            for (let i = 0; i < rayCount; i++) {
                const angle = (i / rayCount) * Math.PI / 2;
                const length = canvas.width * (0.7 + (i / rayCount) * 0.2); // Fixed progression instead of random
                const endX = Math.cos(angle) * length;
                const endY = Math.sin(angle) * length;
                const rayWidth = 10 + (i / rayCount) * 8; // Fixed progression
                const opacity = 0.15 + (i / rayCount) * 0.1; // Fixed progression

                sunRays.push({
                    type: "main",
                    angle,
                    length,
                    endX,
                    endY,
                    rayWidth,
                    opacity
                });
            }

            // Additional rays
            for (let i = 0; i < rayCount; i++) {
                const angle = (i / 8) * Math.PI / 2.5;
                const length = canvas.width * (0.5 + (i / 8) * 0.3);
                const endX = Math.cos(angle) * length;
                const endY = Math.sin(angle) * length;
                const rayWidth = 5 + (i / 8) * 4;
                const opacity = 0.1 + (i / 8) * 0.05;

                sunRays.push({
                    type: "additional",
                    angle,
                    length,
                    endX,
                    endY,
                    rayWidth,
                    opacity
                });
            }
        };

        // Draw sun rays with fixed values (no randomness)
        const drawSunRays = () => {
            // Create a subtle gradient background for the rays coming from the top-left corner
            const gradient = ctx.createRadialGradient(
                0, 0, 0,
                0, 0, Math.max(canvas.width, canvas.height) * 0.8
            );
            gradient.addColorStop(0, "rgba(255, 230, 150, 0.2)");
            gradient.addColorStop(0.6, "rgba(255, 230, 150, 0.1)");
            gradient.addColorStop(1, "rgba(255, 230, 150, 0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw all pre-calculated rays
            sunRays.forEach(ray => {
                const rayGradient = ctx.createLinearGradient(0, 0, ray.endX, ray.endY);

                if (ray.type === "main") {
                    rayGradient.addColorStop(0, `rgba(255, 230, 150, ${ray.opacity})`);
                    rayGradient.addColorStop(0.7, `rgba(255, 230, 150, ${ray.opacity * 0.5})`);
                    rayGradient.addColorStop(1, `rgba(255, 230, 150, 0)`);
                } else {
                    rayGradient.addColorStop(0, `rgba(255, 240, 180, ${ray.opacity})`);
                    rayGradient.addColorStop(0.8, `rgba(255, 240, 180, 0)`);
                }

                ctx.beginPath();
                ctx.lineWidth = ray.rayWidth;
                ctx.strokeStyle = rayGradient;
                ctx.moveTo(0, 0);
                ctx.lineTo(ray.endX, ray.endY);
                ctx.stroke();

                // Add some subtle glow around the main rays
                if (ray.type === "main") {
                    ctx.beginPath();
                    ctx.lineWidth = ray.rayWidth + 6;
                    ctx.strokeStyle = `rgba(255, 230, 150, ${ray.opacity * 0.15})`;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(ray.endX * 0.8, ray.endY * 0.8);
                    ctx.stroke();
                }
            });
        };

        // --- Particle initialization ---
        const initParticles = () => {
            particles = [];

            // Convert meteorological wind direction to canvas angle
            // Meteorological: 0° = North, 90° = East, 180° = South, 270° = West
            // Canvas: 0° = East (right), 90° = South (down), 180° = West, 270° = North
            // const windAngle = ((270 - windDirection) * Math.PI) / 180;

            // Alternative that might be clearer:
            const windAngle = ((windDirection + 90) % 360) * Math.PI / 180;

            if (["rain", "drizzle", "thunder"].includes(condition)) {
                const count = condition === "drizzle" ? 120 : condition === "rain" ? 300 : 200;
                const dropLength = condition === "drizzle" ? [5, 12] : condition === "rain" ? [10, 30] : [10, 20];

                particles = createParticles(count, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    len: Math.random() * (dropLength[1] - dropLength[0]) + dropLength[0],
                    speed: Math.random() * 3 + 2 + (windSpeed / 12),
                    angle: Math.PI + Math.atan2(Math.sin(windAngle), Math.cos(windAngle)) * (windSpeed / 50),

                }));
            } else if (condition === "snow") {
                particles = createParticles(200, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 3 + 1,
                    speed: Math.random() * 1 + 0.5 - (windSpeed > 15 ? windSpeed / 50 : 0),
                    swing: (Math.random() * 2 - 1) * (1 + Math.pow(windSpeed / 15, 1.5)),
                    windInfluence: Math.pow(windSpeed / 12, 1.2),
                }));
            } else if (condition === "fog") {
                const fogDensity = 100;
                particles = createParticles(fogDensity, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 80 + 60, // Larger fog banks
                    dx: (Math.random() - 0.5) * 0.2 + Math.cos(windAngle) * windSpeed / 12,
                    dy: (Math.random() - 0.5) * 0.2 + Math.sin(windAngle) * windSpeed / 12,
                    opacity: isDay ?
                        Math.random() * 0.4 + 0.2 : // Much more visible during day
                        Math.random() * 0.3 + 0.15,
                    pulseSpeed: Math.random() * 0.01 + 0.005, // Subtle pulsing
                    baseOpacity: 0 // Set below
                }));

                // Set base opacity for pulsing effect
                particles.forEach(p => {
                    p.baseOpacity = p.opacity;
                });
            } else if (condition === "cloudy" || condition === "partly-cloudy" || condition === "mostly-clear") {
                const cloudCount = condition === "partly-cloudy" ? 4 : condition === "mostly-clear" ? 2 : 8;
                const scaleFactor = Math.min(canvas.width / 1200, 1);// scale relative to a "full-width" canvas
                const maxCloudRadius = Math.min(canvas.width, canvas.height) / 4;// clouds take max 1/4 of container
                const minCloudRadius = maxCloudRadius / 2;
                particles = createParticles(cloudCount, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height / 2),
                    r: (Math.random() * (maxCloudRadius - minCloudRadius) + minCloudRadius) * scaleFactor,
                    speed: Math.random() * 0.15 + 0.05 + windSpeed / 25,
                    opacity: 0.4 + Math.random() * 0.2,
                    angle: windAngle,
                }));
            }
            // Initialize stars if needed for night time
            if (!isDay && stars.length === 0) {
                initStars();
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background based on time of day
            ctx.fillStyle = isDay ? "#87CEEB" : "#0f172a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);


            // --- Day rays (always present during day) ---
            if (isDay) {
                drawSunRays();
            }


            // Set stroke/fill for rain/drizzle
            if (["rain", "drizzle", "thunder"].includes(condition)) {
                ctx.strokeStyle = isDay ? "rgba(255,255,255,0.5)" : "rgba(200,200,255,0.4)";
                ctx.lineWidth = condition === "drizzle" ? 0.9 : 1.2;
            }
            if (condition === "snow") ctx.fillStyle = "rgba(255,255,255,0.8)";
            if (condition === "fog") {
                ctx.fillStyle = isDay ?
                    "rgba(240,240,240,0.4)" : // Brighter, more opaque for day
                    "rgba(200,200,200,0.3)";  // Slightly different for night
            }


            particles.forEach(p => {
                switch (condition) {
                    case "drizzle":
                    case "rain":
                    case "thunder": drawRain(p); break;
                    case "snow": drawSnow(p); break;
                    case "fog": drawFog(p); break;
                    case "cloudy":
                    case "partly-cloudy":
                    case "mostly-clear": drawCloud(p); break;
                }
            });

            // --- Thunderstorm - Lightning bolts + cloud flash ---
            if (condition === "thunder") {

                // Lightning bolt chance
                const lightningChance = Math.min(0.003 + windSpeed / 2000, 0.008); // subtle chance per frame

                if (Math.random() < lightningChance) {
                    // Random start X for lightning at the top of canvas
                    const startX = Math.random() * canvas.width;
                    const startY = 0;
                    const segments = 8;
                    let x = startX, y = startY;

                    ctx.strokeStyle = "rgba(255,255,255,1)";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y);

                    for (let i = 0; i < segments; i++) {
                        const nextX = x + (Math.random() - 0.5) * 40;
                        const nextY = y + canvas.height / segments;
                        ctx.lineTo(nextX, nextY);
                        x = nextX;
                        y = nextY;
                    }
                    ctx.stroke();

                    // Lightning glow
                    ctx.beginPath();
                    ctx.strokeStyle = "rgba(255,255,255,0.2)";
                    ctx.lineWidth = 6;
                    ctx.moveTo(startX, startY);
                    x = startX; y = startY;

                    for (let i = 0; i < segments; i++) {
                        const nextX = x + (Math.random() - 0.5) * 40;
                        const nextY = y + canvas.height / segments;
                        ctx.lineTo(nextX, nextY);
                        x = nextX; y = nextY;
                    }
                    ctx.stroke();

                    // Flash background
                    ctx.fillStyle = isDay ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }

            if (!isDay) {
                // Update and draw stars
                if (stars.length > 0) {
                    updateStars();

                    stars.forEach(star => {
                        ctx.beginPath();
                        ctx.fillStyle = `rgba(255,255,255,${star.currentOpacity})`;
                        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }
            }
            animationFrame = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener("resize", resize);
        initParticles();

        // Initialize sun rays if it's day time
        if (isDay) {
            initSunRays();
        }

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [condition, isDay, windSpeed, windDirection]);

    return (
        <canvas
            ref={canvasRef}
            className="weather-effects"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}
