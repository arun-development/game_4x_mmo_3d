CREATE TRIGGER [tr_insert_alliance]
	ON [dbo].[alliance]
	AFTER INSERT
	AS
	BEGIN
		DECLARE @alliance_id int
		DECLARE @user_id int
		DECLARE @user_name varchar(50)
		DECLARE @rating int
		declare @data_create datetime

		SET @alliance_id = (SELECT id FROM inserted)
		SET @user_id = (SELECT creator_id FROM inserted)
		SET @user_name = (SELECT nickname FROM [dbo].[user] WHERE id = @user_id)


		INSERT INTO [dbo].[alliance_user] (alliance_id, user_id) VALUES (@alliance_id, @user_id)

		--SET @rating = (SELECT pvp_point FROM [dbo].[user] WHERE id = @user_id)
		--INSERT INTO [dbo].[alliance] (id, pvp_rating) 
			--VALUES (@alliance_id, @rating)

		insert into [dbo].[alliance_user] (alliance_id, date_create,disbandet,leave,roleId,user_id) values(@alliance_id,@data_create,0,0,1,@user_id)
		INSERT INTO [dbo].[alliance_tech] (alliance_id) VALUES (@alliance_id)

		UPDATE [dbo].[alliance] SET creator_name = @user_name WHERE creator_id = @user_id

	END