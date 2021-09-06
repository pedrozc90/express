import express from "express";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import * as pkg from "../package.json";
import RootRouter from "./routes/index.router";
import FileStorageRouter from "./routes/file-storage.router";
import { errorHandler, loggerHandler } from "./middlewares";

// create express server
const app = express();
const env = process.env["NODE_ENV"] || "development";
const port = 0; //process.env.PORT || 4000;
const name = pkg.name;
const version = pkg.version;
const dirname = __dirname;

// application settings
app.set("env", env);
app.set("port", port);
app.set("name", name);
app.set("version", version);

// setup static files
app.use("/static", express.static(path.join(dirname, "public"), { maxAge: 31557600000 }));

// view engine
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");

// gzip compression
app.use(compression());

// body parser params and attach them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS (Corss Origin Resource Sharing)
app.use(cors({ origin: process.env["ALLOWED_ORIGIN"], credentials: true }));

// middlewares
// app.use((request: Request, response: Response, next: NextFunction) => {
//     response.locals.settings = settings;
//     next();
// });

// logger
app.use(loggerHandler());

// API Routes
app.use("/", RootRouter);
app.use("/api/fs", FileStorageRouter);
app.use((req, res) => {
	return res.status(404).json({ message: "page not found." });
});

// error handler
app.use(errorHandler());

export default app;
