IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_detail_system_fk_allianceId')
DROP PROCEDURE [dbo].[g_detail_system_fk_allianceId]
GO

CREATE PROCEDURE [dbo].[g_detail_system_fk_allianceId] (@createFkOrDeleteFk bit)
AS BEGIN
DECLARE @exist bit = 0;
	IF EXISTS(select * FROM sys.objects WHERE name ='FK_g_detail_system_to_alliance' and type ='F')   SET @exist= 1; 
	IF @createFkOrDeleteFk =@exist return;

	IF  (@createFkOrDeleteFk =0)
		 BEGIN 
           ALTER TABLE [dbo].[g_detail_system]
	       DROP CONSTRAINT [FK_g_detail_system_to_alliance]; 
		 END
	ELSE 
		 BEGIN 
		 ALTER TABLE [dbo].[g_detail_system]
		 ADD CONSTRAINT [FK_g_detail_system_to_alliance]
         FOREIGN KEY ([allianceId]) REFERENCES [dbo].[alliance] ([Id]) ON UPDATE CASCADE
		 END	  

END
GO
