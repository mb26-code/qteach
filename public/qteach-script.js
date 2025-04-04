
let chatInput = document.getElementById("chat-input");
let chatHistory = document.getElementById("chat-history");

let qtFace = document.getElementById("qt-face");
//qtFace element (to change the emotion)

qtBe("neutral_blinking")
qtSay("Hello, I'm QT!\nLet's test your math skills!");

let problem = undefined;
//the problem given by the server model

let switchAskingModeButton = document.getElementById("ask-mode-button");
//for the user to switch the asking mode
let askingModeQT = true;
//boolean controling whether QT is the one who gives problem or the one who solve problems

qtGiveProblem();

function qtSay(text) {
    let messageRecord = document.createElement("div");

    let messageRecordAuthor = document.createElement("span");
    messageRecordAuthor.innerText = "QT: ";
    messageRecord.appendChild(messageRecordAuthor);

    let messageRecordContent = document.createElement("p");
    messageRecordContent.innerText = text;
    messageRecord.appendChild(messageRecordContent);

    chatHistory.insertBefore(messageRecord,chatHistory.firstChild);
        
}

async function qtBe(emotion) {
    qtFace.style.content = "url(/qt_faces/" + emotion + ".gif)";
}

async function qtGiveProblem() {
    try {
        const qtProblemResponse = await fetch("/qtProblem");
        const qtProblemResult = await qtProblemResponse.json();
        problem = qtProblemResult.problem;

        qtBe("talking");
        qtSay(problem);
        const talkingDuration = problem.length * 50;
        setTimeout(() => qtBe("neutral_blinking"), talkingDuration);

    } catch(error) {

        console.error("Couldn't fetch a problem: " + error);
    }
}

async function switchAskingMode(event) {
    if (askingModeQT) {
        qtSay("Alright, let me solve your problems!🙂");
        qtBe("talking");
        setTimeout(() => qtBe("neutral_blinking"), 1500);
        event.target.innerText = "Let QT give you problems!";
        event.target.style.backgroundColor = "rgb(230, 212, 20)";
        event.target.style.color = "black";
        askingModeQT = false;
    } else {
        qtSay("It's my turn to test you now!");
        qtBe("talking");
        setTimeout(() => qtBe("neutral_blinking"), 1500);
        qtGiveProblem();
        event.target.innerText = "Give problems to QT!";
        event.target.style.backgroundColor = "rgb(76, 175, 80)";
        event.target.style.color = "white";
        askingModeQT = true;
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

        userMessageRecord.style.color = "rgb(29, 80, 211)";
        chatHistory.insertBefore(userMessageRecord,chatHistory.firstChild);
        
        ///
        if (askingModeQT) {
            try {
                const qtReactionResponse = await fetch("/qtReaction", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problem: problem, answer: userMessage })
                });
                const qtReactionResult = await qtReactionResponse.json();

                if (qtReactionResult.correct) {
                    userMessageRecord.style.color = "rgb(75, 187, 14)";
                } else {
                    userMessageRecord.style.color = "rgb(187, 23, 20)";
                }
                qtBe(qtReactionResult.emotion);
                setTimeout(() => { 
                    qtBe("talking");
                    qtSay(qtReactionResult.message);
                    setTimeout(() => { 
                        qtBe("neutral_blinking");
                        if (qtReactionResult.correct || qtReactionResult.next) {
                            setTimeout(qtGiveProblem, 1000);
                        }
                    }, qtReactionResult.message.length * 50);
                }, 2000);

            } catch(error) {
                console.log(error);
            }

        } else {
            const qtSolveResponse = await fetch("/qtSolve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ problemToSolve: userMessage })
            });
            const qtSolveResult = await qtSolveResponse.json();

            qtBe("talking");
            qtSay(qtSolveResult.message);
            setTimeout(() => {
                qtBe(qtSolveResult.emotion);
                setTimeout(() => qtBe("neutral_blinking"), 1500);
            }, qtSolveResult.message.length * 50);
            
        }
    }
}

