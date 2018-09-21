IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_db_delete_all')
DROP PROCEDURE [dbo].[test_db_delete_all]

GO
CREATE PROCEDURE [dbo].[test_db_delete_all] AS
BEGIN
DECLARE @sucsess bit =0;
	BEGIN TRY 
		DELETE FROM [dbo].[test_db]
		SET @sucsess =1;
	END TRY
	BEGIN CATCH
		SET @sucsess =0;
		SELECT @sucsess as sucsess;
	END CATCH 
    SELECT @sucsess as sucsess;
END



