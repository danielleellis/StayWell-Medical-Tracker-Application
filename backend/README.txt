to start the server open the terminal and cd into this backend dir then type:

node server.js


the server should start running it will say:
"Server is running on port 3000"


then you can install curl:
https://stackoverflow.com/questions/9507353/how-do-i-install-and-use-curl-on-windows
or on mac or whatever idk if it comes normally on mac

and then for the terminal commands to talk to the server:

curl -X POST http://localhost:3000/api/signup -H "Content-Type: application/json" -d "{\"firstName\": \"joseph\", \"lastName\": \"doe\", \"password\": \"password\", \"email\": \"josephdoe@example.com\"}"
creates a new user following the schema


the POST command will send info to the server and in the terminal at the end it should show "User added successfully"
if there's an error then the server terminal will spout some error mumbo jumbo