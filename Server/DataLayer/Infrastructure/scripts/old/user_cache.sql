CREATE PROCEDURE [dbo].[build_user_cache]
	@user_id int
AS
	BEGIN

	DECLARE @sg int
	DECLARE @character varchar(MAX)
	DECLARE @tech varchar(MAX)
	DECLARE @alliance varchar(MAX)
	DECLARE @solar_systems varchar(MAX)
	DECLARE @mothership varchar(MAX) 
	DECLARE @active_fleets varchar(MAX) 
	DECLARE @personal_info varchar(MAX) 
	DECLARE @premium varchar(MAX) 
	DECLARE @alliance_tech varchar(255)

	SET @sg = 100
	SET @character = (SELECT CONCAT ('{"skills":', skills, '"clone:"', 
	clone, '"current_lvl:"', current_lvl,
	 '"current_point:"', 
	 current_point, '"free_lvl:"', free_lvl, '}')
	 FROM [dbo].[user_character] WHERE user_id = @user_id)
	SET @tech = (SELECT tech_lvls FROM [dbo].[user_tech] WHERE user_id = @user_id)
	SET @alliance = ''
	SET @solar_systems = ''
	SET @mothership = ''
	SET @active_fleets = ''
	SET @personal_info = ''
	SET @premium = ''
	SET @alliance_tech = (SELECT tech_lvls FROM [dbo].[alliance_tech] WHERE alliance_id = 1)

	INSERT INTO [dbo].[user_cache] (
		user_id, 
		sg,
		character,
		tech,
		alliance, 
		solar_systems, 
		mothership, 
		active_fleets, 
		personal_info, 
		premium, 
		alliance_tech

	) VALUES (
		@user_id, 
		@sg,
		@character,
		@tech, 
		@alliance, 
		@solar_systems, 
		@mothership, 
		@active_fleets, 
		@personal_info, 
		@premium, 
		@alliance_tech
	);

RETURN 0

END