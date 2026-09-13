// Function to populate the dropdown
function initializeDropdown() {
    const selectElement = document.getElementById('eventSelect');
    
    // Safety check to ensure the dropdown exists
    if (!selectElement) return; 

    // Check if config loaded successfully
    if (typeof PORTAL_CONFIG !== 'undefined') {
        // Prevent duplicate options if called multiple times
        selectElement.innerHTML = '<option value="">Select Event / Program</option>';

        for (const [key, program] of Object.entries(PORTAL_CONFIG)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = program.title;
            selectElement.appendChild(option);
        }
    } else {
        console.error("PORTAL_CONFIG not found. Check if config.js is loading correctly.");
    }
}

// Detect if DOM is already loaded due to dynamic script injection
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDropdown);
} else {
    initializeDropdown(); // Run immediately if DOM is already parsed
}

// Handle UI updates when the dropdown changes
function handleEventSelection() {
    const eventKey = document.getElementById("eventSelect").value;
    const certInput = document.getElementById("certNo");
    const resultDiv = document.getElementById("result");
    const eventTitle = document.getElementById("eventTitle");
    const eventSubTitle = document.getElementById("eventSubTitle");
    const eventLogo = document.getElementById("eventLogo");
    const header = document.getElementById("header");

    certInput.value = "";
    resultDiv.innerHTML = "";

    if (eventKey && PORTAL_CONFIG[eventKey]) {
        certInput.disabled = false;
        const details = PORTAL_CONFIG[eventKey];

        eventTitle.textContent = details.title;
        eventSubTitle.textContent = "Motilal Nehru National Institute of Technology Allahabad";
        
        eventTitle.style.color = "white";
        eventSubTitle.style.color = "white";

        header.style.borderBottom = `15px solid ${details.color || '#002147'}`;

        if (details.logo) {
            eventLogo.src = details.logo;
            eventLogo.style.display = "block";
        } else {
            eventLogo.style.display = "none";
        }
    } else {
        certInput.disabled = true;
        
        eventTitle.textContent = "ISEA Phase-III & MNNIT Allahabad";
        eventSubTitle.textContent = "Select an event below to verify";
        eventLogo.style.display = "none";
        header.style.borderBottom = "none";
    }
}

// Perform Verification Fetch
async function verifyCertificate() {
    const eventKey = document.getElementById("eventSelect").value;
    const certNo = document.getElementById("certNo").value.trim();
    const resultDiv = document.getElementById("result");

    if (!eventKey) return alert("Please select an event.");
    if (!certNo) return alert("Please enter a Certificate Number.");

    resultDiv.innerHTML = `
        <div class="verify-card">
            <div class="spinner"></div>
            <h3>Verifying Certificate</h3>
            <p style="color:#666;">Please wait while we check our secure records...</p>
        </div>
    `;

    const currentProgram = PORTAL_CONFIG[eventKey];

    try {
        const response = await fetch(`${currentProgram.apiUrl}?certNo=${encodeURIComponent(certNo)}`);
        const data = await response.json();
        renderResult(data);
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="card">
                <div class="notfound">❌ Unable to connect to verification server. Please try again later.</div>
            </div>
        `;
        console.error("Fetch API Error:", error);
    }
}

// Render HTML for results
function renderResult(data) {
    if (data.found) {
        const timestamp = data.mergeStatus?.split("Timestamp:")[1]?.trim() || "";

        document.getElementById("result").innerHTML = `
        <div class="card">
            <div class="status">✓ CERTIFICATE VERIFIED</div>
            <table>
                <tr><td>Name</td><td>${data.name || 'N/A'}</td></tr>
                <tr><td>Institute</td><td>${data.institute || 'N/A'}</td></tr>
                <tr><td>Certificate Number</td><td>${data.certificateNo || 'N/A'}</td></tr>
                <tr><td>Email</td><td>${data.email || 'N/A'}</td></tr>
                <tr><td>Department</td><td>${data.department || 'N/A'}</td></tr>
                <tr><td>Designation</td><td>${data.designation || 'N/A'}</td></tr>
                <tr><td>Employee ID</td><td>${data.employeeId || 'N/A'}</td></tr>
                <tr><td>Role</td><td>${data.role || 'N/A'}</td></tr>
                ${timestamp ? `<tr><td>Created On</td><td>${timestamp}</td></tr>` : ''}
            </table>
            
            <div class="actions">
                <a class="btn btn-warning" href="https://forms.gle/xwpJWPuQopETo9US9" target="_blank">✏️ Request Correction</a>
                ${data.mergedDocId ? `<a class="btn" href="https://drive.google.com/uc?export=download&id=${data.mergedDocId}" target="_blank">📥 Download Certificate</a>` : ''}
            </div>
        </div>
        `;
    } else {
        document.getElementById("result").innerHTML = `
        <div class="card">
            <div class="notfound">❌ Certificate Number Not Found</div>
        </div>
        `;
    }
}
