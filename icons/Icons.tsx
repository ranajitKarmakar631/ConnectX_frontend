import React from 'react'

export const MicIcon = ({ color = "#fff" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const MicOffIcon = ({ color = "#ef4444" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);


export const CameraIcon = ({ color = "#fff" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

export const CameraOffIcon = ({ color = "#ef4444" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h2a2 2 0 0 1 2 2v9.34" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export const PhoneIcon = ({ color = "#fff" }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.47-1.47a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const PhoneEndIcon = ({ color = "#fff" }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.45-3.07M2 2l20 20" />
    <path d="M10.68 13.31A16 16 0 0 1 7.27 9.9L8.54 8.63a2 2 0 0 0 .45-2.11 15.86 15.86 0 0 1-.7-2.81A2 2 0 0 0 6.12 2H3.09A2 2 0 0 0 1.1 4.18 19.79 19.79 0 0 0 4 12.69" />
  </svg>
);


export const AiProfilePicture = () => {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6EE7F9" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="55" fill="url(#aiGrad)" />
      <rect x="30" y="35" width="60" height="50" rx="10" fill="white" />
      <line x1="60" y1="20" x2="60" y2="35" stroke="white" strokeWidth="4" />
      <circle cx="60" cy="18" r="5" fill="white" />

      <circle cx="45" cy="55" r="6" fill="#6366F1" />
      <circle cx="75" cy="55" r="6" fill="#6366F1" />

      <rect x="45" y="70" width="30" height="6" rx="3" fill="#6366F1" />

      <circle cx="30" cy="60" r="3" fill="white" />
      <circle cx="90" cy="60" r="3" fill="white" />
    </svg>
  );
};

export const Spinner = () => (
  <div
    style={{
      width: 16,
      height: 16,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff",
      animation: "spin 0.8s linear infinite",
    }}
  />
);

// ─────────────────────────────────────────────
// Style helpers
// ─────────────────────────────────────────────
export const circleBtn = (isActive: boolean): React.CSSProperties => ({
  width: 52,
  height: 52,
  borderRadius: "50%",
  border: "none",
  background: isActive ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  outline: "none",
  transition: "all 0.2s",
});

export const audioCircleBtn = (
  isActive: boolean,
  bg?: string,
): React.CSSProperties => ({
  width: 64,
  height: 64,
  borderRadius: "50%",
  border: "none",
  background:
    bg ?? (isActive ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.12)"),
  backdropFilter: "blur(12px)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  outline: "none",
  transition: "all 0.2s",
});

