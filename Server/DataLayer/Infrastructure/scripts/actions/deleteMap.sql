DELETE FROM [dbo].[user_mothership]
      WHERE [user_id]>0
GO
DELETE FROM [dbo].[g_detail_moon]
      WHERE [Id]>0
GO
DELETE FROM [dbo].[g_geometry_moon]
      WHERE [Id]>0
GO


DELETE FROM [dbo].[g_detail_planet]
      WHERE [Id]>0
GO
DELETE FROM [dbo].[g_geometry_planet]
      WHERE [Id]>0
GO
DELETE FROM [dbo].[g_detail_system]
      WHERE [Id]>0
GO

DELETE FROM [dbo].[g_geometry_star]
      WHERE [Id]>0
GO
DELETE FROM [dbo].[g_sectors]
      WHERE [Id]>0
GO
DELETE FROM [dbo].[g_system]
      WHERE [Id]>0
GO
DELETE FROM [dbo].[g_geometry_system]
      WHERE [Id]>0
GO
















