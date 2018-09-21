IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_system_delete_all') DROP PROCEDURE [dbo].[g_system_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_system_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_system])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_system]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




