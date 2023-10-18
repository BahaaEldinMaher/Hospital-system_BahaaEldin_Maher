--create database HMS2

--use HMS2


--create table Hospital(
--hos_no INT,
--hos_name VARCHAR(40) NOT NULL,
--hos_loc  VARCHAR(40),
--PRIMARY KEY(hos_no)
--);

--create table Room(
--hosNum INT,
--room_no INT,
--room_type VARCHAR(40),
--PRIMARY KEY(room_no),
--foreign key(hosNum) references Hospital(hos_no)
--);


--create table Doctor(
--doc_id INT,
--doc_first VARCHAR(40) not null,
--doc_last VARCHAR(40) not null,
--doc_gender VARCHAR(10),
--doc_city VARCHAR(40) not null,
--doc_loc VARCHAR(40),
--doc_email VARCHAR(30),
--doc_spec VARCHAR(30),
--hos_id INT,
--PRIMARY KEY(doc_id),
--foreign key(hos_id) references Hospital(hos_no)
--ON DELETE CASCADE
--ON UPDATE CASCADE 
--);



--create table Patient(
--pat_id INT,
--pat_first VARCHAR(40) not null,
--pat_last VARCHAR(40) not null,
--pat_gender VARCHAR(10),
--pat_city VARCHAR(40) not null,
--pat_loc VARCHAR(40) not null,
--pat_birth DATE not null,
--hos_num INT,
--docID INT,
--roomNO INT,
--PRIMARY KEY(pat_id),
--foreign key(hos_num) references Hospital(hos_no)
--ON DELETE CASCADE
--ON UPDATE CASCADE,
--foreign key(docID) references Doctor(doc_id),
--foreign key(roomNO) references Room(room_no)
--ON DELETE SET NULL
--ON UPDATE CASCADE
--);


--create table Patient_phone(
--p_id INT,
--pat_phoneNum VARCHAR(20),
--foreign key(p_id) references Patient(pat_id)
--ON DELETE CASCADE
--ON UPDATE CASCADE
--);


--create table Patient_diagnosis(
--p_ID INT,
--dia_no INT,
--dia_days INT,
--dia_treat VARCHAR(30),
--dia_disease VARCHAR(30),
--primary key(dia_no),
--foreign key(p_ID) references Patient(pat_id)
--ON DELETE CASCADE
--ON UPDATE CASCADE
--);


--create table Bill(
--pt_id INT,
--bill_no INT,
--bill_amount INT,
--bill_date DATE,
--primary key(bill_no),
--foreign key(pt_id) references Patient(pat_id)
--ON DELETE CASCADE
--ON UPDATE CASCADE
--);


