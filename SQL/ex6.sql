-- Queries for task 6 of the assignment:
-- Changing a specific lobby from private to public and vice versa
UPDATE Lobby
SET Lobby_Type = 'Private'
WHERE LobbyID = 1001;

UPDATE Lobby
SET Lobby_Type = 'Public'
WHERE LobbyID = 1002;

-- Increasing the cost of medals owned by users in lobbies that are private by 20% 
UPDATE User_Lobby_Medals
SET MedalID = MedalID,
    LobbyID = LobbyID,
    UserID = UserID
WHERE User_Lobby_Medals.MedalID = Medals.MedalID
AND User_Lobby_Medals.LobbyID IN (SELECT LobbyID FROM Lobby WHERE Lobby_Type = 'Private');

-- Allow admins with permisson to write to change the passwords of users
UPDATE User_Account
SET Password = 'newpassword123'
WHERE UserID IN (SELECT UserID FROM Admin_User WHERE Admin_Permission = 'Write');


-- Increasing the chracter values for those users who have a specific medal
UPDATE Characters
SET Character_Value = Character_Value + 10
WHERE CharacterID IN (SELECT CharID FROM User_Lobby_Medals WHERE MedalID = 1);


-- Award a specific medal to users who have collected 20 characters
UPDATE User_Lobby_Medals
SET MedalID = 3 
WHERE UserID IN (
    SELECT UserID
    FROM (
        SELECT UserID, COUNT(DISTINCT CharID) AS CollectedCharacters
        FROM User_Lobby_Character
        GROUP BY UserID
    ) AS CharacterCounts
    WHERE CharacterCounts.CollectedCharacters >= 20
);