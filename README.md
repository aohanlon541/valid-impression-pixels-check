# Validate Impression Pixels

## Steps to Install
- Run `npm install`
- Download newest version of tl_tactics in CSV format and save to within directory.

## Dependencies
- csv-parser: 3.0.0
- mocha: 8.3.2
- node-fetch: 2.6.1

## Steps to Run
- Run `npm run executePixelValidation [count]`
    - The count value will return that number of pixels ran through the validation. Due to this being an assessment and the size of the csv, I wanted it to make the console app run promptly and does not get tied up with thousands of records.