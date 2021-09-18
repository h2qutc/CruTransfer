
import { App } from "./app";
import { DriveController, LoginController, OrderController, UserController } from "./controllers";

const app = new App([new LoginController(), new UserController(), 
    new OrderController(), new DriveController()], 3000);
app.listen();