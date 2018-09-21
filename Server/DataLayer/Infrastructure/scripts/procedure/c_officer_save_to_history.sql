IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_save_to_history')
DROP PROCEDURE [dbo].[c_officer_save_to_history]
GO

CREATE PROCEDURE [dbo].[c_officer_save_to_history]
AS BEGIN 
DECLARE @lastWeek int  =(SELECT max(week) from [dbo].[c_officer_histroy]);
IF (ISNULL(@lastWeek,0)=0) SET @lastWeek =1;
ELSE BEGIN SET @lastWeek =@lastWeek +1;END

INSERT INTO [dbo].[c_officer_histroy](officerType,userId,allianceId ,elected,appointedUserId,dateStart,dateEnd,"week") 
SELECT officerType,userId,allianceId ,elected,appointedUserId,dateStart,dateEnd, @lastWeek FROM [dbo].[c_officer] 
END
GO



 


