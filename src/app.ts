import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";

import { settings } from "./settings";
import { FileRouter, IndexRouter, RoleRouter, UserRouter } from "./routes";
import { error, notFound } from "./middlewares";

/* --- Constants --- */
const dirname = import.meta.dirname; // __dirname;
const maxAge = 31_557_600_000;

/* --- Express App --- */
const app = express();

// setup static files
app.use("/static", express.static(path.join(dirname, "public"), { maxAge: maxAge }));

// gzip compression
app.use(compression());

// body parser params and attach them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// secure apps by setting varius HTTP headers
app.use(helmet());

// enabl CORS (Cross Origin Resource Sharing)
app.use(cors({ origin: settings.cors.origin, credentials: true }));

// routes
app.use("/", IndexRouter);
app.use("/files", FileRouter);
app.use("/users", UserRouter);
app.use("/roles", RoleRouter);

// catch non-existant endpoints
app.use(notFound);

// error handler, if any route throws a error, it should be pass through this middleware
app.use(error);

export default app;
