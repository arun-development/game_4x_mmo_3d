IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_get_all_active')
DROP PROCEDURE [dbo].[alliance_get_all_active]
GO

CREATE PROCEDURE [dbo].[alliance_get_all_active]
AS BEGIN
SELECT * FROM [dbo].[alliance] WHERE disbandet = 0;
END
GO



