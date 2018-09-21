DECLARE @hasItem bit;
EXEC  [dbo].[has_alliance_request_message_item] 1,2,@hasItem=@hasItem OUTPUT;
print (CAST(@hasItem AS VARCHAR));
GO  