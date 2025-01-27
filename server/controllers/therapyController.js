// controllers/therapyController.js
import pkg from "agora-access-token";
const { RtcTokenBuilder, RtcRole } = pkg;

export const generateToken = (req, res) => {
  try {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const channelName = req.body.channelName;
    const uid = req.body.uid || 0;
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
};

export const createSession = async (req, res) => {
  try {
    const { sessionId, hostId, title, maxParticipants = 10 } = req.body;

    // You can add this to your database schema
    const session = new TherapySession({
      sessionId,
      hostId,
      title,
      maxParticipants,
      participants: [hostId],
      createdAt: new Date(),
      status: "active",
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error("Session creation error:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};
