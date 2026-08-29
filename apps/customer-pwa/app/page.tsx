export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">OrderMitra</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Customer QR Menu</h1>
      <p className="mt-4 text-lg text-zinc-600">
        Scan the table QR code to browse the menu and place orders instantly.
      </p>
    </main>
  );
}
