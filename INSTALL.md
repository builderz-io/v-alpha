# Installing V Alpha 2

## Prerequisites

### You need node.js installed and running

Running the MongoDB Entity Store and serving the Web Interface with a simple Express server requires Node.js

```
https://nodejs.org/en/
```

### You need MongoDB installed and running

Running the MongoDB Entity Store requires the Community Edition of MongoDB

```
https://docs.mongodb.com/manual/administration/install-community/
```

Don't forget to start MongoDB after installation

```
sudo mongod
```

### You need Truffle installed and running (optional)

Running the Smart Contract requires Truffle

```
https://www.trufflesuite.com/truffle
```


## Installing the app

Open a Terminal window and run the following commands.

Clone the repository into a local folder. A new folder will be created.

```
git clone https://github.com/valueinstrument/v-alpha-2.git
```

Navigate to the new folder

```
cd v-alpha-2
```

Optionally change git branch before installing dependencies, you may skip this step.

```
git checkout branch-name
```

### Starting the MongoDB Entity Store

Make sure MongoDB is running. Then, from the main V Alpha 2 folder
execute the following:

Install dependencies for the MongoDB Entity Store

```
cd mongodb-entity-store
```

```
npm install
```

Start the MongoDB Entity Store

```
node server.js
```

The MongoDB Entity Store should now be listening on port 6021

### Starting the Web Interface

Open a new Terminal window, navigate to the main V Alpha 2 folder
and execute the following:

Install dependencies for the Web Interface

```
cd web-interface
```

```
npm install
```

Start the Web Interface

```
node server.js
```

Finally access the application in any browser

```
localhost:6029
```

If all is well you should see an empty app, with "no items found"

## Add Content

### Manual Content

Press the Join Button, click "Create new account" and give your
account a name. Then send.

`Make a note of the key`!

Now you can add items to the marketplace. Click 'Jobs', click the plus button and fill out the form with a test job. Then send.

You may have to reload the page (currently) to see the added items.

### Demo Content

To install the demo content also, open a new terminal window and execute the following from the main V Alpha 2 folder

```
cd web-interface/app/src/vcore/v
```

```
nano v-setup.js
```

In the opened file change `demoContent` to `true`

```
demoContent: true, // set to 'true', then ...
```

To save press 'Ctrl-X', then 'Y', then 'Enter'

```
'Ctrl-X' 'Y' 'Enter'
```

Now reload the app in the browser. This triggers the adding of demo content into the MongoDB Entity Store.

```
reload app in browser
```

Before continuing, change `demoContent` back to `false` in order to not add it again with every browser reload.

```
demoContent: false, // ...
```

```
'Ctrl-X' 'Y' 'Enter'
```

Now reload the app in the browser again to see all content added.

```
reload app in browser
```
