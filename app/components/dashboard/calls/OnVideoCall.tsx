"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSocket } from "@/app/SocketProvider";
import { createPeerConnection } from "@/service/peerService/peerService";
import { useSelector } from "react-redux";
import { convertObjectNameToString } from "@/uiHelper";
import { useGetProfileDetails } from "@/service/userProfile/userProfileService";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type CallType = "video" | "audio";

interface OnCallProps {
  callType: CallType;
  declineCall?: () => void;
  acceptCall?: () => void;
  isCallActive?: boolean;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const OnCall = ({
  callType,
  declineCall,
  acceptCall,
  isCallActive,
}: OnCallProps) => {
  // alert(callType)
  const isVideo = callType === "video";
  const socket = useSocket();
  const socketRef = useRef<any>(null);

  const incomingCall = useSelector((state: any) => state.chat.incomingCall);
  console.log("incomingCallllll", incomingCall);
  const outgoingCall = useSelector((state: any) => state.chat.outgoingCall);
  const currentUserId = useSelector((state: any) => state.auth?._id);
  const currentUser = useSelector((state: any) => state.auth?.user);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const { data } = useGetProfileDetails({ filter: { userId: currentUserId } });
  const currentUserDisplayName = data?.data?.displayName;
  // console.log('yeeemeraprofile',currentUser_profile)
  const incomingCallType = incomingCall?.callType;

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const targetIdRef = useRef<string | null>(null);
  const iceQueue = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescSet = useRef(false);
  const handshakeStarted = useRef(false);

  const incomingCallRef = useRef<any>(null);
  const outgoingCallRef = useRef<any>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);
  useEffect(() => {
    outgoingCallRef.current = outgoingCall;
  }, [outgoingCall]);
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    const id = incomingCall?.senderId || outgoingCall?.receiverId || null;
    targetIdRef.current = id;
  }, [incomingCall, outgoingCall]);

  const callerName =
    incomingCall?.senderName || outgoingCall?.receiverName || "Unknown";

  // ── Video element sync ──────────────────────
  useEffect(() => {
    if (localVideoRef.current && localStream)
      localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream)
      remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  // ── Timer ───────────────────────────────────
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => setCallDuration((p) => p + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected]);

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // ── Start Media ──────────────────────────────
  const startMedia = useCallback(
    async (callType: string): Promise<MediaStream | null> => {
      if (localStreamRef.current) {
        const tracks = localStreamRef.current.getTracks();
        if (tracks.every((t) => t.readyState === "live") && tracks.length > 0)
          return localStreamRef.current;
        tracks.forEach((t) => t.stop());
        localStreamRef.current = null;
        setLocalStream(null);
        await new Promise((r) => setTimeout(r, 300));
      }

      // Audio-only call: request only audio

      const constraints: MediaStreamConstraints =
        callType === "audio"
          ? { video: false, audio: true }
          : { video: true, audio: true };

      const tryGet = async () => {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        return stream;
      };

      try {
        return await tryGet();
      } catch (err: any) {
        if (err.name === "NotReadableError" || err.name === "AbortError") {
          await new Promise((r) => setTimeout(r, 800));
          try {
            return await tryGet();
          } catch {
            return null;
          }
        }
        console.error("❌ Media error:", err);
        return null;
      }
    },
    [incomingCallType, callType],
  );

  // ── Setup Peer ───────────────────────────────
  const setupPeer = useCallback((): RTCPeerConnection => {
    if (pcRef.current) return pcRef.current;
    const pc = createPeerConnection();
    pcRef.current = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate && targetIdRef.current) {
        socketRef.current?.emit("ice-candidate", {
          to: targetIdRef.current,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      const stream = e.streams[0];
      if (stream) {
        setRemoteStream(stream);
        setIsConnected(true);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (
        pc.iceConnectionState === "connected" ||
        pc.iceConnectionState === "completed"
      )
        setIsConnected(true);
    };

    return pc;
  }, []);

  // ── Outgoing call ────────────────────────────
  const startOutgoingCall = useCallback(async () => {
    const call = outgoingCallRef.current;
    if (!call || handshakeStarted.current) return;
    if (!socketRef.current) {
      setTimeout(startOutgoingCall, 500);
      return;
    }

    handshakeStarted.current = true;
    const stream = await startMedia(callType);
    if (!stream) {
      handshakeStarted.current = false;
      return;
    }

    const pc = setupPeer();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit("start:calling", {
      chatId: call.chatId,
      senderId: currentUserId,
      receiverId: call.receiverId,
      senderName: currentUserDisplayName,
      receiverName: callType, // ← send callType so receiver knows what kind of call this is
      offer,
    });
  }, [
    callType,
    currentUserId,
    currentUserDisplayName,
    currentUser,
    startMedia,
    setupPeer,
  ]);

  // ── Incoming call accept ─────────────────────
  const acceptIncomingCall = useCallback(async () => {
    const call = incomingCallRef.current;
    if (!call?.offer || handshakeStarted.current) return;

    handshakeStarted.current = true;
    setIsAccepting(true);

    try {
      const stream = await startMedia(incomingCallType);
      if (!stream) {
        handshakeStarted.current = false;
        setIsAccepting(false);
        return;
      }

      const pc = setupPeer();
      await pc.setRemoteDescription(new RTCSessionDescription(call.offer));
      remoteDescSet.current = true;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      while (iceQueue.current.length > 0) {
        const c = iceQueue.current.shift();
        if (c) await pc.addIceCandidate(new RTCIceCandidate(c));
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current?.emit("answer:call", { to: call.senderId, answer });
      acceptCall?.();
    } catch (err) {
      console.error("❌ Accept error:", err);
      handshakeStarted.current = false;
    } finally {
      setIsAccepting(false);
    }
  }, [startMedia, setupPeer, acceptCall]);

  // ── Socket listeners ─────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleAnswer = async ({ answer }: any) => {
      if (!pcRef.current) return;
      try {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
        remoteDescSet.current = true;
        while (iceQueue.current.length > 0) {
          const c = iceQueue.current.shift();
          if (c) await pcRef.current.addIceCandidate(new RTCIceCandidate(c));
        }
      } catch (err) {
        console.error("❌ Answer error:", err);
      }
    };

    const handleIce = async ({ candidate }: any) => {
      if (!pcRef.current) {
        iceQueue.current.push(candidate);
        return;
      }
      if (remoteDescSet.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("❌ ICE error:", err);
        }
      } else {
        iceQueue.current.push(candidate);
      }
    };

    socket.on("answered:call", handleAnswer);
    socket.on("ice-candidate", handleIce);
    return () => {
      socket.off("answered:call", handleAnswer);
      socket.off("ice-candidate", handleIce);
    };
  }, [socket]);

  // ── Auto-start outgoing ──────────────────────
  useEffect(() => {
    if (outgoingCall?.receiverId && !incomingCall && socket)
      startOutgoingCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outgoingCall?.receiverId, socket]);

  // ── Pre-start camera/mic for incoming preview ─
  useEffect(() => {
    if (
      incomingCall?.senderId &&
      !localStreamRef.current &&
      !handshakeStarted.current
    )
      startMedia(incomingCallType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingCall?.senderId]);

  // ── Toggle Mic ────────────────────────────────
  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((p) => !p);
  };

  // ── Toggle Camera (video only) ────────────────
  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsCameraOff((p) => !p);
  };

  // ── Hangup ────────────────────────────────────
  const hangup = () => {
    if (targetIdRef.current)
      socketRef.current?.emit("end-call", { to: targetIdRef.current });
    if (timerRef.current) clearInterval(timerRef.current);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    iceQueue.current = [];
    remoteDescSet.current = false;
    handshakeStarted.current = false;
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
    setCallDuration(0);
    declineCall?.();
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      pcRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );

  // ─────────────────────────────────────────────
  // Render: Audio Call UI
  // ─────────────────────────────────────────────
  if (!isVideo) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "75vh",
          minHeight: 420,
          background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
          borderRadius: 24,
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 24px 32px",
        }}
      >
        {/* Top status */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: isConnected
                ? "rgba(34,197,94,0.15)"
                : "rgba(234,179,8,0.15)",
              border: `1px solid ${isConnected ? "rgba(34,197,94,0.4)" : "rgba(234,179,8,0.4)"}`,
              borderRadius: 20,
              padding: "4px 14px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: isConnected ? "#22c55e" : "#eab308",
              }}
            />
            <span
              style={{
                color: isConnected ? "#22c55e" : "#eab308",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {isConnected ? "Voice connected" : "Connecting…"}
            </span>
          </div>
          <p
            style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}
          >
            {isVideo ? "Video call" : "Voice call"}
          </p>
        </div>

        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Rings */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(!isCallActive || isConnected) &&
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    border: "2px solid rgba(139,92,246,0.3)",
                    animation: "ringPulse 2.4s ease-out infinite",
                    animationDelay: `${i * 0.6}s`,
                  }}
                />
              ))}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                fontWeight: 700,
                color: "#fff",
                boxShadow:
                  "0 0 0 4px rgba(99,102,241,0.25), 0 12px 40px rgba(99,102,241,0.4)",
                zIndex: 1,
                position: "relative",
              }}
            >
              {callerName?.[0]?.toUpperCase() || "?"}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.3px",
              }}
            >
              {callerName}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 14,
                marginTop: 6,
                margin: "6px 0 0",
              }}
            >
              {isConnected
                ? formatDuration(callDuration)
                : isAccepting
                  ? "Connecting..."
                  : incomingCall
                    ? "Incoming voice call"
                    : "Calling..."}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {isCallActive && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <button
                onClick={toggleMute}
                style={audioCircleBtn(isMuted, isMuted ? "#ef4444" : undefined)}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </button>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                {isMuted ? "Unmute" : "Mute"}
              </span>
            </div>
          )}

          {/* Accept */}
          {!isCallActive && incomingCall && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <button
                onClick={acceptIncomingCall}
                disabled={isAccepting}
                style={{
                  ...audioCircleBtn(false, "#22c55e"),
                  opacity: isAccepting ? 0.6 : 1,
                  cursor: isAccepting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 20px rgba(34,197,94,0.5)",
                }}
              >
                {isAccepting ? <Spinner /> : <PhoneIcon />}
              </button>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                Accept
              </span>
            </div>
          )}

          {/* End/Decline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <button
              onClick={hangup}
              style={{
                ...audioCircleBtn(false, "#ef4444"),
                boxShadow: "0 4px 20px rgba(239,68,68,0.5)",
              }}
            >
              <PhoneEndIcon />
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
              {isCallActive ? "End" : "Decline"}
            </span>
          </div>
        </div>

        {/* Hidden audio elements for audio call */}
        <audio
          ref={localVideoRef as any}
          autoPlay
          muted
          style={{ display: "none" }}
        />
        <audio
          ref={remoteVideoRef as any}
          autoPlay
          style={{ display: "none" }}
        />

        <style>{`
          @keyframes ringPulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Render: Video Call UI
  // ─────────────────────────────────────────────
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "75vh",
        minHeight: 480,
        background: "#0f0f0f",
        borderRadius: 24,
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          background: "#000",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* No remote stream placeholder */}
      {!remoteStream && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!isCallActive &&
              !isAccepting &&
              incomingCall &&
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    border: "2px solid rgba(99,102,241,0.4)",
                    animation: "ringPulse 2s ease-out infinite",
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                color: "#fff",
                fontWeight: 700,
                boxShadow: "0 0 0 8px rgba(99,102,241,0.2)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {callerName?.[0]?.toUpperCase() || "?"}
            </div>
          </div>
          <p
            style={{ color: "#fff", fontSize: 22, fontWeight: 600, margin: 0 }}
          >
            {callerName}
          </p>
          <p
            style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}
          >
            {isAccepting
              ? "Connecting..."
              : isCallActive
                ? "Connecting..."
                : incomingCall
                  ? "Incoming video call"
                  : "Calling..."}
          </p>
        </div>
      )}

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 10,
        }}
      >
        <div>
          <p
            style={{
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              margin: 0,
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            {callerName}
          </p>
          <p
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0 }}
          >
            {isConnected
              ? formatDuration(callDuration)
              : isAccepting || isCallActive
                ? "Connecting..."
                : ""}
          </p>
        </div>
        <div
          style={{
            background: isConnected
              ? "rgba(34,197,94,0.2)"
              : "rgba(234,179,8,0.2)",
            border: `1px solid ${isConnected ? "rgba(34,197,94,0.5)" : "rgba(234,179,8,0.5)"}`,
            borderRadius: 20,
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: isConnected ? "#22c55e" : "#eab308",
            }}
          />
          <span
            style={{
              color: isConnected ? "#22c55e" : "#eab308",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {isConnected ? "Live" : "Waiting"}
          </span>
        </div>
      </div>

      {/* Local PiP */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          right: 20,
          width: 130,
          height: 90,
          borderRadius: 16,
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.15)",
          background: "#1a1a2e",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          zIndex: 10,
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: isCameraOff ? "none" : "block",
          }}
        />
        {isCameraOff && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
            }}
          >
            Camera off
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 6,
            background: "rgba(0,0,0,0.5)",
            borderRadius: 6,
            padding: "1px 6px",
            color: "rgba(255,255,255,0.8)",
            fontSize: 10,
            fontWeight: 500,
          }}
        >
          You
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          zIndex: 10,
        }}
      >
        {isCallActive && (
          <button onClick={toggleMute} style={circleBtn(isMuted)}>
            {isMuted ? <MicOffIcon color="#ef4444" /> : <MicIcon />}
          </button>
        )}

        {!isCallActive && incomingCall && (
          <button
            onClick={acceptIncomingCall}
            disabled={isAccepting}
            style={{
              height: 56,
              padding: "0 28px",
              borderRadius: 28,
              border: "none",
              background: isAccepting
                ? "rgba(34,197,94,0.5)"
                : "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: isAccepting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(34,197,94,0.4)",
              outline: "none",
              transition: "all 0.2s",
            }}
          >
            {isAccepting ? (
              <>
                <Spinner /> Connecting...
              </>
            ) : (
              <>
                <PhoneIcon /> Accept
              </>
            )}
          </button>
        )}

        <button
          onClick={hangup}
          style={{
            height: 56,
            padding: "0 28px",
            borderRadius: 28,
            border: "none",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
            outline: "none",
          }}
        >
          <PhoneEndIcon /> {isCallActive ? "End Call" : "Decline"}
        </button>

        {isCallActive && (
          <button onClick={toggleCamera} style={circleBtn(isCameraOff)}>
            {isCameraOff ? <CameraOffIcon color="#ef4444" /> : <CameraIcon />}
          </button>
        )}
      </div>

      <style>{`
        @keyframes ringPulse { 0% { transform:scale(1);opacity:.7; } 100% { transform:scale(2.8);opacity:0; } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────
// Icon components
// ─────────────────────────────────────────────
const MicIcon = ({ color = "#fff" }) => (
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

const MicOffIcon = ({ color = "#ef4444" }) => (
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

const CameraIcon = ({ color = "#fff" }) => (
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

const CameraOffIcon = ({ color = "#ef4444" }) => (
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

const PhoneIcon = ({ color = "#fff" }) => (
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

const PhoneEndIcon = ({ color = "#fff" }) => (
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

const Spinner = () => (
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
const circleBtn = (isActive: boolean): React.CSSProperties => ({
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

const audioCircleBtn = (
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

export default OnCall;
