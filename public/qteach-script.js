
const defaultLanguage = localStorage.getItem("lang") || navigator.language.slice(0, 2) || "en";
let langData = undefined;

const supportedLanguages = {
    en: { label: "English", flag: "🇺🇸" },
    fr: { label: "Français", flag: "🇫🇷" },
    es: { label: "Español", flag: "🇪🇸" },
    vi: { label: "Tiếng Việt", flag: "🇻🇳" },
    ja: { label: "日本語", flag: "🇯🇵" },
    de: { label: "Deutsch", flag: "🇩🇪" },
    ar: { label: "العربية", flag: "🇸🇦" },
    it: { label: "Italiano", flag: "🇮🇹" }
};

const languageSelectElement = document.getElementById("language-select");

for (const [code, { label, flag }] of Object.entries(supportedLanguages)) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${flag} ${label}`;
    languageSelectElement.appendChild(option);
}

////////////////////////////////////////

const chatInputElement = document.getElementById("chat-input");
const chatHistoryElement = document.getElementById("chat-history");

const qtFaceElement = document.getElementById("qt-face");
//qtFace element (to change the emotion)

const modeSwitchButton = document.getElementById("mode-switch-button");
let isModeSwitchButtonLocked = false;

//for the user to switch the asking mode
let inQTAskingMode = true;
//to control and check whether QT is the one who gives problem or the one who solves problems

let isChatInputLocked = true;

let problemForUser = undefined;
//the problem given by QT to the user

document.addEventListener("DOMContentLoaded", async () => {
    await loadLanguageAsync(defaultLanguage);

    // Event listeners

    chatInputElement.addEventListener("keydown", chatInputHandler);
    modeSwitchButton.addEventListener("click", switchAskingModeAsync);

    languageSelectElement.addEventListener("change", (e) => {
        loadLanguageAsync(e.target.value);
    });
});

console.log("QT will be giving problems to the user");

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
        const qtProblemResponse = await fetch("/qtProblem/" + langData["lang"]);
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

            event.target.innerText = langData["modeSwitchButtonTextUserAskingMode"];
            event.target.dataset.i18n = "modeSwitchButtonTextUserAskingMode";
            event.target.style.backgroundColor = "rgb(230, 212, 20)";
            event.target.style.color = "black";

            inQTAskingMode = false;
            problemForUser = undefined;

            qtBe("talking");
            qtSay(langData["messageUserAskingMode"]);
            await sleep(1200);
            qtBe("neutral_blinking");
            
        } else {
            console.log("QT will now give problems to the user");

            event.target.innerText = langData["modeSwitchButtonTextQTAskingMode"];
            event.target.dataset.i18n = "modeSwitchButtonTextQTAskingMode";
            event.target.style.backgroundColor = "rgb(76, 175, 80)";
            event.target.style.color = "white";

            inQTAskingMode = true;

            qtSay(langData["messageQTAskingMode"]);
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
        userMessageRecordElement.style.color = "rgb(0, 0, 0)";

        const userMessageAuthorElement = document.createElement("span");
        userMessageAuthorElement.innerText = langData["userPronounInChatHistory"] + ":";
        userMessageAuthorElement.dataset.i18n = "userPronounInChatHistory";
        userMessageRecordElement.appendChild(userMessageAuthorElement);

        const userMessageBodyElement = document.createElement("p");
        userMessageBodyElement.innerText = userMessage;
        userMessageRecordElement.appendChild(userMessageBodyElement);

        chatHistoryElement.insertBefore(userMessageRecordElement, chatHistoryElement.firstChild);

        if (inQTAskingMode) {
            console.log(`User answer: "${userMessage}"`);

            try {
                console.log("Fetching QT reaction...");

                const qtReactionResponse = await fetch("/qtReaction/" + langData["lang"], {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problem: problemForUser, answer: userMessage })
                });
                const qtReactionResult = await qtReactionResponse.json();

                console.log("QT Reaction:", qtReactionResult);

                //set user message color based on correctness
                userMessageRecordElement.style.color = qtReactionResult.correct
                    ? "rgb(25, 215, 57)"
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

                const qtSolveResponse = await fetch("/qtSolve/" + langData["lang"], {
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


async function loadLanguageAsync(lang) {
    console.log("Changing language to " + lang);
    if (!(lang in supportedLanguages)) {
        lang = "en";
    }

    try {
        const langResponse = await fetch("/lang/" + lang + ".json");
        langData = await langResponse.json();

        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (langData[key]) {
                el.textContent = langData[key];
            }
        });

        localStorage.setItem("lang", lang);
        languageSelectElement.value = lang;
        document.documentElement.lang = lang;

        ////////
        clearChatHistory();

        ////////
        if (inQTAskingMode) {
            console.log("QT will now be giving problems to the user in " + lang);

            qtBe("talking");
            qtSay(langData["messageQTAskingMode"]);
            await sleep(1500);
            qtBe("neutral_blinking");

            isChatInputLocked = true;
            await qtGiveProblemAsync();
            isChatInputLocked = false;

        } else {
            console.log("QT will now be solving the user's problems in " + lang);

            qtBe("talking");
            qtSay(langData["messageQTAskingMode"]);
            await sleep(1500);
            qtBe("neutral_blinking");
            
        }
    } catch (error) {
        console.error(`Error loading language file for '${lang}':`, error);
    }
}

function clearChatHistory() {
    while (chatHistoryElement.firstChild) {
        chatHistoryElement.removeChild(chatHistoryElement.firstChild);
    }
}
