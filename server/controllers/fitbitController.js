import {
  getFitbitOAuthUrlService,
  exchangeFitbitTokenService,
  fetchFitbitDataService,
} from "../services/fitbitService.js";

export const getFitbitOAuthUrl = (req, res) => {
  try {
    const authUrl = getFitbitOAuthUrlService(req.user.user_id);
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate OAuth URL" });
  }
};

export const handleFitbitCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    await exchangeFitbitTokenService(code, state);
    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.error("Fitbit authentication error:", error);
    res.status(500).send("Authentication failed");
  }
};
export const fetchFitbitData = async (req, res) => {
  try {
    const data = await fetchFitbitDataService(req.user);
    res.json(data);
  } catch (error) {
    console.error("Fitbit data fetch error:", error);
    res.status(500).json({ error: "Failed to fetch Fitbit data" });
  }
};
