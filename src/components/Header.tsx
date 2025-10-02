import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black/80 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50 border-b border-amber-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://i.pinimg.com/564x/50/18/23/501823890cf2be28743ac4861742d294.jpg"
                alt="Test Game Logo"
                className="h-16 sm:h-20 w-auto rounded-full shadow-lg border-4 border-amber-400 bg-black p-1"
                style={{ maxWidth: 80 }}
              />
              <span className="text-2xl sm:text-3xl font-bold text-amber-300 align-middle">
                Test Game
              </span>
            </Link>
          </div>

          <nav className="flex gap-4 sm:gap-6 pb-2 sm:pb-0">
            <Link
              to="/users"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200"
            >
              Users
            </Link>
            <Link
              to="/posts"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200"
            >
              Posts
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
