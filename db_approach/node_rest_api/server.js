const express = require('express');
// const VoterRoutes = require('./common/models/voters/routes')
const Voter = require('./common/models/voters/voter'); 
// const voterController = require('./common/models/voters/voterController')
const path = require('path')

const app = express();
app.use(express.json());
// app.use("./common/models/voters/voter", VoterRoutes)

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/find-voter", async (req, res) => {
	const {first_name, last_name, dob, address, residence_city, residence_zip} = req.body;
    // Extract the street number (digits at the start)
    const street_no = address.match(/^\d+/)[0];

    // Extract the street name (everything after the street number)
    const street_name = address.replace(/^\d+\s*/, '');
    
    
    console.log(street_no, street_name, residence_zip)
    try {
        const voter = await Voter.findOne({
            where: {first_name, last_name, dob, street_no, street_name, residence_city, residence_zip}
        });
        
        const is_reg = !(voter=[])

        if (is_reg) {
            res.json({ success: true, is_reg });
        } else {
            res.status(404).json({ success: false, message: "Voter not found" });
        }
    } catch (error) {
        console.error("Error finding voter:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


app.get("/status",
	(request, response)  =>
{
	const status = {
		"Status": "Running"
	};

	response.send(status);
}
	);

app.listen(PORT, () => {
	console.log("Listening on PORT:", PORT);
});
