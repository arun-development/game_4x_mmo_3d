 delete from [dbo].vote;
 go
exec [dbo].[help_reset_index] 'vote',1;
 go

declare @count int =0;
declare  @userId int =1000;
declare  @voterUserId int =2000;
 

while @count < 1000
BEGIN 
insert into [dbo].vote (candidatUserId, voterUserId) values (@userId,@voterUserId) 

set @count = @count + 1 


set @userId =CAST(rand()*10 AS int)
if (@userId =0)  set @userId =1;


set @userId = @userId +1000;
 
set @voterUserId = @voterUserId + 1  
END 
 