import { Prisma } from "../generated/client";
import { prisma } from "../libs";
import { settings } from "../settings";
import { AppError } from "../types";

// ─── Error Code Union ────────────────────────────────────────────────────────

/** All known Prisma error codes across Common, Query Engine, Migrate, db pull, and Accelerate. */
export type PrismaErrorCode =
    // Common (P1xxx)
    | "P1000" // Authentication failed
    | "P1001" // Can't reach database server
    | "P1002" // Database server timed out
    | "P1003" // Database does not exist
    | "P1008" // Operations timed out
    | "P1009" // Database already exists
    | "P1010" // User denied access
    | "P1011" // TLS connection error
    | "P1012" // Schema validation error
    | "P1013" // Invalid database string
    | "P1014" // Underlying model does not exist
    | "P1015" // Unsupported database features
    | "P1016" // Incorrect number of raw query parameters
    | "P1017" // Server closed the connection
    // Prisma Client / Query Engine (P2xxx)
    | "P2000" // Value too long for column
    | "P2001" // Record not found in where condition
    | "P2002" // Unique constraint failed
    | "P2003" // Foreign key constraint failed
    | "P2004" // Constraint failed on the database
    | "P2005" // Invalid stored value for field type
    | "P2006" // Invalid provided value for field
    | "P2007" // Data validation error
    | "P2008" // Failed to parse query
    | "P2009" // Failed to validate query
    | "P2010" // Raw query failed
    | "P2011" // Null constraint violation
    | "P2012" // Missing required value
    | "P2013" // Missing required argument
    | "P2014" // Relation violation
    | "P2015" // Related record not found
    | "P2016" // Query interpretation error
    | "P2017" // Records for relation not connected
    | "P2018" // Required connected records not found
    | "P2019" // Input error
    | "P2020" // Value out of range
    | "P2021" // Table does not exist
    | "P2022" // Column does not exist
    | "P2023" // Inconsistent column data
    | "P2024" // Connection pool timeout
    | "P2025" // Operation failed — required record not found
    | "P2026" // Unsupported database feature used in query
    | "P2027" // Multiple errors during query execution
    | "P2028" // Transaction API error
    | "P2029" // Query parameter limit exceeded
    | "P2030" // No fulltext index found
    | "P2031" // MongoDB replica set required for transactions
    | "P2033" // Number does not fit in 64-bit signed integer
    | "P2034" // Transaction failed — write conflict or deadlock
    | "P2035" // Assertion violation on the database
    | "P2036" // Error in external connector
    | "P2037" // Too many database connections
    // Prisma Migrate / Schema Engine (P3xxx)
    | "P3000" // Failed to create database
    | "P3001" // Migration with destructive changes
    | "P3002" // Migration rolled back
    | "P3003" // Migration format changed
    | "P3004" // System database — do not alter
    | "P3005" // Database schema not empty
    | "P3006" // Migration failed on shadow database
    | "P3007" // Blocked preview features in schema engine
    | "P3008" // Migration already applied
    | "P3009" // Failed migrations block new ones
    | "P3010" // Migration name too long
    | "P3011" // Migration never applied — cannot roll back
    | "P3012" // Migration not in failed state — cannot roll back
    | "P3013" // Datasource provider arrays not supported
    | "P3014" // Shadow database creation failed
    | "P3015" // Migration file not found
    | "P3016" // Fallback database reset failed
    | "P3017" // Migration not found
    | "P3018" // Migration failed to apply
    | "P3019" // Datasource provider mismatch
    | "P3020" // Shadow database auto-creation disabled (Azure SQL)
    | "P3021" // Foreign keys not supported on this database
    | "P3022" // Direct DDL execution disabled
    | "P3023" // externalTables must use fully qualified identifiers
    | "P3024" // externalTables must use simple identifiers
    // prisma db pull (P4xxx)
    | "P4000" // Introspection failed
    | "P4001" // Introspected database was empty
    | "P4002" // Introspected schema inconsistent
    // Prisma Accelerate (P5xxx / P6xxx)
    | "P5011" // Too many requests
    | "P6000" // Generic server error
    | "P6001" // Invalid data source URL
    | "P6002" // Unauthorized — invalid API key
    | "P6003" // Plan limit reached
    | "P6004" // Accelerate global query timeout exceeded
    | "P6005" // Invalid parameters
    | "P6006" // Prisma version not supported by Accelerate
    | "P6008" // Engine connection/start error
    | "P6009" // Response size limit exceeded
    | "P6010"; // Project disabled

// ─── Human-readable messages ──────────────────────────────────────────────────

export const PRISMA_ERROR_MESSAGES: Record<PrismaErrorCode, string> = {
    P1000: "Authentication failed against the database server.",
    P1001: "Can't reach the database server.",
    P1002: "The database server was reached but timed out.",
    P1003: "Database does not exist.",
    P1008: "Operations timed out.",
    P1009: "Database already exists.",
    P1010: "User was denied access on the database.",
    P1011: "Error opening a TLS connection.",
    P1012: "Schema validation error.",
    P1013: "The provided database string is invalid.",
    P1014: "The underlying model does not exist.",
    P1015: "Schema uses features unsupported by this database version.",
    P1016: "Raw query had an incorrect number of parameters.",
    P1017: "Server has closed the connection.",
    P2000: "The provided value is too long for the column's type.",
    P2001: "The record searched for in the where condition does not exist.",
    P2002: "Unique constraint failed.",
    P2003: "Foreign key constraint failed.",
    P2004: "A constraint failed on the database.",
    P2005: "The value stored in the database is invalid for the field's type.",
    P2006: "The provided value for the field is not valid.",
    P2007: "Data validation error.",
    P2008: "Failed to parse the query.",
    P2009: "Failed to validate the query.",
    P2010: "Raw query failed.",
    P2011: "Null constraint violation.",
    P2012: "Missing a required value.",
    P2013: "Missing the required argument for the field.",
    P2014: "The change would violate a required relation.",
    P2015: "A related record could not be found.",
    P2016: "Query interpretation error.",
    P2017: "The records for the relation are not connected.",
    P2018: "The required connected records were not found.",
    P2019: "Input error.",
    P2020: "Value out of range for the type.",
    P2021: "The table does not exist in the current database.",
    P2022: "The column does not exist in the current database.",
    P2023: "Inconsistent column data.",
    P2024: "Timed out fetching a new connection from the connection pool.",
    P2025: "An operation failed because a required record was not found.",
    P2026: "The database provider doesn't support a feature used in the query.",
    P2027: "Multiple errors occurred on the database during query execution.",
    P2028: "Transaction API error.",
    P2029: "Query parameter limit exceeded.",
    P2030: "Cannot find a fulltext index to use for the search.",
    P2031: "MongoDB server must be run as a replica set for transactions.",
    P2033: "A number in the query does not fit into a 64-bit signed integer.",
    P2034: "Transaction failed due to a write conflict or a deadlock.",
    P2035: "Assertion violation on the database.",
    P2036: "Error in external connector.",
    P2037: "Too many database connections opened.",
    P3000: "Failed to create database.",
    P3001: "Migration possible with destructive changes and possible data loss.",
    P3002: "The attempted migration was rolled back.",
    P3003: "The format of migrations changed — saved migrations are no longer valid.",
    P3004: "System database should not be altered with prisma migrate.",
    P3005: "The database schema is not empty.",
    P3006: "Migration failed to apply cleanly to the shadow database.",
    P3007: "Some requested preview features are not yet allowed in the schema engine.",
    P3008: "The migration is already recorded as applied in the database.",
    P3009: "Failed migrations found — new migrations will not be applied.",
    P3010: "The name of the migration is too long (max 200 characters).",
    P3011: "Migration cannot be rolled back because it was never applied.",
    P3012: "Migration cannot be rolled back because it is not in a failed state.",
    P3013: "Datasource provider arrays are no longer supported in migrate.",
    P3014: "Prisma Migrate could not create the shadow database.",
    P3015: "Could not find the migration file.",
    P3016: "Fallback method for database reset failed.",
    P3017: "The migration could not be found.",
    P3018: "A migration failed to apply.",
    P3019: "Datasource provider mismatch with migration_lock.toml.",
    P3020: "Automatic creation of shadow databases is disabled on Azure SQL.",
    P3021: "Foreign keys cannot be created on this database.",
    P3022: "Direct execution of DDL SQL statements is disabled on this database.",
    P3023: "externalTables & externalEnums must contain fully qualified identifiers.",
    P3024: "externalTables & externalEnums must contain simple identifiers without a schema name.",
    P4000: "Introspection operation failed to produce a schema file.",
    P4001: "The introspected database was empty.",
    P4002: "The schema of the introspected database was inconsistent.",
    P5011: "Too many requests — request volume exceeded.",
    P6000: "Accelerate generic server error.",
    P6001: "Accelerate invalid data source URL.",
    P6002: "Accelerate unauthorized — invalid API key.",
    P6003: "Accelerate plan limit reached.",
    P6004: "Accelerate global query timeout exceeded.",
    P6005: "Accelerate invalid parameters supplied.",
    P6006: "Prisma version not supported by Accelerate.",
    P6008: "Accelerate engine failed to start or connect.",
    P6009: "Accelerate response size limit exceeded.",
    P6010: "Accelerate project is disabled.",
};

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isPrismaErrorCode(code: string): code is PrismaErrorCode {
    return code in PRISMA_ERROR_MESSAGES;
}

export const isError = (err: unknown, code: string): boolean => {
    return typeof err === "object" && err !== null && "code" in err && "message" in err && err.code === code;
};

export const map = (e: unknown, code?: PrismaErrorCode | string): AppError | undefined => {
    if (e === undefined || e === null) return undefined;

    // ── Known request errors ──────────────────────────────────────────────
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // TS now fully knows: e.code, e.message, e.meta, e.clientVersion, etc.
        const prismaCode = e.code as PrismaErrorCode;

        if (code && prismaCode === code) {
            return new AppError({ status: "BAD_REQUEST", message: e.message, cause: e });
        }

        switch (prismaCode) {
            case "P2001":
            case "P2015":
            case "P2018":
            case "P2025": {
                const message = e.meta?.["cause"] as string;
                return new AppError({ status: "NOT_FOUND", message, cause: e });
            }

            case "P2002": {
                const target = (e.meta?.["target"] as string[] | undefined)?.join(", ");
                return new AppError({ status: "CONFLICT", message: `Duplicate value on field(s): ${target}`, cause: e });
            }

            case "P2000":
            case "P2005":
            case "P2006":
            case "P2007":
            case "P2011":
            case "P2012":
            case "P2013":
            case "P2019":
            case "P2020":
                return new AppError({ status: "BAD_REQUEST", message: e.message, cause: e });

            case "P2003":
            case "P2004":
            case "P2014":
            case "P2017":
                return new AppError({ status: "UNPROCESSABLE_ENTITY", message: e.message, cause: e });

            case "P2024":
            case "P2037":
                return new AppError({ status: "SERVICE_UNAVAILABLE", message: e.message, cause: e });

            default:
                return new AppError({ status: "INTERNAL_SERVER_ERROR", message: e.message, cause: e });
        }
    }

    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        return new AppError({ status: "INTERNAL_SERVER_ERROR", message: e.message, cause: e });
    }

    if (e instanceof Prisma.PrismaClientRustPanicError) {
        return new AppError({ status: "INTERNAL_SERVER_ERROR", message: "Database engine crashed", cause: e });
    }

    if (e instanceof Prisma.PrismaClientInitializationError) {
        return new AppError({ status: "SERVICE_UNAVAILABLE", message: "Database unavailable", cause: e });
    }

    if (e instanceof Prisma.PrismaClientValidationError) {
        return new AppError({ status: "BAD_REQUEST", message: e.message, cause: e });
    }

    return undefined;
};

export interface DatabaseHealthCheck {
    status: "CONNECTED" | "NOT_CONNECTED";
    error?: string;
    reason?: string;
}

export const healthCheck = async (): Promise<DatabaseHealthCheck> => {
    try {
        const res = await prisma.$queryRaw`SELECT 1`;
        return {
            status: res ? "CONNECTED" : "NOT_CONNECTED",
        };
    } catch (e) {
        return {
            status: "NOT_CONNECTED",
            error: e instanceof Error ? e.message : String(e),
            ...(e instanceof Error && settings.isDev() ? { reason: e.stack } : {}),
        };
    }
};
