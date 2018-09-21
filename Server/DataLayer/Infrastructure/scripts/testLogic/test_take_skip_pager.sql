USE Test;
--http://sqlhints.com/tag/pagination-in-sql-server/
--ЭТО НЕ ПЕЙДЖЕР!
----Arrange
----create table
--GO
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_pager_table')
DROP TABLE [dbo].[test_pager_table]
GO

CREATE TABLE [dbo].[test_pager_table](Id INT IDENTITY (1,1), rowId uniqueidentifier) 
GO

INSERT INTO  [dbo].[test_pager_table](rowId) VALUES(NEWID())
GO 10
-- create procedure
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_pager_take_skip')
DROP PROCEDURE [dbo].[test_pager_take_skip]
GO

CREATE PROCEDURE [dbo].[test_pager_take_skip] (@tableName nvarchar(500),@where nvarchar(500)= null, @orderBy nvarchar(500) = null, @skip int = 0, @take int =0)
AS BEGIN 
	 declare @_take   nvarchar(64);
	 declare @_orderBy nvarchar(500) ='ORDER BY Id asc';
	 declare @_skip   nvarchar(64);
	 declare @_where  nvarchar(500) ='';
	 if(@tableName='' or @tableName IS  NULL)return; 
	 if(@take=0 or @take IS  NULL)return; 
	 if(@skip IS  NULL) set @_skip =0;
	 if(@orderBy != '' AND @orderBy IS NOT NULL) 
		begin
		set @_orderBy =@orderBy;
		end

	 set @_skip = @skip+1;
	 set @_take =@_skip+@take;
 
declare @sql nvarchar(max)='WITH paging AS (SELECT *, ROW_NUMBER() OVER ('+@_orderBy+') AS rowPosition FROM '+@tableName+')
							SELECT * FROM  paging  WHERE (rowPosition BETWEEN '+@_skip+' and '+@_take+') ';
 
if (@where != '' AND @where IS NOT NULL) set @sql =@sql +' and '+@where;


print('@sql : '+@sql) 
 
EXEC sp_executesql  @sql; 
END
GO


--Act
--Assert


--exec  [dbo].[test_simple_pager_take_skip] 1 ,0,,'order by Id asc','Id<3';
exec  [dbo].[test_pager_take_skip] '[dbo].[test_pager_table]',@orderBy = 'order by Id asc', @where = null,@skip= 0,@take = 2	
exec  [dbo].[test_pager_take_skip] '[dbo].[test_pager_table]',@orderBy = 'order by Id asc', @where = null,@skip= 2,@take = 3
exec  [dbo].[test_pager_take_skip] '[dbo].[test_pager_table]',@orderBy = 'order by Id asc', @where = null,@skip= 3,@take = 4
 

---- clean data
DROP PROCEDURE [dbo].[test_pager_take_skip]
DROP TABLE [dbo].[test_pager_table]

 

