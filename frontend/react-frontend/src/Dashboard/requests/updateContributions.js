import Swal from "sweetalert2";

export default async function updateContributions(contributions_data) {
    if (contributions_data.f_name.trim() === "" || contributions_data.s_name.trim() === "") {
        await Swal.fire({
            title: "Missing Information",
            text: "Please complete the fields",
            icon: "warning",
        });
        return false;
    }

    const userConfirmation = await Swal.fire({
        title: "Are you sure you want to update the name and/or amount?",
        text: "Once the amount is updated > 0, it cannot be changed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
    });

    if (!userConfirmation.isConfirmed) {
        await Swal.fire({
            text: "Contributions update is cancelled.",
            icon: "info",
        });
        return true;
    }

    try {
        contributions_data = { ...contributions_data, organization_code: "CCS-EC" };
        const response = await fetch("http://127.0.0.1:5000/dashboard/edit-contributions", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contributions_data),
        });

        if (!response.ok) {
            const promiseResult = await response.json();
            throw new Error(`Update failed: ${promiseResult.message}`);
        }

        await Swal.fire({
            text: "Contributions uploaded successfully.",
            icon: "success",
        });

        return true;
    } catch (error) {
        console.error(error.message);
        await Swal.fire({
            title: "Update failed.",
            text: `Server error, please try again. Error: ${error.message}`,
            icon: "error",
        });

        return false;
    }
}
