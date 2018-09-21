IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_task_delete_all') DROP PROCEDURE [dbo].[user_task_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_task_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_task])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_task]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




