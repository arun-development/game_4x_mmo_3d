USE Test;
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_procedure')
DROP PROCEDURE [dbo].[test]
GO
CREATE PROCEDURE [dbo].[test] (@testValue int, @secondCondition bit)
AS BEGIN
	DECLARE @sucsess bit = 0; 
	IF(@testValue = 0 or @testValue IS NULL)
		BEGIN 
		print (' @allianceId = 0');
			 SELECT @sucsess as sucsess 
			 return @sucsess; 
		END
	ELSE IF (@secondCondition =1)
	      BEGIN 
	     print (' ELSE IF EXISTS');
		 return @sucsess; 
		 END
	ELSE 
	     BEGIN 
		 print ('ELSE');
		 return @sucsess; 		 
		 END
END
GO

BEGIN 
DECLARE @result int;  
EXECUTE @result = [dbo].[test] 1, 0; 
select @result as result
END; 
GO

DROP PROCEDURE [dbo].[test]
