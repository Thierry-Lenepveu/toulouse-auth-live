import { Link, Outlet, useNavigate } from "react-router-dom";

import "./App.css";
import { useState } from "react";

type User = {
  id: number;
  email: string;
  is_admin: boolean;
};

type Auth = {
  user: User;
  // #cookies3 : Plus besoin de typer le token, puisqu'il est géré
  // exclusivement dans les cookies
};

function App() {
  const [auth, setAuth] = useState(null as Auth | null);
  const navigation = useNavigate()

  // #cookies3 : Création de la fonction handleLogout qui, en plus de mettre la valeur
  // de auth à null, envoie une requête au serveur sur le endpoint "api/logout", ce qui a
  // pour effet de supprimer le cookie, rendant la déconnexion effective.
  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
        method: "POST",
        // #cookies3 : Inclusion de la paire "credentials : 'include'" pour transmettre
        // le cookie côté serveur 
        credentials: "include"
      })

      // #cookies3 : Si le serveur répond avec un statut 204 ("no content"), alors le
      // cookie a été supprimé, on peut donc mettre à null le getter "auth"
      if (response.status === 204) {
        setAuth(null)
        navigation("/")
      } 
    } catch (error) {
      console.error(error);
    }
  } 

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {auth == null ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <li>
              <button
                type="button"
                // #cookies3 : On passe à la props onClick la fonction handleLogout
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
      {auth && <p>Hello {auth.user.email}</p>}
      <main>
        <Outlet context={{ auth, setAuth }} />
      </main>
    </>
  );
}

export default App;
