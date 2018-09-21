IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'PARAM_STRING_BUILDER')
DROP FUNCTION [dbo].[PARAM_STRING_BUILDER]
GO
CREATE FUNCTION [dbo].[PARAM_STRING_BUILDER] (@key nvarchar(MAX), @value  nvarchar(MAX))
RETURNS nvarchar(MAX)
AS
BEGIN 
	RETURN  @key +'='''+@value +''',';
END
GO

