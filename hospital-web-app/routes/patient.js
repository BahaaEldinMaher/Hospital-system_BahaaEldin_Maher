var express = require("express");
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hospital.sqlite");

router.get("/", async function (req, res, next) {
	db.all("SELECT * FROM Patient;", [], function (err, patient_rows) {
		if (err) {
			return next(err);
		}

		db.all(
			"SELECT * FROM Hospital,Doctor where Hospital.hos_no=Doctor.hos_id and Hospital.hos_no=?;",
			[req.query.hos_no],
			function (err, doctors_rows) {
				if (err) {
					return next(err);
				}

				res.render("patient", {
					patient_rows,
					doctors_rows,
					hos_no: req.query.hos_no,
					room_no: req.query.room_no,
				});
			}
		);
	});
});

router.post("/", function (req, res, next) {
	db.run(
		"INSERT INTO Patient (pat_first,pat_last,pat_gender,pat_city,pat_loc,pat_birth,pat_phoneNum,hos_num,docID,roomNo) VALUES (?,?,?,?,?,?,?,?,?,?)",
		[
			req.body.pat_first,
			req.body.pat_last,
			req.body.pat_gender,
			req.body.pat_city,
			req.body.pat_loc,
			req.body.pat_birth,
			req.body.pat_phoneNum,
			req.body.hos_no,
			req.body.docID,
			req.body.room_no,
		],

		function (err) {
			// if anything wrong happened, we need to show the error to the user!
			if (err) {
				return next(err);
			}
			res.redirect("/patient");
		}
	);
});

router.post("/delete/:id", async function (req, res, next) {
	db.all(
		"DELETE FROM Patient WHERE Patient.pat_id=?;",
		[req.params.id],
		function (err) {
			if (err) {
				return next(err);
			}

			res.redirect("/patient");
		}
	);
});

module.exports = router;
