IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_db_relation_delete_all')
DROP PROCEDURE [dbo].[test_db_relation_delete_all]
GO
CREATE PROCEDURE [dbo].[test_db_relation_delete_all] AS
BEGIN
DECLARE @sucsess bit =0;
DELETE FROM [dbo].[test_db_relation]
SET @sucsess =1;
SELECT @sucsess as sucsess;
END