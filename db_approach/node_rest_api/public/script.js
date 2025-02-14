document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    const formData = {
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        dob: document.getElementById("dob").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value
    };

    if(formData.state.toLowerCase() != "nj")
    {   
        alert("You must be a resident of New Jersey to vote")
        throw new Error("Ineligible voter");
        
    }

    try {
        const response = await fetch("http://localhost:3000/find-voter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
             alert(`Voter found: ${result.voter.fname} ${result.voter.lname}`);
            // document.getElementById("result").style.color = "green";
        } else {
            alert("Voter not found.");
            // document.getElementById("result").style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Try again later.");
        // document.getElementById("result").style.color = "red";
    }
});
