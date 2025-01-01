export default async function fetchProgramCodes(setProgramCodes) {
    try {
        const response = await fetch("http://127.0.0.1:5000/program-codes/CCS-EC", 
            { method: "GET" }
        );
        
        if (!response.ok) {
            const errorText = await response.text(); // Await the text content
            throw new Error(errorText); // Throw the error with the text content
        }

        const data = await response.json();
        setProgramCodes(p => {
            // Directly concatenate the data array to the existing array (p)
            return [...p, ...data.map(d => d.code)];
        });
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error.message);
    }
};