-- roles
CREATE TABLE IF NOT EXISTS "roles" (
    "id"            BIGSERIAL    NOT NULL,

    "inserted_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version"       INTEGER      NOT NULL DEFAULT 1,

    "name"          VARCHAR(255) NOT NULL,
    "is_default"    BOOLEAN,
    "permission"    BIGINT       NOT NULL DEFAULT 0,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "roles_name_ukey" UNIQUE ("name")
);

CREATE UNIQUE INDEX IF NOT EXISTS "roles_is_default_ukey" ON "roles" ("is_default") WHERE ("is_default" = TRUE);

INSERT INTO "roles" ("id", "name", "is_default", "permission") VALUES
(1, 'None'  , false,  0),
(2, 'Normal',  true,  42),
(3, 'Admin' , false, 127);

-- users
CREATE TABLE IF NOT EXISTS "users" (
    "id"            BIGSERIAL    NOT NULL,

    "inserted_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version"       INTEGER      NOT NULL DEFAULT 1,

    "email"         VARCHAR(255) NOT NULL,
    "password"      VARCHAR(64)  NOT NULL,
    "active"        BOOLEAN      NOT NULL DEFAULT true,
    
    "role_id"       BIGINT       NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_role_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "users_email_ukey" UNIQUE ("email")
);

-- refresh rokens
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
    "id"            BIGSERIAL    NOT NULL,

    "inserted_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version"       INTEGER      NOT NULL DEFAULT 1,

    "token"         TEXT         NOT NULL,
    "expires_at"    TIMESTAMP(3) NOT NULL,

    "user_id"       BIGINT       NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "refresh_tokens_user_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "refresh_tokens_ukey" UNIQUE ("token")
);

-- stored_files
CREATE TYPE "StorageFileType" AS ENUM ('local', 'bucket');

CREATE TABLE IF NOT EXISTS "stored_files" (
    "id"            BIGSERIAL         NOT NULL,

    "inserted_at"   TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version"       INTEGER           NOT NULL DEFAULT 1,

    "storage_type"  "StorageFileType" NOT NULL DEFAULT 'local',
    "object_key"    VARCHAR(1000),
    "etag"          VARCHAR(255),
    
    "hash"          VARCHAR(64)       NOT NULL,
    "filename"      VARCHAR(255)      NOT NULL,
    "content_type"  VARCHAR(255)      NOT NULL,

    "content"       BYTEA,
    "size"          BIGINT            NOT NULL DEFAULT 0,

    CONSTRAINT "stored_files_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "stored_files_hash_ukey" UNIQUE ("hash"),
    CONSTRAINT "stored_files_storage_chk" CHECK (
        (storage_type = 'local' AND content IS NOT NULL AND object_key IS NULL)
        OR
        (storage_type = 'bucket' AND content IS NULL AND object_key IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS "stored_files_object_key_idx" ON "stored_files" ("object_key");
CREATE INDEX IF NOT EXISTS "stored_files_etag_idx" ON "stored_files" ("etag");
