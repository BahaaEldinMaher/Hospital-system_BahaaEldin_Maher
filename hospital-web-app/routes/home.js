var express = require("express");
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hospital.sqlite");

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render('home')
});

module.exports = router;
