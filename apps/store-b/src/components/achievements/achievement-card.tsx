import type { ReactNode } from "react";
import { Lock, Trophy } from "lucide-react";

import { Badge, Card, Progress } from "@framecraft/ui";

/** origina-store-b/client/src/components/AchievementCard.tsx */
export type AchievementCardProps = {
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  icon?: ReactNode;
};

export function AchievementCard({ title, description, unlocked, progress, icon }: AchievementCardProps) {
  return (
    <Card className={`p-4 ${!unlocked ? "opacity-50" : ""}`}>
      <div className="flex items-start gap-3">
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            unlocked ? "bg-chart-3/20" : "bg-muted"
          }`}
        >
          {unlocked ? (
            icon ?? <Trophy className="h-6 w-6 text-chart-3" />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className="font-semibold"
              data-testid={`text-achievement-${title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {title}
            </h4>
            {unlocked ? (
              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/30" data-testid="badge-unlocked">
                Unlocked
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span data-testid="text-progress">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-bar" />
          </div>
        </div>
      </div>
    </Card>
  );
}
