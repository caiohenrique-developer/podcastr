import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slyder from "rc-slider";
import "rc-slider/assets/index.css";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasNext,
    hasPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    playState,
    clearPlayerState,
    playNext,
    playPrevious,
  } = usePlayer();

  const playingEpisode = episodeList[currentEpisodeIndex];

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    } else if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () =>
      setProgress(Math.floor(audioRef.current.currentTime))
    );
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;

    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (playNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {playingEpisode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={playingEpisode.thumbnail}
            objectFit="cover"
          />

          <strong>{playingEpisode.title}</strong>
          <span>{playingEpisode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!playingEpisode ? styles.empty : styles.active}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {playingEpisode ? (
              <Slyder
                max={playingEpisode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{
                  borderColor: "#04d361",
                  borderWidth: 4,
                  cursor: "pointer",
                }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>
            {convertDurationToTimeString(playingEpisode?.duration ?? 0)}
          </span>
        </div>

        {playingEpisode && (
          // <!-- Reprodução simples de áudio -->
          <audio
            src={playingEpisode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => playState(true)}
            onPause={() => playState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          >
            O seu navegador não suporta o elemento <code>audio</code>.
          </audio>
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!playingEpisode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling && styles.isActive}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!playingEpisode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!playingEpisode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            disabled={!playingEpisode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!playingEpisode}
            onClick={toggleLoop}
            className={isLooping && styles.isActive}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
