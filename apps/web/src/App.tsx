import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/chat";
import { Toaster } from "@repo/ui/components";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
      </Routes>
      <Toaster closeButton={true} position="top-right" richColors={true} />
    </BrowserRouter>
  );
};

export default App;
