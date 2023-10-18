var express = require("express");
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hospital.sqlite");

/* GET home page. */
router.get("/", function (req, res, next) {
	db.all("SELECT * FROM Hospital", [], function (err, rows) {
		// if anything wrong happened, we need to show the error to the user!
		if (err) {
			return next(err);
		}
		res.render("hospitals", { rows });
	});
});

router.post("/", function (req, res, next) {
	db.run(
		"INSERT INTO Hospital (hos_name, hos_loc) VALUES (?, ?)",
		[
			req.body.hos_name, 
			req.body.hos_loc
		],
		function (err) {
			// if anything wrong happened, we need to show the error to the user!
			if (err) {
				return next(err);
			}
			res.redirect("/hospitals");
		}
	);
});

router.post("/delete/:id", async function (req, res, next) {
	db.all(
		"DELETE FROM Hospital WHERE Hospital.hos_no=?;",
		[req.params.id],
		function (err) {
			if (err) {
				return next(err);
			}

			res.redirect("/hospitals");
		}
	);
});

module.exports = router;
