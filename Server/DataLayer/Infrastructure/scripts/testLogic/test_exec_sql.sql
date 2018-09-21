USE Test;
--check
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_exec_sql')
DROP PROCEDURE [dbo].[test_exec_sql]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_exec_sql_table')
DROP TABLE [dbo].[test_exec_sql_table]
GO

--create
CREATE TABLE [dbo].[test_exec_sql_table](Id INT IDENTITY (1,1), rowId  nvarchar(36),  PRIMARY KEY CLUSTERED ([Id] ASC)) 
GO

CREATE PROCEDURE [dbo].[test_exec_sql] (@sqlCommand nvarchar(max))
AS BEGIN
 DECLARE @sucsess bit = 0; 
 --EXEC sp_executesql  @sqlCommand; 
 PRINT( @sqlCommand);
 
END;
GO



BEGIN 
	--Arrange 
	DECLARE @tbName nvarchar(75) = '[dbo].[test_exec_sql_table]';
	declare @startValue nvarchar(36) =NEWID(); 
	declare @updateValue nvarchar(36) =NEWID();
 
	
	DECLARE @sqlResult nvarchar(max);  
	DECLARE @sqlCreate nvarchar(max) ='INSERT '+@tbName+' values('''+@startValue+''');';
	DECLARE @sqlUpdate nvarchar(max) ='UPDATE '+@tbName+' set rowId='''+@updateValue+''' where rowId='''+@startValue+''';';
	DECLARE @sqlDelete nvarchar(max) ='DELETE '+@tbName+';print(deleted); IF((SELECT COUNT(*) FROM '+@tbName+')>0)print(not deleted)'
	set @sqlResult = @sqlCreate+ ' ' + @sqlUpdate +' ' + @sqlDelete +' '; 
	

	print ('@sqlCreate '+@sqlCreate)
	print ('@sqlUpdate '+@sqlUpdate)
	print ('@sqlDelete '+@sqlDelete)
    print ('@sqlResult '+@sqlResult)
	UPDATE [dbo].[test_exec_sql_table] set rowId=@updateValue where rowId=@startValue;


	 --assert
	--execute sp_executesql @sql,@Param,@Val
	 EXEC sp_executesql  @sqlCreate;	 
	 IF(( SELECT count(1) rowId  from [dbo].[test_exec_sql_table])!=1 )print('not inserted');
	 	select * from [dbo].[test_exec_sql_table]
	 EXEC sp_executesql  @sqlUpdate; 
	 	 	select * from [dbo].[test_exec_sql_table]
	 IF NOT EXISTS((SELECT * from [dbo].[test_exec_sql_table] where rowId =@updateValue))print('not updated');

	--EXEC sp_executesql  @sqlDelete;  
	
	--EXEC  [dbo].[test_exec_sql] @sqlCommand = @sqlResult; 
	
	
END; 
GO

DROP PROCEDURE [dbo].[test_exec_sql]
DROP TABLE [dbo].[test_exec_sql_table]
GO
