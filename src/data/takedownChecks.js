// Trust score analysis function

export function analyzeContentTrust(input) {
  if (!input) return 0;

  let score = 100;

  // If it's a File object (upload case)
  if (typeof input === "object" && input.name) {
    const fileName = input.name.toLowerCase();
    const fileType = input.type;

    // Penalize suspicious file types
    const riskyExtensions = [".exe", ".bat", ".scr", ".js"];
    riskyExtensions.forEach(ext => {
      if (fileName.endsWith(ext)) score -= 40;
    });

    // Penalize for very large files (>10MB)
    if (input.size > 10 * 1024 * 1024) score -= 20;

    // Reward for common safe media types
    if (fileType.startsWith("image/") || fileType.startsWith("video/")) score += 10;
  }

  // If it's a URL (link paste case)
  if (typeof input === "string") {
    const url = input.toLowerCase();

    // Penalize shortened or obfuscated links
    if (url.includes("bit.ly") || url.includes("tinyurl") || url.includes("shady")) score -= 30;

    // Reward if it's from a known safe domain
    const trustedDomains = ["gov.in", "meta.com", "google.com", "cert-in.org.in"];
    if (trustedDomains.some(domain => url.includes(domain))) score += 20;

    // Penalize common scam words
    const badWords = ["free money", "xxx", "nude", "bitcoin", "hack"];
    badWords.forEach(word => {
      if (url.includes(word)) score -= 25;
    });
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return Promise.resolve(score);
}
