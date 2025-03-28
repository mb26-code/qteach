A small web application allowing first graders to train and learn math skills by chatting with the friendly robot "QT".

Version: 2.0
Creators: Mehdi Bakhtar (mb26-code), Alain Le (AlainIco34), Oscar Jimenez-Flores

To run the app locally, after cloning this repository:
    node qteach-server-script.js
Then, access the web page with a browser by typing this URL:
    http://localhost:8080/


Required for running this application:
    Node.js v18+:
        Check your node version with:
            node --version
        If you need a version that is more recent, you'll need to install it.
        To do this and manage different node versions for your applications, you can use NVM (Node Version Manager):
            To install NVM:
                wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
            Then restart you terminal.
            To verify that NVM is properly installed:
                nvm -v
            To display the node versions you are currently using and the ones installed on your machine:
                nvm ls
            To display the list of node versions you can install:
                nvm ls-remote
            To install a node version:
                nvm install v18.20.7
            Set the node version to use by default:
                nvm alias default v18.20.7
            Now, if you do:
                nvm ls
                or
                node --version
            You should see the version you installed.

    Node.js packages:
        Use NPM (Node Package Manager) to install and manage Node.js packages.
        Express:
            npm install express
        Dotenv:
            npm install dotenv --save
        Google/Generative:
            npm install @google/generative-ai
    
    A .env file containing:
        GEMINI_API_KEY="<your key here>"
        PORT=<your server port here>
