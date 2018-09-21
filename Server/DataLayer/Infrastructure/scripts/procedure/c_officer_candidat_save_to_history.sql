IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_candidat_save_to_history')
DROP PROCEDURE [dbo].[c_officer_candidat_save_to_history]
GO

CREATE PROCEDURE [dbo].[c_officer_candidat_save_to_history](@setWeekPlusOne bit)
AS 
BEGIN 
DECLARE @maxWeek int = (SELECT max(week) from [dbo].[c_officer_candidat_histrory]); 

IF (ISNULL(@maxWeek,0)=0)
	BEGIN 
	SET @maxWeek =1;
	END 

ELSE IF (@setWeekPlusOne=1)
	BEGIN 
	SET @maxWeek =@maxWeek +1;
	END 

 --PRINT(@maxWeek);

INSERT INTO [dbo].[c_officer_candidat_histrory](userId,dateCreate,voices,isFinalizer,"week")
SELECT userId,dateCreate,voices,isFinalizer,@maxWeek as "week" FROM [dbo].[c_officer_candidat]  
END
GO



 


