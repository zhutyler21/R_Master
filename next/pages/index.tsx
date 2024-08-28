import Head from 'next/head';
import ChatContainer from '../components/ChatContainer';

export default function Home() {
  return (
    <>
      <Head>
        <title>R语言小精灵</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <ChatContainer />
    </>
  );
}