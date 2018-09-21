IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_system_system_unique_position')
DROP PROCEDURE [dbo].[g_system_system_unique_position]
GO
CREATE PROCEDURE [dbo].[g_system_system_unique_position]
	
AS
BEGIN
	declare @result int

	--SET @result = (SELECT COUNT(*)
	--FROM [dbo].[g_system] a, [dbo].[g_system] b
	--WHERE a.position = b.position
	--AND a.Id <> b.Id)
RETURN @result
END
GO


