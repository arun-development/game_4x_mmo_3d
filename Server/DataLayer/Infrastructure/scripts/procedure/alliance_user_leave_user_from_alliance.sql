IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_user_leave_user_from_alliance')
DROP PROCEDURE [dbo].[alliance_user_leave_user_from_alliance]
GO
CREATE PROCEDURE [dbo].[alliance_user_leave_user_from_alliance] (@allianceId int, @userId int, @setToNpc bit, @confederationAllianceId INT,@recrutRoleId TINYINT)
AS BEGIN
	IF  (@allianceId IS NULL OR @userId IS NULL)
		 BEGIN 
			raiserror('The paremeters should not be null', 15, 1) -- with log ;
			return;
		 END
	  
	IF (NOT EXISTS (SELECT Id FROM [dbo].[alliance_user] WHERE allianceId = @allianceId and userId =@userId ))
		 BEGIN 
		    raiserror('@alliance_user.Id not exist', 15, 1) -- with log ; 
			return; 
	 	 END
	ELSE
		 BEGIN TRAN
		 BEGIN TRY
		 		DECLARE @dateLeave INT = [dbo].[CURRENT_UNIX_TIMESTAMP] (); 	
		 		DECLARE @dateCreate DATETIME = SYSUTCDATETIME()
		 		DECLARE @auId int = (SELECT Id   
		 								 FROM [dbo].[alliance_user]
		 								 WHERE  allianceId = @allianceId and userId = @userId);
		 						
		 
		 		IF EXISTS(SELECT Id FROM [dbo].[alliance_user_history] WHERE Id = @auId) 
		 			BEGIN
		 				DELETE [dbo].[alliance_user_history] WHERE  Id = @auId;
		 			END
		 		
		 		--records - add old user to history
		 		SET IDENTITY_INSERT [dbo].[alliance_user_history] ON
		 		INSERT INTO [dbo].[alliance_user_history] (Id, allianceId, userId,dateCreate, dateLeave,roleId,leave,disbandet)
		 					SELECT  Id, allianceId, userId, dateCreate, @dateLeave, roleId,1,0
		 					FROM [dbo].[alliance_user] 
		 					WHERE allianceId = @allianceId  and userId = @userId;
		 		SET IDENTITY_INSERT [dbo].[alliance_user_history] OFF
		 		
		 		--records - update user set leave allianceTime
		 		UPDATE [dbo].[user] SET leaveAllianceTime = @dateLeave FROM  [dbo].[user] WHERE Id = @userId;
		 
		 		-- delete old user
		 		DELETE [dbo].[alliance_user] WHERE  Id = @auId;
		 		
		 		-- set user to npc alliance
		 		IF (@setToNpc =1)
		 			BEGIN
		 			IF EXISTS (SELECT Id FROM [dbo].[alliance] WHERE Id =@confederationAllianceId )
		 						INSERT INTO [dbo].[alliance_user](allianceId, userId,dateCreate,roleId)
		 						VALUES (@confederationAllianceId,@userId,@dateCreate,2)
		 			END  
		 		COMMIT TRAN;
		END TRY
		BEGIN CATCH 
			  ROLLBACK TRAN
			  THROW
		END CATCH
 
END
GO


