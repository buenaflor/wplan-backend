CREATE TABLE IF NOT EXISTS email_verification
(
    id              uuid        NOT NULL DEFAULT uuid_generate_v4(),
    user_id         uuid        NOT NULL,
    token           text        NOT NULL,
    expiration_time integer     NOT NULL DEFAULT 1200,
    created_at      timestamptz NOT NULL DEFAULT current_timestamp,
    updated_at      timestamptz NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES "user" (id),
    CONSTRAINT name_length_check CHECK (length(token) <= 128)
);
