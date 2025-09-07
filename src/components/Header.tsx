import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img
                src="https://davinciboardgame.com/wp-content/uploads/2023/01/Hy8uge6SCowHNV4QUwQ1_abBLok08iS03jz2W.png"
                alt="Da Vinci Board Game Logo"
                className="h-12 w-auto"
              />
            </Link>
            <h1 className="text-xl font-bold text-amber-900">
              Da Vinci Board Game
            </h1>
          </div>

          <nav className="flex gap-6">
            <Link
              to="/users"
              className="text-amber-800 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              Users
            </Link>
            <Link
              to="/posts"
              className="text-amber-800 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              Posts
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
