SELECT * from {@tablebName} WHERE channelId=@channelId  --where  
         ORDER BY dateCreate DESC,creatorId DESC        --order by
         OFFSET @skip									--skip
         ROWS FETCH NEXT {@perPage} ROWS ONLY;			--take