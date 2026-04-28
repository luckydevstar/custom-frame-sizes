"use client";

/**
 * Frame designer tooltip mockup — origina-store-b/client/src/pages/DesignerMockup.tsx
 */

import { Card, FrameProfileDiagram, HoverCard, HoverCardContent, HoverCardTrigger } from "@framecraft/ui";
import { useState } from "react";

export function DesignerMockupPageContent() {
  const [selectedFrame] = useState({
    name: "Classic Oak",
    mouldingWidth: 1.25,
    color: "#D4A574",
    borderColor: "#B8935A",
  });

  const artWidth = 16;
  const artHeight = 20;
  const frameWidth = artWidth + selectedFrame.mouldingWidth * 2;
  const frameHeight = artHeight + selectedFrame.mouldingWidth * 2;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Frame Designer Mockup</h1>
        <p className="text-muted-foreground mb-8">
          This mockup demonstrates a frame profile tooltip on the dimension label. Hover over the dimension label below
          the preview to see the frame cross-section.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6">
          <div>
            <Card className="p-6">
              <div className="min-h-[500px] bg-muted rounded-md flex items-center justify-center relative">
                <div
                  className="preview-stage"
                  style={{
                    width: "400px",
                    height: "500px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderTop: `20px solid ${selectedFrame.borderColor}`,
                      borderLeft: `20px solid ${selectedFrame.borderColor}`,
                      borderRight: `20px solid ${selectedFrame.color}`,
                      borderBottom: `20px solid ${selectedFrame.color}`,
                      boxShadow: "inset 0 0 8px rgba(0,0,0,0.2), 0 2px 12px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                    }}
                  >
                    <div
                      style={{
                        width: "calc(100% - 60px)",
                        height: "calc(100% - 60px)",
                        backgroundColor: "#F5F5DC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          width: "calc(100% - 50px)",
                          height: "calc(100% - 50px)",
                          backgroundColor: "#E8E8E8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span className="text-muted-foreground text-sm">Sample Artwork</span>
                      </div>
                    </div>
                  </div>
                </div>

                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg cursor-help border border-border hover-elevate">
                      {frameWidth.toFixed(1)}&quot; × {frameHeight.toFixed(1)}&quot;
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="left" className="w-80" sideOffset={10}>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-1">Frame Profile: {selectedFrame.name}</h4>
                        <p className="text-xs text-muted-foreground">Cross-section showing moulding dimensions</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-md border flex items-center justify-center">
                        <FrameProfileDiagram mouldingWidth='1 1/4"' faceHeight='7/8"' rabbetDepth='3/8"' />
                      </div>
                      <div className="text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Moulding Width:</span>
                          <span className="font-medium">1 1/4&quot;</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Face Height:</span>
                          <span className="font-medium">7/8&quot;</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rabbet Depth:</span>
                          <span className="font-medium">3/8&quot;</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">Sample preview shown for demonstration only</p>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Mockup Features</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Frame Profile Tooltip</h3>
                  <p className="text-muted-foreground">
                    Hover over the dimension label below the frame preview to see a detailed cross-section diagram of the
                    frame profile with exact measurements.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Displayed Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Cross-section diagram</li>
                    <li>Moulding width (1 1/4&quot;)</li>
                    <li>Face height (7/8&quot;)</li>
                    <li>Rabbet depth (3/8&quot;)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">User Benefits</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Visual understanding of frame construction</li>
                    <li>Precise technical specifications</li>
                    <li>Non-intrusive hover interaction</li>
                    <li>Quick access without cluttering the UI</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground italic">
                    This is a design mockup demonstrating the frame profile tooltip feature. In production, this would
                    show the actual selected frame&apos;s cross-section and measurements.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
