IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_db_relation_delete_item')
DROP PROCEDURE [dbo].[test_db_relation_delete_item]
GO
CREATE PROCEDURE [dbo].[test_db_relation_delete_item](@Id int) AS
BEGIN
DECLARE @sucsess bit =0;
	IF(@Id=0)
		BEGIN 
			raiserror('The value should not be 0', 15, 1) -- with log ;
			SELECT @sucsess as sucsess;
			return;
		END
	ELSE IF 	NOT EXISTS(SELECT top(1) Id FROM [dbo].[test_db_relation] WHERE Id =@Id)
		BEGIN 
			raiserror('row not exist', 15, 1) -- with log ;
			SELECT @sucsess as sucsess;
			return;
		END
	ELSE
		BEGIN TRANSACTION
		DELETE FROM [dbo].[test_db_relation] WHERE Id =@Id;
		COMMIT;	
		SET @sucsess =1;
		SELECT @sucsess as sucsess;
		return;
END