IF EXISTS (SELECT * FROM sys.triggers
    WHERE parent_class = 1 AND name = 'tr_leave_user_from_alliance')
DROP TRIGGER tr_leave_user_from_alliance
GO
CREATE  TRIGGER [tr_leave_user_from_alliance]
	ON [dbo].[alliance_user]
	AFTER UPDATE AS  
	BEGIN
	 return;
	 IF (SUBSTRING(COLUMNS_UPDATED(),1,1) & 64 = 64)

	  DECLARE @count int =(SELECT COUNT(*) from inserted);
	  IF(@count != 1) return;
	  IF((SELECT leave FROM inserted) = 1)
	  DECLARE @leftTime int = [dbo].[CURRENT_UNIX_TIMESTAMP] ();
	  DECLARE @userId int  =(SELECT user_id FROM inserted)
	  DECLARE @auId int =(SELECT Id FROM inserted)
	  UPDATE [dbo].[user] SET  leave_alliance_time = @leftTime  WHERE Id = @userId
	  UPDATE [dbo].[alliance_user] SET  date_leave = @leftTime  WHERE Id = @auId;
	END	
GO	
	

	  