const router = require('express').Router();
const voterController = require('./voterController')


router.get("/", voterController.find_voter)

