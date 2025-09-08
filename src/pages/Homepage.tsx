import Navbar from "../components/Navbar";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-black relative">
      <div className="rays-container">
        <div className="ray"></div>
        <div className="ray"></div>
        <div className="ray"></div>
        <div className="ray"></div>
        <div className="ray"></div>
        <div className="ray"></div>
      </div>
      <Navbar />
      <main className="pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto"></div>
      </main>
    </div>
  );
}
