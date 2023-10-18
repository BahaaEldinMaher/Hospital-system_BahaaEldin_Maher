var express = require("express");
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hospital.sqlite");

/* GET home page. */
router.get("/", async function (req, res, next) {
	db.all(
		`
	    SELECT
	        *
	    FROM Patient_diagnosis
	    INNER JOIN Patient ON Patient.pat_id = Patient_diagnosis.p_ID;
	    `,
		[],
		function (err, dia_rows) {
			if (err) {
				return next(err);
			}
			db.all("SELECT * FROM Patient", [], function (err,rows) {
				if (err) {
					return next(err);
				}
				res.render("diagnosis", { dia_rows,rows });
			});
		}
	);
});

router.post("/", function (req, res, next) {
	db.run(
		"INSERT INTO Patient_diagnosis(p_ID,dia_treat,dia_days,dia_disease) VALUES (?,?,?,?)",
		[req.body.p_ID,req.body.dia_treat, req.body.dia_days, req.body.dia_disease],
		function (err) {
			if (err) {
				return next(err);
			}
			res.redirect("/diagnosis");
		}
	);
});

router.post("/delete/:id", async function (req, res, next) {
	db.all(
		"DELETE FROM Patient_diagnosis WHERE Patient_diagnosis.dia_no=?;",
		[req.params.id],
		function (err) {
			if (err) {
				return next(err);
			}

			res.redirect("/diagnosis");
		}
	);
});


module.exports = router;
