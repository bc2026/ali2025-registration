const express = require('express');
const VoterRoutes = require('./common/models/voters/routes')
const VoterModel = require('./common/models/voters/voter')
const voterController = require('voters/voterController')

const app = express();
app.use(express.json());
app.use("/voter", VoterRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("Listening on PORT:", PORT);
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

// (fname, lname, address, city, state, zipcode)
app.get("/voter",
	(request, response) =>
	{
		console.log(VoterModel);
		
	}
)