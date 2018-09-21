

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_get_by_invariant_name')
DROP PROCEDURE [dbo].[channel_get_by_invariant_name]
GO

CREATE PROCEDURE [dbo].[channel_get_by_invariant_name](@channelName  NVARCHAR(14))
AS BEGIN
 --todo  need user CONTAINS but need full text catalog (not suported in express sql version)
 --db use COLLATE   SQL_Latin1_General_CP1_CI_AS  LOWER(arg) not needed set param COLLATE not needed
SELECT * FROM [dbo].[channel] where channelName=@channelName
END
GO



 