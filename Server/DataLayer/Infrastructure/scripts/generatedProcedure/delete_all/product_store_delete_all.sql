IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'product_store_delete_all') DROP PROCEDURE [dbo].[product_store_delete_all] 
GO  

CREATE PROCEDURE [dbo].[product_store_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[product_store])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[product_store]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




