// src/utils/contentChecks.js
import { runToxicityAnalysis } from "./mlAnalyser";

const NSFW_KEYWORDS = [
  "nude", "porn", "xxx", "sex", "explicit", "18+", "onlyfans",
  "pussy", "boobs", "nsfw", "camgirl", "strip", "hot video"
];

const TOXIC_KEYWORDS = [
  "hate", "kill", "suicide", "loser", "die", "stupid", "retard",
  "abuse", "bastard", "racist", "dumb", "ugly", "slur"
];

const SUSPICIOUS_DOMAINS = [
  /bit\.ly/, /tinyurl\.com/, /rb\.gy/, /shorturl\.at/, /t\.co/,
  /free.*(download|gift|money|movie|update|iphone)/,
  /win.*(prize|lottery|bonus|cash)/,
  /verify.*account/, /login.*account/, /bank.*alert/,
  /http[s]?:\/\/(\d{1,3}\.){3}\d{1,3}/,
  /[a-z]*[0-9]+[a-z]*\.(com|net|org)/,
  /[a@]mazon|faceb00k|paypa1|goog[l1]e|instagr[a@]m/
];

const SPOOF_BRANDS = [
  "facebook", "instagram", "paypal", "amazon", "google", "microsoft", "bank"
];

const SUSPICIOUS_FILE_TYPES = [
  ".exe", ".scr", ".bat", ".cmd", ".dll", ".apk", ".zip", ".rar"
];

export async function analyzeContentTrust(content) {
  const lower = content.toLowerCase();
  let ruleScore = 100;
  let reasons = [];

  // 1. NSFW keyword detection
  const nsfwMatches = NSFW_KEYWORDS.filter(w => lower.includes(w));
  if (nsfwMatches.length > 0) {
    ruleScore -= nsfwMatches.length * 10;
    reasons.push("NSFW content");
  }

  // 2. Toxic keyword detection
  const toxicMatches = TOXIC_KEYWORDS.filter(w => lower.includes(w));
  if (toxicMatches.length > 0) {
    ruleScore -= toxicMatches.length * 8;
    reasons.push("Toxic language");
  }

  // 3. Suspicious domain detection
  const domainMatches = SUSPICIOUS_DOMAINS.filter(regex => regex.test(lower));
  if (domainMatches.length > 0) {
    ruleScore -= domainMatches.length * 15;
    reasons.push("Suspicious domain");
  }

  // 4. Dangerous file type detection
  const fileTypeMatches = SUSPICIOUS_FILE_TYPES.filter(ext => lower.endsWith(ext));
  fileTypeMatches.forEach(ext => {
    if (ext === ".exe" || ext === ".apk") {
      ruleScore -= 40;
      reasons.push("Dangerous file type: " + ext);
    } else {
      ruleScore -= 20;
      reasons.push("Suspicious file type: " + ext);
    }
  });

  // 5. Spoof brand phishing detection
  const spoofMatch = SPOOF_BRANDS.find(brand =>
    lower.includes(brand) &&
    (lower.includes("login") || lower.includes("secure") || lower.includes("account"))
  );
  if (spoofMatch) {
    ruleScore -= 25;
    reasons.push(`Spoofed brand phishing attempt (${spoofMatch})`);
  }

  // 6. ML-based toxicity detection
  let mlScore = 100;
  try {
    const mlResult = await runToxicityAnalysis(content); // { toxic: true/false, score: 0–1 }
    const mlConfidence = 1 - mlResult.score;
    mlScore = Math.round(mlConfidence * 100);
    if (mlResult.toxic) {
      reasons.push("ML-flagged as toxic");
    }
  } catch (err) {
    console.error("ML toxicity analysis failed:", err);
    reasons.push("ML model error (ignored)");
  }

  // Combine rule-based and ML score (weighted)
  let finalScore = Math.round(0.6 * ruleScore + 0.4 * mlScore);
  finalScore = Math.max(0, Math.min(100, finalScore)); // Clamp to [0, 100]

  return {
    score: finalScore,
    isSuspicious: finalScore < 70,
    reason: reasons.length > 0 ? reasons.join(" + ") : "No obvious red flags"
  };
}
