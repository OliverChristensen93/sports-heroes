import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import type { User } from "@supabase/supabase-js";
import "../App.css";
import { usePicks } from "../contexts/PicksContext";

const NavBar = () => {
  // Tell TypeScript this can be a User OR null
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { resetPicks } = usePicks();

  // Check auth state on mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    // Listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup listener when component unmounts
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    console.log("Attempting to reset picks.");
    resetPicks();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <Link to="/">Home</Link>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                <Link to="/">Home</Link>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to="/MyPicks">My Picks</Link>
              </a>
            </li>

            {/* Show when user is NOT logged in */}
            {!user && (
              <>
                <li className="navbar-right">
                  <a className="nav-link" href="#">
                    <Link to="/Login">Login</Link>
                  </a>
                </li>
                <li className="navbar-right">
                  <a className="nav-link" href="#">
                    <Link to="/Register">Register</Link>
                  </a>
                </li>
              </>
            )}

            {/* Show when user IS logged in */}
            {user && (
              <>
                <li className="navbar-right">
                  <span>Hello, {user?.user_metadata?.username}</span>
                  <button onClick={signOut}>Sign out</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
