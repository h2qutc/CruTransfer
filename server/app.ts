import bodyParser from "body-parser";
import express from "express";
const cors = require('cors');
import { connect, connection } from 'mongoose';


export class App {
    public app: express.Application;

    public port: number = 8080;

    constructor(controllers: any[], port: number) {
        this.app = express();
        this.port = port;

        this.connectDb();

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.use(cors({ origin: '*' }));

        this.app.use((req: any, res: any, next: any) => {
            res.header(
                "Access-Control-Allow-Headers",
                "x-access-token, Origin, Content-Type, Accept"
            );
            next();
        });
    }

    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });

    }

    private connectDb() {
        connect('mongodb://localhost/CruTransferDb', { useNewUrlParser: true });
        const db = connection;

        // Added check for DB connection
        if (!db)
            console.log("Error connecting db")
        else
            console.log("Db connected successfully")
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const express = require('express')
// const app = express()

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use(cors({ origin: '*' }));

// app.use((req: any, res: any, next: any) => {
//     res.header(
//         "Access-Control-Allow-Headers",
//         "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
// });


// Connect to Mongoose and set connection variable
// mongoose.connect('mongodb://localhost/CruTransferDb', { useNewUrlParser: true });
// const db = mongoose.connection;

// // Added check for DB connection
// if (!db)
//     console.log("Error connecting db")
// else
//     console.log("Db connected successfully")

// // Setup server port
// const port = process.env.PORT || 8080;

// app.get('/', (req: any, res: any) => res.send('Hello World!'));

// const apiRoutes = require('./api-routes');
// app.use('/api', apiRoutes);


// Command: nodemon index
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })