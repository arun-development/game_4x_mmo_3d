IF EXISTS (SELECT * FROM sys.triggers
    WHERE parent_class = 1 AND name = 'tr_update_owner_alliance')
DROP TRIGGER tr_update_owner_alliance
GO

CREATE TRIGGER [tr_update_owner_alliance]
	ON [dbo].[g_detail_planet]
	AFTER  UPDATE AS
	IF (SUBSTRING(COLUMNS_UPDATED(),1,1) & 16 = 16 and SUBSTRING(COLUMNS_UPDATED(),1,1) & 32 = 0)  	 
	BEGIN

		DECLARE @newUserId int;
		DECLARE @skagryUserId  int;
		--DECLARE @planetId  int  =  (SELECT [Id] FROM inserted)
		SET @newUserId = (SELECT [userId] FROM inserted)
		SET @skagryUserId = 1
		IF (@newUserId = @skagryUserId)	
			BEGIN
			UPDATE [dbo].[g_detail_planet] SET [allianceId] = @skagryUserId WHERE userId = @newUserId															
			END
		ELSE 
			BEGIN
			DECLARE @userId int = (SELECT Top(1) Id FROM [dbo].[user] 	 WHERE Id = @newUserId);
			DECLARE @allianceId int = (Select Top(1) allianceId FROM [dbo].[alliance_user]   WHERE  userId = @userId);
			UPDATE [dbo].[g_detail_planet] SET [allianceId] = @allianceId   WHERE userId = @newUserId																 
																	
			END
							
	END
Go