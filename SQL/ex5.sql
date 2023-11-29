-- Queries for task 5 of assignment

-- Listing all lobbies that a user is in.
SELECT Lobby.LobbyID, Lobby.Lobby_Title
FROM Lobby
JOIN User_Lobby ON Lobby.LobbyID = User_Lobby.LobbyID
WHERE User_Lobby.UserID = 1;

-- Listing all lobbies that are public for users to see.
SELECT * FROM Lobby WHERE Lobby_Type = 'Public';

-- Listing all the characters that a specific user has in a specific lobby.
SELECT Characters.*
FROM Characters
JOIN User_Lobby_Character ON Characters.CharacterID = User_Lobby_Character.CharID
WHERE User_Lobby_Character.UserID = 1
AND User_Lobby_Character.LobbyID = 1000;

-- Finding the top 10 characters with the highest Character_Values.
SELECT * FROM Characters ORDER BY Character_Value DESC LIMIT 10;

-- List what medals a user has in a lobby.
SELECT Medals.*
FROM Medals
JOIN User_Lobby_Medals ON Medals.MedalID = User_Lobby_Medals.MedalID
WHERE User_Lobby_Medals.UserID = 1
AND User_Lobby_Medals.LobbyID = 1000;
  
-- Listing all trades involving a specific user.
SELECT * FROM Trades WHERE User1ID = 1 OR User2ID = 1;

-- List the first and last name for a specific user.
SELECT first_name, last_name FROM User_Account WHERE Username = 'User.10';

-- Count the number of characters each user has in a specific lobby.
-- This is useful to see which user has the most characters, replace the LobbyID
SELECT User_Account.Username, COUNT(User_Lobby_Character.CharID) AS CharacterCount
FROM User_Account
LEFT JOIN User_Lobby_Character ON User_Account.UserID = User_Lobby_Character.UserID
WHERE User_Lobby_Character.LobbyID = 1000
GROUP BY User_Account.UserID;

-- List all users that are in a lobby.
SELECT User_Account.*
FROM User_Account
JOIN User_Lobby ON User_Account.UserID = User_Lobby.UserID
WHERE User_Lobby.LobbyID = 1000;

-- List all characters that are not owned by any user within a lobby.
SELECT Characters.*
FROM Characters
LEFT JOIN User_Lobby_Character ON Characters.CharacterID = User_Lobby_Character.CharID
WHERE User_Lobby_Character.CharID IS NULL
  OR User_Lobby_Character.LobbyID <> 1000;

-- This will print out all the tables there are
SELECT * FROM Admin_User;
SELECT * FROM User_Account;
SELECT * FROM Lobby;
SELECT * FROM Characters;
SELECT * FROM User_Lobby_Character;
SELECT * FROM Lobby_Character;
SELECT * FROM Medals;
SELECT * FROM User_Lobby_Medals;
SELECT * FROM Trades;