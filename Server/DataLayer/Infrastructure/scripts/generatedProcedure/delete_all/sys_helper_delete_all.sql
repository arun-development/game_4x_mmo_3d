IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'sys_helper_delete_all') DROP PROCEDURE [dbo].[sys_helper_delete_all] 
GO  

CREATE PROCEDURE [dbo].[sys_helper_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[sys_helper])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[sys_helper]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




