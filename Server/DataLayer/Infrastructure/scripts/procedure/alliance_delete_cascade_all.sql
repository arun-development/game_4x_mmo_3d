IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_delete_all_cascade')
DROP PROCEDURE [dbo].[alliance_delete_all_cascade]
GO

CREATE PROCEDURE [dbo].[alliance_delete_all_cascade] 
AS 
BEGIN TRY
DELETE [dbo].alliance;
DELETE [dbo].alliance_user;
DELETE [dbo].alliance_user_history;
DELETE [dbo].alliance_request_message;
DELETE [dbo].alliance_request_message_history;
DELETE [dbo].alliance_fleet;
DELETE [dbo].alliance_tech;

EXEC [dbo].help_reset_index @dbName = 'alliance',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_user',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_user_history',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_request_message',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_request_message_history',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_fleet',  -- varchar(50)
                            @lastIndex = 0; -- int
 

END TRY
BEGIN CATCH
THROW;
END CATCH
DECLARE @sucsess BIT =1;  
SELECT @sucsess;

GO

 

 