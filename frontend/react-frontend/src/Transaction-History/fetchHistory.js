export default async function fetchHistory(s_contribution, setters) {
  fetch(`http://127.0.0.1:5000/transaction-history/get-all/CCS-EC/${s_contribution}`, {
    method: "GET",
  }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Return the text response
    })
    .then((text) => {
      const data = JSON.parse(text); // Parse JSON

      // Map and update students data
      const updatedData = data["history"].map((element, index) => ({
        ...element,
        number: index,
      }));

      setters.setContributions(data['contributions']);
      setters.setSelectedContribution(data['chosen_contribution']);
      setters.setHistory(updatedData);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      setters.setError(error); // Handle errors
    });
};