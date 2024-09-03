import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import CustomLayout from "./components/layouts/layout";
import "preline/dist/preline";

function App() {
  return (
    <AuthProvider>
      <CustomLayout />
    </AuthProvider>
  );
}

export default App;
