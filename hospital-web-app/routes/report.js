var express = require("express");
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hospital.sqlite");

/* GET home page. */
router.get("/:patient_id", async function (req, res, next) {
	db.all(
		`
	    SELECT
	        *
	    FROM Patient
		INNER JOIN Doctor ON Doctor.doc_id = Patient.docID
	    WHERE Patient.pat_id=?
	    `,
		[req.params.patient_id],
		function (err, patient_row) {
			// if anything wrong happened, we need to show the error to the user!
			if (err) {
				return next(err);
			}

			db.all(
				`
				SELECT
					*
				FROM Bill
				WHERE Bill.pt_id=?
				`,
				[req.params.patient_id],
				function (err, bills_rows) {
					// if anything wrong happened, we need to show the error to the user!
					if (err) {
						return next(err);
					}
					db.all(
						`
						SELECT
							*
						FROM Patient_diagnosis
						WHERE Patient_diagnosis.p_ID=?
						`,
						[req.params.patient_id],
						function (err, diagnosis_rows) {
							// if anything wrong happened, we need to show the error to the user!
							if (err) {
								return next(err);
							}

							res.render("report", {
								patient_data: patient_row[0],
								bills_rows,
								diagnosis_rows
							});
						}
					);
				}
			);
		}
	);
});

module.exports = router;
