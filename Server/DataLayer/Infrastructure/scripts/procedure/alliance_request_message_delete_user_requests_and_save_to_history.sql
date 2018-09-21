IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_request_message_delete_user_requests_and_save_to_history')
DROP PROCEDURE [dbo].[alliance_request_message_delete_user_requests_and_save_to_history]
GO

CREATE PROCEDURE [dbo].[alliance_request_message_delete_user_requests_and_save_to_history](@fromUserId int, @toAllianceId int,@armAllianceSourceType TINYINT,@armUserSourceType TINYINT)
AS
BEGIN
 
   DECLARE @sucsess BIT =0; 
   IF(@fromUserId = 0 or @fromUserId IS NULL or @toAllianceId =0 or @toAllianceId IS NULL)
      BEGIN 
		 RAISERROR('The value should not be 0 or NULL', 15, 1)  
	     SELECT @sucsess; 
		 RETURN;
	  END
   ELSE 
	  BEGIN TRAN
	  BEGIN TRY 
				 	DECLARE @dateLeave INT = [dbo].[CURRENT_UNIX_TIMESTAMP](); 

					INSERT INTO [dbo].[alliance_request_message_history] (
						oldArmId,
						sourceType,
						fromId,
						fromName,
						toId,
						toName,
						dateCreate,
						message,
						userAccepted,
						allianceAccepted,
						creatorIcon,
						dateDelete)

								SELECT  Id,
										sourceType,
										fromId,
										fromName,
										toId,
										toName,
										dateCreate,
										message,
										userAccepted,
										allianceAccepted,
										creatorIcon,
										@dateLeave							 
								FROM [dbo].[alliance_request_message] 
								WHERE fromId = @fromUserId AND toId = @toAllianceId AND sourceType = @armUserSourceType
									  OR fromId = @toAllianceId AND toId =@fromUserId AND sourceType = @armAllianceSourceType;
					
					DELETE [dbo].[alliance_request_message] WHERE fromId = @fromUserId AND toId = @toAllianceId AND sourceType = @armUserSourceType
												                  OR fromId = @toAllianceId AND toId =@fromUserId AND sourceType = @armAllianceSourceType;
					COMMIT TRAN 
 
			END TRY 
			BEGIN CATCH  
			        ROLLBACK TRANSACTION
					THROW
			END CATCH 
	  SET  @sucsess = 1; 
	  SELECT @sucsess;
END
GO



