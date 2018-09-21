IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_update_icon_by_alliance_icon')
DROP PROCEDURE [dbo].[channel_update_icon_by_alliance_icon];
GO

CREATE PROCEDURE [dbo].[channel_update_icon_by_alliance_icon](@newIconUrl NVARCHAR(1000), @creatorId INT,@allianceChannelType TINYINT)
AS
BEGIN  
	DECLARE  @sucsess BIT = 1;  
	IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[channel] WHERE creatorId =@creatorId and channelType = @allianceChannelType) 
		BEGIN
			SELECT @sucsess;
			RETURN;
		END 
	ELSE 
		BEGIN TRAN	  
		BEGIN TRY    	
			UPDATE [dbo].[channel] 
			SET channelIcon = @newIconUrl
			WHERE  creatorId =@creatorId and channelType = @allianceChannelType 
			COMMIT TRAN  
		END TRY
		BEGIN CATCH
			ROLLBACK TRAN 
			THROW
		END CATCH
SELECT @sucsess; 
END
GO

