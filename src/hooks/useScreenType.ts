import { useSyncExternalStore } from "react";

type ScreenType = "mobile" | "tablet" | "laptop" | "desktop";

const mediaQueries: Record<ScreenType, string> = {
  mobile: "(max-width: 425px)",
  tablet: "(min-width: 426px) and (max-width: 768px)",
  laptop: "(min-width: 769px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px)",
};

function getCurrentScreen(): ScreenType {
  if (typeof window === "undefined") return "desktop";

  if (window.matchMedia(mediaQueries.mobile).matches) return "mobile";
  if (window.matchMedia(mediaQueries.tablet).matches) return "tablet";
  if (window.matchMedia(mediaQueries.laptop).matches) return "laptop";
  return "desktop";
}

export function useScreenType(): ScreenType {
  return useSyncExternalStore(
    (callback) => {
      const mqls = Object.values(mediaQueries).map((q) => window.matchMedia(q));
      mqls.forEach((mql) => mql.addEventListener("change", callback));
      return () => mqls.forEach((mql) => mql.removeEventListener("change", callback));
    },
    getCurrentScreen,
    () => "desktop"
  );
}