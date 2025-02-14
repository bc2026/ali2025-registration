CREATE TABLE Voters (
    ID VARCHAR(50) PRIMARY KEY,  -- ID is a string
    Last_Name VARCHAR(255) NULL,  -- Explicitly allowing NULLs
    First_Name VARCHAR(255),
    Middle_Name VARCHAR(255),
    Suffix VARCHAR(50),
    Street_No INT,
    Street_Name VARCHAR(255),
    APT_UNIT VARCHAR(50),
    Residence_City VARCHAR(100),
    Residence_State VARCHAR(50),
    Residence_Zip INT,
    Mailing VARCHAR(255),
    Mailing_Address_Line_2 VARCHAR(255),
    Mailing_Address_Line_3 VARCHAR(255),
    Mailing_City VARCHAR(100),
    Mailing_State VARCHAR(50),
    Mailing_Zip VARCHAR(20),
    Mailing_Country VARCHAR(50),
    Municipality VARCHAR(100),
    Ward VARCHAR(50),
    District VARCHAR(50),
    DOB DATE,
    Party VARCHAR(100),
    Status VARCHAR(50),
    Reg_Date DATE,
    Voting_Priv_Date DATE
);

COPY Voters FROM '/mnt/c/Users/bc2to/Documents/ali2025-registration/db_approach/sql/modified_file.csv'
DELIMITER ',' 
CSV HEADER NULL 'NULL';


UPDATE voters
SET
    id = LOWER(id),
    last_name = LOWER(last_name),
    first_name = LOWER(first_name),
    middle_name = LOWER(middle_name),
    suffix = LOWER(suffix),
    street_no = LOWER(street_no),
    street_name = LOWER(street_name),
    apt_unit = LOWER(apt_unit),
    residence_city = LOWER(residence_city),
    residence_state = LOWER(residence_state),
    residence_zip = LOWER(residence_zip),
    mailing = LOWER(mailing),
    mailing_address_line_2 = LOWER(mailing_address_line_2),
    mailing_address_line_3 = LOWER(mailing_address_line_3),
    mailing_city = LOWER(mailing_city),
    mailing_state = LOWER(mailing_state),
    mailing_zip = LOWER(mailing_zip),
    mailing_country = LOWER(mailing_country),
    municipality = LOWER(municipality),
    ward = LOWER(ward),
    district = LOWER(district),
    -- dob = LOWER(dob),
    party = LOWER(party),
    status = LOWER(status)
    -- reg_date = LOWER(reg_date),
    -- voting_priv_date = LOWER(voting_priv_date);

