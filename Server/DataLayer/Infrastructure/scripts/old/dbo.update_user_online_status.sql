IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'update_user_online_status')
DROP PROCEDURE [dbo].update_user_online_status
GO

CREATE PROCEDURE [dbo].[update_user_online_status](@userId int,@isOnline bit)
AS
BEGIN
	DECLARE @time INT =[dbo].[CURRENT_UNIX_TIMESTAMP] ();
	IF (@isOnline = 1)	UPDATE [dbo].[user] SET dateLastJoin = @time WHERE Id=@userId;	
	ELSE UPDATE [dbo].[user] SET dateLastLeft = @time WHERE Id= @userId;
	select top(1) authId from [dbo].[user] where Id = @userId
END
