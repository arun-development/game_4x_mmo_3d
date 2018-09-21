IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_request_message_update_alliance_icon')
DROP PROCEDURE [dbo].[alliance_request_message_update_alliance_icon];
GO

CREATE PROCEDURE [dbo].[alliance_request_message_update_alliance_icon](@allianceId INT, @newIcon NVARCHAR (1000),@armAllianceSourceType TINYINT)
AS
BEGIN 
	IF EXISTS (SELECT TOP(1) Id  FROM [dbo].[alliance_request_message] WHERE  fromId = @allianceId and sourceType =@armAllianceSourceType)
	BEGIN
		UPDATE [dbo].[alliance_request_message] 
		SET creatorIcon = @newIcon
		WHERE  fromId = @allianceId
		SELECT * FROM [dbo].[alliance_request_message] WHERE  fromId = @allianceId and sourceType =@armAllianceSourceType;
	END
END
GO

