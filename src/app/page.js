import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import './globals.css'
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
        </main>
      </div>
    </>
  );
} 