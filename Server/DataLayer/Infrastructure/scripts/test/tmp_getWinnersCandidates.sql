--1046, 1077, 1041, 1073

--SELECT * FROM [DBO].[user]
--LEFT JOIN [dbo].[alliance_user] as au
--LEFT JOIN [dbo].[alliance] as au    
--WHERE Id = 1046

WITH  electedOfficers (userId,voices) 
as 
	(SELECT Top(4) userId, voices  FROM [dbo].[c_officer_candidat] WHERE isFinalizer =1  ORDER BY voices DESC, Id) 

SELECT 
electedOfficers.userId as userId,
"user".nickname as userName, 
"user".pvpPoint as userPvpPoint,
personalInfo.img as userAvatar,
 alliance.Id as allianceId,
 alliance.images as allianceLabel,
 alliance.name as allianceName
 FROM electedOfficers
 LEFT JOIN [dbo].[user] as "user" on electedOfficers.userId ="user".Id
 LEFT JOIN [dbo].[user_personal_info] as personalInfo on electedOfficers.userId =personalInfo.userId
 LEFT JOIN [dbo].[alliance_user] as allianceUser on electedOfficers.userId =allianceUser.userId
 LEFT JOIN [dbo].[alliance] as alliance on allianceUser.allianceId =alliance.Id

--SELECT Top(4)
-- candidatUserId as userId,
-- count,
--"user".nickname as userName, 
--"user".pvpPoint as userPvpPoint,
--personalInfo.img as userAvatar, 
-- alliance.Id as allianceId,
-- alliance.images as allianceLabel,
-- alliance.name as allianceName
--from electedOfficers
-- LEFT JOIN [dbo].[user] as "user" on electedOfficers.candidatUserId ="user".Id
-- LEFT JOIN [dbo].[user_personal_info] as personalInfo on electedOfficers.candidatUserId =personalInfo.userId
-- LEFT JOIN [dbo].[alliance_user] as allianceUser on electedOfficers.candidatUserId =allianceUser.userId
-- LEFT JOIN [dbo].[alliance] as alliance on allianceUser.allianceId =alliance.Id
-- ORDER BY count DESC 
--END
GO
