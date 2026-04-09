// Marks module - handles bruise and mark generation with tool-specific patterns

const BRUISE_PATTERNS = {
  punch: {
    mainSize: { rxMin: 6, rxMax: 8, ryMin: 5, ryMax: 7 },
    spread: 4,
    colors: ["rgba(60,0,20,0.8)", "rgba(100,10,30,0.6)", "rgba(140,30,50,0.3)"],
    vesselCount: { min: 2, max: 4 },
    vesselDist: { min: 3, max: 6 },
    swellingSize: { rxMin: 10, rxMax: 12, ryMin: 8, ryMax: 10 },
    swellingColor: "rgba(255,200,200,0.15)",
  },
  slap: {
    mainSize: { rxMin: 10, rxMax: 14, ryMin: 8, ryMax: 12 },
    spread: 8,
    colors: [
      "rgba(200,50,50,0.7)",
      "rgba(180,80,80,0.5)",
      "rgba(255,150,150,0.3)",
    ],
    vesselCount: { min: 1, max: 3 },
    vesselDist: { min: 6, max: 10 },
    swellingSize: { rxMin: 15, rxMax: 18, ryMin: 12, ryMax: 15 },
    swellingColor: "rgba(255,180,180,0.2)",
  },
  hammer: {
    mainSize: { rxMin: 8, rxMax: 10, ryMin: 8, ryMax: 10 },
    spread: 6,
    colors: ["rgba(40,0,10,0.9)", "rgba(60,10,20,0.7)", "rgba(80,20,40,0.4)"],
    vesselCount: { min: 3, max: 5 },
    vesselDist: { min: 4, max: 8 },
    swellingSize: { rxMin: 14, rxMax: 16, ryMin: 14, ryMax: 16 },
    swellingColor: "rgba(200,150,150,0.25)",
    bloodCount: { min: 5, max: 10 },
    bloodDist: { min: 15, max: 30 },
  },
  whip: {
    mainSize: { rxMin: 2, rxMax: 3, ryMin: 25, ryMax: 45 },
    spread: 12,
    colors: [
      "rgba(180,0,0,0.85)",
      "rgba(200,40,40,0.6)",
      "rgba(220,80,80,0.35)",
    ],
    vesselCount: { min: 1, max: 2 },
    vesselDist: { min: 8, max: 15 },
    swellingSize: { rxMin: 3, rxMax: 5, ryMin: 30, ryMax: 50 },
    swellingColor: "rgba(255,150,150,0.1)",
    lineCount: { min: 2, max: 4 },
    linear: true,
  },
  rose: {
    mainSize: { rxMin: 12, rxMax: 18, ryMin: 12, ryMax: 18 },
    spread: 0,
    colors: ["rgba(255,0,80,0.9)", "rgba(255,100,150,0.6)"],
    type: "heart",
    heartColor: "rgba(255,0,80,0.85)",
    vesselCount: { min: 0, max: 0 },
    vesselDist: { min: 0, max: 0 },
    swellingSize: { rxMin: 0, rxMax: 0, ryMin: 0, ryMax: 0 },
    swellingColor: "rgba(0,0,0,0)",
  },
};

function createMark(toolName, hitX, hitY) {
  const pattern = BRUISE_PATTERNS[toolName] || BRUISE_PATTERNS.punch;
  const marks = [];

  // Main bruise with tool-specific size
  const rx =
    pattern.mainSize.rxMin +
    Math.random() * (pattern.mainSize.rxMax - pattern.mainSize.rxMin);
  const ry =
    pattern.mainSize.ryMin +
    Math.random() * (pattern.mainSize.ryMax - pattern.mainSize.ryMin);

  marks.push({
    x: hitX,
    y: hitY,
    rx: rx,
    ry: ry,
    rot: Math.random() * Math.PI,
    type: "bruise",
    colors: pattern.colors,
  });

  // Additional impact marks for hammer (circular pattern)
  if (toolName === "hammer") {
    for (let i = 0; i < 3; i++) {
      const angle = ((Math.PI * 2) / 3) * i + Math.random() * 0.3;
      const dist = 8 + Math.random() * 4;
      marks.push({
        x: hitX + Math.cos(angle) * dist,
        y: hitY + Math.sin(angle) * dist,
        rx: 3 + Math.random() * 2,
        ry: 3 + Math.random() * 2,
        rot: Math.random() * Math.PI,
        type: "bruise",
        colors: pattern.colors,
      });
    }
  }

  // Broken blood vessels (tiny dots)
  const vesselCount = Math.floor(
    pattern.vesselCount.min +
      Math.random() * (pattern.vesselCount.max - pattern.vesselCount.min),
  );
  for (let i = 0; i < vesselCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist =
      pattern.vesselDist.min +
      Math.random() * (pattern.vesselDist.max - pattern.vesselDist.min);
    marks.push({
      x: hitX + Math.cos(angle) * dist,
      y: hitY + Math.sin(angle) * dist,
      rx: 1 + Math.random() * 1.5,
      ry: 1 + Math.random() * 1.5,
      rot: Math.random() * Math.PI,
      type: "vessel",
      color: "rgba(200,30,30,0.7)",
    });
  }

  // Swelling/discoloration with tool-specific size
  const swrx =
    pattern.swellingSize.rxMin +
    Math.random() * (pattern.swellingSize.rxMax - pattern.swellingSize.rxMin);
  const swry =
    pattern.swellingSize.ryMin +
    Math.random() * (pattern.swellingSize.ryMax - pattern.swellingSize.ryMin);
  marks.push({
    x: hitX,
    y: hitY,
    rx: swrx,
    ry: swry,
    rot: Math.random() * Math.PI,
    type: "swelling",
    color: pattern.swellingColor,
  });

  // Additional surface damage for slap
  if (toolName === "slap") {
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 12 + Math.random() * 8;
      marks.push({
        x: hitX + Math.cos(angle) * dist,
        y: hitY + Math.sin(angle) * dist,
        rx: 2 + Math.random() * 2,
        ry: 2 + Math.random() * 2,
        rot: Math.random() * Math.PI,
        type: "vessel",
        color: "rgba(255,100,100,0.4)",
      });
    }
  }

  // Blood splatter for hammer (spreads far and wide)
  if (toolName === "hammer" && pattern.bloodCount) {
    const bloodCount = Math.floor(
      pattern.bloodCount.min +
        Math.random() * (pattern.bloodCount.max - pattern.bloodCount.min),
    );

    // Main blood drops
    for (let i = 0; i < bloodCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist =
        pattern.bloodDist.min +
        Math.random() * (pattern.bloodDist.max - pattern.bloodDist.min);
      const size = 2 + Math.random() * 4;
      marks.push({
        x: hitX + Math.cos(angle) * dist,
        y: hitY + Math.sin(angle) * dist,
        rx: size,
        ry: size * (0.5 + Math.random() * 0.5),
        rot: Math.random() * Math.PI,
        type: "blood",
        color: "rgba(180,0,0,0.8)",
      });
    }

    // Blood trail drops (smaller, more scattered)
    for (let i = 0; i < bloodCount * 1.5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = pattern.bloodDist.max + Math.random() * 20;
      const size = 1 + Math.random() * 2;
      marks.push({
        x: hitX + Math.cos(angle) * dist,
        y: hitY + Math.sin(angle) * dist,
        rx: size,
        ry: size * (0.5 + Math.random() * 0.5),
        rot: Math.random() * Math.PI,
        type: "blood",
        color: "rgba(150,0,0,0.6)",
      });
    }
  }

  // Linear whip marks - parallel lines
  if (toolName === "whip" && pattern.linear) {
    const lineCount =
      pattern.lineCount?.min +
      Math.floor(
        Math.random() * (pattern.lineCount.max - pattern.lineCount.min + 1),
      );
    const spacing = 6 + Math.random() * 4;
    const baseAngle = Math.random() * Math.PI;

    for (let i = 0; i < lineCount; i++) {
      const offsetX =
        Math.cos(baseAngle + Math.PI / 2) * (i - lineCount / 2) * spacing;
      const offsetY =
        Math.sin(baseAngle + Math.PI / 2) * (i - lineCount / 2) * spacing;
      const lineLength =
        pattern.mainSize.ryMin +
        Math.random() * (pattern.mainSize.ryMax - pattern.mainSize.ryMin);
      const lineWidth =
        pattern.mainSize.rxMin +
        Math.random() * (pattern.mainSize.rxMax - pattern.mainSize.rxMin);

      marks.push({
        x: hitX + offsetX,
        y: hitY + offsetY,
        rx: lineWidth,
        ry: lineLength,
        rot: baseAngle,
        type: "linear-bruise",
        colors: pattern.colors,
      });
    }
  }

  // Rose - heart shape overlay
  if (toolName === "rose" && pattern.type === "heart") {
    marks.push({
      x: hitX,
      y: hitY,
      rx:
        pattern.mainSize.rxMin +
        Math.random() * (pattern.mainSize.rxMax - pattern.mainSize.rxMin),
      ry:
        pattern.mainSize.ryMin +
        Math.random() * (pattern.mainSize.ryMax - pattern.mainSize.ryMin),
      rot: Math.random() * Math.PI,
      type: "heart",
      colors: pattern.colors,
      heartColor: pattern.heartColor,
    });
  }

  return marks;
}

function drawMark(ctx, mark, offsetX, offsetY) {
  ctx.save();
  ctx.translate(offsetX + mark.x, offsetY + mark.y);
  ctx.rotate(mark.rot);

  if (mark.type === "bruise" && mark.colors) {
    for (let i = 0; i < mark.colors.length; i++) {
      const color = mark.colors[i];
      const offset = i / (mark.colors.length - 1);
      ctx.beginPath();
      ctx.ellipse(0, 0, mark.rx * offset, mark.ry * offset, 0, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  } else if (mark.type === "vessel") {
    ctx.beginPath();
    ctx.ellipse(0, 0, mark.rx, mark.ry, 0, 0, 2 * Math.PI);
    ctx.fillStyle = mark.color;
    ctx.fill();
  } else if (mark.type === "swelling") {
    ctx.beginPath();
    ctx.ellipse(0, 0, mark.rx, mark.ry, 0, 0, 2 * Math.PI);
    ctx.fillStyle = mark.color;
    ctx.fill();
  } else if (mark.type === "blood") {
    ctx.beginPath();
    ctx.ellipse(0, 0, mark.rx, mark.ry, 0, 0, 2 * Math.PI);
    ctx.fillStyle = mark.color;
    ctx.fill();
  } else if (mark.type === "linear-bruise" && mark.colors) {
    ctx.globalCompositeOperation = "multiply";
    for (let i = 0; i < mark.colors.length; i++) {
      const color = mark.colors[i];
      const offset = i / (mark.colors.length - 1);
      ctx.beginPath();
      ctx.ellipse(0, 0, mark.rx * offset, mark.ry * offset, 0, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  } else if (mark.type === "heart" && mark.colors) {

    const size = Math.max(mark.rx, mark.ry);
    const heartSize = size * 1.5;

    ctx.beginPath();
    ctx.moveTo(0, -heartSize / 3);
    ctx.bezierCurveTo(
      heartSize / 2,
      -heartSize,
      heartSize,
      -heartSize / 3,
      0,
      heartSize / 2,
    );
    ctx.bezierCurveTo(
      -heartSize,
      -heartSize / 3,
      -heartSize / 2,
      -heartSize,
      0,
      -heartSize / 3,
    );
    ctx.fillStyle = mark.heartColor || "#ff0066";
    ctx.fill();
  }

  ctx.restore();
}

export { createMark, drawMark, BRUISE_PATTERNS };
