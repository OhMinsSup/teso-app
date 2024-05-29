import type { MetadataRoute } from "next";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "web",
    name: "velossWebsite",
    short_name: "Threads",
    description: "veloss personal website",
    start_url: PAGE_ENDPOINTS.ROOT,
    orientation: "landscape-primary",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [],
    lang: "ko-KR",
  };
}
