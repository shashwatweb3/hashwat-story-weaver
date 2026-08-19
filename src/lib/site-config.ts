/**
 * Central site configuration shared by the client and the server.
 * These values are public — never put secrets here.
 */

export const SITE_NAME = "Shashwat Chauhan";
export const SITE_URL = "https://www.shashwat.fun";

export const AUTHOR_HANDLE = "@Shashwat_web3";
export const AUTHOR_URL = "https://x.com/Shashwat_web3";

export const NEWSLETTER = {
  heading: "Get the next one.",
  copy: "New notes, ideas and things I'm building. Straight to your inbox.",
  consent: "Subscribe for new articles and notes.",
  button: "Subscribe",
  placeholder: "Your email",
  success: "You're in. Check your inbox to confirm — I'll send the next one your way.",
  alreadySubscribed: "You're already subscribed.",
  error: "Couldn't subscribe right now. Please try again later.",
  invalidEmail: "Please enter a valid email address.",
} as const;
