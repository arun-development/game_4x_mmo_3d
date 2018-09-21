IF EXISTS (SELECT * FROM sys.triggers
    WHERE parent_class = 1 AND name = 'dbo.tr_insert_alliance_user')
DROP TRIGGER tr_insert_alliance_user
GO

CREATE  TRIGGER tr_insert_alliance_user
	BEFORE INSERT ON [dbo].[alliance_user]
 --   AS
	--IF (SUBSTRING(COLUMNS_UPDATED(),1,1) & 32 = 32)   
	--BEGIN	
	--  DECLARE @leave bit 
	--  SET @leave = (SELECT leave FROM inserted)
	--  IF (@leave = 1)

	--  DECLARE @userId int 
	--  DECLARE @leftTime int
	--  DECLARE @auId int

	--  SET @leftTime =    [dbo].[CURRENT_UNIX_TIMESTAMP] ()
 --     SET @userId =   (SELECT user_id FROM inserted)
	--  SET @auId =   (SELECT Id FROM inserted)
	 
	--  UPDATE [dbo].[user] SET  leave_alliance_time = @leftTime  WHERE Id = @userId
	--  UPDATE [dbo].[alliance_user] SET  date_left = @leftTime  WHERE Id = @auId
	--END	
GO	
	

	  