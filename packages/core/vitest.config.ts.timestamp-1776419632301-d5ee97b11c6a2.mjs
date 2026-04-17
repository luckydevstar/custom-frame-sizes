// vitest.config.ts
import { defineConfig } from "file:///D:/3_job_projects/us_CustomFrame/framecraft-frontends/packages/core/node_modules/vitest/dist/config.js";
import path from "path";
var __vite_injected_original_dirname = "D:\\3_job_projects\\us_CustomFrame\\framecraft-frontends\\packages\\core";
var vitest_config_default = defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/**/*.d.ts",
        "src/**/*.config.*",
        "src/**/__tests__/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}"
      ]
    }
  },
  resolve: {
    alias: {
      "@framecraft/core": path.resolve(__vite_injected_original_dirname, "./src"),
      "@framecraft/types": path.resolve(__vite_injected_original_dirname, "../types/src"),
      "@framecraft/data": path.resolve(__vite_injected_original_dirname, "../data/src")
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXDNfam9iX3Byb2plY3RzXFxcXHVzX0N1c3RvbUZyYW1lXFxcXGZyYW1lY3JhZnQtZnJvbnRlbmRzXFxcXHBhY2thZ2VzXFxcXGNvcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXDNfam9iX3Byb2plY3RzXFxcXHVzX0N1c3RvbUZyYW1lXFxcXGZyYW1lY3JhZnQtZnJvbnRlbmRzXFxcXHBhY2thZ2VzXFxcXGNvcmVcXFxcdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovM19qb2JfcHJvamVjdHMvdXNfQ3VzdG9tRnJhbWUvZnJhbWVjcmFmdC1mcm9udGVuZHMvcGFja2FnZXMvY29yZS92aXRlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVzdC9jb25maWdcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgdGVzdDoge1xyXG4gICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgIGVudmlyb25tZW50OiBcIm5vZGVcIixcclxuICAgIGluY2x1ZGU6IFtcInNyYy8qKi8qLnt0ZXN0LHNwZWN9Lnt0cyx0c3h9XCJdLFxyXG4gICAgZXhjbHVkZTogW1wibm9kZV9tb2R1bGVzXCIsIFwiZGlzdFwiXSxcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIHByb3ZpZGVyOiBcInY4XCIsXHJcbiAgICAgIHJlcG9ydGVyOiBbXCJ0ZXh0XCIsIFwianNvblwiLCBcImh0bWxcIl0sXHJcbiAgICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgICBcIm5vZGVfbW9kdWxlcy9cIixcclxuICAgICAgICBcInNyYy8qKi8qLmQudHNcIixcclxuICAgICAgICBcInNyYy8qKi8qLmNvbmZpZy4qXCIsXHJcbiAgICAgICAgXCJzcmMvKiovX190ZXN0c19fLyoqXCIsXHJcbiAgICAgICAgXCIqKi8qLnRlc3Que3RzLHRzeH1cIixcclxuICAgICAgICBcIioqLyouc3BlYy57dHMsdHN4fVwiLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQGZyYW1lY3JhZnQvY29yZVwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgICBcIkBmcmFtZWNyYWZ0L3R5cGVzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vdHlwZXMvc3JjXCIpLFxyXG4gICAgICBcIkBmcmFtZWNyYWZ0L2RhdGFcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9kYXRhL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJZLFNBQVMsb0JBQW9CO0FBQ3hhLE9BQU8sVUFBVTtBQURqQixJQUFNLG1DQUFtQztBQUd6QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixTQUFTLENBQUMsK0JBQStCO0FBQUEsSUFDekMsU0FBUyxDQUFDLGdCQUFnQixNQUFNO0FBQUEsSUFDaEMsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxNQUFNO0FBQUEsTUFDakMsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsb0JBQW9CLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDbkQscUJBQXFCLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDM0Qsb0JBQW9CLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsSUFDM0Q7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
