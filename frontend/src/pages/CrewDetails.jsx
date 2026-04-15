import { useParams } from "react-router-dom";

const CrewDetails = () => {
  const { id } = useParams();

  return (
    <main>
      <h1>Crew Details</h1>
      <p>Crew data for astronaut ID: {id}</p>
    </main>
  );
};

export default CrewDetails;
