IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_disband_alliance')
DROP PROCEDURE [dbo].[alliance_disband_alliance]
GO

CREATE PROCEDURE [dbo].[alliance_disband_alliance] (@allianceId int,@confederationAllianceId INT,@recrutRoleId TINYINT, @armAllianceSourceType TINYINT,@armUserSourceType TINYINT)
AS BEGIN
DECLARE @sucsess BIT =0;  
	IF  (@allianceId IS NULL)
		 BEGIN 
			RAISERROR('The value for @allianceId should not be null', 15, 1) -- with log ; 
			SELECT @sucsess;
			RETURN;
		 END
	  
	IF (NOT EXISTS (SELECT Id FROM [dbo].[alliance] WHERE Id = @allianceId ))
		 BEGIN 
				RAISERROR('@allianceId not exist', 15, 1) -- with log ; 
				SELECT @sucsess;
				RETURN;
	 	 END
	ELSE IF ((SELECT disbandet FROM [dbo].[alliance] WHERE Id = @allianceId)=1)
		BEGIN 
			raiserror('alliance was disbandet', 15, 1) -- with log ; 
			SELECT @sucsess;
			RETURN;
	 	END
	ELSE
			BEGIN TRAN	
			BEGIN TRY
					DECLARE @dateLeave INT = [dbo].[CURRENT_UNIX_TIMESTAMP] ();  				
					DECLARE @dateCreate DATETIME = SYSUTCDATETIME() 
						--record - aliance deleted
						UPDATE [dbo].[alliance] 
								SET disbandet =1,dateDisband = @dateLeave
								WHERE Id = @allianceId;						
						
						IF EXISTS (SELECT allianceId FROM [dbo].[alliance_user_history] WHERE  allianceId = @allianceId)
							DELETE [dbo].[alliance_user_history] WHERE  allianceId = @allianceId;
						
						--records - add old users to history
						SET IDENTITY_INSERT [dbo].[alliance_user_history] ON
						INSERT INTO [dbo].[alliance_user_history] (Id, allianceId, userId,dateCreate, dateLeave,roleId,leave,disbandet)
							SELECT  Id, allianceId, userId, dateCreate, @dateLeave, roleId,0,1
							FROM [dbo].[alliance_user] 
							WHERE allianceId = @allianceId;
						SET IDENTITY_INSERT [dbo].[alliance_user_history] OFF
						
						-- delete old users
						DELETE [dbo].[alliance_user] WHERE  allianceId = @allianceId;
						
						--delete request messages

						delete [dbo].[alliance_request_message] WHERE fromId = @allianceId AND sourceType = @armAllianceSourceType 
																	  OR toId = @allianceId AND  sourceType = @armUserSourceType;
						delete [dbo].[alliance_request_message_history] WHERE fromId = @allianceId AND sourceType = @armAllianceSourceType 
																	  OR toId = @allianceId AND  sourceType = @armUserSourceType;

						-- set users to npc alliance
						IF EXISTS (SELECT Id FROM [dbo].[alliance] WHERE Id =@confederationAllianceId )
										INSERT INTO [dbo].[alliance_user](allianceId, userId, dateCreate, roleId)
										SELECT @confederationAllianceId, userId, @dateCreate, 2
										FROM [dbo].[alliance_user_history]
									    WHERE allianceId = @allianceId; 
						COMMIT TRAN; 
			END TRY
			BEGIN CATCH 
					ROLLBACK TRAN;
					THROW;
			END CATCH
			SET @sucsess =1;
			SELECT @sucsess;
 
END
GO



