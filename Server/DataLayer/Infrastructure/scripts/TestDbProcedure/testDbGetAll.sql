IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_db_get_all')
DROP PROCEDURE [dbo].[test_db_get_all]
GO
CREATE PROCEDURE [dbo].[test_db_get_all] AS
BEGIN
SELECT * FROM [dbo].[test_db]
END