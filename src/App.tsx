import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topics from "./components/Topics";
import Note from "./components/Note";
import Chapters from "./components/Chapters";
import { ThemeProvider } from "./components/theme-provider";
import { Navigation } from "./components/Navigation";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Topics />} />
          <Route path="/Topics" element={<Topics />} />
          <Route path="/Chapters" element={<Chapters />} />
          <Route path="/Note" element={<Note />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
