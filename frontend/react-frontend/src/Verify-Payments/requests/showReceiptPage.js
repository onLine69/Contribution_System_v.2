import generateReceiptsPDF from './generateReceiptsPDF.js';

export default function showReceiptPage(details) {
    // Create a new tab/window
    const newTab = window.open();
    details = { ...details, verification_date: new Date(details.verification_date).toISOString().split('T')[0] };
    // HTML content to display in the new tab
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Receipts</title>
            <style>
                ${getStyle()}
            </style>
        </head>

        <body>
            <main id="to-print">
                <div class="details">
                    <div>
                        <p><strong>Contribution Name:</strong> ${details.contribution_name}</p>
                    </div>
                    <div>
                        <p><strong>Block Representative Name:</strong> ${details.block_rep_name}</p>
                    </div>
                    <div>
                        <p><strong>Date:</strong> ${details.verification_date}</p>
                    </div>
                    <div>
                        <p><strong>Program Code:</strong> ${details.program_code}</p>
                    </div>
                    <div>
                        <p><strong>Year Level:</strong> ${details.year_level}</p>
                    </div>
                    <div>
                        <p><strong>Total Amount:</strong> &#8369; ${details.total_amount}</p>
                    </div>
                </div>
                <hr>
                <input id="print-receipts" type="button" value="Create PDF" />
                <input id="go-back" type="button" value="Go Back" />
            </main>
        </body>
        </html>
    `;

    // Write HTML content to the new tab
    newTab.document.write(htmlContent);
    newTab.document.close(); // Ensures the content is rendered

    // Append the receipt content
    newTab.document.getElementById('to-print').appendChild(generateReceiptHTML(details));
    newTab.document.getElementById('print-receipts').addEventListener('click', () => { generateReceiptsPDF(details, newTab); });
    
};

const generateReceiptHTML = (data) => {
    const container = document.createElement('div');
    container.classList.add('receipt-container');
    
    const heading = document.createElement('h2');
    heading.textContent = 'Receipt';
    container.appendChild(heading);
    
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    data.verified_payments.forEach((payment) => {
        const card = document.createElement('div');
        card.classList.add('receipt-card');

        // Left Column
        const leftColumn = document.createElement('div');
        leftColumn.classList.add('left-column');
        leftColumn.innerHTML = `
            <img src="./src/assets/ccs_logo.png" alt="CCS Logo">
            <p>ID #: ${payment.student_id}</p>
            <p>Name: ${payment.student_name}</p>
            <p>Course: ${data.program_code}</p>
            <p>Date: ${data.verification_date}</p>
        `;
        
        // Right Column
        const rightColumn = document.createElement('div');
        rightColumn.classList.add('right-column');
        rightColumn.innerHTML = `
            <div class="header-container">
                <img src="./src/assets/ccs_logo.png" alt="CCS Logo">
                <h2>Certificate of Payment</h2>
            </div>
            <br>
            <p>This serves as a certificate of payment for ${data.academic_year} ${data.contribution_name}</p>
            <p>(___) CCS-Executive Council Contribution Fee</p>

            <div class="information">
                <p>ID #: ${payment.student_id}</p>
                <p>Name: ${payment.student_name}</p>
                <p>Course: ${data.program_code}</p>
                <p>Date: ${data.verification_date}</p>
            </div>

            <div class="signature">
                <div class="signature-line"></div>
                <p>Signature over Printed Name</p>
            </div>
        `;

        card.appendChild(leftColumn);
        card.appendChild(rightColumn);
        cardContainer.appendChild(card);
    });

    container.appendChild(cardContainer);
    return container;
};

function getStyle(){
    return `
        .to-print {
            background-color: violet;
        }

        .receipt-container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }

        .card-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        /* Main container */
        .receipt-card {
            display: flex;
            border: 1px solid black;
            width: 300px;
            height: 200px;
            font-family: Arial, sans-serif;
            font-size: 8px;
        }

        /* Left side styles */
        .left-column {
            background-color: #2eaba9;
            color: black;
            width: 40%;
            padding: 5px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            border-right: 1px dashed black;
        }

        .left-column img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: block;
            margin: 0 auto 50px;
            border: 2px solid #227c7b;
        }

        .left-column p {
            margin: 3px 0;
            line-height: 1;
        }

        .information {
            margin-top: 10px;
            line-height: 1;
            text-align: left;
        }

        .header-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .header-container img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid black;
        }

        .header-container h2 {
            font-size: 12px;
            margin: 0;
        }

        /* Right side styles */
        .right-column {
            width: 60%;
            padding: 5px;
            box-sizing: border-box;
            text-align: center;
            position: relative;
        }

        .right-column h2 {
            margin: 0;
            font-size: 10px;
        }

        .right-column p {
            margin: 5px 0;
            font-size: 8px;
            line-height: 1.2;
        }

        .right-column .signature {
            position: absolute;
            bottom: 5px;
            right: 5px;
            text-align: center;
        }

        .signature-line {
            border-top: 1px solid black;
            width: 100px;
            margin-top: 2px;
            font-size: 6px;
        }

        @layer base {
            img {
                display: initial;
            }
        }`;
}