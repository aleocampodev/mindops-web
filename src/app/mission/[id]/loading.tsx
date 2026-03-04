export default function MissionDetailLoading() {
  return (
    <main className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          Loading Mission…
        </p>
      </div>
    </main>
  );
}
