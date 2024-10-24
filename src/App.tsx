import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import CreateRoom from "./components/CreateRoom";
import CreateUser from "./components/CreateUser";
import WaitToVotePage from "./components/WaitToVote";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/wait-to-vote" element={<WaitToVotePage />} />
      </Routes>
    </Router>
  );
};

export default App;
