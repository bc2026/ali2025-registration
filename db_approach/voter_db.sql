CREATE TABLE Voters (
	fname VARCHAR(255) NOT NULL,
	lname VARCHAR(255) NOT NULL,
	address VARCHAR(255),
	city VARCHAR(255) NOT NULL,
	stateUS VARCHAR(8),
	zipcode INT,
	is_reg BOOLEAN NOT NULL DEFAULT FALSE 
	--TRUE for REGISTERED
	--FALSE for NOT REGISTERED
);

INSERT INTO Voters (fname, lname, address, city, stateUS, zipcode, is_reg) 
VALUES ('Bhagawat', 'Chapagain', '123 Sesame St', 'Harrisburg', 'PA', 17112, FALSE);


INSERT INTO Voters (fname, lname, address, city, stateUS, zipcode, is_reg) 
VALUES ('Mussab', 'Ali', '35 Journal Square Plaza', 'Jersey City', 'NJ', 07306, TRUE);



