import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import SignUp from "./pages/SingUp/SignUp";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import WorkSpace from "./pages/WorkSpace/WorkSpace";
import SettingPage from "./pages/SettingPage/SettingPage";
import ProtectedRoute from "./ProtectedRoute";
import ShareAccessHandler from "./components/AccessHandles/ShareAccessHandler";
import FormBot from "./pages/FormBot/FormBot";
import ResponsePage from "./pages/Response/ResponsePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/share/:token" element={<ShareAccessHandler />} />
      <Route path="/form-bot/:formId" element={<FormBot />} />
      <Route path="/workspace/:formId" element={<WorkSpace />} />
      <Route path="/response/:formId" element={<ResponsePage />} />
      <Route path="/settings" element={<SettingPage />} />
    </Routes>
  );
}
