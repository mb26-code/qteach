# QTeach

> _Practice math through conversation — with QT, your multilingual robot tutor._

**QTeach** is a small web application that helps first graders practice and build their math skills by chatting with a friendly robot named QT — available in multiple languages!

## 🧩 Features

- 🧠 **Challenge Mode** — QT gives the user math problems to solve  
- 💬 **Ask Mode** — The user can ask QT any math-related question

## 🌍 Multilingual Support

QT speaks multiple languages! The interface and interaction adapt based on the selected language to make learning more inclusive.

## 💻 Access

- Works on **any modern browser** (desktop preferred)
- Requires an **internet connection**
- No installation needed — just open and start chatting!

## ⚙️ Tech

- Built with HTML, CSS, and JavaScript
- Powered by the **Gemini** LLM for intelligent responses

## Web deployment links: https://www.qteach.app/ and https://qteach.onrender.com/

Latest version: 3.1.0

Creators: 
- Mehdi Bakhtar (mb26-code)
- Alain Le (AlainIco34)
- Oscar Jimenez-Flores



### Local installation guide (host the app on your machine)

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



### Required for running this application:
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
