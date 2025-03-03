
let chatInput = document.getElementById("chat-input");
let chatHistory = document.getElementById("chat-history");

let qtFace = document.getElementById("qt-face");

qtSay("Hello, I'm QT! Let's test your arithmetic skills!");

let askingMode = true;
let problem = undefined;

qtAskProblem();

function qtSay(text) {
    let botMessageRecord = document.createElement("div");

    let botMessageRecordAuthor = document.createElement("span");
    botMessageRecordAuthor.innerText = "QT: ";
    botMessageRecord.appendChild(botMessageRecordAuthor);

    let botMessageRecordContent = document.createElement("p");
    botMessageRecordContent.innerText = text;
    botMessageRecord.appendChild(botMessageRecordContent);

    chatHistory.insertBefore(botMessageRecord,chatHistory.firstChild);
        
}

async function qtEmotion(emotion) {
    qtFace.style.content = "url(/qt_faces/" + emotion + ".gif)";
}

async function qtAskProblem() {
    try {
        const qtProblemResponse = await fetch("/qtProblem");
        const qtProblemResult = await qtProblemResponse.json();
        problem = qtProblemResult.problem;
        qtEmotion("talking");
        qtSay(problem);
        setTimeout(() => qtEmotion("neutral_blinking"), 2000);

    } catch(error) {
        console.log(error);
    }
}

async function chatInputHandler(event) {
    if (event.key === "Enter" && !event.shiftKey && /\S/.test(chatInput.value)) {
        event.preventDefault();

        let userMessage = chatInput.value.trim();
        chatInput.value = "";
        
        let userMessageRecord = document.createElement("div");

        let userMessageRecordAuthor = document.createElement("span");
        userMessageRecordAuthor.innerText = "You: ";
        userMessageRecord.appendChild(userMessageRecordAuthor);

        let userMessageRecordContent = document.createElement("p");
        userMessageRecordContent.innerText = userMessage;
        userMessageRecord.appendChild(userMessageRecordContent);

        userMessageRecord.style.color = "rgb(160, 230, 30)";
        chatHistory.insertBefore(userMessageRecord,chatHistory.firstChild);
        
        ///
        if (askingMode) {
            try {
                const qtReactionResponse = await fetch("/qtReaction", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problem: problem, answer: userMessage })
                });
                const qtReactionResult = await qtReactionResponse.json();
                qtEmotion(qtReactionResult.emotion);
                setTimeout(() => { 
                    qtEmotion("talking");
                    qtSay(qtReactionResult.message);
                    setTimeout(() => { 
                        qtEmotion("neutral_blinking");
                        if (qtReactionResult.correct) {
                            setTimeout(qtAskProblem, 2000);
                        }
                    }, qtReactionResult.message.length * 50);
                }, 1500);
                

            } catch(error) {
                console.log(error);
            }

        } else {
            const qtSolveResponse = await fetch("/qtSolve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ problem: problem })
            });
            const qtSolveResult = await qtSolveResponse.json();
            qtEmotion("talking");
            qtSay(qtSolveResult.message);
            setTimeout(() => qtEmotion(qtSolveResult.emotion), 2000);
            setTimeout(() => qtEmotion("neutral_blinking"), 4000);
        }
    }
}

