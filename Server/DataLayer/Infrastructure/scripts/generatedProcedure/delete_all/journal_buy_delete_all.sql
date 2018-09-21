IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'journal_buy_delete_all') DROP PROCEDURE [dbo].[journal_buy_delete_all] 
GO  

CREATE PROCEDURE [dbo].[journal_buy_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[journal_buy])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[journal_buy]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




