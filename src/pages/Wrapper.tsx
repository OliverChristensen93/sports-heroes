import React, { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient";
import { Navigate } from "react-router-dom";

//This component makes sure we are logged in before viewing children. Otherwise it redirects to "/Login".

function Wrapper({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // !! framför ett object ( i detta fall session) betyder följande:
      // om det finns ett objekt så blir det true. om det är null eller undefined blir det false.
      // så det görs om till en boolean.
      setAuthenticated(!!session);
      setLoading(false);
    };

    getSession();
  }, []);

  if (loading) {
    return <div>Loading....</div>;
  } else {
    if (authenticated) {
      return <>{children}</>;
    }
    return <Navigate to="/Login" />;
  }
}

export default Wrapper;
