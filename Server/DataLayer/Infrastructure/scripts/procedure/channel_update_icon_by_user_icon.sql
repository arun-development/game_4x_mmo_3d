IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_update_icon_by_user_icon')
DROP PROCEDURE [dbo].[channel_update_icon_by_user_icon];
GO

CREATE PROCEDURE [dbo].[channel_update_icon_by_user_icon](@newIconUrl NVARCHAR(1000), @userId INT, @userChannelType TINYINT)
AS
BEGIN 
    DECLARE @sucsess bit =1;  
	BEGIN TRAN
	BEGIN TRY 
		IF EXISTS (select top(1) Id FROM [dbo].[channel] WHERE  creatorId =@userId and channelType = @userChannelType )
			BEGIN		    	
				UPDATE [dbo].[channel] 
				SET channelIcon = @newIconUrl
				WHERE  creatorId =@userId and channelType = @userChannelType
			END  
		COMMIT TRAN
	END TRY
	BEGIN CATCH 
		ROLLBACK TRAN
		THROW
	END CATCH 
	SELECT @sucsess; 
END
GO

