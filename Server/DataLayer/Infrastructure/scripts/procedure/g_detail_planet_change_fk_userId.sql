IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_detail_planet_change_fk_userId')
DROP PROCEDURE [dbo].[g_detail_planet_change_fk_userId]
GO

CREATE PROCEDURE [dbo].[g_detail_planet_change_fk_userId] (@createFkOrDeleteFk bit)
AS BEGIN
DECLARE @exist bit = 0;
	IF EXISTS(select * FROM sys.objects WHERE name ='FK_g_detail_planet_to_user' and type ='F')   SET @exist= 1; 
	IF @createFkOrDeleteFk =@exist return;

	IF  (@createFkOrDeleteFk =0)
		 BEGIN 
           ALTER TABLE [dbo].[g_detail_planet]
	       DROP CONSTRAINT FK_g_detail_planet_to_user; 
		 END
	ELSE 
		 BEGIN 
		 ALTER TABLE [dbo].[g_detail_planet]
		 ADD CONSTRAINT [FK_g_detail_planet_to_user]
         FOREIGN KEY ([userId]) REFERENCES [dbo].[user] ([Id]) 
		 END	  

END
GO


