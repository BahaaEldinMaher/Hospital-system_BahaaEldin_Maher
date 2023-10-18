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
	    FROM Room
	    INNER JOIN Hospital ON Hospital.hos_no = Room.hosNum;
	    `,
		[],
		function (err, rooms_rows) {
			// if anything wrong happened, we need to show the error to the user!
			if (err) {
				return next(err);
			}
			// get all hospitals
			db.all("SELECT * FROM Hospital", [], function (err, hospitals_rows) {
				if (err) {
					return next(err);
				}
				res.render("rooms", { rooms_rows, hospitals_rows });
			});
		}
	);
});

router.get("/:hos_no", function (req, res, next) {
	db.all(
		"SELECT * FROM Room,Hospital where Hospital.hos_no=Room.hosNum and Hospital.hos_no=?",
		[req.params.hos_no],
		function (err, rooms_rows) {
			// if anything wrong happened, we need to show the error to the user!
			if (err) {
				return next(err);
			}
			res.render("rooms", { rooms_rows, hos_no: req.params.hos_no });
		}
	);
});

router.post("/", function (req, res, next) {
	db.run(
		"INSERT INTO Room (hosNum, room_type) VALUES (?, ?)",
		[req.body.hosNum, req.body.room_type],
		function (err) {
			// if anything wrong happened, we need to show the error to the user!
			if (err) {
				return next(err);
			}
			if (req.body.redirect_to_hospital) {
				res.redirect("/rooms/" + req.body.redirect_to_hospital);
			} else {
				res.redirect("/rooms");
			}
		}
	);
});

router.post("/delete/:id", async function (req, res, next) {
	db.all(
		"DELETE FROM Room WHERE Room.room_no=?;",
		[req.params.id],
		function (err) {
			if (err) {
				return next(err);
			}

			res.redirect("/rooms");
		}
	);
});


module.exports = router;
