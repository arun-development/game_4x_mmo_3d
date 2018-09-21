BEGIN TRAN end_voting
BEGIN TRY 
         EXEC [dbo].[c_vote_save_to_history];
         EXEC [dbo].[c_vote_delete_all];
         EXEC [dbo].[help_reset_index] '{nameof(c_vote)}',1; 
         EXEC [dbo].[c_officer_save_to_history]; 
         EXEC [dbo].[c_officer_delete_all]; 
         EXEC [dbo].[help_reset_index] '{nameof(c_officer)}',1; 
         EXEC [dbo].[c_vote_delete_all];
         EXEC [dbo].[c_officer_candidat_save_to_history] 1;
         EXEC [dbo].[c_officer_candidat_delete_all];
         EXEC [dbo].[help_reset_index] '{nameof(c_officer_candidat)}',1;
	     COMMIT TRAN end_voting
		 SELECT 1;
END  TRY
BEGIN CATCH
	ROLLBACK TRANSACTION end_voting;	
THROW;
END CATCH
 
