export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/bg-kampus.jpg)" }}
    >
      <div className="min-h-screen bg-black/20 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
