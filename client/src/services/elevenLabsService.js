export const AVAILABLE_VOICES = {
  female: {
    rachel: { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", language: "English" },
    domi: { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", language: "English" },
    bella: { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", language: "English" },
    elli: { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", language: "English" },
  },
  male: {
    adam: { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", language: "English" },
    antoni: { id: "ErXwobaYiN019PkySvjV", name: "Antoni", language: "English" },
    josh: { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", language: "English" },
  },
};

export const elevenLabsService = {
  async textToSpeech(text, voiceId = "AZnzlk1XvdvUeBnXmlld", options = {}) {
    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

    const defaultSettings = {
      stability: 0.5,
      similarity_boost: 0.5,
      style: 0.5,
      use_speaker_boost: true,
    };

    const settings = { ...defaultSettings, ...options };

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: settings,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to convert text to speech");
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Text-to-speech error:", error);
      throw error;
    }
  },

  stopSpeech() {
    window.speechSynthesis.cancel();
  },

  getAvailableVoices() {
    return AVAILABLE_VOICES;
  },
};
