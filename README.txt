******************************HOW TO USE THAT APP*********************************

1. In terminal run command: npm istall (set all modules and dependents);

2. Then run command: node switch.js for run switch server.
Server connect to mongoDB and listening on port 8000.
If you haven't mongoDB, please download.

3. In different terminal run command: node controller.js.
Controller connecte to switch server and listening on port 3000.
You can also run in different terminal command: node controller2.js.
Controller2 connected to switch server and listening on port 3001.

4. Open browser in http://localhost:3000 (and 3001 for controller2 or port witch another controller have been running) couple of time.
You will see the:
    * Your id: - field with device address (comprises socket.id of device and socket.id of depend controller);
    * Destination: - field where you write (past) destination device address;
    * Text area - field with message what you want to deliver;
    * Send button - send message to another device;

5. Copy id of device and past him to destination field in different page and there send message whatever you want.

6. Open destination page and you will see message;

7. Enjoy !!!.