IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'UNIX_TIMESTAMP')
DROP FUNCTION [dbo].[UNIX_TIMESTAMP]
GO
CREATE FUNCTION [dbo].[UNIX_TIMESTAMP] (@ctimestamp datetime)
RETURNS integer
AS 
BEGIN
  /* Function body */
  declare @return integer

  SELECT @return = DATEDIFF(SECOND,{d '1970-01-01'}, @ctimestamp)

  return @return
END
GO


