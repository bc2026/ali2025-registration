import pandas as pd

# Load your data
df = pd.read_csv('main.csv')

# Remove rows where any column contains the word 'section' (case insensitive)
df = df[~df.apply(lambda row: row.astype(str).str.contains('section', case=False).any(), axis=1)]
# Replace all empty strings with NaN (which will be interpreted as NULL in PostgreSQL)
df.replace("", pd.NA, inplace=True)

# Save the modified DataFrame to a new CSV
df.to_csv('/mnt/c/Users/bc2to/Documents/ali2025-registration/db_approach/sql/modified_file.csv', index=False)


