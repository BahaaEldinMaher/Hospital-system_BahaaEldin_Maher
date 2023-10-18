var express = require("express");
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hospital.sqlite");

router.get("/", async function (req, res, next) {
	db.all(
		`
	    SELECT
	        *
	    FROM Doctor
	    INNER JOIN Hospital ON Hospital.hos_no = Doctor.hos_id;
	    `,
		[],
		function (err, doctor_rows) {
			// if anything wrong happened, we need to show the error to the user!
			if (err) {
				return next(err);
			}
			// get all hospitals
			db.all("SELECT * FROM Hospital", [], function (err, hospitals_rows) {
				if (err) {
					return next(err);
				}
				res.render("doctor", { doctor_rows, hospitals_rows });
			});
		}
	);
});

router.post("/", function (req, res, next) {
	db.run(
		"INSERT INTO Doctor (doc_first,doc_last,doc_gender,doc_city,doc_loc,doc_email,doc_spec,hos_id) VALUES (?,?,?,?,?,?,?,?)",
		[
			req.body.doc_first, 
			req.body.doc_last,
			req.body.doc_gender, 
			req.body.doc_city,
			req.body.doc_loc, 
			req.body.doc_email,
			req.body.doc_spec, 
			req.body.hos_id
			

		],
		function (err) {
			// if anything wrong happened, we need to show the error to the user!
			if (err) {
				return next(err);
			}
			res.redirect("/doctor");
		}
	);
});

router.post("/delete/:id", async function (req, res, next) {
	db.all(
		"DELETE FROM Doctor WHERE Doctor.doc_id=?;",
		[req.params.id],
		function (err) {
			if (err) {
				return next(err);
			}

			res.redirect("/doctor");
		}
	);
});



module.exports = router;