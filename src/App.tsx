import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Topics from "./components/Topics";
import Note from "./components/Note";
import Chapters from "./components/Chapters";
import { ThemeProvider } from "./components/theme-provider";
import { Navigation } from "./components/Navigation";
import { useState } from "react";

const App: React.FC = () => {
  const [nextChapter, setNextChapter] = useState<string>("");
  const [lastChapter, setLastChapter] = useState<string>("");
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/Topics" element={<Topics />} />
          <Route path="/Chapters" element={<Chapters />} />
          <Route path="/Note" element={<Note />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
