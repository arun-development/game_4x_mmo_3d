IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'help_delete_table_cascade')
DROP PROCEDURE [dbo].[help_delete_table_cascade]
GO

CREATE PROCEDURE [dbo].[help_delete_table_cascade] (@tableName NVARCHAR(255) = '')
AS BEGIN
	 DECLARE @tableForDelete NVARCHAR(255);	
	 SET @tableForDelete = (SELECT  TOP(1) t.name  FROM sys.foreign_keys k
									 LEFT JOIN sys.tables t ON t.object_id = k.parent_object_id
									 WHERE k.referenced_object_id = (SELECT object_id FROM sys.tables WHERE name = @tableName));
	
		WHILE (ISNULL(@tableForDelete, '') != '')
		  BEGIN
		   IF NOT EXISTS (SELECT TOP 1 t.name FROM sys.foreign_keys k
						  LEFT JOIN sys.tables t ON t.object_id = k.parent_object_id
						  WHERE k.referenced_object_id = (SELECT object_id FROM sys.tables  WHERE name = @tableForDelete))
		    BEGIN
		     IF EXISTS (SELECT * FROM sys.tables WHERE name = @tableForDelete)
		      BEGIN
		       EXECUTE ('DROP TABLE [' + @tableForDelete + ']');
		      END
		
		     SET @tableForDelete = (SELECT 
		            TOP(1) t.name
		           FROM sys.foreign_keys k
		           LEFT JOIN sys.tables t ON t.object_id = k.parent_object_id
		           WHERE k.referenced_object_id = (SELECT 
		                    object_id
		                   FROM sys.tables 
		                   WHERE name = @tableName));
		    END
		    ELSE
		    EXECUTE [dbo].[help_delete_table_cascade] @tableForDelete;	   
		  END
		
		 EXECUTE ('DROP TABLE [' + @tableName + ']');
		RETURN 1;
END;
GO

 