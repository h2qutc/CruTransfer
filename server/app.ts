import bodyParser from "body-parser";
import express from "express";
import { connect, connection } from 'mongoose';
import { EmailService } from "./services";
const cors = require('cors');


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

            // const emailService = new EmailService();
            // emailService.sendMail('hohongquan.bk@gmail.com', 'demo email', 'content email');
        });
    }
}