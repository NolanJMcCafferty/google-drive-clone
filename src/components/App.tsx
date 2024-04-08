import { BrowserRouter, Routes, Route } from "react-router-dom";
import Drive from "./Drive";
import SignIn from "./SignIn";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/drive" element={<Drive />} />
        <Route path="/drive/folders/:folderId" element={<Drive />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
