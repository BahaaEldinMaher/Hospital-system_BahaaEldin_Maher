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
	    FROM Bill
	    INNER JOIN Patient ON Patient.pat_id = Bill.pt_id;
	    `,
		[],
		function (err,bill_rows) {
			if (err) {
				return next(err);
			}
			db.all("SELECT * FROM Patient", [], function (err,rows) {
				if (err) {
					return next(err);
				}
				res.render("bill", { bill_rows,rows });
			});
		}
	);
});

router.post("/", function (req, res, next) {
	db.run(
		"INSERT INTO Bill(pt_id,bill_amount,bill_date) VALUES (?,?,?)",
		[req.body.pt_id,req.body.bill_amount, req.body.bill_date],
		function (err) {
			if (err) {
				return next(err);
			}
			res.redirect("/bill");
		}
	);
});

router.post("/delete/:id", async function (req, res, next) {
	db.all(
		"DELETE FROM Bill WHERE Bill.bill_no=?;",
		[req.params.id],
		function (err) {
			if (err) {
				return next(err);
			}

			res.redirect("/bill");
		}
	);
});

module.exports = router;