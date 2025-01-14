import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CreateRoom from "./components/CreateRoom";
import CreateUser from "./components/CreateUser";
import WaitToVotePage from "./components/WaitToVote";
import Results from "./components/Results";
import Availability from "./components/Availability";
import Dates from "./components/Dates";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Toaster />
      </div>
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/wait-to-vote" element={<WaitToVotePage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/dates" element={<Dates />} />
      </Routes>
    </Router>
  );
};

export default App;
