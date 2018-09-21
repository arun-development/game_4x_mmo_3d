﻿IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_tech_delete_all') DROP PROCEDURE [dbo].[alliance_tech_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_tech_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_tech])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_tech]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 



