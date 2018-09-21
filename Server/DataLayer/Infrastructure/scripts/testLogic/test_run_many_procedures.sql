USE Test;
--check
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_procedure_to_inv')
DROP PROCEDURE [dbo].[test_procedure_to_inv]
GO

 
CREATE PROCEDURE [dbo].[test_procedure_to_inv] (@param int)
AS BEGIN

declare @p nvarchar(1) = @param;
 --EXEC sp_executesql  @sqlCommand; 
 PRINT('@param:'+ @p);
 
END;
GO


 declare @sql nvarchar(max)= 'exec [dbo].[test_procedure_to_inv] @param=1; exec [dbo].[test_procedure_to_inv] @param=2;exec [dbo].[test_procedure_to_inv] @param=3;';
 exec sp_executesql @sql;  

DROP PROCEDURE [dbo].[test_procedure_to_inv]
 
GO
