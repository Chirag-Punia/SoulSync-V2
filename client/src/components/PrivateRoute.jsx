import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig";
import { Spinner } from "@nextui-org/react";  

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(user ? true : false); 
    });

    return () => unsubscribe(); 
  }, []);

  
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" color="primary" />
      </div>
    );
  }

  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;