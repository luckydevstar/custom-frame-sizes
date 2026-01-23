// Test imports from @framecraft packages
import { defaultTheme } from "@framecraft/config";
import type { ThemeConfig } from "@framecraft/config";

export default function HomePage() {
  // Verify theme import works
  const theme: ThemeConfig = defaultTheme;

  // Use theme to avoid unused variable warning
  const primaryColor = theme.brand.primary;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-background to-muted">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">Store A</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            FrameCraft multi-store platform - First production storefront
          </p>
        </div>

        <div className="mt-12 p-8 bg-card rounded-lg border shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">P2-001 Status</h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Next.js 14+ App Router</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Tailwind CSS configured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>TypeScript setup complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Monorepo integration ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>@framecraft packages configured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Environment variables template created</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>Development server running on http://localhost:3000</p>
          <p className="mt-2">P2-001: Application scaffold complete ✅</p>
          <p className="mt-2">Theme Primary Color: {primaryColor}</p>
        </div>
      </div>
    </main>
  );
}
