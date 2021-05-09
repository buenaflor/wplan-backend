CREATE OR REPLACE FUNCTION trigger_email_verified()
    RETURNS TRIGGER AS $$
BEGIN
    IF OLD.email != NEW.email THEN
        NEW.email_confirmed = false;
    end if;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
