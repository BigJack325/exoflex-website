import { useSyncExternalStore } from "react";

type ScreenType = "mobile" | "tablet" | "desktop";

const mediaQueries: Record<ScreenType, string> = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1178px)",
  desktop: "(min-width: 1179px)",
};

function getCurrentScreen(): ScreenType {
  if (typeof window === "undefined") return "desktop";

  if (window.matchMedia(mediaQueries.mobile).matches) return "mobile";
  if (window.matchMedia(mediaQueries.tablet).matches) return "tablet";
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