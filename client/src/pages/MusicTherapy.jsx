import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Progress,
  Badge,
} from "@nextui-org/react";
import {
  PlayIcon,
  PauseIcon,
  SearchIcon,
  VolumeIcon,
  SkipForwardIcon,
  SkipBackIcon,
  ShuffleIcon,
  RepeatIcon,
  Heart,
} from "lucide-react";

const musicTracks = [
  {
    id: 1,
    title: "Peaceful Rain",
    artist: "Nature Sounds",
    url: "https://cdn.pixabay.com/download/audio/2024/10/30/audio_42e6870f29.mp3?filename=calming-rain-257596.mp3",
    category: "Nature",
    duration: "3:20",
    image:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Meditation Bells",
    artist: "Healing Sounds",
    url: "https://cdn.pixabay.com/download/audio/2024/04/03/audio_fbb6101bb2.mp3?filename=zen-bells-sound-199835.mp3",
    category: "Meditation",
    duration: "4:15",
    image:
      "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Forest Morning",
    artist: "Nature Ambience",
    url: "https://cdn.pixabay.com/download/audio/2023/07/04/audio_483452e03a.mp3?filename=spring-morning-forest-wildlife-156670.mp3",
    category: "Nature",
    duration: "5:30",
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Deep Meditation",
    artist: "Zen Masters",
    url: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_a4193b8e73.mp3?filename=binaural_delta_500_501-5hz-19563.mp3",
    category: "Meditation",
    duration: "6:00",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Ocean Waves",
    artist: "Sea Sounds",
    url: "https://cdn.pixabay.com/download/audio/2022/06/07/audio_b9bd4170e4.mp3?filename=ocean-waves-112906.mp3",
    category: "Nature",
    duration: "4:45",
    image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop",
  },
];

function MusicTherapy() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const [volume, setVolume] = useState(0.7);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTracks, setFilteredTracks] = useState(musicTracks);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const filtered = musicTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTracks(filtered);
  }, [searchQuery]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  useEffect(() => {
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      updateProgress();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [audio]);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlay = (track) => {
    setLoading(true);
    if (currentTrack && currentTrack.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      if (currentTrack) {
        audio.pause();
      }
      audio.src = track.url;
      audio
        .play()
        .then(() => {
          setCurrentTrack(track);
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition =
      (e.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
    const newTime = clickPosition * audio.duration;
    audio.currentTime = newTime;
    setProgress((newTime / audio.duration) * 100);
  };

  const toggleFavorite = (trackId) => {
    setFavorites((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    );
  };

  const playNext = () => {
    const currentIndex = filteredTracks.findIndex(
      (track) => track.id === currentTrack?.id
    );
    const nextTrack =
      filteredTracks[(currentIndex + 1) % filteredTracks.length];
    handlePlay(nextTrack);
  };

  const playPrevious = () => {
    const currentIndex = filteredTracks.findIndex(
      (track) => track.id === currentTrack?.id
    );
    const previousTrack =
      filteredTracks[
        currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1
      ];
    handlePlay(previousTrack);
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-xl shadow-2xl mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Music Therapy</h1>
        <p className="text-white/80">
          Find peace and relaxation through therapeutic sounds
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/10 p-6 rounded-xl backdrop-blur-sm">
        <Input
          placeholder="Search by title, artist, or category..."
          startContent={<SearchIcon className="text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            color={shuffle ? "success" : "default"}
            variant="light"
            onPress={() => setShuffle(!shuffle)}
          >
            <ShuffleIcon />
          </Button>
          <div className="flex items-center gap-2">
            <VolumeIcon className="text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map((track) => (
          <Card
            key={track.id}
            className="hover:scale-105 transition-transform duration-300 group"
          >
            <CardBody className="p-0 relative overflow-hidden">
              <div
                className="h-48 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${track.image})` }}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{track.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {track.artist}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge color="primary" variant="flat">
                        {track.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {track.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      isIconOnly
                      color={
                        favorites.includes(track.id) ? "danger" : "default"
                      }
                      variant="light"
                      onPress={() => toggleFavorite(track.id)}
                    ></Button>
                    <Button
                      isIconOnly
                      color={
                        currentTrack?.id === track.id ? "secondary" : "primary"
                      }
                      variant="shadow"
                      onPress={() => handlePlay(track)}
                      isLoading={loading && currentTrack?.id === track.id}
                    >
                      {isPlaying && currentTrack?.id === track.id ? (
                        <PauseIcon />
                      ) : (
                        <PlayIcon />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {currentTrack && (
        <Card className="fixed bottom-0 left-0 right-0 bg-background/60 backdrop-blur-md border-t">
          <CardBody className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={currentTrack.image}
                    alt={currentTrack.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {currentTrack.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    isIconOnly
                    color="default"
                    variant="light"
                    onPress={playPrevious}
                  >
                    <SkipBackIcon />
                  </Button>
                  <Button
                    isIconOnly
                    color="secondary"
                    variant="shadow"
                    onPress={() => handlePlay(currentTrack)}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </Button>
                  <Button
                    isIconOnly
                    color="default"
                    variant="light"
                    onPress={playNext}
                  >
                    <SkipForwardIcon />
                  </Button>
                  <Button
                    isIconOnly
                    color={repeat ? "success" : "default"}
                    variant="light"
                    onPress={() => setRepeat(!repeat)}
                  >
                    <RepeatIcon />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatTime(currentTime)}</span>
                <div
                  className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer"
                  onPress={handleProgressClick}
                >
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm">{formatTime(duration)}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default MusicTherapy;
