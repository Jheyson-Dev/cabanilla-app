import React from "react";
import { useRouteError } from "react-router-dom";

const NotFound: React.FC = () => {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error.statusText || error.message}</p>
        </div>
      )}
    </div>
  );
};

export default NotFound;
