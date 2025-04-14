
const chatInputElement = document.getElementById("chat-input");
const chatHistoryElement = document.getElementById("chat-history");

const qtFaceElement = document.getElementById("qt-face");
//qtFace element (to change the emotion)

const modeSwitchButton = document.getElementById("mode-switch-button");
let isModeSwitchButtonLocked = false;

document.addEventListener("DOMContentLoaded", () => {
    chatInputElement.addEventListener("keydown", chatInputHandler);
    modeSwitchButton.addEventListener("click", switchAskingModeAsync);
});


//for the user to switch the asking mode
let inQTAskingMode = true;
//to control and check whether QT is the one who gives problem or the one who solves problems

let isChatInputLocked = true;

qtBe("neutral_blinking");
qtSay("Hello, I'm QT!\nLet's test your math skills!");

let problemForUser = undefined;
//the problem given by QT

console.log("QT will be giving problems to the user");

(async () => {
    isChatInputLocked = true;
    await qtGiveProblemAsync();
    isChatInputLocked = false;
})();

////////////////////////////////////////////////////////////

//display a QT message on the page
function qtSay(message) {
    const messageRecordElement = document.createElement("div");

    const messageAuthorElement = document.createElement("span");
    messageAuthorElement.innerText = "QT:";
    messageRecordElement.appendChild(messageAuthorElement);

    const messageBodyElement = document.createElement("p");
    messageBodyElement.innerText = message;
    messageRecordElement.appendChild(messageBodyElement);

    chatHistoryElement.insertBefore(messageRecordElement, chatHistoryElement.firstChild);
}

//change QT emotion/expression
function qtBe(emotion) {
    qtFaceElement.style.content = "url(/qt_faces/" + emotion + ".gif)";
}

//a sleep function, use this to wait some time before executing the next line of code
function sleep(durationInMilliseconds) {
    return new Promise(resolve => setTimeout(resolve, durationInMilliseconds));
}

//fetch a new problem from the server and display it on the page
async function qtGiveProblemAsync() {
    try {
        console.log("Fetching QT problem...");
        const qtProblemResponse = await fetch("/qtProblem");
        const qtProblemResult = await qtProblemResponse.json();
        problemForUser = qtProblemResult.problem;

        qtBe("talking");
        qtSay(problemForUser);

        console.log("Problem given by QT: \"" + problemForUser + "\"");
        
        const talkingDurationMs = problemForUser.length * 50;
        await sleep(talkingDurationMs);
        qtBe("neutral_blinking");

    } catch(error) {
        console.error("Error while fetching QT problem: " + error);
    }
}

async function switchAskingModeAsync(event) {
    if (!isModeSwitchButtonLocked) {
        console.log("Switching asking mode");
        isModeSwitchButtonLocked = true;

        if (inQTAskingMode) {
            console.log("QT will now solve the user's problems");

            event.target.innerText = "Let QT give you problems!";
            event.target.style.backgroundColor = "rgb(230, 212, 20)";
            event.target.style.color = "black";

            inQTAskingMode = false;
            problemForUser = undefined;

            qtBe("talking");
            qtSay("Alright, I'll solve your problems now! 🙂");
            await sleep(1500);
            qtBe("neutral_blinking");
            
        } else {
            console.log("QT will now give problems to the user");

            event.target.innerText = "Give problems to QT!";
            event.target.style.backgroundColor = "rgb(76, 175, 80)";
            event.target.style.color = "white";

            inQTAskingMode = true;

            qtSay("It's my turn to test you now!");
            qtBe("talking");
            await sleep(1200);
            qtBe("neutral_blinking");

            qtGiveProblemAsync();
        }

        isModeSwitchButtonLocked = false;
    }
}

async function chatInputHandler(event) {

    if (!isChatInputLocked && 
        event.key === "Enter" && 
        !event.shiftKey && 
        /\S/.test(chatInputElement.value)) {
        event.preventDefault();
        
        isChatInputLocked = true;

        let userMessage = chatInputElement.value.trim();
        chatInputElement.value = "";
        
        const userMessageRecordElement = document.createElement("div");
        userMessageRecordElement.style.color = "rgb(29, 80, 211)";

        const userMessageAuthorElement = document.createElement("span");
        userMessageAuthorElement.innerText = "You:";
        userMessageRecordElement.appendChild(userMessageAuthorElement);

        const userMessageBodyElement = document.createElement("p");
        userMessageBodyElement.innerText = userMessage;
        userMessageRecordElement.appendChild(userMessageBodyElement);

        chatHistoryElement.insertBefore(userMessageRecordElement, chatHistoryElement.firstChild);

        if (inQTAskingMode) {
            console.log(`User answer: "${userMessage}"`);

            try {
                console.log("Fetching QT reaction...");

                const qtReactionResponse = await fetch("/qtReaction", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problem: problemForUser, answer: userMessage })
                });
                const qtReactionResult = await qtReactionResponse.json();

                console.log("QT Reaction:", qtReactionResult);

                //set user message color based on correctness
                userMessageRecordElement.style.color = qtReactionResult.correct
                    ? "rgb(75, 187, 14)"
                    : "rgb(187, 23, 20)";
                
                //QT responds
                qtBe(qtReactionResult.emotion);
                await sleep(1000);
                qtBe("talking");
                qtSay(qtReactionResult.message);
                await sleep(qtReactionResult.message.length * 50);
                qtBe("neutral_blinking");

                if (qtReactionResult.correct || qtReactionResult.next) {
                    await sleep(1000);
                    await qtGiveProblemAsync();
                }

            } catch(error) {
                console.error("Error while fetching QT reaction:", error);
            }

        } else {
            try {
                console.log("Fetching QT answer...");

                const qtSolveResponse = await fetch("/qtSolve", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problemToSolve: userMessage })
                });
                const qtSolveResult = await qtSolveResponse.json();

                console.log("QT answer:", qtSolveResult);

                qtBe("talking");
                qtSay(qtSolveResult.message);
                await sleep(qtSolveResult.message.length * 50);
                qtBe(qtSolveResult.emotion);
                await sleep(1000);
                qtBe("neutral_blinking");

            } catch(error) {
                console.error("Error while fetching problem answer:", error);
            }
        }
        isChatInputLocked = false;
    } 
}