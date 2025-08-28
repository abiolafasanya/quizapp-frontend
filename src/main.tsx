import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthPage from "./page/AuthPage.tsx";
import HomePage from "./page/HomePage.tsx";
import { PrivateRoute } from "./components/PrivateRoute.tsx";
import AppInitProvider from "./components/AppInitProvider.tsx";
import AppLayout from "./components/layout/AppLayout.tsx";
import QuizAndResults from "./features/quiz/QuizAndResult.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppInitProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <HomePage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <PrivateRoute>
                <AppLayout>
                  <QuizAndResults />
                </AppLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AppInitProvider>
  </React.StrictMode>
);
