import React from "react";
import RightsCard from "../components/RightsCard";
import { useNavigate } from "react-router-dom";
import "./KnowYourRights.css";

import image26 from '../Images/image26.png';
import image27 from '../Images/image27.png';
import image28 from '../Images/image28.png';
import image29 from '../Images/image29.png';

const rightsSections = [
  {
    title: "Laws & Rights",
    description:
      "Understand your legal protections. Learn about Indian laws that safeguard you from online abuse, stalking, and privacy violations.",
    bgColor: "#F7CFC7",
    icon: image26,
    route: "/rights/laws-&-rights",
  },
  {
    title: "Real Stories",
    description:
      "Real people. Real action. Explore true cases of digital abuse victims who fought back using legal tools — and how you can too.",
    bgColor: "#C2F0F5",
    icon: image29,
    route: "/know-your-rights/real-stories",
  },
  {
    title: "Legal Tips & FAQs",
    description:
      "What to do when things go wrong. Find actionable advice for reporting cybercrimes, collecting evidence, and protecting yourself legally.",
    bgColor: "#E5C8FF",
    icon: image27,
    route: "/know-your-rights/legal-tips",
  },
  {
    title: "Awareness Campaigns",
    description:
      "Stay informed. Stay safe. Access posters, helplines, and digital safety campaigns that promote responsible tech use and legal awareness.",
    bgColor: "#F7C7F0",
    icon: image28,
    route: "/know-your-rights/awareness-campaigns",
  },
];

function KnowYourRights() {
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route !== "#") navigate(route);
  };

  return (
    <div
      style={{
        minHeight: "100vh", // Important fix: avoid black screen issue
        width: "100vw",
        overflowX: "hidden",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        fontFamily: "Inter, sans-serif",
        color: "#43016E",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "40px",
      }}
    >
      <h2
        style={{
          fontWeight: "bold",
          fontSize: "clamp(22px, 4vw, 32px)",
          marginTop: "40px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Know Your Rights Hub
      </h2>

      <div
        style={{
          display: "grid",
          gap: "24px",
          padding: "20px",
          maxWidth: "600px",
          width: "100%",
          justifyContent: "center",
        }}
        className="rights-grid"
      >
        {rightsSections.map((section, index) => (
          <div
            key={index}
            onClick={() => handleClick(section.route)}
            style={{ cursor: "pointer" }}
          >
            <RightsCard
              title={section.title}
              description={section.description}
              bgColor={section.bgColor}
              icon={section.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default KnowYourRights;
