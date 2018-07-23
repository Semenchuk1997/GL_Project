******************************HOW TO USE THAT APP*********************************

1. In terminal run command: npm istall (set all modules and dependents);

2. Then run command: node switch.js for run switch server.
Server connect to mongoDB and listening on port 8000.
If you haven't mongoDB, please download.

3. In different terminal run command: node controller.js.
Controller connecte to switch server and listening on port 3000.

( You can copy controller code and create another file and past code innto him, change listening port and run controller in different terminal.
Both controllers will connect to switch server and would controll devices on their ports.)

4. Open browser in http://localhost:3000 (or port what you set for controller) couple of time.
You will see the:
    * Your id: - field with device address (comprises socket.id of device and socket.id of depend controller);
    * Destination: - field where you write (past) destination device address;
    * Text area - field with message what you want to deliver;
    * Send button - send message to another device;

5. Copy id of device and past him to destination field in different page and there send message whatever you want.

6. Open destination page and you will see message;

7. Enjoy !!!.