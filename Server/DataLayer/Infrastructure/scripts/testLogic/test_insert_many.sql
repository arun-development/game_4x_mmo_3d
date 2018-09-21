
DECLARE @tablevar table (Id int);

INSERT INTO [dbo].[user] OUTPUT INSERTED.Id INTO @tablevar VALUES ('qwe1'),('qwe2'),('qwe2');
 SELECT u.* from [dbo].[user] as u JOIN  @tablevar as t  ON t.Id =u.Id ;

 


--delete from [dbo].[user];
