

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_get_serch_items')
DROP PROCEDURE [dbo].[channel_get_serch_items]
GO

CREATE PROCEDURE [dbo].[channel_get_serch_items](@partChannelName  NVARCHAR(14), @channelType TINYINT, @serchType TINYINT)
AS BEGIN
 
 --todo  need use CONTAINS but need full text catalog (not suported in express sql version)
  --db use COLLATE   SQL_Latin1_General_CP1_CI_AS  LOWER(arg) not needed set param COLLATE not needed
IF(@serchType =3)SELECT	Id,	channelName,password FROM [dbo].[channel] where channelType = @channelType and  password!='' and channelName LIKE '%'+channelName+'%';
ELSE IF(@serchType =2)SELECT Id, channelName, password FROM [dbo].[channel] where channelType = @channelType and password='' and channelName LIKE '%' + @partChannelName + '%';
ELSE SELECT	Id, channelName,password FROM [dbo].[channel] where channelType = @channelType and  channelName LIKE '%' + @partChannelName + '%';
END
GO



 