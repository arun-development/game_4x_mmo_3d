IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_fleet_delete_all') DROP PROCEDURE [dbo].[alliance_fleet_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_fleet_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_fleet])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_fleet]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




