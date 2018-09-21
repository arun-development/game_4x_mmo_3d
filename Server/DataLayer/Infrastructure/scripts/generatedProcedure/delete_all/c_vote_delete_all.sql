﻿IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_vote_delete_all') DROP PROCEDURE [dbo].[c_vote_delete_all] 
GO  

CREATE PROCEDURE [dbo].[c_vote_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[c_vote])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[c_vote]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 



