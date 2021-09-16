import bodyParser from "body-parser";
import express from "express";
import { connect, connection } from 'mongoose';
import logger from "./services/log";
const cors = require('cors');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const dbConnString = process.env.MONGO_CONN_STRING || 'mongodb://localhost/CruTransferDb';

export class App {
    public app: express.Application;

    public port: number = 3000;

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

        this.app.use(express.static(process.cwd() + "/crutransfer-app/"));

        this.app.use((req: any, res: any, next: any) => {
            res.header(
                "Access-Control-Allow-Headers",
                "x-access-token, Origin, Content-Type, Accept"
            );
            next();
        });

        this.app.use(
            fileUpload({
                createParentPath: true,
            })
        );
    }

    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });

        this.app.get('/', (req, res) => {
            res.sendFile(process.cwd() + "/crutransfer-app/index.html")
        });
    }

    private connectDb() {
        connect(dbConnString, { useNewUrlParser: true });
        const db = connection;

        // Added check for DB connection
        if (!db)
            logger.info("Error connecting db")
        else
            logger.info("Db connected successfully")
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`App listening on the port ${this.port}`);
        });
    }
}