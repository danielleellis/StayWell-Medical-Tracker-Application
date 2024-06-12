to start the server open the terminal and cd into this backend dir then type:

node server.js


the server should start running it will say:
"Server is running on port 3000"


then you can install curl:
https://stackoverflow.com/questions/9507353/how-do-i-install-and-use-curl-on-windows
or on mac or whatever idk if it comes normally on mac


and then for the terminal commands to talk to the server:

curl http://localhost:3000/users
{"users":[{"userID":"user1","username":"johndoe","password":"password123","legalName":"John Doe","pronouns":"he/him","birthday":"1985-05-15","phoneNumber":"123-456-7890","emailAddress":"johndoe@example.com","userCalendar":null,"medicationList":null,"journal":null,"documents":null,"friendsList":null},{"userID":"user2","username":"janedoe","password":"password456","legalName":"Jane Doe","pronouns":"she/her","birthday":"1990-10-10","phoneNumber":"987-654-3210","emailAddress":"janedoe@example.com","userCalendar":null,"medicationList":null,"journal":null,"documents":null,"friendsList":null}]}

curl http://localhost:3000/users/user1
{"user":{"userID":"user1","username":"johndoe","password":"password123","legalName":"John Doe","pronouns":"he/him","birthday":"1985-05-15","phoneNumber":"123-456-7890","emailAddress":"johndoe@example.com","userCalendar":null,"medicationList":null,"journal":null,"documents":null,"friendsList":null}}

to create a new user you would need to POST a command like this:
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"username\": \"josephdoe\", \"password\": \"password456\", \"legalName\": \"Joseph Doe\", \"userID\": \"user3\", \"pronouns\": \"she/her\", \"birthday\": \"1990-10-10\", \"phoneNumber\": \"987-654-3210\", \"emailAddress\": \"josephdoe@example.com\"}"
however to make it unique you need to change the info under userID
	for example \"legalName\": \"Jaqueline Doe", \"userID": \"userchangedthenumberrightherefromupperexample"

curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"username\": \"josephdoe\", \"password\": \"password456\", \"legalName\": \"Joseph Doe\", \"userID\": \"user420\", \"pronouns\": \"she/her\", \"birthday\": \"1990-10-10\", \"phoneNumber\": \"987-654-3210\", \"emailAddress\": \"josephdoe@example.com\"}"




the POST command will send info to the server and in the terminal at the end it should show "User added successfully"
if there's an error then the server terminal will spout some error mumbo jumbo