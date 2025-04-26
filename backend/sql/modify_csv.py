import pandas as pd

# Load your data
df = pd.read_csv('main.csv')


print("Cleaning 'section' strings...")
# Remove rows where any column contains the word 'section' (case insensitive)
df = df[~df.apply(lambda row: row.astype(str).str.contains('section', case=False).any(), axis=1)]
# Replace all empty strings with NaN (which will be interpreted as NULL in PostgreSQL)
df.replace("", pd.NA, inplace=True)


print("Cleaning 'zip'...")
# Read CSV, treating 'Residence Zip' as a string to avoid mixed types
df = pd.read_csv("main.csv", dtype={"Residence Zip": "str"}, low_memory=False)
# Drop NaN values in 'Residence Zip'
df = df.dropna(subset=["Residence Zip"])
# Remove non-numeric values (keep only digits)
df["Residence Zip"] = df["Residence Zip"].str.extract("(\d+)")  # Extract only numbers
# Drop rows where 'Residence Zip' is still NaN after extraction
df = df.dropna(subset=["Residence Zip"])
# Convert to integer
df["Residence Zip"] = df["Residence Zip"].astype(int)

    

# Save the modified DataFrame to a new CSV
df.to_csv('/mnt/c/Users/bc2to/Documents/ali2025-registration/db_approach/sql/modified_file.csv', index=False)




