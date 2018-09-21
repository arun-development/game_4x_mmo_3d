﻿IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'test_db_relation_get_item')
DROP PROCEDURE [dbo].[test_db_relation_get_item]
GO
CREATE PROCEDURE [dbo].[test_db_relation_get_item](@Id int) AS
BEGIN
DECLARE @sucsess bit =0;
	IF(@Id=0)
		BEGIN 
			raiserror('The value should not be 0', 15, 1) -- with log ;
			SELECT @sucsess as sucsess;
			return;
		END
	ELSE
	SELECT  TOP(1) * FROM [dbo].[test_db_relation] WHERE Id =@Id;
END