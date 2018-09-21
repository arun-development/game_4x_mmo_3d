IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'CURRENT_UNIX_TIMESTAMP')
DROP FUNCTION [dbo].[CURRENT_UNIX_TIMESTAMP]
GO
CREATE FUNCTION [dbo].[CURRENT_UNIX_TIMESTAMP] ()
RETURNS INT
AS
BEGIN
	RETURN [dbo].[UNIX_TIMESTAMP](SYSUTCDATETIME()) 
END
GO


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'PARAM_STRING_BUILDER')
DROP FUNCTION [dbo].[PARAM_STRING_BUILDER]
GO
CREATE FUNCTION [dbo].[PARAM_STRING_BUILDER] (@key nvarchar(MAX), @value  nvarchar(MAX))
RETURNS nvarchar(MAX)
AS
BEGIN 
	RETURN  @key +'='''+@value +''',';
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'REMOVE_LAST_SIMBOL')
DROP FUNCTION [dbo].[REMOVE_LAST_SIMBOL]
GO
CREATE FUNCTION [dbo].[REMOVE_LAST_SIMBOL] (@str nvarchar(MAX))
RETURNS nvarchar(MAX)
AS
BEGIN
	RETURN LEFT(@str, LEN(@str)-1);
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'UNIX_TIMESTAMP')
DROP FUNCTION [dbo].[UNIX_TIMESTAMP]
GO
CREATE FUNCTION [dbo].[UNIX_TIMESTAMP] (@ctimestamp datetime)
RETURNS integer
AS 
BEGIN
  /* Function body */
  declare @return integer

  SELECT @return = DATEDIFF(SECOND,{d '1970-01-01'}, @ctimestamp)

  return @return
END
GO


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_delete_all_cascade')
DROP PROCEDURE [dbo].[alliance_delete_all_cascade]
GO

CREATE PROCEDURE [dbo].[alliance_delete_all_cascade] 
AS 
BEGIN TRY
DELETE [dbo].alliance;
DELETE [dbo].alliance_user;
DELETE [dbo].alliance_user_history;
DELETE [dbo].alliance_request_message;
DELETE [dbo].alliance_request_message_history;
DELETE [dbo].alliance_fleet;
DELETE [dbo].alliance_tech;

EXEC [dbo].help_reset_index @dbName = 'alliance',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_user',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_user_history',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_request_message',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_request_message_history',  -- varchar(50)
                            @lastIndex = 0; -- int
 
EXEC [dbo].help_reset_index @dbName = 'alliance_fleet',  -- varchar(50)
                            @lastIndex = 0; -- int
 

END TRY
BEGIN CATCH
THROW;
END CATCH
DECLARE @sucsess BIT =1;  
SELECT @sucsess;

GO

 

 
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_delete_cascade_alliance_item')
DROP PROCEDURE [dbo].[alliance_delete_cascade_alliance_item]
GO

CREATE PROCEDURE [dbo].[alliance_delete_cascade_alliance_item] (@allianceId int, @allianceSourceTypeId TINYINT,@userSourceTypeId TINYINT)
AS BEGIN
DECLARE @sucsess BIT =0;  
 
   
	IF(@allianceId = 0 or @allianceId IS NULL)
			BEGIN 
				raiserror('The value should not be 0 or NULL', 15, 1) 
				SELECT @sucsess
				RETURN;
			END
	IF  (NOT EXISTS (SELECT id from [dbo].[alliance] where id=@allianceId))
			BEGIN  
					--print ('ALLIANCE NOT EXIST OPERATION CANCELED');
					 SET @sucsess =1;
					 SELECT @sucsess;
					 RETURN
			END
	ELSE 
			BEGIN TRAN delete_alliance_item_tran
			BEGIN TRY 
					 --delete allince
					 DELETE [dbo].[alliance] where id=@allianceId 
					-- PRINT ('alliance exist IF EXISTS');  
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_user] where allianceId=@allianceId)
						--delete alliance_user
						 BEGIN 
							 DELETE [dbo].[alliance] where Id=@allianceId
							 --PRINT ('delete alliance_user');
						 END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_user_history] where allianceId=@allianceId)
					 	--delete alliance_user_history  в продакшене этот код нужно закоментить
					      BEGIN
							 DELETE [dbo].[alliance_user_history] where allianceId=@allianceId	 				 
					 		 --PRINT ('delete alliance_user_history'); 
					      END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_request_message] 
							   WHERE (fromId=@allianceId AND sourceType =@allianceSourceTypeId) 
							          OR (toId =@allianceId AND sourceType =@userSourceTypeId))
										 BEGIN
					 					 --delete alliance_request_message
 											DELETE [dbo].[alliance_request_message] 
											WHERE (fromId=@allianceId AND sourceType =@allianceSourceTypeId)
											OR (toId =@allianceId AND sourceType =@userSourceTypeId)
											
											--PRINT ('delete alliance_request_message'); 
					 					 END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_request_message_history] 
							   WHERE (fromId=@allianceId AND sourceType =@allianceSourceTypeId) 
							   OR (toId =@allianceId AND sourceType =@userSourceTypeId))
										 BEGIN
					 					 --delete alliance_request_message
 											DELETE [dbo].[alliance_request_message_history] 
											WHERE (fromId=@allianceId AND sourceType =@allianceSourceTypeId) 
											OR (toId =@allianceId AND sourceType =@userSourceTypeId)
					 						
											--PRINT ('delete alliance_request_message_history'); 
					 					 END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_fleet] where allianceId=@allianceId)
					      BEGIN
					 		--delete alliance_fleet
							DELETE [dbo].[alliance_fleet] WHERE allianceId =@allianceId 					 
					 		--print ('delete alliance_fleet'); 
					 	  END
					 IF EXISTS(SELECT TOP(1) Id from [dbo].[alliance_tech] where Id=@allianceId)
					      BEGIN
					 		--delete alliance_tech
							DELETE [dbo].[alliance_tech] WHERE Id =@allianceId 					 
					 		--print ('delete alliance_tech'); 
					 	  END 
					 --ROLLBACK TRAN delete_alliance_item_tran;
					 COMMIT TRAN delete_alliance_item_tran;	

					 --print ('COMMIT TRAN delete_alliance_item_tran');  
			END TRY
			BEGIN CATCH 
				ROLLBACK TRAN delete_alliance_item_tran;
				--print ('ROLLBACK TRAN delete_alliance_item_tran');
				THROW
			END CATCH
			SET @sucsess =1;
			SELECT @sucsess;
 
END;
GO

 
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_disband_alliance')
DROP PROCEDURE [dbo].[alliance_disband_alliance]
GO

CREATE PROCEDURE [dbo].[alliance_disband_alliance] (@allianceId int,@confederationAllianceId INT,@recrutRoleId TINYINT, @armAllianceSourceType TINYINT,@armUserSourceType TINYINT)
AS BEGIN
DECLARE @sucsess BIT =0;  
	IF  (@allianceId IS NULL)
		 BEGIN 
			RAISERROR('The value for @allianceId should not be null', 15, 1) -- with log ; 
			SELECT @sucsess;
			RETURN;
		 END
	  
	IF (NOT EXISTS (SELECT Id FROM [dbo].[alliance] WHERE Id = @allianceId ))
		 BEGIN 
				RAISERROR('@allianceId not exist', 15, 1) -- with log ; 
				SELECT @sucsess;
				RETURN;
	 	 END
	ELSE IF ((SELECT disbandet FROM [dbo].[alliance] WHERE Id = @allianceId)=1)
		BEGIN 
			raiserror('alliance was disbandet', 15, 1) -- with log ; 
			SELECT @sucsess;
			RETURN;
	 	END
	ELSE
			BEGIN TRAN	
			BEGIN TRY
					DECLARE @dateLeave INT = [dbo].[CURRENT_UNIX_TIMESTAMP] ();  				
					DECLARE @dateCreate DATETIME = SYSUTCDATETIME() 
						--record - aliance deleted
						UPDATE [dbo].[alliance] 
								SET disbandet =1,dateDisband = @dateLeave
								WHERE Id = @allianceId;						
						
						IF EXISTS (SELECT allianceId FROM [dbo].[alliance_user_history] WHERE  allianceId = @allianceId)
							DELETE [dbo].[alliance_user_history] WHERE  allianceId = @allianceId;
						
						--records - add old users to history
						SET IDENTITY_INSERT [dbo].[alliance_user_history] ON
						INSERT INTO [dbo].[alliance_user_history] (Id, allianceId, userId,dateCreate, dateLeave,roleId,leave,disbandet)
							SELECT  Id, allianceId, userId, dateCreate, @dateLeave, roleId,0,1
							FROM [dbo].[alliance_user] 
							WHERE allianceId = @allianceId;
						SET IDENTITY_INSERT [dbo].[alliance_user_history] OFF
						
						-- delete old users
						DELETE [dbo].[alliance_user] WHERE  allianceId = @allianceId;
						
						--delete request messages

						delete [dbo].[alliance_request_message] WHERE fromId = @allianceId AND sourceType = @armAllianceSourceType 
																	  OR toId = @allianceId AND  sourceType = @armUserSourceType;
						delete [dbo].[alliance_request_message_history] WHERE fromId = @allianceId AND sourceType = @armAllianceSourceType 
																	  OR toId = @allianceId AND  sourceType = @armUserSourceType;

						-- set users to npc alliance
						IF EXISTS (SELECT Id FROM [dbo].[alliance] WHERE Id =@confederationAllianceId )
										INSERT INTO [dbo].[alliance_user](allianceId, userId, dateCreate, roleId)
										SELECT @confederationAllianceId, userId, @dateCreate, 2
										FROM [dbo].[alliance_user_history]
									    WHERE allianceId = @allianceId; 
						COMMIT TRAN; 
			END TRY
			BEGIN CATCH 
					ROLLBACK TRAN;
					THROW;
			END CATCH
			SET @sucsess =1;
			SELECT @sucsess;
 
END
GO



IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_get_alliance_count')
DROP PROCEDURE [dbo].[alliance_get_alliance_count]
GO
CREATE PROCEDURE [dbo].[alliance_get_alliance_count]
AS
BEGIN
SELECT Count(*)  FROM [dbo].[alliance]
END
GO


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_get_all_active')
DROP PROCEDURE [dbo].[alliance_get_all_active]
GO

CREATE PROCEDURE [dbo].[alliance_get_all_active]
AS BEGIN
SELECT * FROM [dbo].[alliance] WHERE disbandet = 0;
END
GO



IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_request_message_delete_user_requests_and_save_to_history')
DROP PROCEDURE [dbo].[alliance_request_message_delete_user_requests_and_save_to_history]
GO

CREATE PROCEDURE [dbo].[alliance_request_message_delete_user_requests_and_save_to_history](@fromUserId int, @toAllianceId int,@armAllianceSourceType TINYINT,@armUserSourceType TINYINT)
AS
BEGIN
 
   DECLARE @sucsess BIT =0; 
   IF(@fromUserId = 0 or @fromUserId IS NULL or @toAllianceId =0 or @toAllianceId IS NULL)
      BEGIN 
		 RAISERROR('The value should not be 0 or NULL', 15, 1)  
	     SELECT @sucsess; 
		 RETURN;
	  END
   ELSE 
	  BEGIN TRAN
	  BEGIN TRY 
				 	DECLARE @dateLeave INT = [dbo].[CURRENT_UNIX_TIMESTAMP](); 

					INSERT INTO [dbo].[alliance_request_message_history] (
						oldArmId,
						sourceType,
						fromId,
						fromName,
						toId,
						toName,
						dateCreate,
						message,
						userAccepted,
						allianceAccepted,
						creatorIcon,
						dateDelete)

								SELECT  Id,
										sourceType,
										fromId,
										fromName,
										toId,
										toName,
										dateCreate,
										message,
										userAccepted,
										allianceAccepted,
										creatorIcon,
										@dateLeave							 
								FROM [dbo].[alliance_request_message] 
								WHERE fromId = @fromUserId AND toId = @toAllianceId AND sourceType = @armUserSourceType
									  OR fromId = @toAllianceId AND toId =@fromUserId AND sourceType = @armAllianceSourceType;
					
					DELETE [dbo].[alliance_request_message] WHERE fromId = @fromUserId AND toId = @toAllianceId AND sourceType = @armUserSourceType
												                  OR fromId = @toAllianceId AND toId =@fromUserId AND sourceType = @armAllianceSourceType;
					COMMIT TRAN 
 
			END TRY 
			BEGIN CATCH  
			        ROLLBACK TRANSACTION
					THROW
			END CATCH 
	  SET  @sucsess = 1; 
	  SELECT @sucsess;
END
GO



IF EXISTS (SELECT name FROM sys.objects WHERE  name = 'alliance_request_message_has_message_item')
DROP PROCEDURE [dbo].[alliance_request_message_has_message_item]
GO
CREATE PROCEDURE [dbo].[alliance_request_message_has_message_item] (@fromId int, @toId int,  @sourceType TINYINT)
AS
BEGIN
	DECLARE @hasItem BIT= 0;
	IF EXISTS (SELECT Id FROM [dbo].[alliance_request_message] WHERE  fromId = @fromId and toId = @toId and sourceType = @sourceType)
		BEGIN
		SET @hasItem = 1;
		END
	ELSE
		BEGIN
		SET @hasItem = 0;
		END
		
	SELECT @hasItem;
END
GO


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_request_message_update_alliance_icon')
DROP PROCEDURE [dbo].[alliance_request_message_update_alliance_icon];
GO

CREATE PROCEDURE [dbo].[alliance_request_message_update_alliance_icon](@allianceId INT, @newIcon NVARCHAR (1000),@armAllianceSourceType TINYINT)
AS
BEGIN 
	IF EXISTS (SELECT TOP(1) Id  FROM [dbo].[alliance_request_message] WHERE  fromId = @allianceId and sourceType =@armAllianceSourceType)
	BEGIN
		UPDATE [dbo].[alliance_request_message] 
		SET creatorIcon = @newIcon
		WHERE  fromId = @allianceId
		SELECT * FROM [dbo].[alliance_request_message] WHERE  fromId = @allianceId and sourceType =@armAllianceSourceType;
	END
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'alliance_user_leave_user_from_alliance')
DROP PROCEDURE [dbo].[alliance_user_leave_user_from_alliance]
GO
CREATE PROCEDURE [dbo].[alliance_user_leave_user_from_alliance] (@allianceId int, @userId int, @setToNpc bit, @confederationAllianceId INT,@recrutRoleId TINYINT)
AS BEGIN
	IF  (@allianceId IS NULL OR @userId IS NULL)
		 BEGIN 
			raiserror('The paremeters should not be null', 15, 1) -- with log ;
			return;
		 END
	  
	IF (NOT EXISTS (SELECT Id FROM [dbo].[alliance_user] WHERE allianceId = @allianceId and userId =@userId ))
		 BEGIN 
		    raiserror('@alliance_user.Id not exist', 15, 1) -- with log ; 
			return; 
	 	 END
	ELSE
		 BEGIN TRAN
		 BEGIN TRY
		 		DECLARE @dateLeave INT = [dbo].[CURRENT_UNIX_TIMESTAMP] (); 	
		 		DECLARE @dateCreate DATETIME = SYSUTCDATETIME()
		 		DECLARE @auId int = (SELECT Id   
		 								 FROM [dbo].[alliance_user]
		 								 WHERE  allianceId = @allianceId and userId = @userId);
		 						
		 
		 		IF EXISTS(SELECT Id FROM [dbo].[alliance_user_history] WHERE Id = @auId) 
		 			BEGIN
		 				DELETE [dbo].[alliance_user_history] WHERE  Id = @auId;
		 			END
		 		
		 		--records - add old user to history
		 		SET IDENTITY_INSERT [dbo].[alliance_user_history] ON
		 		INSERT INTO [dbo].[alliance_user_history] (Id, allianceId, userId,dateCreate, dateLeave,roleId,leave,disbandet)
		 					SELECT  Id, allianceId, userId, dateCreate, @dateLeave, roleId,1,0
		 					FROM [dbo].[alliance_user] 
		 					WHERE allianceId = @allianceId  and userId = @userId;
		 		SET IDENTITY_INSERT [dbo].[alliance_user_history] OFF
		 		
		 		--records - update user set leave allianceTime
		 		UPDATE [dbo].[user] SET leaveAllianceTime = @dateLeave FROM  [dbo].[user] WHERE Id = @userId;
		 
		 		-- delete old user
		 		DELETE [dbo].[alliance_user] WHERE  Id = @auId;
		 		
		 		-- set user to npc alliance
		 		IF (@setToNpc =1)
		 			BEGIN
		 			IF EXISTS (SELECT Id FROM [dbo].[alliance] WHERE Id =@confederationAllianceId )
		 						INSERT INTO [dbo].[alliance_user](allianceId, userId,dateCreate,roleId)
		 						VALUES (@confederationAllianceId,@userId,@dateCreate,2)
		 			END  
		 		COMMIT TRAN;
		END TRY
		BEGIN CATCH 
			  ROLLBACK TRAN
			  THROW
		END CATCH
 
END
GO




IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_get_by_invariant_name')
DROP PROCEDURE [dbo].[channel_get_by_invariant_name]
GO

CREATE PROCEDURE [dbo].[channel_get_by_invariant_name](@channelName  NVARCHAR(14))
AS BEGIN
 --todo  need user CONTAINS but need full text catalog (not suported in express sql version)
 --db use COLLATE   SQL_Latin1_General_CP1_CI_AS  LOWER(arg) not needed set param COLLATE not needed
SELECT * FROM [dbo].[channel] where channelName=@channelName
END
GO



 


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_get_serch_items')
DROP PROCEDURE [dbo].[channel_get_serch_items]
GO

CREATE PROCEDURE [dbo].[channel_get_serch_items](@partChannelName  NVARCHAR(14), @channelType TINYINT, @serchType TINYINT)
AS BEGIN
 
 --todo  need use CONTAINS but need full text catalog (not suported in express sql version)
  --db use COLLATE   SQL_Latin1_General_CP1_CI_AS  LOWER(arg) not needed set param COLLATE not needed
IF(@serchType =3)SELECT	Id,	channelName,password FROM [dbo].[channel] where channelType = @channelType and  password!='' and channelName LIKE '%'+channelName+'%';
ELSE IF(@serchType =2)SELECT Id, channelName, password FROM [dbo].[channel] where channelType = @channelType and password='' and channelName LIKE '%' + @partChannelName + '%';
ELSE SELECT	Id, channelName,password FROM [dbo].[channel] where channelType = @channelType and  channelName LIKE '%' + @partChannelName + '%';
END
GO



 
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_update_icon_by_alliance_icon')
DROP PROCEDURE [dbo].[channel_update_icon_by_alliance_icon];
GO

CREATE PROCEDURE [dbo].[channel_update_icon_by_alliance_icon](@newIconUrl NVARCHAR(1000), @creatorId INT,@allianceChannelType TINYINT)
AS
BEGIN  
	DECLARE  @sucsess BIT = 1;  
	IF NOT EXISTS (SELECT top(1) Id FROM [dbo].[channel] WHERE creatorId =@creatorId and channelType = @allianceChannelType) 
		BEGIN
			SELECT @sucsess;
			RETURN;
		END 
	ELSE 
		BEGIN TRAN	  
		BEGIN TRY    	
			UPDATE [dbo].[channel] 
			SET channelIcon = @newIconUrl
			WHERE  creatorId =@creatorId and channelType = @allianceChannelType 
			COMMIT TRAN  
		END TRY
		BEGIN CATCH
			ROLLBACK TRAN 
			THROW
		END CATCH
SELECT @sucsess; 
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'channel_update_icon_by_user_icon')
DROP PROCEDURE [dbo].[channel_update_icon_by_user_icon];
GO

CREATE PROCEDURE [dbo].[channel_update_icon_by_user_icon](@newIconUrl NVARCHAR(1000), @userId INT, @userChannelType TINYINT)
AS
BEGIN 
    DECLARE @sucsess bit =1;  
	BEGIN TRAN
	BEGIN TRY 
		IF EXISTS (select top(1) Id FROM [dbo].[channel] WHERE  creatorId =@userId and channelType = @userChannelType )
			BEGIN		    	
				UPDATE [dbo].[channel] 
				SET channelIcon = @newIconUrl
				WHERE  creatorId =@userId and channelType = @userChannelType
			END  
		COMMIT TRAN
	END TRY
	BEGIN CATCH 
		ROLLBACK TRAN
		THROW
	END CATCH 
	SELECT @sucsess; 
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_candidat_get_top_candidates')
DROP PROCEDURE [dbo].[c_officer_candidat_get_top_candidates]
GO

CREATE PROCEDURE [dbo].[c_officer_candidat_get_top_candidates](@take INT)
AS 
BEGIN 

DECLARE @totalVoices INT = (SELECT COUNT(Id) FROM  [dbo].[c_vote])
IF (ISNULL(@take,0)=0)
	BEGIN
	 SELECT 
	 co.Id as Id , 
	 co.userId as UserId,
	 "user".nickname as UserName,
	 "user".pvpPoint as PvpPoint,
	  @totalVoices as TotalVoices,
	  co.voices as Voices
	 FROM [dbo].[c_officer_candidat]  as co
	 LEFT JOIN [dbo].[user] as "user" on co.userId ="user".Id 
	 WHERE co.isFinalizer =1 
	 ORDER BY  Id ASC  
	END
ELSE
	BEGIN	
	 SELECT top(@take)
	 co.Id as Id , 
	 co.userId as UserId,
	 "user".nickname as UserName,
	 "user".pvpPoint as PvpPoint,
	  @totalVoices as TotalVoices,
	  co.voices as Voices
	 FROM [dbo].[c_officer_candidat] as co
	 LEFT JOIN [dbo].[user] as "user" on co.userId ="user".Id 
	 ORDER BY PvpPoint DESC, Id ASC 
	END
END
GO



 


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_candidat_save_to_history')
DROP PROCEDURE [dbo].[c_officer_candidat_save_to_history]
GO

CREATE PROCEDURE [dbo].[c_officer_candidat_save_to_history](@setWeekPlusOne bit)
AS 
BEGIN 
DECLARE @maxWeek int = (SELECT max(week) from [dbo].[c_officer_candidat_histrory]); 

IF (ISNULL(@maxWeek,0)=0)
	BEGIN 
	SET @maxWeek =1;
	END 

ELSE IF (@setWeekPlusOne=1)
	BEGIN 
	SET @maxWeek =@maxWeek +1;
	END 

 --PRINT(@maxWeek);

INSERT INTO [dbo].[c_officer_candidat_histrory](userId,dateCreate,voices,isFinalizer,"week")
SELECT userId,dateCreate,voices,isFinalizer,@maxWeek as "week" FROM [dbo].[c_officer_candidat]  
END
GO



 


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_officer_save_to_history')
DROP PROCEDURE [dbo].[c_officer_save_to_history]
GO

CREATE PROCEDURE [dbo].[c_officer_save_to_history]
AS BEGIN 
DECLARE @lastWeek int  =(SELECT max(week) from [dbo].[c_officer_histroy]);
IF (ISNULL(@lastWeek,0)=0) SET @lastWeek =1;
ELSE BEGIN SET @lastWeek =@lastWeek +1;END

INSERT INTO [dbo].[c_officer_histroy](officerType,userId,allianceId ,elected,appointedUserId,dateStart,dateEnd,"week") 
SELECT officerType,userId,allianceId ,elected,appointedUserId,dateStart,dateEnd, @lastWeek FROM [dbo].[c_officer] 
END
GO



 


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_vote_get_top_finalized_officers')
DROP PROCEDURE [dbo].[c_vote_get_top_finalized_officers]
GO

CREATE PROCEDURE [dbo].[c_vote_get_top_finalized_officers](@takeTopCount  int)
AS BEGIN 

WITH  electedOfficers (candidatUserId,count)as (SELECT candidatUserId, count(voterUserId) as count FROM [dbo].c_vote GROUP BY candidatUserId) 

SELECT Top(@takeTopCount)
 candidatUserId as userId,
 count,
"user".nickname as userName, 
"user".pvpPoint as userPvpPoint,
"user".avatarUrls as userAvatar, 
 alliance.Id as allianceId,
 alliance.images as allianceLabel,
 alliance.name as allianceName
FROM electedOfficers
 LEFT JOIN [dbo].[user] as "user" on electedOfficers.candidatUserId ="user".Id 
 LEFT JOIN [dbo].[alliance_user] as allianceUser on electedOfficers.candidatUserId =allianceUser.userId
 LEFT JOIN [dbo].[alliance] as alliance on allianceUser.allianceId =alliance.Id
 ORDER BY count DESC 
END
GO
 


 


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'c_vote_save_to_history')
DROP PROCEDURE [dbo].[c_vote_save_to_history]
GO

CREATE PROCEDURE [dbo].[c_vote_save_to_history]
AS 
BEGIN 
DECLARE @lastWeek int  = (SELECT max(week) from [dbo].[c_vote_history]);
	IF (ISNULL(@lastWeek,0)=0)
		 BEGIN 
		 SET @lastWeek =1;
		 	--print ('last week:  IS NULL :' +(CAST(@lastWeek AS VARCHAR)));
		 END
	ELSE 
		BEGIN 
		--print ('last week:  NOT NULL :' +(CAST(@lastWeek AS VARCHAR)));
		SET @lastWeek =@lastWeek +1;
		END

 
INSERT INTO [dbo].[c_vote_history](candidatUserId,voterUserId,"week") SELECT candidatUserId,voterUserId,@lastWeek as "week" FROM [dbo].[c_vote] 
END
GO



 


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'drop_tables_from_schema')
DROP PROCEDURE [dbo].[drop_tables_from_schema]
GO 

CREATE PROCEDURE [dbo].[drop_tables_from_schema](@schemaName varchar(500))
AS 
BEGIN
    DECLARE @constraintSchemaName nvarchar(128), @constraintTableName nvarchar(128),  @constraintName nvarchar(128)
    declare @sql nvarchar(max)
    -- delete FK first
    DECLARE cur1 cursor for
    SELECT DISTINCT 
    CASE WHEN t2.[object_id] is NOT NULL  THEN  s2.name ELSE s.name END as SchemaName,
    CASE WHEN t2.[object_id] is NOT NULL  THEN  t2.name ELSE t.name END as TableName,
    CASE WHEN t2.[object_id] is NOT NULL  THEN  OBJECT_NAME(d2.constraint_object_id) ELSE OBJECT_NAME(d.constraint_object_id) END as ConstraintName
    FROM sys.objects t 
        inner join sys.schemas s 
            on t.[schema_id] = s.[schema_id]
        left join sys.foreign_key_columns d 
            on  d.parent_object_id = t.[object_id]
        left join sys.foreign_key_columns d2 
            on  d2.referenced_object_id = t.[object_id]
        inner join sys.objects t2 
            on  d2.parent_object_id = t2.[object_id]
        inner join sys.schemas s2 
            on  t2.[schema_id] = s2.[schema_id]
    WHERE t.[type]='U' 
        AND t2.[type]='U'
        AND t.is_ms_shipped = 0 
        AND t2.is_ms_shipped = 0 
        AND s.Name=@schemaName
    OPEN cur1
    FETCH next from cur1 into @constraintSchemaName, @constraintTableName, @constraintName
    WHILE @@fetch_status = 0
    BEGIN
        set @sql ='ALTER TABLE ' + @constraintSchemaName + '.' + @constraintTableName+' DROP CONSTRAINT '+@constraintName+';'
        exec(@sql)
        fetch next from cur1 into @constraintSchemaName, @constraintTableName, @constraintName
    END
    CLOSE cur1
    DEALLOCATE cur1

    DECLARE @tableName nvarchar(128)
    declare cur2 cursor for
    select s.Name, p.Name
    from sys.objects p
        INNER JOIN sys.schemas s ON p.[schema_id] = s.[schema_id]
    WHERE p.[type]='U' and is_ms_shipped = 0 
    AND s.Name=@schemaName
    ORDER BY s.Name, p.Name
    OPEN cur2

    FETCH next from cur2 into @schemaName,@tableName
    WHILE @@fetch_status = 0
    BEGIN
        SET @sql ='DROP TABLE ' + @schemaName + '.' + @tableName
        EXEC(@sql)
        FETCH NEXT FROM cur2 INTO @schemaName,@tableName
    END

    CLOSE cur2
    DEALLOCATE cur2

end
GO
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
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'g_system_system_unique_position')
DROP PROCEDURE [dbo].[g_system_system_unique_position]
GO
CREATE PROCEDURE [dbo].[g_system_system_unique_position]
	
AS
BEGIN
	declare @result int

	--SET @result = (SELECT COUNT(*)
	--FROM [dbo].[g_system] a, [dbo].[g_system] b
	--WHERE a.position = b.position
	--AND a.Id <> b.Id)
RETURN @result
END
GO


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

 
IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'help_reset_index')
DROP PROCEDURE [dbo].[help_reset_index]
GO
 
 
--custom reset index impl for help_reset_index
CREATE PROCEDURE [dbo].[help_reset_index] @dbName varchar(50),@lastIndex int AS
	--documentated ms bug
	--DBCC CHECKIDENT(@dbName, RESEED, @lastIndex);
--exists 2 path for resolve
IF (ISNULL(@lastIndex,0)=0 ) 
	BEGIN
		DECLARE @last_value INT = CONVERT(INT, (SELECT last_value FROM sys.identity_columns WHERE OBJECT_NAME(OBJECT_ID) = @dbName));
		IF @last_value IS NULL
			BEGIN
				-- Table newly created and no rows inserted yet; start the IDs off from 1
				DBCC CHECKIDENT (@dbName, RESEED, 1);
			END
		ELSE
			BEGIN
				-- Table has rows; ensure the IDs continue from the last ID used 
				DECLARE @lastValUsed INT;
				DECLARE @sql nvarchar(500)= 'SELECT @maxId = MAX(Id)  from  [dbo].['+@dbName+']; '--+ ;	 
				DECLARE @parm  nvarchar(500)= '@maxId int OUTPUT';
				EXEC sp_executesql @sql, @parm, @maxId=@lastValUsed OUTPUT;			
		        SET  @lastValUsed =  ISNULL(@lastValUsed,0);    
				DBCC CHECKIDENT (@dbName, RESEED, @lastValUsed);
			END
	END
ELSE
--just set value, but you know what you do
	BEGIN  
	DBCC CHECKIDENT(@dbName, RESEED, @lastIndex)
	END

GO
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


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_mothership_update')
DROP PROCEDURE [dbo].[user_mothership_update]
GO

CREATE PROCEDURE [dbo].[user_mothership_update](
 @Id  int,
 @startSystemId int,
 @resources nvarchar(MAX),
 @hangar nvarchar(MAX),
 @unitProgress nvarchar(MAX),
 @laboratoryProgress nvarchar(MAX), 
 @extractionProportin nvarchar(MAX),
 @techProgress nvarchar(MAX),
 @lastUpgradeProductionTime int  
 )
AS BEGIN 
declare  @_startSystemId int;
declare @_resources nvarchar(MAX);
declare @_hangar nvarchar(MAX);
declare @_unitProgress nvarchar(MAX);
declare @_laboratoryProgress nvarchar(MAX);
declare @_extractionProportin nvarchar(MAX);
declare @_techProgress nvarchar(MAX); 
declare @_lastUpgradeProductionTime int;

select @_startSystemId=startSystemId,
@_resources =resources , 
@_hangar =hangar,  
@_unitProgress =unitProgress,  
@_laboratoryProgress =laboratoryProgress  ,
@_extractionProportin =extractionProportin  ,
@_techProgress =techProgress,
@_lastUpgradeProductionTime = lastUpgradeProductionTime  
from  [dbo].[user_mothership] where Id = @Id 

declare @hasChange bit = 0;
declare @sql nvarchar(MAX) ='update [dbo].[user_mothership] set ';
declare @sqlLen int = len(@sql);

if(@_startSystemId !=@startSystemId) set @sql+= [dbo].[PARAM_STRING_BUILDER]('startSystemId',@startSystemId) 
if(@_resources !=@resources) set @sql+= [dbo].[PARAM_STRING_BUILDER]('resources',@resources)
if(@_hangar !=@hangar) set @sql+= [dbo].[PARAM_STRING_BUILDER]('hangar',@hangar)
if(@_unitProgress !=@unitProgress) set @sql+= [dbo].[PARAM_STRING_BUILDER]('unitProgress',@unitProgress)
if(@_laboratoryProgress !=@laboratoryProgress) set @sql+= [dbo].[PARAM_STRING_BUILDER]('laboratoryProgress',@laboratoryProgress)
if(@_extractionProportin !=@extractionProportin) set @sql+= [dbo].[PARAM_STRING_BUILDER]('extractionProportin',@extractionProportin)
if(@_techProgress !=@techProgress) set @sql+= [dbo].[PARAM_STRING_BUILDER]('techProgress',@techProgress)
if(@_lastUpgradeProductionTime !=@lastUpgradeProductionTime) set @sql+= [dbo].[PARAM_STRING_BUILDER]('lastUpgradeProductionTime',@lastUpgradeProductionTime)

IF(len(@sql) > @sqlLen)
BEGIN
set @sql =[dbo].[REMOVE_LAST_SIMBOL](@sql) +concat( ' WHERE Id=',@Id); 
EXEC sp_executesql @sql;
END
ELSE SELECT 1;
END
GO


IF EXISTS (SELECT * FROM sys.objects WHERE  name = 'user_serch_name_id')
DROP PROCEDURE [dbo].[user_serch_name_id]
GO

CREATE PROCEDURE [dbo].[user_serch_name_id](@partUserName  NVARCHAR(14))
AS BEGIN
 --todo  need use CONTAINS but need full text catalog (not suported in express sql version)
 --db use COLLATE   SQL_Latin1_General_CP1_CI_AS  LOWER(arg) not needed set param COLLATE not needed
 
SELECT Id, nickname FROM [dbo].[user] where nickname LIKE '%' + @partUserName + '%'
END
GO



 
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




