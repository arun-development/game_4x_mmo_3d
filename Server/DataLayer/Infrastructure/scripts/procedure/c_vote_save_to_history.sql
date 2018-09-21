IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_vote_save_to_history')
DROP PROCEDURE [dbo].[c_vote_save_to_history]
GO

CREATE PROCEDURE [dbo].[c_vote_save_to_history]
AS 
BEGIN 
DECLARE @lastWeek int  = (SELECT max(week) from [dbo].[c_vote_history]);
	IF (ISNULL(@lastWeek,0)=0)
		 BEGIN 
		 SET @lastWeek =1;
		 	--print ('last week:  IS NULL :' +(CAST(@lastWeek AS VARCHAR)));
		 END
	ELSE 
		BEGIN 
		--print ('last week:  NOT NULL :' +(CAST(@lastWeek AS VARCHAR)));
		SET @lastWeek =@lastWeek +1;
		END

 
INSERT INTO [dbo].[c_vote_history](candidatUserId,voterUserId,"week") SELECT candidatUserId,voterUserId,@lastWeek as "week" FROM [dbo].[c_vote] 
END
GO



 


