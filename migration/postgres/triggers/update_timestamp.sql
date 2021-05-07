CREATE TRIGGER set_update_timestamp_user
    BEFORE UPDATE ON "user"
    FOR EACH ROW
EXECUTE PROCEDURE trigger_update_timestamp();

CREATE TRIGGER set_update_timestamp_workout_plan
    BEFORE UPDATE ON workout_plan
    FOR EACH ROW
EXECUTE PROCEDURE trigger_update_timestamp();
