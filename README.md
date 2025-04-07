# QTeach

A small web application allowing first graders to train and learn math skills by chatting with the friendly robot QT.

## Web deployment link: https://qteach.onrender.com/

Creators: 
- Mehdi Bakhtar (mb26-code)
- Alain Le (AlainIco34)
- Oscar Jimenez-Flores


### Local installation guide (running the app on your machine)

1. Access this URL: https://github.com/mb26-code/qteach

2. Click on the green **"Code"** button

3. Select **"Download ZIP"**

4. Extract the downloaded file
  - **Windows**: Right click > "Extract all"
  - **Mac**: Double click > "Automatic extraction"
  - **Linux**: Right click > "Extract here"

5. Open a terminal
  - **Windows**: Press `Win + R` > Type `cmd` > Press Enter
  - **Mac**: Press `Cmd + Space` > Type `Terminal` > Press Enter
  - **Linux**: Press `Ctrl + Alt + T`

6. Verify necessary tools:
  - In terminal, type `node -v`
    If there is a message saying that "node" is unknown, go to step 61.
    Else, go to step 7.

  - Then type `npm list express`
    If "express" is unknown, go to step 61.
    Else, go to step 7.

61. Install dependencies:
  - **Node.js**:
    1. Go to: https://nodejs.org
    2. Download LTS version
    3. Launch installation file (.msi or .pkg)
    4. Check "Add to PATH" during installation

  - **Express**:
    1. Go to: https://expressjs.com/en/starter/installing.html
    2. On Mac and Linux, type in the terminal `npm install express`

7. Using the terminal, move to project directory:
   - **Windows**:
     ```bash
     cd Downloads/
     cd qteach-main
     cd qteach-main
     ```
   - **Mac** and **Linux**:
     ```bash
     cd Downloads/
     cd qteach-main
     ```

8. Launch application server by typing `node qteach-server-script.js`

9. This message should be displayed:
```
Server application running on port 8080.
QTeach web page localhost URL: http://localhost:8080/
```

10. Copy the link and access it using a web browser
  
11. Interact with QT: Answer its questions or give it some problems to solve!



Required for running this application:
- Node.js v18+
- Node.js packages:
  - Express
  - Dotenv
  - Google/Generative-AI
- A `.env` file containing:
```env
GEMINI_API_KEY="your key here"
PORT=your server port here
```
