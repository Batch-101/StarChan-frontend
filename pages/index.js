import HomeNews from '../components/NewsComps/HomeNews';
import Header from '../components/Header';
import Head from 'next/head';



function IndexPage() {
  return (
    <>
      <Head>
        <meta name="description" content="StarChan est un forum de discussion sur l'astronomie intégrant une galerie photo et les dernières actualités." />
        <title>StarChan</title>
      </Head>
      <Header />
      <HomeNews />
    </>)
}

export default IndexPage;
