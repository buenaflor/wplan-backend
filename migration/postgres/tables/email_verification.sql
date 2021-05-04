CREATE TABLE IF NOT EXISTS email_verification
(
    id         uuid        NOT NULL DEFAULT uuid_generate_v4(),
    user_id    uuid        NOT NULL,
    token      text        NOT NULL,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES "user" (id),
    CONSTRAINT name_length_check CHECK (length(token) <= 128)
);
