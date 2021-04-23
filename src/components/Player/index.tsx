import Image from "next/image";
import { useContext } from "react";
import Slyder from "rc-slider";
import "rc-slider/assets/index.css";
import { PlayerContext } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";

export function Player() {
  const { episodeList, currentEpisodeIndex } = useContext(PlayerContext);

  const playingEpisode = episodeList[currentEpisodeIndex];

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

      <footer className={!playingEpisode && styles.empty}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {playingEpisode ? (
              <Slyder
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
          <span>00:00</span>
        </div>

        <div className={styles.buttons}>
          <button type="button" disabled={!playingEpisode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!playingEpisode}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!playingEpisode}
          >
            <img src="/play.svg" alt="Tocar" />
          </button>
          <button type="button" disabled={!playingEpisode}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button type="button" disabled={!playingEpisode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
