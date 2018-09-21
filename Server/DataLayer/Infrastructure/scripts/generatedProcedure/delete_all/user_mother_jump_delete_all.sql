IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_mother_jump_delete_all') DROP PROCEDURE [dbo].[user_mother_jump_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_mother_jump_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_mother_jump])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_mother_jump]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




