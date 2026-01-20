# The Ticking Trivia Bomb 💣

A high-stakes, timed trivia game built with Vanilla JavaScript. Players must race against the clock to answer questions fetched dynamically from the Open Trivia Database.


## 🎮 How It Works
* **The Hook:** Users start with a fixed time limit (120s).
* **The Risk:** Every correct answer adds **+5 seconds**. Every wrong answer subtracts **-5 seconds**.
* **The Goal:** Answer as many questions as possible before the timer hits zero and the "bomb" explodes.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3
* **Logic:** Vanilla JavaScript (ES6+)
* **Data Source:** [Open Trivia Database API](https://opentdb.com/)

## 🔑 Key Features
* **Dynamic Data Fetching:** Uses `async/await` and the Fetch API to retrieve batches of questions in real-time.
* **Custom State Management:** Manages a complex game loop (Score, Timer, Question Queue) without external frameworks.
* **Data Sanitization:** Implements a custom helper function to decode HTML entities (e.g., converting `&quot;` to `"`), ensuring text is readable.
* **Fisher-Yates Shuffle:** Randomizes answer options so the correct answer isn't always in the same spot.
* **Responsive Design:** Clean, centered UI using CSS Flexbox.

## 🧠 What I Learned
* **DOM Manipulation:** Dynamically creating and updating HTML elements based on user interaction.
* **Asynchronous JavaScript:** Handling API latency and promises to ensure a smooth user experience.
* **Error Handling:** Managing empty data queues and API response codes.

## 🏃‍♂️ How to Run
1.  Clone the repository.
2.  Open `index.html` in any modern web browser.
3.  Click "Start Game" to begin!
