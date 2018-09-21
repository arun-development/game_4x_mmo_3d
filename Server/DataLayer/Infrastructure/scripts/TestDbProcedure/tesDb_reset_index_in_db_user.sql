drop table [dbo].[user]

CREATE TABLE [dbo].[user] (
    [Id]    INT            IDENTITY (1, 1) NOT NULL,
    [value] NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'help_reset_index')
DROP PROCEDURE [dbo].[help_reset_index]
GO
 
 
--custom reset index impl for help_reset_index
CREATE PROCEDURE [dbo].[help_reset_index] @lastIndex int AS
	--DBCC CHECKIDENT(@dbName, RESEED, @lastIndex);
	declare @dbName varchar(50) ='user';
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
				declare @sql nvarchar(500)= 'SELECT @maxId = MAX(Id)  from  [dbo].['+@dbName+']; '--+ ;	 
				declare @parm  nvarchar(500)= '@maxId int OUTPUT';
				EXEC sp_executesql @sql, @parm, @maxId=@lastValUsed OUTPUT;			
		        SET  @lastValUsed =  ISNULL(@lastValUsed,0);  
			   	SELECT @lastValUsed;	 
				DBCC CHECKIDENT (@dbName, RESEED, @lastValUsed);
			END
	END
ELSE
	BEGIN  
	DBCC CHECKIDENT(@dbName, RESEED, @lastIndex)
	END

GO

delete  [dbo].[user]
exec [dbo].[help_reset_index] 0
insert into [dbo].[user] (value) values ('test');
select * from  [dbo].[user]

delete  [dbo].[user]
exec [dbo].[help_reset_index] 0
insert into [dbo].[user] (value) values ('test');
insert into [dbo].[user] (value) values ('test');
select * from  [dbo].[user]
 

delete  [dbo].[user]
exec [dbo].[help_reset_index] 0
insert into [dbo].[user] (value) values ('test');
select * from  [dbo].[user]


 