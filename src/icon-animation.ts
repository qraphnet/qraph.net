import { Animation } from "./animation";
import type { Canvas } from "./canvas";
import { TrackedCursor } from "./cursor-track";
import { Transform } from "./transform";

const genEyePath = () => {
  const path = new Path2D;
  path.moveTo(6.928203230275509, -4);
  path.lineTo(0, 0);
  path.lineTo(6.928203230275509, +4);
  return path;
};

const genEyeBrowPath = () => {
  const path = new Path2D;
  path.moveTo(-3, 0);
  path.bezierCurveTo(-2, -1, 2, -1, 3, 0);
  return path;
};

const genMouthPath = () => {
  const path = new Path2D;
  path.moveTo(0, 4.5);
  path.bezierCurveTo(-3, 4.5, -7, 2, -6, 0);
  path.bezierCurveTo(-5, -2, -2, 0, 0, 0);
  path.bezierCurveTo(2, 0, 5, -2, 6, 0);
  path.bezierCurveTo(7, 2, 3, 4.5, 0, 4.5);
  return path;
};

const eye = genEyePath();
const eyeBrow = genEyeBrowPath();
const mouth = genMouthPath();

const calcRay = (cursor: TrackedCursor, canvas: Canvas): Ray => {
  if (cursor.x == 0 && cursor.y == 0) return new Ray(0, 0);
  const bounding = canvas.getBounding();
  const cx = (bounding.left + bounding.right) / 2;
  const cy = (bounding.top + bounding.bottom) / 2;
  return new Ray(cursor.x - cx, cursor.y - cy);
};

export class IconAnimation extends Animation {
  cursor: TrackedCursor;
  ray: Ray;

  constructor(canvas: Canvas) {
    super(canvas);
    canvas.animation = this;

    this.cursor = new TrackedCursor();
    this.ray = new Ray(0, 0);
  }

  render(): void {
    const { context: ctx, width, height } = this.canvas;
    const short = Math.min(width, height);
    const scale = short / 48;

    const mouseRay = calcRay(this.cursor, this.canvas);
    mouseRay.adjust(short/3);
    this.ray.smooth(mouseRay);

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);

    
    const base = Transform.translate(width/2, height/2).mul(this.ray.toTransform(short/2, short/2)).scale(scale, scale);
    {
      ctx.lineWidth = 1.2;
      {
        base.translate(3, 0).rotate(1/180*Math.PI).apply(ctx);
        ctx.stroke(eye);
      }
      {
        base.translate(-3, 0).rotate(179/180*Math.PI).apply(ctx);
        ctx.stroke(eye);
      }
    }

    {
      ctx.lineWidth = 0.8;
      {
        base.translate(7.25, -10).rotate(10/180*Math.PI).apply(ctx);
        ctx.stroke(eyeBrow);
      }
      {
        base.translate(-7.25, -10).rotate(-10/180*Math.PI).apply(ctx);
        ctx.stroke(eyeBrow);
      }
    }

    {
      ctx.lineWidth = 0.9;
      base.translate(0, 9).apply(ctx);
      ctx.stroke(mouth);
    }
  }
}

class Ray {
  coordinate: [number, number];
  constructor(x: number, y: number) {
    this.coordinate = [x, y];
  }

  adjust(threshold: number) {
    for (let i = 0; i < 2; ++i) {
      this.coordinate[i] = Math.tanh(this.coordinate[i] / threshold) * threshold;
    }
  }

  smooth(to: Ray) {
    const r = 0.1;
    for (let i = 0; i < 2; ++i) this.coordinate[i] = (1-r) * this.coordinate[i] + r *  to.coordinate[i];
  }

  toTransform(distance: number, faceZ: number): Transform {
    const [x, y] = this.coordinate;
    const phi = Math.atan(y / Math.sqrt(distance*distance + x*x)), theta = Math.atan(x / distance);

    return Transform.fromAbcdef(Math.cos(theta), 0, -Math.sin(theta)*Math.sin(phi), Math.cos(phi), Math.sin(theta)*Math.cos(phi)*faceZ, Math.sin(phi)*faceZ);
  }
}