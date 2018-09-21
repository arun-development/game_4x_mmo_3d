IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_delete_cascade_alliance_item')
DROP PROCEDURE [dbo].[alliance_delete_cascade_alliance_item]
GO

CREATE PROCEDURE [dbo].[alliance_delete_cascade_alliance_item] (@allianceId int, @allianceSourceTypeId TINYINT,@userSourceTypeId TINYINT)
AS BEGIN
DECLARE @sucsess BIT =0;  
 
   
	IF(@allianceId = 0 or @allianceId IS NULL)
			BEGIN 
				raiserror('The value should not be 0 or NULL', 15, 1) 
				SELECT @sucsess
				RETURN;
			END
	IF  (NOT EXISTS (SELECT id from [dbo].[alliance] where id=@allianceId))
			BEGIN  
					--print ('ALLIANCE NOT EXIST OPERATION CANCELED');
					 SET @sucsess =1;
					 SELECT @sucsess;
					 RETURN
			END
	ELSE 
			BEGIN TRAN delete_alliance_item_tran
			BEGIN TRY 
					 --delete allince
					 DELETE [dbo].[alliance] where id=@allianceId 
					-- PRINT ('alliance exist IF EXISTS');  
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_user] where allianceId=@allianceId)
						--delete alliance_user
						 BEGIN 
							 DELETE [dbo].[alliance] where Id=@allianceId
							 --PRINT ('delete alliance_user');
						 END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_user_history] where allianceId=@allianceId)
					 	--delete alliance_user_history  в продакшене этот код нужно закоментить
					      BEGIN
							 DELETE [dbo].[alliance_user_history] where allianceId=@allianceId	 				 
					 		 --PRINT ('delete alliance_user_history'); 
					      END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_request_message] 
							   WHERE (fromId=@allianceId AND sourceType =@allianceSourceTypeId) 
							          OR (toId =@allianceId AND sourceType =@userSourceTypeId))
										 BEGIN
					 					 --delete alliance_request_message
 											DELETE [dbo].[alliance_request_message] 
											WHERE (fromId=@allianceId AND sourceType =@allianceSourceTypeId)
											OR (toId =@allianceId AND sourceType =@userSourceTypeId)
											
											--PRINT ('delete alliance_request_message'); 
					 					 END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_request_message_history] 
							   WHERE (fromId=@allianceId AND sourceType =@allianceSourceTypeId) 
							   OR (toId =@allianceId AND sourceType =@userSourceTypeId))
										 BEGIN
					 					 --delete alliance_request_message
 											DELETE [dbo].[alliance_request_message_history] 
											WHERE (fromId=@allianceId AND sourceType =@allianceSourceTypeId) 
											OR (toId =@allianceId AND sourceType =@userSourceTypeId)
					 						
											--PRINT ('delete alliance_request_message_history'); 
					 					 END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_fleet] where allianceId=@allianceId)
					      BEGIN
					 		--delete alliance_fleet
							DELETE [dbo].[alliance_fleet] WHERE allianceId =@allianceId 					 
					 		--print ('delete alliance_fleet'); 
					 	  END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_tech] where Id=@allianceId)
					      BEGIN
					 		--delete alliance_tech
							DELETE [dbo].[alliance_tech] WHERE Id =@allianceId 					 
					 		--print ('delete alliance_tech'); 
					 	  END 
					 --ROLLBACK TRAN delete_alliance_item_tran;
					 COMMIT TRAN delete_alliance_item_tran;	

					 --print ('COMMIT TRAN delete_alliance_item_tran');  
			END TRY
			BEGIN CATCH 
				ROLLBACK TRAN delete_alliance_item_tran;
				--print ('ROLLBACK TRAN delete_alliance_item_tran');
				THROW
			END CATCH
			SET @sucsess =1;
			SELECT @sucsess;
 
END;
GO

 