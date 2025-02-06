export default async function generateStudentList(list_type) {
    if (list_type === "None") return;

    fetch(`http://127.0.0.1:5000/dashboard/get-list/CCS-EC/${list_type}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true
        });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const header = "./src/assets/docs/Header.png";
        const footer = "./src/assets/docs/Footer.png";

        doc.setFontSize(20);
        doc.setFont("times", "bold");
        const title = data['list-type'];
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, 40); // Centered title

        let currentY = 50; // Starting Y position for content
        const lineHeight = 10; // Line height for the content
        const startLine = 20;

        // Loop through each program and year level to add students
        // Get all valid program-year combinations with student data
        const validCombinations = [];
        data['programs'].forEach(program => {
            data['year_levels'].forEach(year => {
                const students = data[`${program['code']}-${year}`];
                if (students && students.length > 0) {
                    validCombinations.push({ program, year, students });
                }
            });
        });

        // Iterate over each valid program-year level combination
        validCombinations.forEach(({ program, year, students }, index) => {
            // Add header and footer images
            doc.addImage(header, 'PNG', (pageWidth - 184) / 2, 5, 184, 28);
            doc.addImage(footer, 'PNG', (pageWidth - 184) / 2, pageHeight - 20, 184, 20);

            // Set header for program-year level
            doc.setFontSize(16);
            doc.setFont("times", "bold");
            doc.text(`${program['code']} - ${year}`, startLine, currentY);
            currentY += lineHeight; // Move down for the next line

            // Set font for student entries
            doc.setFontSize(13);
            doc.setFont("times", "normal");
            // Loop through students and add them to the PDF
            students.forEach(student => {
                const studentText = `${student['id_number']}: ${student['full_name']}`;
                doc.text(studentText, startLine, currentY);
                currentY += lineHeight;

                // Check if the current Y position is too close to the bottom of the page
                if (currentY > pageHeight - 20) { // Adjust margin as needed
                    doc.addPage(); // Create a new page if necessary
                    doc.addImage(header, 'PNG', (pageWidth - 184) / 2, 5, 184, 28);
                    doc.addImage(footer, 'PNG', (pageWidth - 184) / 2, pageHeight - 20, 184, 20);
                    currentY = 40; // Reset Y position for new page
                }
            });

            // Add a new page after each valid combination except for the last one
            if (index < validCombinations.length - 1) {
                doc.addPage();
                currentY = 40; // Reset Y position for new page
            }
        });
        doc.save(`${data['list-type']}.pdf`);
    })
    .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
    });
}