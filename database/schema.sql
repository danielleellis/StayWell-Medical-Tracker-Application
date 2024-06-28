CREATE TABLE Users (
    userID TEXT, 
    firstName TEXT, 
    lastName TEXT, 
    email TEXT, 
    password TEXT, 
    username TEXT, 
    pronouns TEXT, 
    phoneNumber TEXT, 
    birthday TEXT, 
    profilePhoto TEXT,
    verificationCode TEXT
);

CREATE TABLE Calendar (
    userID TEXT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Event (
    eventID TEXT PRIMARY KEY,
    eventName TEXT,
    color TEXT,
    isPublic BOOLEAN,
    viewableBy TEXT,
    notes TEXT,
    streakDays INTEGER,
    reminder TEXT,
    startTime DATE,
    endTime DATE,
    allDay BOOLEAN,
    eventType TEXT,
    calendarID TEXT,
    FOREIGN KEY (calendarID) REFERENCES Calendar(rowid),
    FOREIGN KEY (eventType) REFERENCES EventType(name)
);

CREATE TABLE SingleEvent (
    eventID TEXT PRIMARY KEY,
    dateTime DATE,
    FOREIGN KEY (eventID) REFERENCES Event(eventID)
);

CREATE TABLE RecurringEvent (
    eventID TEXT PRIMARY KEY,
    repeat TEXT,
    startDate DATE,
    endDate DATE,
    recurringException TEXT,
    FOREIGN KEY (eventID) REFERENCES Event(eventID)
);

CREATE TABLE EventType (
    name TEXT PRIMARY KEY,
    currentValue INTEGER,
    goalValue INTEGER
);

CREATE TABLE Selection (
    selectionID TEXT PRIMARY KEY,
    name TEXT,
    image TEXT,
    isSelected BOOLEAN
);

CREATE TABLE SelectionMenu (
    selectionMenuID TEXT PRIMARY KEY,
    name TEXT,
    selectionsList TEXT
);

CREATE TABLE MultiSelectionButtons (
    selectionMenuID TEXT,
    FOREIGN KEY (selectionMenuID) REFERENCES SelectionMenu(selectionMenuID)
);

CREATE TABLE SingleSelectionButtons (
    selectionMenuID TEXT,
    FOREIGN KEY (selectionMenuID) REFERENCES SelectionMenu(selectionMenuID)
);

CREATE TABLE NumericGoal (
    name TEXT,
    currentValue INTEGER,
    goalValue INTEGER,
    FOREIGN KEY (name) REFERENCES EventType(name)
);

CREATE TABLE Notification (
    notificationID TEXT PRIMARY KEY,
    message TEXT,
    time DATE
);

CREATE TABLE Documents (
    documentID TEXT PRIMARY KEY,
    documentName TEXT,
    images TEXT
);

CREATE TABLE Medication (
    medicationID TEXT PRIMARY KEY,
    medicationName TEXT,
    dosage INTEGER,
    directions TEXT
);
