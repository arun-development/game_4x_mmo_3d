DECLARE @TEST INT = 1 --1 is test mode, use zero when you are ready to execute
BEGIN TRANSACTION;
BEGIN TRY
     IF @TEST= 1
        BEGIN
            SELECT * FROM Production.Product  WHERE ProductID = 980;
        END    
    -- Generate a constraint violation error.
    DELETE FROM Production.Product  WHERE ProductID = 980;
     IF @TEST= 1
        BEGIN
            SELECT * FROM Production.Product  WHERE ProductID = 980;
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        END    
END TRY

BEGIN CATCH
    SELECT 
        ERROR_NUMBER() AS ErrorNumber, ERROR_SEVERITY() AS ErrorSeverity, ERROR_STATE() AS ErrorState, ERROR_PROCEDURE() AS ErrorProcedure, ERROR_LINE() AS ErrorLine, ERROR_MESSAGE() AS ErrorMessage;  IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
END CATCH;

IF @@TRANCOUNT > 0 AND @TEST = 0
    COMMIT TRANSACTION;
GO


BEGIN TRANSACTION [Tran1]
BEGIN TRY
INSERT INTO [Test].[dbo].[T1]  ([Title], [AVG])
VALUES ('Tidd130', 130), ('Tidd230', 230)

UPDATE [Test].[dbo].[T1]  SET [Title] = N'az2' ,[AVG] = 1 WHERE [dbo].[T1].[Title] = N'az'


COMMIT TRANSACTION [Tran1]

END TRY
BEGIN CATCH
  ROLLBACK TRANSACTION [Tran1]
END CATCH  

GO