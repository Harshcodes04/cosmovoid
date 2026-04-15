import { useParams } from "react-router-dom";

const RocketDetails = () => {
  const { id } = useParams();

  return (
    <main>
      <h1>Rocket Details</h1>
      <p>Rocket data for vehicle ID: {id}</p>
    </main>
  );
};

export default RocketDetails;
