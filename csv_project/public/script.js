document.getElementById("userForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let lastname = document.getElementById("Lastname").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;

    fetch("http://localhost:3000/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, lastname, email, address }),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("userForm").reset();
        })
        .catch(error => console.error("Error:", error));

    let popup = window.open(
        "https://voter.svrs.nj.gov/registration-check",
        "VoterCheck",
        "width=500,height=600,top=100,left=100"
    );

    let checkPopup = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkPopup); 
            window.location.href = "pledge.html";        }
    }, 1000);
});
