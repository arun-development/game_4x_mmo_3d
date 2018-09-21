--WITH  electedOfficers (candidatUserId,voterUserId)
--as (SELECT candidatUserId, count(voterUserId) as count FROM [dbo].vote GROUP BY candidatUserId ORDER BY count)

--select * from electedOfficers
go
DECLARE @topCount int =4;
WITH  electedOfficers (candidatUserId,count)as (SELECT candidatUserId, count(voterUserId) as count FROM [dbo].vote GROUP BY candidatUserId) 

SELECT Top(@topCount)
 candidatUserId as userId,
 count,
"user".nickname as userName, 
"user".pvpPoint as userPvpPoint,
personalInfo.img as userAvatar, 
 alliance.Id as allianceId,
 alliance.images as allianceLabel,
 alliance.name as allianceName

from electedOfficers
 LEFT JOIN [dbo].[user] as "user" on electedOfficers.candidatUserId ="user".Id
 LEFT JOIN [dbo].[user_personal_info] as personalInfo on electedOfficers.candidatUserId =personalInfo.userId
 LEFT JOIN [dbo].[alliance_user] as allianceUser on electedOfficers.candidatUserId =allianceUser.userId
 LEFT JOIN [dbo].[alliance] as alliance on allianceUser.allianceId =alliance.Id
 ORDER BY count DESC


 
 