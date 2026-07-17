import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackEvent } from "@/lib/analytics";

export default function RouteAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    trackEvent("page_view", {
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
