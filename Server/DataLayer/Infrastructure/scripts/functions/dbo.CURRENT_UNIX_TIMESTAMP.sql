﻿IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'CURRENT_UNIX_TIMESTAMP')
DROP FUNCTION [dbo].[CURRENT_UNIX_TIMESTAMP]
GO
CREATE FUNCTION [dbo].[CURRENT_UNIX_TIMESTAMP] ()
RETURNS INT
AS
BEGIN
	RETURN [dbo].[UNIX_TIMESTAMP](SYSUTCDATETIME()) 
END
GO


