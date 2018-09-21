IF EXISTS (SELECT * FROM sys.triggers
    WHERE parent_class = 1 AND name = 'tr_insert_alliance')
DROP TRIGGER tr_insert_alliance
GO
CREATE TRIGGER [tr_insert_alliance]
	ON [dbo].[alliance]
	AFTER INSERT
	AS
	BEGIN
		DECLARE @alliance_id int	=(SELECT id FROM inserted)
		DECLARE @user_id int =(SELECT creatorId FROM inserted)
		DECLARE @user_name varchar(14)	=(SELECT creatorName FROM inserted)
		DECLARE @data_create datetime= (SELECT dateCreate FROM inserted)


		
		IF NOT EXISTS(select TOP(1) allianceId FROM [dbo].[alliance_user] WHERE allianceId = @alliance_id and userId = @user_id and roleId = 1)
						BEGIN
						insert into [dbo].[alliance_user] (allianceId, dateCreate,roleId,userId) values(@alliance_id, @data_create,1,@user_id)
						END	
	END