import Head from 'next/head'
import Chat from '../components/Chat'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5e6d3] flex items-center justify-center">
      <Head>
        <title>R语言小精灵</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-2xl">
        <Chat />
      </main>
    </div>
  )
}