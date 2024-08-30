export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <iframe
        src="/index.html"
        className="w-full h-full"
        style={{ border: 'none', height: '100vh', width: '100%' }}
      />
    </main>
  );
}
