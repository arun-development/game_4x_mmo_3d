IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_candidat_get_top_candidates')
DROP PROCEDURE [dbo].[c_officer_candidat_get_top_candidates]
GO

CREATE PROCEDURE [dbo].[c_officer_candidat_get_top_candidates](@take INT)
AS 
BEGIN 

DECLARE @totalVoices INT = (SELECT COUNT(Id) FROM  [dbo].[c_vote])
IF (ISNULL(@take,0)=0)
	BEGIN
	 SELECT 
	 co.Id as Id , 
	 co.userId as UserId,
	 "user".nickname as UserName,
	 "user".pvpPoint as PvpPoint,
	  @totalVoices as TotalVoices,
	  co.voices as Voices
	 FROM [dbo].[c_officer_candidat]  as co
	 LEFT JOIN [dbo].[user] as "user" on co.userId ="user".Id 
	 WHERE co.isFinalizer =1 
	 ORDER BY  Id ASC  
	END
ELSE
	BEGIN	
	 SELECT top(@take)
	 co.Id as Id , 
	 co.userId as UserId,
	 "user".nickname as UserName,
	 "user".pvpPoint as PvpPoint,
	  @totalVoices as TotalVoices,
	  co.voices as Voices
	 FROM [dbo].[c_officer_candidat] as co
	 LEFT JOIN [dbo].[user] as "user" on co.userId ="user".Id 
	 ORDER BY PvpPoint DESC, Id ASC 
	END
END
GO



 


