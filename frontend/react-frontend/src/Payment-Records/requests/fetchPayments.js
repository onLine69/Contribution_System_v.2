export default async function fetchPayments(s_contribution, setters) {
    const restoreChecked = () => {
      const checkedBoxes = document.querySelectorAll('input[name="transact-student"]:checked');
      const checkAll = document.getElementById("transact-all");

      checkAll.checked = false;
      checkedBoxes.forEach((checkedBox) => {
        checkedBox.checked = false;  
      })
    }

    fetch(`http://127.0.0.1:5000/payment-records/get-records/CCS-EC/${s_contribution}`, {
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
        const updatedData = data["students"].map((element, index) => ({
          ...element,
          number: index,
        }));
  
        // Update states
        restoreChecked();
        setters.setContributions(data['contributions']);
        setters.setSelectedContribution(data['chosen_contribution']);
        setters.setStat(data['stat']);
        setters.setPayments(updatedData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setters.setError(error); // Handle errors
      });
  };