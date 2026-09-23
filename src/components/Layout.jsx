export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-800 via-red-700 to-slate-200 relative">
      <div className="absolute inset-0 bg-stripes pointer-events-none" />
      <div className="relative min-h-screen flex items-center justify-center p-4 pb-20">
        {children}
      </div>
      <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
        <div className="bg-white rounded-full px-5 py-2 text-sm shadow-lg border border-slate-200 pointer-events-auto">
          <span className="text-slate-500">Powered by </span>
          <a
            href="https://bte-jkt.telkomuniversity.ac.id/informasi/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-800 hover:text-red-700 hover:underline"
          >
            Telkom University Jakarta
          </a>
          <span className="text-slate-300 mx-2">|</span>
          <span className="text-slate-500">Developed by </span>
          <a
            href="https://resume-pandu.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-800 hover:text-red-700 hover:underline"
          >
            Muhammad Pandu Wirakusuma
          </a>
        </div>
      </div>
    </div>
  );
}
