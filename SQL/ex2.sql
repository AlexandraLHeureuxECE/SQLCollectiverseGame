
-- Switch to the Collectiverse database
USE Collectiverse;

-- Create the Admin_User table
CREATE TABLE IF NOT EXISTS Admin_User (
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) NOT NULL,
    Password VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    Admin_Permission ENUM('Read', 'Write', 'Admin'), 
    UNIQUE (Username),
    UNIQUE (email)
);

-- Create the User_Account table
CREATE TABLE IF NOT EXISTS User_Account (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100), 
    last_name VARCHAR(100),
    Username VARCHAR(100) NOT NULL,
    Password VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    UNIQUE (Username),
    UNIQUE (email)
);

-- Create the Lobby table
CREATE TABLE IF NOT EXISTS Lobby (
    LobbyID INT PRIMARY KEY AUTO_INCREMENT,
    Lobby_Title VARCHAR(100) NOT NULL,
    Lobby_Type ENUM('Private', 'Public') NOT NULL,
    Lobby_Code VARCHAR(100) DEFAULT NULL,
    AdminID INT,
    CurrentUsers INT DEFAULT 0,
    FOREIGN KEY (AdminID) REFERENCES Admin_User(AdminID)
) AUTO_INCREMENT = 1000;

-- Create the User_Lobby table
CREATE TABLE IF NOT EXISTS User_Lobby (
    UserID INT,
    LobbyID INT,
    PRIMARY KEY (UserID, LobbyID),
    FOREIGN KEY (UserID) REFERENCES User_Account(UserID),
    FOREIGN KEY (LobbyID) REFERENCES Lobby(LobbyID)
);

-- Create the Characters table
CREATE TABLE IF NOT EXISTS Characters (
    CharacterID INT PRIMARY KEY AUTO_INCREMENT,
    Character_Name VARCHAR(100) NOT NULL,
    Character_Value INT DEFAULT 0.00,
    Char_Icon BLOB, 
    Nickname VARCHAR(100), 
    Origin VARCHAR(300),
    AdminID INT, 
    FOREIGN KEY (AdminID) REFERENCES Admin_User(AdminID)
);

-- Create the User_Lobby_Character table
CREATE TABLE IF NOT EXISTS User_Lobby_Character (
    UserID INT,
    CharID INT,
    LobbyID INT,
    PRIMARY KEY (UserID, CharID, LobbyID),
    FOREIGN KEY (UserID) REFERENCES User_Account(UserID),
    FOREIGN KEY (CharID) REFERENCES Characters(CharacterID),
    FOREIGN KEY (LobbyID) REFERENCES Lobby(LobbyID)
);

-- Create the Lobby_Character table
CREATE TABLE IF NOT EXISTS Lobby_Character (
    LobbyID INT,
    CharID INT,
    PRIMARY KEY (LobbyID, CharID),
    FOREIGN KEY (LobbyID) REFERENCES Lobby(LobbyID),
    FOREIGN KEY (CharID) REFERENCES Characters(CharacterID)
);

-- Create the Medals table
CREATE TABLE IF NOT EXISTS Medals (
    MedalID INT PRIMARY KEY AUTO_INCREMENT,
    MedalName VARCHAR(100) NOT NULL,
    Color VARCHAR(50) NOT NULL,
    Cost INT NOT NULL,
    Icon BLOB
);

-- Create the User_Medals table
CREATE TABLE IF NOT EXISTS User_Lobby_Medals (
    UserID INT,
    MedalID INT,
    LobbyID INT,
    PRIMARY KEY (UserID, MedalID, LobbyID),
    FOREIGN KEY (UserID) REFERENCES User_Account(UserID),
    FOREIGN KEY (MedalID) REFERENCES Medals(MedalID),
    FOREIGN KEY (LobbyID) REFERENCES Lobby(LobbyID)
);

-- Create the Trades table
CREATE TABLE IF NOT EXISTS Trades (
    TradeID INT PRIMARY KEY AUTO_INCREMENT,
    User1ID INT,
    User2ID INT,
    Char1ID INT,
    Char2ID INT,
    LobbyID INT,
    AdminID INT,
    TradeTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TradeMessage VARCHAR(300),
    FOREIGN KEY (User1ID) REFERENCES User_Account(UserID),
    FOREIGN KEY (User2ID) REFERENCES User_Account(UserID),
    FOREIGN KEY (User1ID, Char1ID, LobbyID) REFERENCES User_Lobby_Character(UserID, CharID, LobbyID),
    FOREIGN KEY (User2ID ,Char2ID, LobbyID) REFERENCES User_Lobby_Character(UserID, CharID, LobbyID),
    FOREIGN KEY (LobbyID) REFERENCES Lobby(LobbyID),
    FOREIGN KEY (AdminID) REFERENCES Admin_User(AdminID),
    CHECK (User1ID <> User2ID) 
);