## Description

Musuem Visitors API written with the help of InversifyJS and inversify-express-utils library.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev

# build
$ npm run build
```

## Test

Test written in Mocha, Chai and Sinon. Coverage is done using Istanbul.

```bash
# run test and coverage
$ npm run test
```

## API 

```bash

# API URL
- GET /api/visitors?date=dateInMilliseconds&ignore=museumToIgnore

# API params
- date in millseconds
- museum to ignore (optional)

# API response format
{
    "attendance": {
        “month”: string,
        “year”: number,
        “highest”: {
            “museum”: string,
            “visitors”: number
        },
        “lowest”: {
            “museum”: string,
            “visitors”: number
        },
        “ignored”: {
            “museum”: string,
            “visitors”: number
        },
       “total”: number
    }
}
```





