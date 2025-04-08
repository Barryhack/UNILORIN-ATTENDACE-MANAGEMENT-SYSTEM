import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",
  
  // Specify tags for better error categorization
  tags: {
    environment: process.env.NODE_ENV,
  },
  
  // Specify which errors to ignore
  ignoreErrors: [
    // Ignore specific error messages
    "Network request failed",
    "Failed to fetch",
  ],
}); 