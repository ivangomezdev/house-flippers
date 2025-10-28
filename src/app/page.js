import Head from 'next/head';
import Navbar from '../components/NavBar';
import Hero from '../components/Hero';
import Properties from '@/components/Propertys';


export default function Home() {

  return (
    <>
      <Head>
        <title>Green Ray - We Buy Houses For Cash</title>
        <meta name="description" content="We buy houses and renovate them. Fair value and fast closings." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page">
        <Navbar />
        <main className="main">
          <Hero />
          <Properties />
        </main>
      </div>
    </>
  );
}