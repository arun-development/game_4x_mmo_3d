IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_mothership_update')
DROP PROCEDURE [dbo].[user_mothership_update]
GO

CREATE PROCEDURE [dbo].[user_mothership_update](
 @Id  int,
 @startSystemId int,
 @resources nvarchar(MAX),
 @hangar nvarchar(MAX),
 @unitProgress nvarchar(MAX),
 @laboratoryProgress nvarchar(MAX), 
 @extractionProportin nvarchar(MAX),
 @techProgress nvarchar(MAX),
 @lastUpgradeProductionTime int  
 )
AS BEGIN 
declare  @_startSystemId int;
declare @_resources nvarchar(MAX);
declare @_hangar nvarchar(MAX);
declare @_unitProgress nvarchar(MAX);
declare @_laboratoryProgress nvarchar(MAX);
declare @_extractionProportin nvarchar(MAX);
declare @_techProgress nvarchar(MAX); 
declare @_lastUpgradeProductionTime int;

select @_startSystemId=startSystemId,
@_resources =resources , 
@_hangar =hangar,  
@_unitProgress =unitProgress,  
@_laboratoryProgress =laboratoryProgress  ,
@_extractionProportin =extractionProportin  ,
@_techProgress =techProgress,
@_lastUpgradeProductionTime = lastUpgradeProductionTime  
from  [dbo].[user_mothership] where Id = @Id 

declare @hasChange bit = 0;
declare @sql nvarchar(MAX) ='update [dbo].[user_mothership] set ';
declare @sqlLen int = len(@sql);

if(@_startSystemId !=@startSystemId) set @sql+= [dbo].[PARAM_STRING_BUILDER]('startSystemId',@startSystemId) 
if(@_resources !=@resources) set @sql+= [dbo].[PARAM_STRING_BUILDER]('resources',@resources)
if(@_hangar !=@hangar) set @sql+= [dbo].[PARAM_STRING_BUILDER]('hangar',@hangar)
if(@_unitProgress !=@unitProgress) set @sql+= [dbo].[PARAM_STRING_BUILDER]('unitProgress',@unitProgress)
if(@_laboratoryProgress !=@laboratoryProgress) set @sql+= [dbo].[PARAM_STRING_BUILDER]('laboratoryProgress',@laboratoryProgress)
if(@_extractionProportin !=@extractionProportin) set @sql+= [dbo].[PARAM_STRING_BUILDER]('extractionProportin',@extractionProportin)
if(@_techProgress !=@techProgress) set @sql+= [dbo].[PARAM_STRING_BUILDER]('techProgress',@techProgress)
if(@_lastUpgradeProductionTime !=@lastUpgradeProductionTime) set @sql+= [dbo].[PARAM_STRING_BUILDER]('lastUpgradeProductionTime',@lastUpgradeProductionTime)

IF(len(@sql) > @sqlLen)
BEGIN
set @sql =[dbo].[REMOVE_LAST_SIMBOL](@sql) +concat( ' WHERE Id=',@Id); 
EXEC sp_executesql @sql;
END
ELSE SELECT 1;
END
GO
