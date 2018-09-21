

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_serch_name_id')
DROP PROCEDURE [dbo].[user_serch_name_id]
GO

CREATE PROCEDURE [dbo].[user_serch_name_id](@partUserName  NVARCHAR(14))
AS BEGIN
 --todo  need use CONTAINS but need full text catalog (not suported in express sql version)
 --db use COLLATE   SQL_Latin1_General_CP1_CI_AS  LOWER(arg) not needed set param COLLATE not needed
 
SELECT Id, nickname FROM [dbo].[user] where nickname LIKE '%' + @partUserName + '%'
END
GO



 