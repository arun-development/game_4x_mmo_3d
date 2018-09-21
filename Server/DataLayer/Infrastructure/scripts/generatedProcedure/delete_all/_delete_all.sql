IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_delete_all') DROP PROCEDURE [dbo].[alliance_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_fleet_delete_all') DROP PROCEDURE [dbo].[alliance_fleet_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_fleet_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_fleet])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_fleet]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_request_message_delete_all') DROP PROCEDURE [dbo].[alliance_request_message_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_request_message_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_request_message])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_request_message]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_request_message_history_delete_all') DROP PROCEDURE [dbo].[alliance_request_message_history_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_request_message_history_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_request_message_history])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_request_message_history]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_role_delete_all') DROP PROCEDURE [dbo].[alliance_role_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_role_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_role])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_role]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_tech_delete_all') DROP PROCEDURE [dbo].[alliance_tech_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_tech_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_tech])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_tech]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_user_delete_all') DROP PROCEDURE [dbo].[alliance_user_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_user_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_user])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_user]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_user_history_delete_all') DROP PROCEDURE [dbo].[alliance_user_history_delete_all] 
GO  

CREATE PROCEDURE [dbo].[alliance_user_history_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[alliance_user_history])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[alliance_user_history]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_delete_all') DROP PROCEDURE [dbo].[c_officer_delete_all] 
GO  

CREATE PROCEDURE [dbo].[c_officer_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[c_officer])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[c_officer]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_candidat_delete_all') DROP PROCEDURE [dbo].[c_officer_candidat_delete_all] 
GO  

CREATE PROCEDURE [dbo].[c_officer_candidat_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[c_officer_candidat])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[c_officer_candidat]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_candidat_histrory_delete_all') DROP PROCEDURE [dbo].[c_officer_candidat_histrory_delete_all] 
GO  

CREATE PROCEDURE [dbo].[c_officer_candidat_histrory_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[c_officer_candidat_histrory])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[c_officer_candidat_histrory]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_histroy_delete_all') DROP PROCEDURE [dbo].[c_officer_histroy_delete_all] 
GO  

CREATE PROCEDURE [dbo].[c_officer_histroy_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[c_officer_histroy])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[c_officer_histroy]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_vote_delete_all') DROP PROCEDURE [dbo].[c_vote_delete_all] 
GO  

CREATE PROCEDURE [dbo].[c_vote_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[c_vote])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[c_vote]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_vote_history_delete_all') DROP PROCEDURE [dbo].[c_vote_history_delete_all] 
GO  

CREATE PROCEDURE [dbo].[c_vote_history_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[c_vote_history])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[c_vote_history]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_delete_all') DROP PROCEDURE [dbo].[channel_delete_all] 
GO  

CREATE PROCEDURE [dbo].[channel_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[channel])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[channel]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_connection_delete_all') DROP PROCEDURE [dbo].[channel_connection_delete_all] 
GO  

CREATE PROCEDURE [dbo].[channel_connection_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[channel_connection])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[channel_connection]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_message_delete_all') DROP PROCEDURE [dbo].[channel_message_delete_all] 
GO  

CREATE PROCEDURE [dbo].[channel_message_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[channel_message])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[channel_message]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_detail_moon_delete_all') DROP PROCEDURE [dbo].[g_detail_moon_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_detail_moon_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_detail_moon])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_detail_moon]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_detail_planet_delete_all') DROP PROCEDURE [dbo].[g_detail_planet_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_detail_planet_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_detail_planet])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_detail_planet]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_detail_system_delete_all') DROP PROCEDURE [dbo].[g_detail_system_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_detail_system_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_detail_system])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_detail_system]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_galaxy_delete_all') DROP PROCEDURE [dbo].[g_galaxy_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_galaxy_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_galaxy])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_galaxy]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_game_type_delete_all') DROP PROCEDURE [dbo].[g_game_type_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_game_type_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_game_type])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_game_type]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_geometry_moon_delete_all') DROP PROCEDURE [dbo].[g_geometry_moon_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_geometry_moon_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_geometry_moon])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_geometry_moon]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_geometry_planet_delete_all') DROP PROCEDURE [dbo].[g_geometry_planet_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_geometry_planet_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_geometry_planet])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_geometry_planet]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_geometry_star_delete_all') DROP PROCEDURE [dbo].[g_geometry_star_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_geometry_star_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_geometry_star])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_geometry_star]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_geometry_system_delete_all') DROP PROCEDURE [dbo].[g_geometry_system_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_geometry_system_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_geometry_system])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_geometry_system]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_sectors_delete_all') DROP PROCEDURE [dbo].[g_sectors_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_sectors_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_sectors])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_sectors]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_system_delete_all') DROP PROCEDURE [dbo].[g_system_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_system_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_system])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_system]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_texture_type_delete_all') DROP PROCEDURE [dbo].[g_texture_type_delete_all] 
GO  

CREATE PROCEDURE [dbo].[g_texture_type_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[g_texture_type])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[g_texture_type]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_bookmark_delete_all') DROP PROCEDURE [dbo].[user_bookmark_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_bookmark_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_bookmark])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_bookmark]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_delete_all') DROP PROCEDURE [dbo].[user_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_mothership_delete_all') DROP PROCEDURE [dbo].[user_mothership_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_mothership_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_mothership])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_mothership]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_mother_jump_delete_all') DROP PROCEDURE [dbo].[user_mother_jump_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_mother_jump_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_mother_jump])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_mother_jump]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_report_delete_all') DROP PROCEDURE [dbo].[user_report_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_report_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_report])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_report]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_spy_delete_all') DROP PROCEDURE [dbo].[user_spy_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_spy_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_spy])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_spy]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_task_delete_all') DROP PROCEDURE [dbo].[user_task_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_task_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_task])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_task]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_balance_cc_delete_all') DROP PROCEDURE [dbo].[user_balance_cc_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_balance_cc_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_balance_cc])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_balance_cc]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'transacation_cc_delete_all') DROP PROCEDURE [dbo].[transacation_cc_delete_all] 
GO  

CREATE PROCEDURE [dbo].[transacation_cc_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[transacation_cc])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[transacation_cc]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'currency_delete_all') DROP PROCEDURE [dbo].[currency_delete_all] 
GO  

CREATE PROCEDURE [dbo].[currency_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[currency])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[currency]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'journal_buy_delete_all') DROP PROCEDURE [dbo].[journal_buy_delete_all] 
GO  

CREATE PROCEDURE [dbo].[journal_buy_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[journal_buy])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[journal_buy]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_premium_delete_all') DROP PROCEDURE [dbo].[user_premium_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_premium_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_premium])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_premium]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'product_store_delete_all') DROP PROCEDURE [dbo].[product_store_delete_all] 
GO  

CREATE PROCEDURE [dbo].[product_store_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[product_store])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[product_store]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'product_type_delete_all') DROP PROCEDURE [dbo].[product_type_delete_all] 
GO  

CREATE PROCEDURE [dbo].[product_type_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[product_type])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[product_type]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_chest_delete_all') DROP PROCEDURE [dbo].[user_chest_delete_all] 
GO  

CREATE PROCEDURE [dbo].[user_chest_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[user_chest])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[user_chest]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'sys_helper_delete_all') DROP PROCEDURE [dbo].[sys_helper_delete_all] 
GO  

CREATE PROCEDURE [dbo].[sys_helper_delete_all] AS
BEGIN
   DECLARE @sucsess bit =0;
       IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[sys_helper])
           BEGIN
              SET @sucsess = 1;
           END
       ELSE
           BEGIN
               BEGIN TRY
               DELETE FROM [dbo].[sys_helper]
               SET @sucsess = 1;
               END TRY
               BEGIN CATCH
                   THROW; 
               END CATCH 
            END
   SELECT  @sucsess
END 
GO 




