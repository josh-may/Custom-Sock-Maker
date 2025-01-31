import posthog from "posthog-js";

// Check if we're in a browser environment and PostHog isn't already initialized
if (typeof window !== "undefined" && !window.posthog) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) {
    console.error("PostHog API key is not set in environment variables");
  }

  posthog.init(key, {
    api_host: host,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") {
        posthog.debug();
        console.log("PostHog initialized with key:", key);
        console.log("PostHog host:", host);
      }
    },
    capture_pageview: true, // Automatically capture pageviews
    persistence: "localStorage",
    autocapture: true,
  });
}

export default posthog;
