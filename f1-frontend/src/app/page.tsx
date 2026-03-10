export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
      <h2 className="text-5xl font-black text-slate-800">
        Welcome to the <span className="text-red-600">Pit Lane</span>
      </h2>
      <p className="text-xl text-slate-500 max-w-2xl">
        Select a season from the sidebar to explore historical race results,
        driver standings, and team championships.
      </p>

      <div className="text-9xl animate-pulse mt-8">🏎️</div>
    </div>
  );
}
