--for revert

BEGIN TRANSACTION [testTranResetAllianceIdentity]
GO


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'help_reset_index')
DROP PROCEDURE [dbo].[help_reset_index]
GO
 
--custom reset index impl for help_reset_index
CREATE PROCEDURE [dbo].[help_reset_index] @dbName varchar(50),@lastIndex int AS
IF (ISNULL(@lastIndex,0)=0 ) 
	BEGIN
		DECLARE @last_value INT = CONVERT(INT, (SELECT last_value FROM sys.identity_columns WHERE OBJECT_NAME(OBJECT_ID) = @dbName));
		IF @last_value IS NULL
			BEGIN 
				DBCC CHECKIDENT (@dbName, RESEED, 1);
			END
		ELSE
			BEGIN 
				DECLARE @lastValUsed INT;
				DECLARE @sql nvarchar(500)= 'SELECT @maxId = MAX(Id)  from  [dbo].['+@dbName+']; '--+ ;	 
				DECLARE @parm  nvarchar(500)= '@maxId int OUTPUT';
				EXEC sp_executesql @sql, @parm, @maxId=@lastValUsed OUTPUT;			
		        SET  @lastValUsed =  ISNULL(@lastValUsed,0);    
				DBCC CHECKIDENT (@dbName, RESEED, @lastValUsed);
			END
	END
ELSE
	BEGIN 
	print ('lastVal !=0')
	DBCC CHECKIDENT(@dbName, RESEED, @lastIndex)
	END

GO



--create procedure for test
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_reset_alliance_ident')
DROP PROCEDURE [dbo].[test_reset_alliance_ident]
GO

CREATE PROCEDURE [dbo].[test_reset_alliance_ident] @resetTo int AS
BEGIN 
	declare @_dbName nvarchar(50) = 'alliance';
	declare @_resetTo int = @resetTo;
	declare @_expectNext int = @_resetTo+1;
	declare @_current_ident nvarchar; 
	print('start test for reset id for table: '
	+@_dbName + 
	 +' @_resetTo: '+cast(@_resetTo as varchar)
	 +' , @_expectNext:'+ cast(@_expectNext as varchar)
	)
	-- set val to identity
	DELETE [dbo].[alliance];
	EXEC [dbo].help_reset_index @dbName = @_dbName, @lastIndex=@_resetTo


	set @_current_ident = cast(IDENT_CURRENT(@_dbName) as varchar);
	print('after reset : lastId: '
	+@_current_ident
	+' expect: '
	+cast(@_resetTo as varchar)
	+'')
	insert into  [dbo].[alliance] (name,creatorId,disbandet,cc) values('testAlliance',1,0,1000)

	set @_current_ident = cast(IDENT_CURRENT(@_dbName) as varchar);
	print('after insert : id: '
	+@_current_ident
	+', expect: '
	+cast(@_expectNext as varchar)
	+'')
	select *  from [dbo].[alliance];
END

GO

EXEC [dbo].[test_reset_alliance_ident]  @resetTo=0;
EXEC [dbo].[test_reset_alliance_ident]  @resetTo=1;

DROP PROCEDURE [dbo].[test_reset_alliance_ident];

--COMMIT TRANSACTION [testTranResetAllianceIdentity];
ROLLBACK TRANSACTION [testTranResetAllianceIdentity];








 
