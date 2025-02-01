export default async function fetchBlockReps() {
    try {
        const response = await fetch("http://127.0.0.1:5000/blockreps/CCS-EC", 
            { method: "GET" }
        );
        
        if (!response.ok) {
            const errorText = await response.text(); // Await the text content
            throw new Error(errorText); // Throw the error with the text content
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error.message);
    }
};