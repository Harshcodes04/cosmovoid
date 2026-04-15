import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main>
      <h1>Page Not Found</h1>
      <p>The page you requested does not exist.</p>
      <p>
        <Link to="/">Return home</Link>
      </p>
    </main>
  );
};

export default NotFound;
