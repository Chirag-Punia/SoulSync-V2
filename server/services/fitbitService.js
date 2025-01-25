import axios from "axios";
import User from "../models/User.js";
import FitbitData from "../models/FitbitData.js";
import dotenv from "dotenv";
dotenv.config();
const FITBIT_AUTH_URL = process.env.FITBIT_AUTH_URL;
const FITBIT_TOKEN_URL = process.env.FITBIT_TOKEN_URL;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

export const getFitbitOAuthUrlService = (userId) => {
  return `${FITBIT_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=activity%20heartrate%20sleep%20nutrition&state=${userId}`;
};

export const exchangeFitbitTokenService = async (code, state) => {
  try {
    const tokenResponse = await axios.post(
      FITBIT_TOKEN_URL,
      new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const { access_token, refresh_token, user_id } = tokenResponse.data;

    await User.findOneAndUpdate(
      { firebaseUid: state },
      {
        fitbitAccessToken: access_token,
      },
      { new: true }
    );
    return true;
  } catch (error) {
    console.error("Fitbit token exchange error:", error);
    throw error;
  }
};

export const fetchFitbitDataService = async (user) => {
  try {
    const userData = await User.findOne({ firebaseUid: user.user_id });
    if (!userData || !userData.fitbitAccessToken) {
      throw new Error("Fitbit not connected");
    }

    const FITBIT_API_BASE = "https://api.fitbit.com/1/user/-";
    const endpoints = [
      { name: "activities", url: `${FITBIT_API_BASE}/activities.json` },
      {
        name: "heart_rate",
        url: `${FITBIT_API_BASE}/activities/heart/date/today/1d.json`,
      },
      { name: "sleep", url: `${FITBIT_API_BASE}/sleep/date/today.json` },
      {
        name: "nutrition",
        url: `${FITBIT_API_BASE}/foods/log/date/today.json`,
      },
      {
        name: "body",
        url: `${FITBIT_API_BASE}/body/log/weight/date/today.json`,
      },
    ];

    const requests = endpoints.map((endpoint) =>
      axios
        .get(endpoint.url, {
          headers: {
            Authorization: `Bearer ${userData.fitbitAccessToken}`,
          },
        })
        .catch((error) => ({
          error: true,
          name: endpoint.name,
          message: error.message,
        }))
    );

    const responses = await Promise.all(requests);

    const processedData = {
      user: userData._id,
      activities: responses[0].error ? null : responses[0].data,
      heartRate: responses[1].error ? null : responses[1].data,
      sleep: responses[2].error ? null : responses[2].data,
      nutrition: responses[3].error ? null : responses[3].data,
      body: responses[4].error ? null : responses[4].data,
    };

    const fitbitData = new FitbitData(processedData);
    await fitbitData.save();

    return processedData;
  } catch (error) {
    console.error("Error fetching Fitbit data:", error);
    throw error;
  }
};
