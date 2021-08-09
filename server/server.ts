import { App } from "./app";
import { LoginController, OrderController, UserController } from "./controllers";

const app = new App([new LoginController(), new UserController(), new OrderController()], 8080);
app.listen();