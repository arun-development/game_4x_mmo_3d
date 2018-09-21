--exec [dbo].[channel_get_serch_items] 'arun',1,3
CREATE FULLTEXT CATALOG channel_name_full_text_catalog
	WITH ACCENT_SENSITIVITY = OFF
	--AS DEFAULT
	AUTHORIZATION dbo
GO

 