
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_transaction_test_table')
DROP TABLE [dbo].[test_transaction_test_table]
GO
print('@@TRANCOUNT: ' + CAST (@@TRANCOUNT AS VARCHAR(max))) 
go

--rollback is ok
BEGIN
print('rollback is ok begin')
--Arrange
declare  @sucsess bit= 0;
declare @mustCount int =2;
 
CREATE TABLE [dbo].[test_transaction_test_table] (Id int  NOT NULL, TestName nvarchar(max) NULL, PRIMARY KEY CLUSTERED ([Id] ASC))
--Act
BEGIN TRAN test_tran1
BEGIN TRY
	insert into [dbo].[test_transaction_test_table] values(1,'');
	set @mustCount =1/0;
	COMMIT TRAN test_tran1
END  TRY
BEGIN CATCH
	ROLLBACK TRANSACTION test_tran1;	
	set @sucsess =1;
END CATCH

--Assert
IF(@sucsess=1)
	BEGIN 
		set @mustCount =(SELECT COUNT(*)  FROM [dbo].[test_transaction_test_table]); 
		if(@mustCount =0) 	print('test ok')
		else print('value must be 0')
	END
else
	BEGIN
	print('test fail') 
	END


--reset
DROP TABLE [dbo].[test_transaction_test_table]
print('@@TRANCOUNT: ' + CAST (@@TRANCOUNT AS VARCHAR(max))) 
print('rollback is ok done')
print('==========  NEXT=>>> ================') 
END
GO
 



--commit is ok
BEGIN
print('commit is ok begin')
--Arrange
declare  @sucsess bit= 0;
declare @mustCount int =2;
 
CREATE TABLE [dbo].[test_transaction_test_table] (Id int  NOT NULL, TestName nvarchar(max) NULL, PRIMARY KEY CLUSTERED ([Id] ASC))
--Act
BEGIN TRAN test_tran2
BEGIN TRY
	insert into [dbo].[test_transaction_test_table] values(1,'');
 	set @sucsess =1
	COMMIT TRAN test_tran2
END  TRY
BEGIN CATCH
	ROLLBACK TRANSACTION test_tran2;	 
END CATCH

--Assert
IF(@sucsess=1)
	BEGIN 
		set @mustCount =(SELECT COUNT(*)  FROM [dbo].[test_transaction_test_table]); 
		if(@mustCount =1) 	print('test ok')
		else print('value must be 1')
	END
else
	BEGIN
	print('test fail') 
	END

--reset
DROP TABLE [dbo].[test_transaction_test_table]
print('@@TRANCOUNT: ' + CAST (@@TRANCOUNT AS VARCHAR(max))) 
print('commit is ok done')
print('==========  NEXT=>>> ================') 
END
GO
 
-- save point 
BEGIN
print('save point is saved  begin')
--Arrange
declare  @sucsess bit= 0;
declare @mustCount int =2; 
CREATE TABLE [dbo].[test_transaction_test_table] (Id int  NOT NULL, TestName nvarchar(max) NULL, PRIMARY KEY CLUSTERED ([Id] ASC))
insert into [dbo].[test_transaction_test_table] values(1,'zero') 

--Act
BEGIN TRAN test_tran3
BEGIN TRY
	update [dbo].[test_transaction_test_table] set TestName='savePointIsSaved';
	SAVE TRAN savepoint1
 
	update [dbo].[test_transaction_test_table] set TestName='fail';
	set @mustCount =1/0;
 
END  TRY
BEGIN CATCH
	ROLLBACK TRAN savepoint1 
	COMMIT TRAN test_tran3
END CATCH

--Assert
IF EXISTS (select * from [dbo].[test_transaction_test_table] where TestName = 'savePointIsSaved')
	BEGIN 
		print('test ok')
	END
else
	BEGIN
	print('test fail') 
	END

--reset
DROP TABLE [dbo].[test_transaction_test_table]
print('@@TRANCOUNT: ' + CAST (@@TRANCOUNT AS VARCHAR(max))) 
print('save point is saved  done')
print('==========  NEXT=>>> ================') 
END
GO

--finally trancount 
BEGIN
if(@@TRANCOUNT !=0) print('@@TRANCOUNT error active counts: ' + CAST (@@TRANCOUNT AS VARCHAR(max))) 
END
GO







 