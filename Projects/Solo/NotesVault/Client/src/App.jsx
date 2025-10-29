import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import NoteDetailPage from "./pages/NoteDetailPage.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
import { FloatingThemeToggle } from "./components/FloatingThemeToggle.jsx";

const AppContent = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`relative h-full w-full ${isDark ? 'dark' : 'light-mode'}`}>
      <div className={`absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 ${
        isDark 
          ? '[background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]' 
          : '[background:radial-gradient(125%_125%_at_50%_10%,#fff_60%,#00FF9D20_100%)]'
      }`} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
      <FloatingThemeToggle />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;