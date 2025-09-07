import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Users from "./pages/UserList.";
import Posts from "./pages/PostList";
import { AppProviders } from "./providers/app";

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
