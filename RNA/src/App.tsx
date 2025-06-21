import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout & Pages
import Layout from "./components/layout/Layout";
import Home from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Research from "./pages/Research";
import RnaStructure from "./pages/RnaStructure";
import NotFound from "./pages/NotFound";
import Predict from "./pages/Predict";
import AuthPage from "./pages/AuthPage"; // ✅ Auth Page

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth page without layout */}
              <Route path="/auth" element={<AuthPage />} />

              {/* All routes wrapped with Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="research" element={<Research />} />
                <Route path="rna-structure" element={<RnaStructure />} />
                <Route path="predict" element={<Predict />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
