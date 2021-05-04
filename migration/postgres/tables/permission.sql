CREATE TABLE IF NOT EXISTS permission
(
    id   uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT name_length_check CHECK (length(name) <= 32)
);
