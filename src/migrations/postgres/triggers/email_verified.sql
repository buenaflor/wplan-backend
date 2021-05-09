CREATE TRIGGER set_email_verified_user
    BEFORE UPDATE ON "user"
    FOR EACH ROW
EXECUTE PROCEDURE trigger_email_verified();
