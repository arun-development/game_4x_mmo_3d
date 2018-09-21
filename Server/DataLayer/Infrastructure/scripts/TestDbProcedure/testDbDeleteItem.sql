go IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_db_delete_item')
DROP PROCEDURE [dbo].[test_db_delete_item]
GO
CREATE PROCEDURE [dbo].[test_db_delete_item](@Id int) AS
BEGIN
DECLARE @sucsess bit =0;
	IF(@Id=0 or @Id IS NULL)
		BEGIN 
			raiserror('The value should not be 0 or NULL', 15, 1)
			SELECT @sucsess as sucsess;
			return;
		END
	ELSE IF NOT EXISTS(SELECT top(1) Id FROM [dbo].[test_db] WHERE Id =@Id)
		BEGIN 
			raiserror('row not exist', 15, 1)
			SELECT @sucsess as sucsess;
			return;
		END
	ELSE
		BEGIN TRANSACTION
			BEGIN TRY		
				DELETE FROM [dbo].[test_db] WHERE Id =@Id;
				SET @sucsess =1;
				COMMIT TRANSACTION
			END TRY
			BEGIN CATCH
					SET @sucsess =0;
					ROLLBACK TRANSACTION
					THROW;
			END CATCH
	SELECT @sucsess as sucsess;
END
 