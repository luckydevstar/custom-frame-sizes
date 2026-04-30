import {
  ALL_FRAME_MOULDING_PRICES,
  calculateFrameLinearFeet,
  COMPONENT_PRICING,
  PRICING_MARKUPS,
} from "@framecraft/core";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@framecraft/ui";

/** b-shadow-box-frames-original PricingMetrics.tsx — internal comparison grid (matches robots disallow /pricing-metrics) */
const ALL_FRAMES = Object.entries(ALL_FRAME_MOULDING_PRICES)
  .map(([sku, pricePerFt]) => ({
    sku,
    pricePerFt,
  }))
  .sort((a, b) => a.pricePerFt - b.pricePerFt);

const SIZES = [
  { w: 4, h: 4, label: "4×4" },
  { w: 8, h: 10, label: "8×10" },
  { w: 16, h: 20, label: "16×20" },
  { w: 20, h: 24, label: "20×24" },
  { w: 24, h: 36, label: "24×36" },
  { w: 30, h: 40, label: "30×40" },
];

const FRAME_MARKUP = PRICING_MARKUPS.FRAME_MOULDING;
const ACRYLIC_MARKUP = COMPONENT_PRICING.STANDARD_ACRYLIC.designerMarkup ?? 8;
const ACRYLIC_COST_PER_SQ_IN = COMPONENT_PRICING.STANDARD_ACRYLIC.costPerSqIn;

const NEW_FLOOR_PRICE = 15.99;
const MARKETING_LOAD = 0.125;

const HANDLING_ANCHORS = [
  { perimeter: 16, fee: 6 },
  { perimeter: 36, fee: 8 },
  { perimeter: 72, fee: 11 },
  { perimeter: 88, fee: 15 },
  { perimeter: 120, fee: 23 },
  { perimeter: 140, fee: 32 },
];

const MULTIPLIER_ANCHORS = [
  { cost: 0, mult: 6.0 },
  { cost: 10, mult: 6.0 },
  { cost: 25, mult: 5.2 },
  { cost: 60, mult: 4.4 },
  { cost: 120, mult: 3.6 },
  { cost: 200, mult: 3.0 },
  { cost: 400, mult: 2.6 },
];

const OVERSIZE_THRESHOLDS = [
  { perimeter: 140, surcharge: 25 },
  { perimeter: 120, surcharge: 15 },
];

function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

function getSmoothedHandlingFee(perimeter: number): number {
  for (let i = 0; i < HANDLING_ANCHORS.length - 1; i++) {
    const a = HANDLING_ANCHORS[i];
    const b = HANDLING_ANCHORS[i + 1];
    if (!a || !b) continue;
    if (perimeter >= a.perimeter && perimeter <= b.perimeter) {
      return lerp(perimeter, a.perimeter, b.perimeter, a.fee, b.fee);
    }
  }
  const firstAnchor = HANDLING_ANCHORS[0];
  if (firstAnchor && perimeter < firstAnchor.perimeter) {
    return firstAnchor.fee;
  }
  const last = HANDLING_ANCHORS[HANDLING_ANCHORS.length - 1];
  const prev = HANDLING_ANCHORS[HANDLING_ANCHORS.length - 2];
  if (!last || !prev) {
    return HANDLING_ANCHORS[0]?.fee ?? 0;
  }
  return lerp(perimeter, prev.perimeter, last.perimeter, prev.fee, last.fee);
}

function getSmoothedMultiplier(materialCost: number): number {
  for (let i = 0; i < MULTIPLIER_ANCHORS.length - 1; i++) {
    const a = MULTIPLIER_ANCHORS[i];
    const b = MULTIPLIER_ANCHORS[i + 1];
    if (!a || !b) continue;
    if (materialCost >= a.cost && materialCost <= b.cost) {
      return lerp(materialCost, a.cost, b.cost, a.mult, b.mult);
    }
  }
  const firstMult = MULTIPLIER_ANCHORS[0];
  if (!firstMult) return 6;
  if (materialCost < firstMult.cost) {
    return firstMult.mult;
  }
  return MULTIPLIER_ANCHORS[MULTIPLIER_ANCHORS.length - 1]?.mult ?? firstMult.mult;
}

function roundTo99(price: number): number {
  return Math.ceil(price) - 0.01;
}

function getOversizeSurcharge(perimeter: number): number {
  for (const threshold of OVERSIZE_THRESHOLDS) {
    if (perimeter >= threshold.perimeter) {
      return threshold.surcharge;
    }
  }
  return 0;
}

function calculateNewPrice(
  w: number,
  h: number,
  framePricePerFt: number,
): {
  newPrice: number;
  multiplierUsed: number;
  handlingFeeUsed: number;
  oversizeSurcharge: number;
  hitFloor: boolean;
  materialCost: number;
  preMarketing: number;
} {
  const linearFeet = calculateFrameLinearFeet(w, h);
  const frameMaterialCost = linearFeet * framePricePerFt;
  const sqIn = w * h;
  const acrylicMaterialCost = sqIn * ACRYLIC_COST_PER_SQ_IN;
  const materialCost = frameMaterialCost + acrylicMaterialCost;

  const perimeter = 2 * (w + h);
  const handlingFeeUsed = getSmoothedHandlingFee(perimeter);
  const multiplierUsed = getSmoothedMultiplier(materialCost);
  const oversizeSurcharge = getOversizeSurcharge(perimeter);

  const preMarketing = materialCost * multiplierUsed + handlingFeeUsed + oversizeSurcharge;
  const priceWithMarketing = preMarketing / (1 - MARKETING_LOAD);

  const rounded = roundTo99(priceWithMarketing);

  const hitFloor = rounded < NEW_FLOOR_PRICE;
  const newPrice = hitFloor ? NEW_FLOOR_PRICE : rounded;

  return {
    newPrice,
    multiplierUsed,
    handlingFeeUsed,
    oversizeSurcharge,
    hitFloor,
    materialCost,
    preMarketing,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function PricingMetricsPageContent() {
  const rows = ALL_FRAMES.flatMap((frame) =>
    SIZES.map((size) => {
      const linearFeet = calculateFrameLinearFeet(size.w, size.h);
      const frameCost = linearFeet * frame.pricePerFt;
      const sqIn = size.w * size.h;
      const acrylicCost = sqIn * ACRYLIC_COST_PER_SQ_IN;
      const materialCost = frameCost + acrylicCost;
      const currentPrice = frameCost * FRAME_MARKUP + acrylicCost * ACRYLIC_MARKUP;

      const newCalc = calculateNewPrice(size.w, size.h, frame.pricePerFt);

      const deltaAbs = newCalc.newPrice - currentPrice;
      const deltaPct = ((newCalc.newPrice - currentPrice) / currentPrice) * 100;

      return {
        sku: frame.sku,
        size: size.label,
        materialCost,
        currentPrice,
        newPrice: newCalc.newPrice,
        deltaAbs,
        deltaPct,
        multiplierUsed: newCalc.multiplierUsed,
        handlingFeeUsed: newCalc.handlingFeeUsed,
        oversizeSurcharge: newCalc.oversizeSurcharge,
        hitFloor: newCalc.hitFloor,
      };
    }),
  );

  const avgDelta = rows.reduce((sum, r) => sum + r.deltaPct, 0) / rows.length;
  const floorHits = rows.filter((r) => r.hitFloor).length;
  const oversizeHits = rows.filter((r) => r.oversizeSurcharge > 0).length;
  const priceIncreases = rows.filter((r) => r.deltaAbs > 0).length;
  const priceDecreases = rows.filter((r) => r.deltaAbs < 0).length;

  const midSizeRows = rows.filter((r) => r.size === "16×20" || r.size === "20×24");
  const midSizeDeltas = midSizeRows.map((r) => r.deltaPct).sort((a, b) => a - b);
  const midMidIdx = Math.floor(midSizeDeltas.length / 2);
  const midSizeMedianDelta =
    midSizeDeltas.length > 0 ? (midSizeDeltas[midMidIdx] ?? 0) : 0;

  const emptyDash = "\u2014";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold" data-testid="text-pricing-metrics-title">
          Pricing Comparison: Current vs New
        </h1>
        <p className="text-sm text-muted-foreground">
          {ALL_FRAMES.length} SKUs × {SIZES.length} sizes = {rows.length} rows | Floor: ${NEW_FLOOR_PRICE} |
          Marketing: {(MARKETING_LOAD * 100).toFixed(1)}%
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary">Avg Δ%: {formatPercent(avgDelta)}</Badge>
        <Badge variant="secondary">Mid-Size Median Δ%: {formatPercent(midSizeMedianDelta)}</Badge>
        <Badge variant="secondary">Price Floor Hits: {floorHits}</Badge>
        <Badge variant="secondary">Oversize Surcharges: {oversizeHits}</Badge>
        <Badge variant="outline" className="text-green-600">
          Increases: {priceIncreases}
        </Badge>
        <Badge variant="outline" className="text-red-600">
          Decreases: {priceDecreases}
        </Badge>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-lg">New Pricing Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Handling Fee (by perimeter)</h4>
            <div className="text-muted-foreground space-y-1">
              {HANDLING_ANCHORS.map((a) => (
                <div key={a.perimeter}>
                  {a.perimeter}&quot; → ${a.fee}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Multiplier (by material cost)</h4>
            <div className="text-muted-foreground space-y-1">
              {MULTIPLIER_ANCHORS.slice(1).map((a) => (
                <div key={a.cost}>
                  ≤${a.cost} → {a.mult}×
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Oversize Surcharge (by perimeter)</h4>
            <div className="text-muted-foreground space-y-1">
              {OVERSIZE_THRESHOLDS.map((t) => (
                <div key={t.perimeter}>
                  ≥{t.perimeter}&quot; → +${t.surcharge}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Full Comparison Table</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[70vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="text-right">Material$</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">New</TableHead>
                  <TableHead className="text-right">Δ$</TableHead>
                  <TableHead className="text-right">Δ%</TableHead>
                  <TableHead className="text-right">Mult</TableHead>
                  <TableHead className="text-right">Handling</TableHead>
                  <TableHead className="text-right">Oversize</TableHead>
                  <TableHead className="text-center">Floor?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow
                    key={`${row.sku}-${row.size}-${idx}`}
                    data-testid={`row-${row.sku}-${row.size}`}
                    className={
                      row.hitFloor
                        ? "bg-yellow-50 dark:bg-yellow-950/20"
                        : row.oversizeSurcharge > 0
                          ? "bg-blue-50 dark:bg-blue-950/20"
                          : ""
                    }
                  >
                    <TableCell className="font-mono text-sm">{row.sku}</TableCell>
                    <TableCell className="text-right">{row.size}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(row.materialCost)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(row.currentPrice)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.newPrice)}</TableCell>
                    <TableCell
                      className={`text-right ${row.deltaAbs >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {row.deltaAbs >= 0 ? "+" : ""}
                      {formatCurrency(row.deltaAbs)}
                    </TableCell>
                    <TableCell className={`text-right ${row.deltaPct >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatPercent(row.deltaPct)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{row.multiplierUsed.toFixed(2)}×</TableCell>
                    <TableCell className="text-right text-muted-foreground">${row.handlingFeeUsed.toFixed(2)}</TableCell>
                    <TableCell
                      className={`text-right ${row.oversizeSurcharge > 0 ? "text-blue-600 font-medium" : "text-muted-foreground"}`}
                    >
                      {row.oversizeSurcharge > 0 ? `+$${row.oversizeSurcharge}` : emptyDash}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.hitFloor ? (
                        <Badge variant="outline" className="text-yellow-600">
                          Yes
                        </Badge>
                      ) : (
                        emptyDash
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
