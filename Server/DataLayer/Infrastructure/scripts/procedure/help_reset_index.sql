IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'help_reset_index')
DROP PROCEDURE [dbo].[help_reset_index]
GO
 
 
--custom reset index impl for help_reset_index
CREATE PROCEDURE [dbo].[help_reset_index] @dbName varchar(50),@lastIndex int AS
	--documentated ms bug
	--DBCC CHECKIDENT(@dbName, RESEED, @lastIndex);
--exists 2 path for resolve
IF (ISNULL(@lastIndex,0)=0 ) 
	BEGIN
		DECLARE @last_value INT = CONVERT(INT, (SELECT last_value FROM sys.identity_columns WHERE OBJECT_NAME(OBJECT_ID) = @dbName));
		IF @last_value IS NULL
			BEGIN
				-- Table newly created and no rows inserted yet; start the IDs off from 1
				DBCC CHECKIDENT (@dbName, RESEED, 1);
			END
		ELSE
			BEGIN
				-- Table has rows; ensure the IDs continue from the last ID used 
				DECLARE @lastValUsed INT;
				DECLARE @sql nvarchar(500)= 'SELECT @maxId = MAX(Id)  from  [dbo].['+@dbName+']; '--+ ;	 
				DECLARE @parm  nvarchar(500)= '@maxId int OUTPUT';
				EXEC sp_executesql @sql, @parm, @maxId=@lastValUsed OUTPUT;			
		        SET  @lastValUsed =  ISNULL(@lastValUsed,0);    
				DBCC CHECKIDENT (@dbName, RESEED, @lastValUsed);
			END
	END
ELSE
--just set value, but you know what you do
	BEGIN  
	DBCC CHECKIDENT(@dbName, RESEED, @lastIndex)
	END

GO