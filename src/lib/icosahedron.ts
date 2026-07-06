// Wireframe icosahedron renderer: hand-rolled perspective projection onto a 2D
// canvas (no WebGL/three.js) so the hero/story/card/join canvases can share one
// cheap, dependency-free 3D primitive.

export type Vec3 = [number, number, number];

export interface Icosahedron {
  vertices: Vec3[];
  edges: [number, number][];
}

export function buildIcosahedron(): Icosahedron {
  const PHI = (1 + Math.sqrt(5)) / 2;
  const raw: Vec3[] = [
    [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
    [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
    [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1],
  ];
  const vertices = raw.map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l] as Vec3;
  });
  const edges: [number, number][] = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const [ax, ay, az] = vertices[i];
      const [bx, by, bz] = vertices[j];
      const d = Math.hypot(ax - bx, ay - by, az - bz);
      if (d < 1.2) edges.push([i, j]);
    }
  }
  return { vertices, edges };
}

export function rotatePoint(p: Vec3, ax: number, ay: number): Vec3 {
  let [x, y, z] = p;
  let c = Math.cos(ay);
  let s = Math.sin(ay);
  const x2 = x * c - z * s;
  const z2 = x * s + z * c;
  x = x2;
  z = z2;
  c = Math.cos(ax);
  s = Math.sin(ax);
  const y2 = y * c - z * s;
  const z3 = y * s + z * c;
  return [x, y2, z3];
}

export function project(p: Vec3, w: number, h: number, scale: number): [number, number] {
  const d = 3.4;
  const f = d / (d - p[2]);
  return [w / 2 + p[0] * f * scale, h / 2 + p[1] * f * scale];
}

export interface DrawIcoOptions {
  color: string;
  scale?: number;
  tilt?: number;
  explode?: number;
  rings?: boolean;
}

export function sizeCanvasToDisplay(canvas: HTMLCanvasElement): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(2, rect.width * dpr);
  canvas.height = Math.max(2, rect.height * dpr);
}

function alphaHex(alpha: number): string {
  return Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
}

export function drawIcosahedron(
  ico: Icosahedron,
  canvas: HTMLCanvasElement,
  rot: number,
  opts: DrawIcoOptions,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w, h) * (opts.scale ?? 0.33);
  const tilt = opts.tilt ?? 0;
  const explode = opts.explode ?? 0;
  const pts = ico.vertices.map((p) => rotatePoint(p, rot * 0.62 + tilt, rot));
  ctx.lineWidth = Math.max(1, w / 900);

  ico.edges.forEach(([a, b]) => {
    let pa = pts[a];
    let pb = pts[b];
    if (explode > 0) {
      const mx = (pa[0] + pb[0]) / 2;
      const my = (pa[1] + pb[1]) / 2;
      const mz = (pa[2] + pb[2]) / 2;
      const ml = Math.hypot(mx, my, mz) || 1;
      const k = explode * 0.85;
      pa = [pa[0] + (mx / ml) * k, pa[1] + (my / ml) * k, pa[2] + (mz / ml) * k];
      pb = [pb[0] + (mx / ml) * k, pb[1] + (my / ml) * k, pb[2] + (mz / ml) * k];
    }
    const qa = project(pa, w, h, scale);
    const qb = project(pb, w, h, scale);
    const depth = (pa[2] + pb[2]) / 2;
    const alpha = Math.max(0.05, (0.18 + (depth + 1) * 0.32) * (1 - explode * 0.25));
    ctx.strokeStyle = opts.color + alphaHex(alpha);
    ctx.beginPath();
    ctx.moveTo(qa[0], qa[1]);
    ctx.lineTo(qb[0], qb[1]);
    ctx.stroke();
  });

  pts.forEach((p) => {
    const k = 1 + explode * 1.15;
    const pe: Vec3 = [p[0] * k, p[1] * k, p[2] * k];
    const q = project(pe, w, h, scale);
    const alpha = 0.35 + (p[2] + 1) * 0.32;
    ctx.fillStyle = opts.color + alphaHex(alpha);
    ctx.beginPath();
    ctx.arc(q[0], q[1], Math.max(1.5, w / 350) * (1 + explode * 0.6), 0, Math.PI * 2);
    ctx.fill();
  });

  if (opts.rings) {
    const ringAlpha = 1 - explode;
    if (ringAlpha > 0.02) {
      const N = 64;
      for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * Math.PI * 2;
          let p: Vec3 =
            ring === 0
              ? [Math.cos(a) * 1.35, Math.sin(a) * 1.35, 0]
              : ring === 1
                ? [Math.cos(a) * 1.35, 0, Math.sin(a) * 1.35]
                : [0, Math.cos(a) * 1.35, Math.sin(a) * 1.35];
          p = rotatePoint(p, rot * 0.4, -rot * 0.75);
          const q = project(p, w, h, scale);
          if (i === 0) ctx.moveTo(q[0], q[1]);
          else ctx.lineTo(q[0], q[1]);
        }
        ctx.strokeStyle = opts.color + alphaHex(ringAlpha * (46 / 255));
        ctx.stroke();
      }
    }
  }
}
