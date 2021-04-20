export default function Home({ episodes }) {
  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(episodes)}</p>
    </>
  );
}

// The data obtained from the server automatically passes to my index component above
export async function getStaticProps() {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
}
