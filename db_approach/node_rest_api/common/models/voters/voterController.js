const VoterModel = require("./voter");

findVoter: (req, res) =>
    {
        VoterModel.findVoter({})
        .then((voters) => {
            return res.status(200).json({
                status: true,
                data: voters
            });
        }).catch((err) =>
        {
            return res.status(500).json({
                status: false,
                error: err
            });
        });
    }

    
