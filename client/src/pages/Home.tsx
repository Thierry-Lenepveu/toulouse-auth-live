import { useRef } from "react";

import type { FormEventHandler } from "react";

import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";

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

type Item = {
  id: number;
  title: string;
  user_id: number;
};

function Home() {
  const items = useLoaderData() as Item[];

  const titleRef = useRef<HTMLInputElement>(null);

  const { auth } = useOutletContext() as { auth: Auth | null };

  const revalidator = useRevalidator();

  // Gestionnaire de soumission du formulaire
  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      // Appel à l'API pour demander une connexion
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/items`,
        {
          method: "post",
          // #cookies3 : Inclusion de la paire "credentials : 'include'" pour transmettre
          // le cookie côté serveur
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            /* conditional rendering ensures auth is not null */
            // #cookies3 : Le header d'autorisation n'est plus nécessaire dès lors que l'on
            // utilise les cookies
            // Authorization: `Bearer ${(auth as Auth).token}`, Inclusion du jeton JWT
          },
          body: JSON.stringify({
            title:
              /* rendering process ensures the ref is defined before the form is submitted */
              (titleRef.current as HTMLInputElement).value,
            userId:
              /* conditional rendering ensures auth is not null */
              (auth as Auth).user.id,
          }),
        },
      );

      // Recharge la page si la création réussit
      if (response.status === 201) {
        revalidator.revalidate();
      } else {
        // Log des détails de la réponse en cas d'échec
        console.info(response);
      }
    } catch (err) {
      // Log des erreurs possibles
      console.error(err);
    }
  };

  return (
    <>
      {auth != null && (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              {/* Champ pour le title */}
              <label htmlFor="title">title</label>{" "}
              <input ref={titleRef} type="text" id="title" />
            </div>
            {/* Bouton de soumission du formulaire */}
            <button type="submit">Send</button>
          </form>
          <ul>
            {items.map(({ id, title }) => (
              <li key={id}>{title}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default Home;
