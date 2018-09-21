	
SET IDENTITY_INSERT dbo.userMessage ON; 
--1002002
INSERT INTO dbo.userMessage (Id,UserId, Message) VALUES (1,1002002, 'Garden shovel');  
select * from dbo.userMessage

SET IDENTITY_INSERT dbo.userMessage off; 
INSERT INTO dbo.userMessage (UserId, Message) VALUES (1002002, 'message2');  
select * from dbo.userMessage

delete from dbo.userMessage
