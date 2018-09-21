SELECT DB_NAME(eS.database_id) AS the_database,
	   eS.is_user_process,
	   COUNT(eS.session_id) AS total_database_connections
FROM sys.dm_exec_sessions eS
 
GROUP BY DB_NAME(eS.database_id), eS.is_user_process
ORDER BY 1, 2;
SELECT *
FROM sys.dm_exec_sessions eS