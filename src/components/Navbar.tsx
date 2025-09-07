import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-black/80 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50 border-b border-amber-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="https://davinciboardgame.com/wp-content/uploads/2023/01/Hy8uge6SCowHNV4QUwQ1_abBLok08iS03jz2W.png"
                alt="Da Vinci Board Game Logo"
                className="h-8 sm:h-10 w-auto brightness-125"
              />
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-amber-300 truncate">
                Da Vinci Board Game
              </h1>
            </Link>
          </div>

          <nav className="flex gap-4 sm:gap-6 pb-2 sm:pb-0">
            <Link
              to="/"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200 border-b border-amber-400/50"
            >
              Home
            </Link>
            <Link
              to="/users"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200 border-b border-amber-400/50"
            >
              Users
            </Link>
            <Link
              to="/posts"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200 border-b border-amber-400/50"
            >
              Posts
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
