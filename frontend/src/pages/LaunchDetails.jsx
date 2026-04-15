import { useParams } from "react-router-dom";

const LaunchDetails = () => {
  const { id } = useParams();

  return (
    <main>
      <h1>Launch Details</h1>
      <p>Launch data for mission ID: {id}</p>
    </main>
  );
};

export default LaunchDetails;
