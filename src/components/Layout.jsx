export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-800 via-red-700 to-slate-200 relative">
      <div className="absolute inset-0 bg-stripes pointer-events-none" />
      <div className="relative min-h-screen flex items-center justify-center p-4 pb-20">
        {children}
      </div>
      <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
        <div className="bg-white rounded-full px-5 py-2 text-sm shadow-lg border border-slate-200">
          <span className="text-slate-500">Powered by </span>
          <span className="font-bold text-slate-800">Telkom University Jakarta</span>
        </div>
      </div>
    </div>
  );
}
