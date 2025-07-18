// utils/contentChecks.js

const NSFW_KEYWORDS = ["nude", "porn", "xxx", "sex", "explicit", "18+", "onlyfans", "pussy", "boobs", "nsfw"];
const TOXIC_KEYWORDS = ["hate", "kill", "suicide", "loser", "die", "stupid", "retard"];

export function analyzeContentTrust(text) {
  const lower = text.toLowerCase();

  const suspiciousPatterns = [
    /bit\.ly|tinyurl\.com|rb\.gy|shorturl\.at/, // Shorteners
    /free.*(gift|offer|money)/,
    /win.*(prize|cash|iphone)/,
    /(verify|login).*account/,
    /http[s]?:\/\/(\d{1,3}\.){3}\d{1,3}/, // Raw IPs
    /amzon\.|googIe\.|faceb00k\.|paypa1\./, // Lookalike domains
  ];

  const containsNSFW = NSFW_KEYWORDS.some((word) => lower.includes(word));
  const containsToxic = TOXIC_KEYWORDS.some((word) => lower.includes(word));
  const matchesSuspicious = suspiciousPatterns.some((pattern) => pattern.test(lower));

  const isSuspicious = containsNSFW || containsToxic || matchesSuspicious;

  let score;
  if (containsNSFW) score = Math.floor(Math.random() * 15) + 10; // 10–25
  else if (matchesSuspicious) score = Math.floor(Math.random() * 20) + 30; // 30–50
  else if (containsToxic) score = Math.floor(Math.random() * 15) + 40; // 40–55
  else score = Math.floor(Math.random() * 30) + 70; // 70–100 for trusted

  const reason = isSuspicious
    ? "Suspicious or NSFW content detected"
    : "No obvious suspicious indicators";

  return {
    score,
    isSuspicious,
    reason,
  };
}



  