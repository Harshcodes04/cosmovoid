import { useParams } from "react-router-dom";

const JournalDetails = () => {
  const { id } = useParams();

  return (
    <main>
      <h1>Journal Details</h1>
      <p>Viewing journal entry ID: {id}</p>
    </main>
  );
};

export default JournalDetails;
