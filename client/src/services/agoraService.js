// services/agoraService.js
import AgoraRTC from 'agora-rtc-sdk-ng';

export const createAgoraClient = () => {
  // Create client with basic configuration
  const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
    enableLogUpload: false,
    enableInnerDataUpload: false
  });

  // Set log level
  AgoraRTC.setLogLevel(3);

  // Add error handler
  client.on('exception', (evt) => {
    console.log(`[Agora] Exception: code: ${evt.code}, msg: ${evt.msg}`);
  });

  return client;
};

// Video configuration
export const videoConfig = {
  encoderConfig: {
    width: 640,
    height: 360,
    frameRate: 30,
    bitrateMin: 400,
    bitrateMax: 1000,
  }
};

// Audio configuration
export const audioConfig = {
  encoderConfig: {
    sampleRate: 48000,
    stereo: true,
    bitrate: 128
  }
};