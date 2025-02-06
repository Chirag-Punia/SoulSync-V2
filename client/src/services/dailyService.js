const DAILY_API_URL = import.meta.env.VITE_DAILY_API_URL;

export const createDailyRoom = async () => {
  try {
    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          enable_chat: true,
          enable_screenshare: false,
          start_video_off: true,
          start_audio_off: false,
          max_participants: 10,
          exp: Math.round(Date.now() / 1000) + 3600 * 24, 
        },
      }),
    });

    const data = await response.json();
    return data.name; 
  } catch (error) {
    console.error("Error creating Daily room:", error);
    throw new Error("Failed to create room");
  }
};
