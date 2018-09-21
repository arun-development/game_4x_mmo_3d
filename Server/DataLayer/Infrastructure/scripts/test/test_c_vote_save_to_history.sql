EXEC [dbo].[c_vote_save_to_history]
SELECT * FROM [dbo].[c_vote_history]
DELETE FROM [dbo].[c_vote_history]
EXEC [dbo].[help_reset_index] 'c_vote_history', 1