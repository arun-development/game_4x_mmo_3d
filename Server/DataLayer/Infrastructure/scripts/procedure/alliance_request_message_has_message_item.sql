IF EXISTS (SELECT name FROM sys.objects WHERE  name = 'alliance_request_message_has_message_item')
DROP PROCEDURE [dbo].[alliance_request_message_has_message_item]
GO
CREATE PROCEDURE [dbo].[alliance_request_message_has_message_item] (@fromId int, @toId int,  @sourceType TINYINT)
AS
BEGIN
	DECLARE @hasItem BIT= 0;
	IF EXISTS (SELECT Id FROM [dbo].[alliance_request_message] WHERE  fromId = @fromId and toId = @toId and sourceType = @sourceType)
		BEGIN
		SET @hasItem = 1;
		END
	ELSE
		BEGIN
		SET @hasItem = 0;
		END
		
	SELECT @hasItem;
END
GO


