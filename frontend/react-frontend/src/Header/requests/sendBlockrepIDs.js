export default async function sendBlockrepIDs(ids) {
    try {
        const response = await fetch("http://127.0.0.1:5000/set-block-reps", 
            {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'org_code': "CCS-EC", 'block_reps': ids})
            }
        );
        
        const promiseResult = await response.json();
        console.log(promiseResult.message);
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error.message);
    }
};