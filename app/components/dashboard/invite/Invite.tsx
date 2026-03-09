// import { useState } from "react";
// import nodeMailer from "nodemailer";
// import axios from "axios";
// import { BASE_API } from "@/service/queryKeys";
// import { message } from "antd";
// const avatars = [
//   { initials: "AK", color: "#7c6aff" },
//   { initials: "SR", color: "#ff6a6a" },
//   { initials: "MJ", color: "#34d399" },
// ];

// export default function InvitePage() {
//   const [email, setEmail] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [sent, setSent] = useState(false);
//   const [hoveredBtn, setHoveredBtn] = useState(false);
//   const [hoveredCopy, setHoveredCopy] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText("hi");
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleSend = async () => {
//     if (!email) return;
//     const data = await axios.post(`${BASE_API}/invite/send`, {
//       message: "nice",
//       email: "ranajitkarmakar631@gmail.com",
//     });
//     console.log("yeeee leee teeraaaa data", data);
//     setSent(true);
//     setEmail("");
//     setTimeout(() => setSent(false), 3000);
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "'Segoe UI', system-ui, sans-serif",
//         padding: "24px",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Background blobs */}
//       <div
//         style={{
//           position: "absolute",
//           width: 400,
//           height: 400,
//           borderRadius: "50%",
//           background: "rgba(124,106,255,0.12)",
//           top: -100,
//           left: -100,
//           filter: "blur(80px)",
//           pointerEvents: "none",
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           width: 300,
//           height: 300,
//           borderRadius: "50%",
//           background: "rgba(255,106,106,0.1)",
//           bottom: -80,
//           right: -80,
//           filter: "blur(60px)",
//           pointerEvents: "none",
//         }}
//       />

//       {/* Card */}
//       <div
//         style={{
//           background: "rgba(255,255,255,0.05)",
//           backdropFilter: "blur(24px)",
//           WebkitBackdropFilter: "blur(24px)",
//           border: "1px solid rgba(255,255,255,0.1)",
//           borderRadius: 24,
//           padding: "48px 40px",
//           width: "100%",
//           maxWidth: 480,
//           boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
//           position: "relative",
//         }}
//       >
//         {/* Badge */}
//         <div
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 6,
//             background: "rgba(124,106,255,0.15)",
//             border: "1px solid rgba(124,106,255,0.3)",
//             borderRadius: 100,
//             padding: "6px 14px",
//             marginBottom: 28,
//           }}
//         >
//           <span
//             style={{
//               width: 7,
//               height: 7,
//               borderRadius: "50%",
//               background: "#7c6aff",
//               display: "inline-block",
//               boxShadow: "0 0 8px #7c6aff",
//             }}
//           />
//           <span
//             style={{
//               fontSize: 12,
//               color: "#a99fff",
//               fontWeight: 600,
//               letterSpacing: "0.05em",
//               textTransform: "uppercase",
//             }}
//           >
//             Chat Room
//           </span>
//         </div>

//         {/* Heading */}
//         <h1
//           style={{
//             fontSize: 34,
//             fontWeight: 700,
//             color: "#fff",
//             lineHeight: 1.2,
//             marginBottom: 12,
//             letterSpacing: "-0.02em",
//           }}
//         >
//           You're invited to
//           <br />
//           <span
//             style={{
//               background: "linear-gradient(90deg, #a78bfa, #f472b6)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             Design Crew 🎨
//           </span>
//         </h1>

//         <p
//           style={{
//             color: "rgba(255,255,255,0.5)",
//             fontSize: 15,
//             lineHeight: 1.6,
//             marginBottom: 32,
//           }}
//         >
//           Join a cozy space where ideas flow freely. Real-time chat, threads,
//           and vibes only.
//         </p>

//         {/* Active members */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             marginBottom: 36,
//           }}
//         >
//           <div style={{ display: "flex" }}>
//             {avatars.map((a, i) => (
//               <div
//                 key={i}
//                 style={{
//                   width: 34,
//                   height: 34,
//                   borderRadius: "50%",
//                   background: a.color,
//                   border: "2px solid #1a1a2e",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#fff",
//                   marginLeft: i === 0 ? 0 : -10,
//                   zIndex: avatars.length - i,
//                   position: "relative",
//                   letterSpacing: "0.02em",
//                 }}
//               >
//                 {a.initials}
//               </div>
//             ))}
//           </div>
//           <div>
//             <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
//               12 members active
//             </div>
//             <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
//               3 online right now
//             </div>
//           </div>
//         </div>

//         {/* Divider */}
//         <div
//           style={{
//             borderTop: "1px solid rgba(255,255,255,0.07)",
//             marginBottom: 28,
//           }}
//         />

//         {/* Invite link section */}
//         <div style={{ marginBottom: 24 }}>
//           <label
//             style={{
//               display: "block",
//               color: "rgba(255,255,255,0.6)",
//               fontSize: 12,
//               fontWeight: 600,
//               letterSpacing: "0.05em",
//               textTransform: "uppercase",
//               marginBottom: 10,
//             }}
//           >
//             Invite Link
//           </label>
//           <div style={{ display: "flex", gap: 8 }}>
//             <div
//               style={{
//                 flex: 1,
//                 background: "rgba(255,255,255,0.05)",
//                 border: "1px solid rgba(255,255,255,0.1)",
//                 borderRadius: 12,
//                 padding: "11px 14px",
//                 color: "rgba(255,255,255,0.4)",
//                 fontSize: 13,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 fontFamily: "monospace",
//               }}
//             >
//               hii
//             </div>
//             <button
//               onClick={handleCopy}
//               onMouseEnter={() => setHoveredCopy(true)}
//               onMouseLeave={() => setHoveredCopy(false)}
//               style={{
//                 padding: "11px 18px",
//                 borderRadius: 12,
//                 border: "1px solid rgba(255,255,255,0.1)",
//                 background: copied
//                   ? "rgba(52,211,153,0.15)"
//                   : hoveredCopy
//                     ? "rgba(255,255,255,0.1)"
//                     : "rgba(255,255,255,0.06)",
//                 color: copied ? "#34d399" : "#fff",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {copied ? "✓ Copied" : "Copy"}
//             </button>
//           </div>
//         </div>

//         {/* Email invite section */}
//         <div style={{ marginBottom: 28 }}>
//           <label
//             style={{
//               display: "block",
//               color: "rgba(255,255,255,0.6)",
//               fontSize: 12,
//               fontWeight: 600,
//               letterSpacing: "0.05em",
//               textTransform: "uppercase",
//               marginBottom: 10,
//             }}
//           >
//             Invite by Email
//           </label>
//           <div style={{ display: "flex", gap: 8 }}>
//             <input
//               type="email"
//               placeholder="friend@email.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               style={{
//                 flex: 1,
//                 background: "rgba(255,255,255,0.05)",
//                 border: "1px solid rgba(255,255,255,0.1)",
//                 borderRadius: 12,
//                 padding: "11px 14px",
//                 color: "#fff",
//                 fontSize: 14,
//                 outline: "none",
//                 transition: "border 0.2s",
//               }}
//               onFocus={(e) =>
//                 (e.target.style.borderColor = "rgba(124,106,255,0.5)")
//               }
//               onBlur={(e) =>
//                 (e.target.style.borderColor = "rgba(255,255,255,0.1)")
//               }
//             />
//             <button
//               onClick={handleSend}
//               onMouseEnter={() => setHoveredBtn(true)}
//               onMouseLeave={() => setHoveredBtn(false)}
//               style={{
//                 padding: "11px 20px",
//                 borderRadius: 12,
//                 border: "none",
//                 background: sent
//                   ? "linear-gradient(135deg, #34d399, #059669)"
//                   : hoveredBtn
//                     ? "linear-gradient(135deg, #9f8fff, #f472b6)"
//                     : "linear-gradient(135deg, #7c6aff, #e070b0)",
//                 color: "#fff",
//                 fontSize: 13,
//                 fontWeight: 700,
//                 cursor: "pointer",
//                 transition: "all 0.25s",
//                 whiteSpace: "nowrap",
//                 boxShadow:
//                   hoveredBtn && !sent
//                     ? "0 4px 20px rgba(124,106,255,0.4)"
//                     : "none",
//               }}
//             >
//               {sent ? "✓ Sent!" : "Send →"}
//             </button>
//           </div>
//         </div>

//         {/* Join button */}
//         <button
//           style={{
//             width: "100%",
//             padding: "15px",
//             background: "linear-gradient(135deg, #7c6aff 0%, #e070b0 100%)",
//             border: "none",
//             borderRadius: 14,
//             color: "#fff",
//             fontSize: 16,
//             fontWeight: 700,
//             cursor: "pointer",
//             letterSpacing: "0.01em",
//             boxShadow: "0 8px 32px rgba(124,106,255,0.35)",
//             transition: "opacity 0.2s, transform 0.2s",
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.opacity = 0.9;
//             e.target.style.transform = "translateY(-1px)";
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.opacity = 1;
//             e.target.style.transform = "translateY(0)";
//           }}
//         >
//           Join the Chat Room
//         </button>

//         {/* Footer note */}
//         <p
//           style={{
//             textAlign: "center",
//             color: "rgba(255,255,255,0.25)",
//             fontSize: 12,
//             marginTop: 20,
//           }}
//         >
//           Free to join · No credit card required
//         </p>
//       </div>
//     </div>
//   );
// }
