CREATE OR REPLACE FUNCTION increase_workout_plan_count()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_private IS TRUE THEN
        UPDATE "user" SET private_workout_plans=private_workout_plans + 1 WHERE id=NEW.user_id;
    ELSE
        UPDATE "user" SET public_workout_plans=public_workout_plans + 1 WHERE id=NEW.user_id;
    end if;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrease_workout_plan_count()
    RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_private IS TRUE THEN
        UPDATE "user" SET private_workout_plans=private_workout_plans - 1 WHERE id=OLD.user_id;
    ELSE
        UPDATE "user" SET public_workout_plans=public_workout_plans - 1 WHERE id=OLD.user_id;
    end if;
END;
$$ LANGUAGE plpgsql;
