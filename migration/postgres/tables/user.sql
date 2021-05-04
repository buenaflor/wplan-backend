CREATE TABLE IF NOT EXISTS public."user"
(
    id                    uuid        NOT NULL DEFAULT uuid_generate_v4(),
    login                 text        NOT NULL UNIQUE,
    name                  text        NOT NULL,
    password              text        NOT NULL,
    email                 text        NOT NULL UNIQUE,
    bio                   text,
    email_confirmed       boolean     NOT NULL DEFAULT false,
    collaborators         integer     NOT NULL DEFAULT 0,
    public_workout_plans  integer     NOT NULL DEFAULT 0,
    private_workout_plans integer     NOT NULL DEFAULT 0,
    created_at            timestamptz NOT NULL DEFAULT current_timestamp,
    updated_at            timestamptz NOT NULL DEFAULT current_timestamp,
    last_login_at         timestamptz NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (id),
    CONSTRAINT login_length_check CHECK (length(login) <= 40),
    CONSTRAINT name_length_check CHECK (length(name) <= 40),
    CONSTRAINT bio_length_check CHECK (length(bio) <= 160),
    CONSTRAINT password_length_check CHECK (length(password) <= 128),
    CONSTRAINT positive_numbers_check CHECK (public_workout_plans >= 0 AND private_workout_plans >= 0 AND
                                             collaborators >= 0),
    CONSTRAINT proper_email_check CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);
