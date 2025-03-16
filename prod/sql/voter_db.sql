DROP TABLE IF EXISTS Voters;
CREATE TABLE Voters (
    ID VARCHAR(50) PRIMARY KEY,  -- ID is a string
    Last_Name VARCHAR(255) NULL,  -- Explicitly allowing NULLs
    First_Name VARCHAR(255),
    Middle_Name VARCHAR(255),
    Suffix VARCHAR(50),
    Street_No VARCHAR(50) NULL,  -- Allow NULL for street_no
    Street_Name VARCHAR(255),
    APT_UNIT VARCHAR(50),
    Residence_City VARCHAR(100),
    Residence_State VARCHAR(50),
    Residence_Zip VARCHAR(50),
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

-- Make sure the file path is correct for the environment PostgreSQL is running in
\copy voters FROM './modified_file.csv' WITH (FORMAT csv, HEADER true);
-- Clean up the data (trim whitespace and convert to lowercase)
UPDATE voters
SET
    id = LOWER(id),
    last_name = TRIM(LOWER(last_name)),
    first_name = TRIM(LOWER(first_name)),
    middle_name = TRIM(LOWER(middle_name)),
    suffix = TRIM(LOWER(suffix)),
    street_name = TRIM(LOWER(street_name)),
    apt_unit = TRIM(LOWER(apt_unit)),
    residence_city = TRIM(LOWER(residence_city)),
    residence_state = TRIM(LOWER(residence_state)),
    mailing = TRIM(LOWER(mailing)),
    mailing_address_line_2 = TRIM(LOWER(mailing_address_line_2)),
    mailing_address_line_3 = TRIM(LOWER(mailing_address_line_3)),
    mailing_city = TRIM(LOWER(mailing_city)),
    mailing_state = TRIM(LOWER(mailing_state)),
    mailing_zip = TRIM(LOWER(mailing_zip)),
    mailing_country = TRIM(LOWER(mailing_country)),
    municipality = TRIM(LOWER(municipality)),
    ward = TRIM(LOWER(ward)),
    district = TRIM(LOWER(district)),
    party = TRIM(LOWER(party)),
    status = TRIM(LOWER(status));
