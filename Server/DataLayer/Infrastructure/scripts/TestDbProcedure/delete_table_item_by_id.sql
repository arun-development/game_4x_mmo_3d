IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'delete_table_item_by_id')
DROP PROCEDURE [dbo].[delete_table_item_by_id]
GO

CREATE PROCEDURE [dbo].[delete_table_item_by_id](@tableName NVARCHAR(50),@targetId int,@targetType NVARCHAR(10))
AS
BEGIN
DECLARE @targetId INT =1;
	IF (@targetId is NULL or @targetId=0)
		 BEGIN 
			raiserror('The value should not be null', 15, 1) -- with log ;
			return 1;
		 END

DECLARE @SQLQuery NVARCHAR(500) = 'SELECT * FROM [dbo].['+@tableName+'] WHERE Id = @targetId';
DECLARE @ParameterDefinition  NVARCHAR(MAX)= '@targetId '+@targetType;

EXECUTE sp_executesql @SQLQuery,@ParameterDefinition,@targetId;
END