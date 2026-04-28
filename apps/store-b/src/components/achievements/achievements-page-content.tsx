"use client";

import { Image, Palette, Ruler, Sparkles, Crown, Users } from "lucide-react";
import { useEffect } from "react";

import { Card, Progress } from "@framecraft/ui";

import { AchievementCard } from "./achievement-card";

/** origina-store-b/client/src/pages/Achievements.tsx — mock array (legacy todo) */
const achievements = [
  {
    title: "First Design",
    description: "Create your first custom frame",
    unlocked: true,
    progress: 100,
    icon: <Sparkles className="h-6 w-6 text-chart-3" />,
  },
  {
    title: "Five Frames Created",
    description: "Design 5 different custom frames",
    unlocked: true,
    progress: 100,
    icon: <Image className="h-6 w-6 text-chart-3" />,
  },
  {
    title: "Mat Master",
    description: "Try all mat board colors",
    unlocked: false,
    progress: 60,
    icon: <Palette className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Size Explorer",
    description: "Design frames in 3 different sizes",
    unlocked: false,
    progress: 66,
    icon: <Ruler className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Premium Selector",
    description: "Choose premium glass",
    unlocked: true,
    progress: 100,
    icon: <Crown className="h-6 w-6 text-chart-3" />,
  },
  {
    title: "Frame Enthusiast",
    description: "Try 10 different frame styles",
    unlocked: false,
    progress: 40,
    icon: <Users className="h-6 w-6 text-muted-foreground" />,
  },
];

export function AchievementsPageContent() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const overallProgress = (unlockedCount / totalCount) * 100;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2" data-testid="text-achievements-title">
          Your Achievements
        </h1>
        <p className="text-lg text-muted-foreground">Track your progress and unlock new milestones</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold" data-testid="text-unlocked-count">
              {unlockedCount} / {totalCount}
            </h3>
            <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-chart-3" data-testid="text-progress-percentage">
              {overallProgress.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">Complete</p>
          </div>
        </div>
        <Progress value={overallProgress} className="h-3" data-testid="progress-overall" />
      </Card>

      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.title} {...achievement} />
        ))}
      </div>
    </div>
  );
}
