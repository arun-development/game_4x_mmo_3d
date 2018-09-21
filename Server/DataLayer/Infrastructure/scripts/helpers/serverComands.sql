return;
--https://blogs.msdn.microsoft.com/azuresqlemea/2016/10/05/create-sql-login-and-sql-user-on-your-azure-sql-db/
--https://blog.kloud.com.au/2016/04/08/azure-sql-pro-tip-creating-login-account-and-user/
--drom from role
EXEC sp_droprolemember 'roleName', 'UseRname'; 

-- Drop sql user

-- show all logins
SELECT * from master.sys.sql_logins

-- dropLogin 
DROP LOGIN login_name  

-- drop user 
DROP USER user_name  

 



----https://blog.kloud.com.au/2016/04/08/azure-sql-pro-tip-creating-login-account-and-user/
-- create user in master (need select db maser)
IF EXISTS(SELECT * FROM sys.database_principals WHERE name = '<LOGIN_ACCOUNT>')
  DROP USER [<LOGIN_ACCOUNT>]
  DROP LOGIN [<LOGIN_ACCOUNT>]
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = N'<LOGIN_ACCOUNT>')
  CREATE LOGIN [<LOGIN_ACCOUNT>] WITH PASSWORD=N'<ACCOUNT_PASSWORD>'
GO

-- after create reconnect to sql server width  target dbName and run command
CREATE USER [<LOGIN_ACCOUNT>] FOR LOGIN [<LOGIN_ACCOUNT>] WITH DEFAULT_SCHEMA=[dbo]
ALTER ROLE [db_owner] ADD MEMBER [<LOGIN_ACCOUNT>]
GO
-- or custom permitions 
CREATE USER [<LOGIN_ACCOUNT>] FOR LOGIN [<LOGIN_ACCOUNT>] WITH DEFAULT_SCHEMA=[dbo]
GRANT SELECT,INSERT,UPDATE,DELETE ON SCHEMA::dbo TO [<LOGIN_ACCOUNT>]
GO


