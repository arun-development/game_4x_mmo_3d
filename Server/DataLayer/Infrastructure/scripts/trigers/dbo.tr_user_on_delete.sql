IF EXISTS (SELECT * FROM sys.triggers
    WHERE parent_class = 1 AND name = 'tr_user_on_delete')
DROP TRIGGER tr_user_on_delete
GO
CREATE TRIGGER [tr_user_on_delete]
	ON [dbo].[user]	FOR DELETE 	AS 	BEGIN
	if((select count(*) from inserted) =1)
	DECLARE @userId  INT=(SELECT Id FROM deleted )
	IF NOT (@userId = 1)
		UPDATE [dbo].[g_detail_planet] 	 SET [userId] =1 WHERE userId = @userId
		DELETE 	[dbo].[user_report]  WHERE defenderUserId  = @userId OR atackerUserId = @userId;
		DELETE 	[dbo].[user_task]  WHERE sourceUserId  = @userId;  
	END