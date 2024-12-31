export default async function fetchStudents(setStudents, setError) {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/student-records/get-all",
        { method: "GET" }
      );
      const text = await response.text();
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = JSON.parse(text);
      const updatedData = data.map((element, index) => ({
        ...element,
        number: index,
      }));
      setStudents(updatedData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError(error);
    }
  };