import Head from 'next/head';
import ChatContainer from '../components/ChatContainer';
import { Global, css } from '@emotion/react';

export default function Home() {
  return (
    <>
      <Global
        styles={css`
          @keyframes gradientAnimation {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Noto Sans SC', sans-serif;
          }
        `}
      />
      <Head>
        <title>R语言小精灵</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ChatContainer />
    </>
  );
}