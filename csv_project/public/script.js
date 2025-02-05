document.getElementById("userForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    let name = document.getElementById("name").value;
    let lastname = document.getElementById("Lastname").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;

    // Send data to backend
    fetch("http://localhost:3000/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, lastname, email, address }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Show success message
            document.getElementById("userForm").reset();
        })
        .catch(error => console.error("Error:", error));

    // Open a popup window for the voter registration check
    let popup = window.open(
        "https://voter.svrs.nj.gov/registration-check",
        "VoterCheck",
        "width=500,height=600,top=100,left=100"
    );

    // Check every second if the popup has been closed
    let checkPopup = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkPopup); // Stop checking
            document.body.innerHTML = ""; // Clear the entire page
        }
    }, 1000);
});
