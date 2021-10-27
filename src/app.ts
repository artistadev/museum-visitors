import "reflect-metadata";
import dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import container from './inversify.config';

// Initialize .env
dotenv.config();

// create express server
const server = new InversifyExpressServer(container);



// for uncaught error
server.setErrorConfig((app) => {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Internal server error. Please try again later!');
    });
});

// start express server
server.build().listen(process.env.PORT, () => {
    console.log(`Server listening on PORT : ${ process.env.PORT }`);
});
