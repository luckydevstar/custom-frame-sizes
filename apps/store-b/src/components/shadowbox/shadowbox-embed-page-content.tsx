"use client";

/**
 * Shadowbox Designer embed — origina-store-b/client/src/pages/ShadowboxEmbed.tsx
 * Embeddable designer without site chrome; parent communication via postMessage.
 */

import { deserializeDesign } from "@framecraft/core";
import { ShadowboxDesigner } from "@framecraft/ui";
import type {
  ShadowboxConfig,
  ShadowboxFeatureFlags,
  ShadowboxIncomingMessage,
  ShadowboxOutgoingMessage,
} from "@framecraft/types";
import { useCallback, useEffect, useState } from "react";

function getIsInIframe() {
  return typeof window !== "undefined" && window.self !== window.parent;
}

export function ShadowboxEmbedPageContent() {
  const [readonly, setReadonly] = useState(false);
  const [initialDesign, setInitialDesign] = useState<ShadowboxConfig | null>(null);
  const [targetOrigin, setTargetOrigin] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<ShadowboxFeatureFlags>({
    FEATURE_MOULDING_PICKER: true,
    FEATURE_MAT_SET: true,
    FEATURE_JERSEY_MOUNT: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inIframe = getIsInIframe();

    const readonlyParam = params.get("readonly");
    if (readonlyParam === "1" || readonlyParam === "true") {
      setReadonly(true);
    }

    const designParam = params.get("design");
    if (designParam) {
      const design = deserializeDesign(designParam);
      if (design) {
        setInitialDesign(design);
      }
    }

    const originParam = params.get("targetOrigin");
    if (originParam) {
      setTargetOrigin(originParam);
      setIsReady(true);
    } else if (!inIframe) {
      setTargetOrigin(window.location.origin);
      setIsReady(true);
    } else {
      setIsReady(true);
    }

    const mouldingPicker = params.get("mouldingPicker");
    const matSet = params.get("matSet");
    const jerseyMount = params.get("jerseyMount");

    setFeatureFlags({
      FEATURE_MOULDING_PICKER: mouldingPicker !== "0" && mouldingPicker !== "false",
      FEATURE_MAT_SET: matSet !== "0" && matSet !== "false",
      FEATURE_JERSEY_MOUNT: jerseyMount === "1" || jerseyMount === "true",
    });
  }, []);

  const postMessageToParent = useCallback(
    (message: ShadowboxOutgoingMessage) => {
      if (window.parent && window.parent !== window) {
        const inIframe = getIsInIframe();
        const origin = targetOrigin || (inIframe ? "*" : "");
        if (origin) {
          window.parent.postMessage(message, origin);
        } else {
          console.warn("[ShadowboxEmbed] Cannot post message: not in iframe and no targetOrigin configured");
        }
      }
    },
    [targetOrigin]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object" || !event.data.type) {
        return;
      }

      const message = event.data as ShadowboxIncomingMessage;
      const { type, data } = message;

      if (getIsInIframe() && !targetOrigin && event.origin) {
        setTargetOrigin(event.origin);
      }

      if (targetOrigin && event.origin !== targetOrigin) {
        console.warn("Ignoring message from unauthorized origin:", event.origin, "expected:", targetOrigin);
        return;
      }

      switch (type) {
        case "SHADOWBOX_LOAD":
          if (data?.design) {
            setInitialDesign(data.design);
          }
          break;

        case "SHADOWBOX_SET_READONLY":
          if (typeof data?.readonly === "boolean") {
            setReadonly(data.readonly);
          }
          break;

        default:
          console.warn("Unknown message type:", type);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [targetOrigin]);

  useEffect(() => {
    if (isReady) {
      postMessageToParent({
        type: "SHADOWBOX_READY",
        data: {
          version: "1.0.0",
          origin: targetOrigin || "wildcard",
        },
      });
    }
  }, [isReady, targetOrigin, postMessageToParent]);

  useEffect(() => {
    if (!getIsInIframe() || targetOrigin) return;

    const timeoutId = setTimeout(() => {
      if (!targetOrigin) {
        console.warn(
          '[ShadowboxEmbed] Operating in wildcard mode - parent has not sent any messages. Messages will continue to use "*" origin.'
        );
      }
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [targetOrigin]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full h-full">
        <ShadowboxDesigner
          hideMobileSticky={true}
          readonly={readonly}
          initialConfig={initialDesign}
          featureFlags={featureFlags}
          onChange={(config: ShadowboxConfig) => {
            postMessageToParent({
              type: "SHADOWBOX_CHANGE",
              data: {
                design: config,
              },
            });
          }}
          onSave={(config: ShadowboxConfig) => {
            const designId = `sb_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            postMessageToParent({
              type: "SHADOWBOX_SAVE",
              data: {
                designId,
                design: config,
              },
            });
          }}
        />
      </div>
    </div>
  );
}
