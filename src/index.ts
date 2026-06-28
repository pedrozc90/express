import http from "http";

import app from "./app.ts";

export const DI = {} as {
	server: http.Server;
};

const env = app.get("env");
const port = app.get("port");
const version = app.get("version");

const server: http.Server = app.listen(port);

server.on("listening", () => {
	if (!server.listening) return;

	const addr = server.address();

	console.log("Address:", addr);

	const bind = addr ? (typeof addr === "string" ? `Pipe ${addr}` : `http://${addr.address}:${addr.port}`) : null;

	console.log("----------------------------------------------------------------------");
	console.log(`Application running on ${bind}`);
	console.log("To shut it down, press CTRL + C at any time.");
	console.log("----------------------------------------------------------------------");
	console.log(`Process PID: ${process.pid}`);
	console.log(`Environment: ${env}`);
	console.log(`Version    : ${version}`);
	console.log("----------------------------------------------------------------------");
});

server.on("error", (error: Error) => {
	const syscall = "syscall" in error ? error.syscall : null;
	if (syscall !== "listen") {
		throw error;
	}

	const bind: string = typeof port === "string" ? "Pipe " + port : "Port " + port;

	// handle specific listen errors with friendly messages
	const code = "code" in error ? error.code : null;
	switch (code) {
		case "EACCES": {
			console.error(bind + " requires elevated privileges");
			return process.exit(1);
		}
		case "EADDRINUSE": {
			console.error(bind + " is already in use");
			return process.exit(1);
		}
		default:
			throw error;
	}
});
