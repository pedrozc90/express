import app from "./app";
import { prisma } from "./libs";
import { settings } from "./settings";

const { port } = settings;

const server = app.listen(port);

server.on("listening", () => {
    if (!server.listening) return;

    const addr = server.address();
    console.log("Address:", addr);

    if (settings.environment === "development") {
        console.log(settings);
    }

    const bind = addr ? (typeof addr === "string" ? `Pipe ${addr}` : `http://${addr.address}:${addr.port}`) : null;

    console.log("----------------------------------------------------------------------");
    console.log(`Application running on ${bind}`);
    console.log("To shut it down, press CTRL + C at any time.");
    console.log("----------------------------------------------------------------------");
    console.log(`Process PID: ${process.pid}`);
    console.log(`Environment: ${settings.environment}`);
    console.log(`Version    : ${settings.version}`);
    console.log("----------------------------------------------------------------------");
});

server.on("error", (error: Error) => {
    const syscall = "syscall" in error ? error.syscall : null;
    if (syscall !== "listen") {
        throw error;
    }

    const bind: string = typeof port === "string" ? "Pipe " + port : "Port " + port;
    const code = "code" in error ? error.code : null;

    // handle specific listen errors with friendly messages
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

let shuttingDown: boolean = false;

const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`${signal} received. Shutting down gracefully...`);

    const forceExitTimer = setTimeout(() => {
        console.log("Graceful shutdown timed out. Forcing exit.");
        process.exit(1);
    }, 10_000);

    forceExitTimer.unref();

    try {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });

        await prisma.$disconnect();

        console.log("Shutdown complete");
        process.exit(0);
    } catch (e) {
        console.error("Error during shutdown:", e);
        process.exit(1);
    }
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
