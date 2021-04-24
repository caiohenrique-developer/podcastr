import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import api from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from "./homepage.module.scss";
import { usePlayer } from "../contexts/PlayerContext";

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type HomeProps = {
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((latestEpisode, index) => {
            return (
              <li key={latestEpisode.id}>
                <Image
                  width={192}
                  height={192}
                  src={latestEpisode.thumbnail}
                  alt={latestEpisode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${latestEpisode.id}`}>
                    <a>{latestEpisode.title}</a>
                  </Link>
                  <p>{latestEpisode.members}</p>
                  <span>{latestEpisode.publishedAt}</span>
                  <span>{latestEpisode.durationAsString}</span>
                </div>

                <button
                  type="button"
                  onClick={() => playList(episodeList, index)}
                >
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((allEpisode, index) => {
              return (
                <tr key={allEpisode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={allEpisode.thumbnail}
                      alt={allEpisode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${allEpisode.id}`}>
                      <a>{allEpisode.title}</a>
                    </Link>
                  </td>
                  <td>{allEpisode.members}</td>
                  <td style={{ width: 100 }}>{allEpisode.publishedAt}</td>
                  <td>{allEpisode.durationAsString}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playList(episodeList, index + latestEpisodes.length)
                      }
                    >
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

// The data obtained from the server automatically passes to my index component above
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
