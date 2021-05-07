CREATE TRIGGER increase_workout_plan_count_user
    BEFORE INSERT ON workout_plan
    FOR EACH ROW
EXECUTE PROCEDURE increase_workout_plan_count();

CREATE TRIGGER decrease_workout_plan_count_user
    BEFORE DELETE ON workout_plan
    FOR EACH ROW
EXECUTE PROCEDURE decrease_workout_plan_count();
