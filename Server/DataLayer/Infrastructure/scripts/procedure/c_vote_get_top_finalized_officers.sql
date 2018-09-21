IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_vote_get_top_finalized_officers')
DROP PROCEDURE [dbo].[c_vote_get_top_finalized_officers]
GO

CREATE PROCEDURE [dbo].[c_vote_get_top_finalized_officers](@takeTopCount  int)
AS BEGIN 

WITH  electedOfficers (candidatUserId,count)as (SELECT candidatUserId, count(voterUserId) as count FROM [dbo].c_vote GROUP BY candidatUserId) 

SELECT Top(@takeTopCount)
 candidatUserId as userId,
 count,
"user".nickname as userName, 
"user".pvpPoint as userPvpPoint,
"user".avatarUrls as userAvatar, 
 alliance.Id as allianceId,
 alliance.images as allianceLabel,
 alliance.name as allianceName
FROM electedOfficers
 LEFT JOIN [dbo].[user] as "user" on electedOfficers.candidatUserId ="user".Id 
 LEFT JOIN [dbo].[alliance_user] as allianceUser on electedOfficers.candidatUserId =allianceUser.userId
 LEFT JOIN [dbo].[alliance] as alliance on allianceUser.allianceId =alliance.Id
 ORDER BY count DESC 
END
GO
 


 


