/**
 * SVG Path Generator for Record Album Mat Openings
 * Generates compound SVG paths for unified shapes (rectangle + overlapping circles).
 */

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  centerX: number;
  centerY: number;
  radius: number;
}

function getCircleLineIntersection(
  lineX: number,
  circleCenterX: number,
  circleCenterY: number,
  radius: number
): { top: Point; bottom: Point } | null {
  const dx = lineX - circleCenterX;
  if (Math.abs(dx) > radius) return null;
  const dy = Math.sqrt(radius * radius - dx * dx);
  return {
    top: { x: lineX, y: circleCenterY - dy },
    bottom: { x: lineX, y: circleCenterY + dy },
  };
}

function getCircleCircleIntersection(c1: Circle, c2: Circle): { top: Point; bottom: Point } | null {
  const dx = c2.centerX - c1.centerX;
  const dy = c2.centerY - c1.centerY;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > c1.radius + c2.radius || d < Math.abs(c1.radius - c2.radius) || d === 0) return null;
  const a = (c1.radius * c1.radius - c2.radius * c2.radius + d * d) / (2 * d);
  const h = Math.sqrt(c1.radius * c1.radius - a * a);
  const p2x = c1.centerX + (a * dx) / d;
  const p2y = c1.centerY + (a * dy) / d;
  const intersect1x = p2x + (h * dy) / d;
  const intersect1y = p2y - (h * dx) / d;
  const intersect2x = p2x - (h * dy) / d;
  const intersect2y = p2y + (h * dx) / d;
  if (intersect1y < intersect2y) {
    return {
      top: { x: intersect1x, y: intersect1y },
      bottom: { x: intersect2x, y: intersect2y },
    };
  }
  return {
    top: { x: intersect2x, y: intersect2y },
    bottom: { x: intersect1x, y: intersect1y },
  };
}

export function generateRectanglePath(rect: Rectangle): string {
  return `M ${rect.x},${rect.y} L ${rect.x + rect.width},${rect.y} L ${rect.x + rect.width},${rect.y + rect.height} L ${rect.x},${rect.y + rect.height} Z`;
}

export function generateCirclePath(circle: Circle): string {
  const { centerX, centerY, radius } = circle;
  return `M ${centerX - radius},${centerY} A ${radius},${radius} 0 0,1 ${centerX + radius},${centerY} A ${radius},${radius} 0 0,1 ${centerX - radius},${centerY} Z`;
}

export function generateRectangleWithCirclePath(rect: Rectangle, circle: Circle): string {
  const rectRight = rect.x + rect.width;
  const rectBottom = rect.y + rect.height;
  const intersection = getCircleLineIntersection(
    rectRight,
    circle.centerX,
    circle.centerY,
    circle.radius
  );
  if (!intersection) {
    return generateRectanglePath(rect) + " " + generateCirclePath(circle);
  }
  const { top: intersectTop, bottom: intersectBottom } = intersection;
  const largeArc = 1;
  return `M ${rect.x},${rect.y} L ${rectRight},${rect.y} L ${intersectTop.x},${intersectTop.y} A ${circle.radius},${circle.radius} 0 ${largeArc},1 ${intersectBottom.x},${intersectBottom.y} L ${rectRight},${rectBottom} L ${rect.x},${rectBottom} Z`;
}

export function generateRectangleWithTwoCirclesPath(
  rect: Rectangle,
  circle1: Circle,
  circle2: Circle
): string {
  const rectRight = rect.x + rect.width;
  const rectBottom = rect.y + rect.height;
  const rectCircle1Intersection = getCircleLineIntersection(
    rectRight,
    circle1.centerX,
    circle1.centerY,
    circle1.radius
  );
  const circleCircleIntersection = getCircleCircleIntersection(circle1, circle2);
  if (!rectCircle1Intersection || !circleCircleIntersection) {
    return (
      generateRectanglePath(rect) +
      " " +
      generateCirclePath(circle1) +
      " " +
      generateCirclePath(circle2)
    );
  }
  const rectInt1Top = rectCircle1Intersection.top;
  const rectInt1Bottom = rectCircle1Intersection.bottom;
  const circleIntTop = circleCircleIntersection.top;
  const circleIntBottom = circleCircleIntersection.bottom;
  return `M ${rect.x},${rect.y} L ${rectRight},${rect.y} L ${rectInt1Top.x},${rectInt1Top.y} A ${circle1.radius},${circle1.radius} 0 0,1 ${circleIntTop.x},${circleIntTop.y} A ${circle2.radius},${circle2.radius} 0 1,1 ${circleIntBottom.x},${circleIntBottom.y} A ${circle1.radius},${circle1.radius} 0 0,1 ${rectInt1Bottom.x},${rectInt1Bottom.y} L ${rectRight},${rectBottom} L ${rect.x},${rectBottom} Z`;
}

export function generateMatBoardPath(outerRect: Rectangle, openingPath: string): string {
  const outer = `M ${outerRect.x},${outerRect.y} L ${outerRect.x + outerRect.width},${outerRect.y} L ${outerRect.x + outerRect.width},${outerRect.y + outerRect.height} L ${outerRect.x},${outerRect.y + outerRect.height} Z`;
  return `${outer} ${openingPath}`;
}

export type MatOpeningLayoutType =
  | "cover-only"
  | "single-with-cover"
  | "double-with-covers"
  | "disc-only"
  | "disc-with-cover"
  | "double-disc"
  | "quad-disc";

export function generateMatOpeningPath(
  layout: MatOpeningLayoutType,
  rect: Rectangle,
  circle1?: Circle,
  circle2?: Circle
): string {
  if (layout === "cover-only") return generateRectanglePath(rect);
  if (layout === "single-with-cover" && circle1)
    return generateRectangleWithCirclePath(rect, circle1);
  if (layout === "double-with-covers" && circle1 && circle2)
    return generateRectangleWithTwoCirclesPath(rect, circle1, circle2);
  if (layout === "disc-only" && circle1) return generateCirclePath(circle1);
  if (layout === "disc-with-cover" && circle1)
    return generateRectangleWithCirclePath(rect, circle1);
  if (layout === "double-disc" && circle1 && circle2)
    return generateRectangleWithTwoCirclesPath(rect, circle1, circle2);
  if (layout === "quad-disc") return generateRectanglePath(rect);
  return generateRectanglePath(rect);
}
