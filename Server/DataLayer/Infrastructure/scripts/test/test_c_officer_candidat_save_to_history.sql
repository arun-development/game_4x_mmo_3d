EXEC [dbo].[c_officer_candidat_save_to_history]  1
SELECT * FROM [dbo].[c_officer_candidat_histrory]
DELETE FROM [dbo].[c_officer_candidat_histrory]
EXEC [dbo].[help_reset_index] 'c_officer_candidat_histrory', 1