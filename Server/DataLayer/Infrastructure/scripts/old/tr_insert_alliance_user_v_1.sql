
CREATE TRIGGER [tr_insert_alliance_user]
    ON [dbo].[alliance_user]
    AFTER INSERT
    AS
    BEGIN
		DECLARE @user_id int
		DECLARE @alliance_id int
		DECLARE @user_ids varchar(MAX)

		SET @user_id = (SELECT user_id FROM inserted)
		SET @alliance_id = (SELECT alliance_id FROM inserted)

		SET @user_ids = (SELECT user_ids FROM [dbo].[alliance] WHERE Id = @alliance_id)

		--IF '{[]}' = @user_ids
		--	SET @user_ids = REPLACE(@user_ids, ']}', CONCAT(@user_id, ']}'))
		--ELSE
		--	SET @user_ids = REPLACE(@user_ids, ']}', CONCAT(',', @user_id, ']}'))

					IF '[]' = @user_ids
			SET @user_ids = REPLACE(@user_ids, ']', CONCAT(@user_id, ']'))
		ELSE
			SET @user_ids = REPLACE(@user_ids, ']', CONCAT(',', @user_id, ']'))
			
        UPDATE [dbo].[alliance] SET 
			user_ids = @user_ids
		WHERE id = @alliance_id
    END