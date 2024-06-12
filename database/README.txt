before launching the database you'll need to setup SQLite on your computer

to launch the database you cd into this directory in your VScode terminal and type
sqlite3 database.db
.tables

should show all of the tables currently in the database. it would look like this:

PS C:\Users\Max\Source\Repos\StayWell-Medical-Tracker-Application\database> sqlite3 database.db
SQLite version 3.46.0 2024-05-23 13:25:27 (UTF-16 console I/O)
Enter ".help" for usage hints.
sqlite> .tables
Appointment    Event          JournalEntry   Selection      users
Calendar       Habit          Medication     SelectionMenu
Document       Journal        Notification   User
sqlite>

if you want to view the entire schema for the database type:
.schema

i'd post the text in here but it just looks exactly like the schema.sql file