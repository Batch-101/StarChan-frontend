import HomeNews from '../components/NewsComps/HomeNews';
import Header from '../components/Header';
import Head from 'next/head';



function IndexPage() {
  return (
    <>
      <Head>
        <title>StarChan</title>
      </Head>
      <Header />
      <HomeNews />
    </>)
}

export default IndexPage;
