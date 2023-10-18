const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hospital.sqlite");

db.serialize(function () {
	console.log("db is ready!");
	// create tables if it doesn't exists
	db.run(`
    create table if not exists Hospital(
      hos_no INTEGER PRIMARY KEY,
      hos_name VARCHAR(40) NOT NULL,
      hos_loc  VARCHAR(40)
    );
  `);

	db.run(`
    create table if not exists Room(
      hosNum INT NOT NULL,
      room_no INTEGER PRIMARY KEY,
      room_type VARCHAR(40),
      foreign key(hosNum) references Hospital(hos_no)
      ON DELETE CASCADE
      ON UPDATE CASCADE 
    );
  `);

	db.run(`
    create table if not exists Doctor(
      doc_id INTEGER PRIMARY KEY,
      doc_first VARCHAR(40) not null,
      doc_last VARCHAR(40) not null,
      doc_gender VARCHAR(10),
      doc_city VARCHAR(40) not null,
      doc_loc VARCHAR(40),
      doc_email VARCHAR(30),
      doc_spec VARCHAR(30),
      hos_id INT NOT NULL,
      foreign key(hos_id) references Hospital(hos_no)
      ON DELETE CASCADE
      ON UPDATE CASCADE 
    );
  `);

	db.run(`
    create table if not exists Patient(
      pat_id INTEGER PRIMARY KEY,
      pat_first VARCHAR(40) not null,
      pat_last VARCHAR(40) not null,
      pat_gender VARCHAR(10),
      pat_city VARCHAR(40) not null,
      pat_loc VARCHAR(40) not null,
      pat_birth DATE not null,
      pat_phoneNum VARCHAR(20),
      hos_num INT NOT NULL,
      docID INT NOT NULL,
      roomNO INT NOT NULL,
      foreign key(hos_num) references Hospital(hos_no)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
      foreign key(docID) references Doctor(doc_id),
      foreign key(roomNO) references Room(room_no)
      ON DELETE SET NULL
      ON UPDATE CASCADE
    );
  `);

	db.run(`
    create table if not exists Patient_diagnosis(
      p_ID INT NOT NULL,
      dia_no INTEGER PRIMARY KEY,
      dia_days INT,
      dia_treat VARCHAR(30),
      dia_disease VARCHAR(30),
      foreign key(p_ID) references Patient(pat_id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    );
  `);

	db.run(`
    create table if not exists Bill(
      pt_id INT NOT NULL,
      bill_no INTEGER PRIMARY KEY,
      bill_amount INT,
      bill_date DATE,
      foreign key(pt_id) references Patient(pat_id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    );
  `);
});

// db.close();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));





// PAGES
app.use("/", require("./routes/home"));
app.use("/hospitals", require("./routes/hospitals"));
app.use("/rooms", require("./routes/rooms"));
app.use("/doctor", require("./routes/doctor"));
app.use("/patient", require("./routes/patient"));
app.use("/diagnosis", require("./routes/diagnosis"));
app.use("/bill", require("./routes/bill"));
app.use("/report", require("./routes/report"));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
