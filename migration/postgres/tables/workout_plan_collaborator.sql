CREATE TABLE IF NOT EXISTS workout_plan_collaborator
(
    id              uuid NOT NULL DEFAULT uuid_generate_v4(),
    workout_plan_id uuid NOT NULL,
    user_id         uuid NOT NULL,
    role_id         uuid NOT NULL,
    permission_id   uuid NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plan (id),
    FOREIGN KEY (user_id) REFERENCES "user" (id),
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (permission_id) REFERENCES permission (id)
);
