import express from "express";
import handlebars from "express-handlebars";
import { Server as HTTPServer } from "http";
import { Server as SocketIO } from "socket.io";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import __dirname from "./dirname.js";
import productsView from "./routes/products.views.js";
import productsRealTime from "./routes/realtimeproducts.views.js";

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const httpServer = HTTPServer(app);
const io = new SocketIO(httpServer);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/products", productsView);

app.use("/realtimeproducts", productsRealTime);

// * Metodos socket
io.on("connection", (socket) => {
  console.log(`Cliente conectado con la identificacion: ${socket.id}`);

  socket.emit("saludo", socket.id);
});

httpServer.listen(8080, () => {
  console.log("escuchando en el puerto 8080!");
});
