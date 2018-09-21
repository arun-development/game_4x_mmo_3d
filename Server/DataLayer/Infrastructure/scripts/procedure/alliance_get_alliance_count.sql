IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_get_alliance_count')
DROP PROCEDURE [dbo].[alliance_get_alliance_count]
GO
CREATE PROCEDURE [dbo].[alliance_get_alliance_count]
AS
BEGIN
SELECT Count(*)  FROM [dbo].[alliance]
END
GO


