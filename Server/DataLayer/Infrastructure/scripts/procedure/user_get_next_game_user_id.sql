IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_get_next_game_user_id')
DROP PROCEDURE [dbo].[user_get_next_game_user_id]
GO
CREATE PROCEDURE [dbo].[user_get_next_game_user_id]
AS
BEGIN
declare @val int = IDENT_CURRENT('[dbo].[user]');
IF (ISNULL(@val,0)=0 OR @val<=1000) select 1001
ELSE select @val +1 
END
GO


