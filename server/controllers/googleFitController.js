import { OAuth2Client } from "google-auth-library";
import googleFitService from "../services/googleFitService.js";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CLIENT_FALLBACK
);

class GoogleFitController {
  async generateOAuthUrl(req, res) {
    const userId = req.user.user_id;
    const state = JSON.stringify({ userId });

    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.body.read",
        "https://www.googleapis.com/auth/fitness.nutrition.read",
        "https://www.googleapis.com/auth/fitness.sleep.read",
        "https://www.googleapis.com/auth/fitness.location.read",
      ],
      state: encodeURIComponent(state),
    });

    res.json({ authUrl });
  }

  async handleOAuthCallback(req, res) {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).send("Authorization code is required");
    }

    try {
      const decodedState = JSON.parse(decodeURIComponent(state));
      const userId = decodedState.userId;

      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      const access_token = tokens.access_token;
      await User.findOneAndUpdate(
        { firebaseUid: userId },
        {
          googleFitAccessToken: access_token,
        },
        { new: true }
      );

      res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      console.error("Error exchanging authorization code:", error.message);
      res.status(500).send("Failed to authenticate with Google");
    }
  }

  async fetchAndStoreGoogleFitData(req, res) {
    try {
      const userData = await User.findOne({ firebaseUid: req.user.user_id });
      const result = await googleFitService.fetchGoogleFitData(
        userData.googleFitAccessToken,
        userData._id
      );
      res.json(result);
    } catch (error) {
      console.error("Error fetching Google Fit data:", error);
      res.status(500).send("Failed to fetch Google Fit data");
    }
  }

  async getStoredGoogleFitData(req, res) {
    try {
      const data = await googleFitService.getStoredGoogleFitData(req.user._id);
      res.json(data);
    } catch (error) {
      res.status(500).send("Error retrieving Google Fit data");
    }
  }
}

export default new GoogleFitController();
