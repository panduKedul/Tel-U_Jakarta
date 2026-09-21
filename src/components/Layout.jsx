export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url(/bg-kampus.jpg)" }}
    >
      <div className="min-h-screen bg-black/20 flex items-center justify-center p-4 pb-20">
        {children}
      </div>
      <div className="absolute bottom-4 right-4 bg-white/90 rounded-full px-5 py-2 flex items-center gap-2 text-sm shadow-lg">
        <span className="text-slate-500">Powered by</span>
        <span className="font-bold text-slate-800">Telkom University</span>
        <span className="text-slate-300">|</span>
        <span className="font-bold text-slate-800">DASKOM Laboratory</span>
        <span className="text-slate-300">|</span>
        <span className="font-bold text-teal-600">CONNECTED</span>
      </div>
    </div>
  );
}
