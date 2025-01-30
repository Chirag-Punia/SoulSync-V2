import { auth } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

let accessToken = null;

export const googleCalendarService = {
  isAuthorized() {
    return !!accessToken;
  },

  clearAuthorization() {
    accessToken = null;
  },

  async authorize() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/calendar.readonly");
      provider.addScope("https://www.googleapis.com/auth/calendar.events");

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      accessToken = credential.accessToken; // Store the access token
      return accessToken;
    } catch (error) {
      console.error("Google Calendar authorization error:", error);
      throw error;
    }
  },

  async getEvents(startDate = new Date()) {
    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const timeMin = new Date(startDate);
      const timeMax = new Date(startDate);
      timeMax.setDate(timeMax.getDate() + 7);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
          new URLSearchParams({
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: "startTime",
          }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Calendar API Error:", errorData);
        if (response.status === 401) {
          this.clearAuthorization();
        }
        throw new Error(
          errorData.error?.message || "Failed to fetch calendar events"
        );
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      throw error;
    }
  },

  async addEvent(event) {
    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Calendar API Error:", errorData);
        if (response.status === 401) {
          this.clearAuthorization();
        }
        throw new Error(errorData.error?.message || "Failed to add event");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      throw error;
    }
  },
};
