import React, { useState } from "react";
import axios from "axios";
import "./App.css";

require("dotenv").config();

function App() {
    const [userDice, setUserDice] = useState([]);
    const [computerDice, setComputerDice] = useState([]);
    const [giphy, setGiphy] = useState([]);
    const api_key = process.env.REACT_APP_API_KEY;

    window.onload = function () {
        var fund = 1000;
        document.getElementById("currentAmount").innerHTML = fund;

        const randomDiceUser = Math.floor(Math.random() * 6) + 1;
        const randomDiceComputer = Math.floor(Math.random() * 6) + 1;

        setUserDice("/images/dice/dice_" + randomDiceUser + ".png");
        setComputerDice("/images/dice/dice_" + randomDiceComputer + ".png");
        axios.get("https://api.giphy.com/v1/gifs/random?api_key=" + api_key + "&tag=good-luck&rating=g").then((res) => {
            setGiphy(res.data.data.images.downsized_large.url);
        });
    };

    function rollDice() {
        const UserScore = Math.floor(Math.random() * 6) + 1;
        const ComputerScore = Math.floor(Math.random() * 6) + 1;
        const CurrentAmount = document.getElementById("currentAmount").innerHTML;

        const bet = document.getElementById("userBet").value;
        const currentFunds = parseInt(CurrentAmount);
        const addFunds = parseInt(CurrentAmount) + parseInt(bet);
        const removeFunds = parseInt(CurrentAmount) - parseInt(bet);

        if (bet == 0 || NaN || undefined) {
            alert("Please enter a number.");
        } else if (currentFunds === 0) {
            /* If you run out of funds */
            document.getElementById("fundsDepleted").innerHTML = "It looks like you're out of money. Go do something else.";
        } else if (bet > currentFunds) {
            /* If you bet more than you have*/
            alert("You can't bet more than you have.");
        } else {
            /* Output dice images */
            setUserDice("/images/dice/dice_" + UserScore + ".png");
            setComputerDice("/images/dice/dice_" + ComputerScore + ".png");
            if (UserScore > ComputerScore) {
                /* If the user's roll is higher than the computer's */
                axios.get("https://api.giphy.com/v1/gifs/random?api_key=" + api_key + "&tag=winner&rating=g").then((res) => {
                    setGiphy(res.data.data.images.downsized_large.url);
                });
                document.getElementById("userDice").classList.add("diceWinner");
                document.getElementById("computerDice").classList.remove("diceWinner");
                document.getElementById("outcome").src = process.env.PUBLIC_URL + "/images/won.png";
                document.getElementById("currentAmount").innerHTML = addFunds;
                document.getElementById("userBet").value = "";
            } else if (UserScore === ComputerScore) {
                /* If it's a tie score */
                axios.get("https://api.giphy.com/v1/gifs/random?api_key=" + api_key + "&tag=tie+score&rating=g").then((res) => {
                    setGiphy(res.data.data.images.downsized_large.url);
                });
                document.getElementById("userDice").classList.add("diceWinner");
                document.getElementById("computerDice").classList.add("diceWinner");
                document.getElementById("outcome").src = process.env.PUBLIC_URL + "/images/tie.png";
                document.getElementById("userBet").value = "";
            } else {
                /* If the computer's roll is higher than the user's */
                axios.get("https://api.giphy.com/v1/gifs/random?api_key=" + api_key + "&tag=loser&rating=g").then((res) => {
                    setGiphy(res.data.data.images.downsized_large.url);
                });
                document.getElementById("userDice").classList.remove("diceWinner");
                document.getElementById("computerDice").classList.add("diceWinner");
                document.getElementById("outcome").src = process.env.PUBLIC_URL + "/images/lost.png";
                document.getElementById("currentAmount").innerHTML = removeFunds;
                document.getElementById("userBet").value = "";
            }
        }
    }
    return (
        <div className="container">
            <img src={process.env.PUBLIC_URL + "/images/logo.png"} className="logo" />
            <div className="center">
                <p>Place your bet</p>
                <input type="number" step="100" min="0" max="1000" id="userBet" className="betInput" />
                <p>
                    Current Amount: <span id="currentAmount"></span>
                </p>
                <p id="fundsDepleted" className="center"></p>
                <button onClick={rollDice} className="btn">
                    Roll Dice
                </button>{" "}
            </div>
            <div class="row">
                <div class="column center">
                    <h1>You</h1>
                    <img id="userDice" src={process.env.PUBLIC_URL + userDice} />
                </div>

                <div class="column center">
                    <h1>Computer</h1>
                    <img id="computerDice" src={process.env.PUBLIC_URL + computerDice} />
                </div>
            </div>
            <img id="outcome" className="outcomeText" />
            <img src={giphy} className="gif center" />
            <br />
        </div>
    );
}

export default App;
