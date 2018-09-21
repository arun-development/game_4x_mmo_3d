--срабатывает в момент окончания очереди строительства
CREATE PROCEDURE [dbo].[update_bild_turn_closed]
AS
BEGIN
--	DECLARE 
--	@planet_id int,
--	@bild_name varchar(50),
--	@next_level int, 
--	@i int;

--	DECLARE @bild_canceled TABLE (
--		planet_id INT Primary Key IDENTITY(1, 1),
--		bild_name varchar(50), 
--		next_level int 
--	);

--	INSERT INTO @bild_canceled (
--		planet_id, 
--		bild_name, 
--		next_level
--	) SELECT 
--		planet_id, 
--		bild_name, 
--		next_level
--	FROM [dbo].[bild_turn] 

--	WHERE end_time < DATEDIFF(s, '1970-01-01 00:00:00', GETUTCDATE()) AND status = 1
--	ORDER BY planet_id ASC;

--	SET @i = 1;

--	WHILE (@i <= (SELECT MAX(planet_id) FROM @bild_canceled))
--	BEGIN
--		SELECT 
--			@planet_id = planet_id, 
--			@bild_name = bild_name, 
--			@next_level = next_level 
--		FROM @bild_canceled WHERE planet_id = @i;

--		UPDATE [dbo].[planet_bild_pack] SET
--			@bild_name = CONCAT('{"name":', '"', @bild_name, '", "level":', @next_level, '}')
--		WHERE planet_id = @planet_id;

--		UPDATE [dbo].[bild_turn] SET
--			status = 0
--		WHERE planet_id = @planet_id;

--		SET @i = @i + 1;
--	END

	RETURN 0;
END