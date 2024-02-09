import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import TrackService from "../apiServices/TrackService";
import APP_ENV from "../configs/appEnv";
import "./musicPlayer.css";
const TRACK_LIMIT = 10;
export default function MusicPlayer() {
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [offset, setCurrentOffset] = useState(0);
  useEffect(() => {
    if (currentTrack) {
      let sound = new Howl({
        src: `${APP_ENV.API_TRACK_BASE_URL}${currentTrack?.streamUrl}`,
        htmls:true
      });

      const onSoundPlaying = (p) => {
        setIsPlaying(true);
      };
      const onSoundPause = (p) => {
        setIsPlaying(false);
      };
      sound.on("play", onSoundPlaying);
      sound.on("pause", onSoundPause);
      sound.on("stop", onSoundPause);
      sound.once("load", () => {
        sound.play();
      });
      soundRef.current = sound;

      return () => {
        sound.off("play", onSoundPlaying);
        sound.off("pause", onSoundPause);
        sound.off("stop", onSoundPause);
        sound?.unload?.();
      };
    }
  }, [currentTrack]);
  const getMusicTrack = async (
    offset = 0,
    limit = TRACK_LIMIT,
    ignore = false
  ) => {
    try {
      let response = await TrackService.getTracks({ limit, offset });
      if (response?.status === 200 && !ignore) {
        const { data: respData } = response;
        setTracks(respData?.body?.tracks);
        setCurrentTrack(respData?.body?.tracks?.[0]);
        setCurrentOffset(offset);
      }
    } catch (err) {
      console.log("Error getting music tracks: ", err);
    }
  };
  useEffect(() => {
    let ignore = false;
    getMusicTrack(0, TRACK_LIMIT, ignore);
    return () => {
      ignore = true;
    };
  }, []);

  const onPause = () => {
    soundRef.current?.pause?.();
  };
  const onPlay = () => {
    soundRef.current?.play?.();
  };
  const onStop = () => {
    soundRef.current?.stop?.();
  };
  const onNext = () => {
    soundRef.current?.stop?.();
    const findTrackIndex = tracks.findIndex((d) => d.id === currentTrack?.id);
    if (findTrackIndex !== -1 && tracks?.length - 2 >= findTrackIndex) {
      setCurrentTrack(tracks[findTrackIndex + 1]);
    } else {
      getMusicTrack(offset + TRACK_LIMIT);
    }
  };

  return (
    <section className="music-player-wrapper">
      <h2 className="track-title">{currentTrack?.title || ""}</h2>
      <div className="album-bg-art-wrapper">
        <img
          src={
            currentTrack?.artworkUrl
              ? `${APP_ENV.API_TRACK_BASE_URL}${currentTrack?.artworkUrl}`
              : ""
          }
          alt="album-art"
        />
      </div>
      <div className="album-art-wrapper">
        <img
          src={
            currentTrack?.artworkUrl
              ? `${APP_ENV.API_TRACK_BASE_URL}${currentTrack?.artworkUrl}`
              : ""
          }
          alt="album-art"
        />
      </div>
      <div className="player-controler">
        {isPlaying ? (
          <button className="play-pause-control" onClick={onPause}>
            Pause
          </button>
        ) : (
          <button className="play-pause-control" onClick={onPlay}>
            Play
          </button>
        )}

        <button className="stop-control" onClick={onStop}>
          Stop
        </button>
        <button className="next-control" onClick={onNext}>
          Next
        </button>
      </div>
    </section>
  );
}
