import React, { useState } from "react";
import axios from "axios";
import "./App.css";

require("dotenv").config();

function App() {
    const [userDice, setUserDice] = useState([]);
    const [computerDice, setComputerDice] = useState([]);
    const [giphy, setGiphy] = useState([]);

    window.onload = function () {
        var fund = 1000;
        document.getElementById("currentAmount").innerHTML = fund;
    };

    function rollDice() {
        const api_key = process.env.REACT_APP_API_KEY;

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
            document.getElementById("fundsDepleted").innerHTML = "It looks like you're out of money. Go do something else.";
        } else if (bet > currentFunds) {
            alert("You can't bet more than you have.");
        } else {
            setUserDice("/images/dice/dice_" + UserScore + ".png");
            setComputerDice("/images/dice/dice_" + ComputerScore + ".png");
            if (UserScore > ComputerScore) {
                axios.get("https://api.giphy.com/v1/gifs/random?api_key=" + api_key + "&tag=winner&rating=g").then((res) => {
                    setGiphy(res.data.data.images.downsized_large.url);
                });
                document.getElementById("outcome").innerHTML = "You Won :)";
                document.getElementById("currentAmount").innerHTML = addFunds;
                document.getElementById("userBet").value = "";
            } else if (UserScore === ComputerScore) {
                document.getElementById("outcome").innerHTML = "It's a Tie!";
                document.getElementById("userBet").value = "";
                axios.get("https://api.giphy.com/v1/gifs/random?api_key=" + api_key + "&tag=tie+score&rating=g").then((res) => {
                    setGiphy(res.data.data.images.downsized_large.url);
                });
            } else {
                axios.get("https://api.giphy.com/v1/gifs/random?api_key=" + api_key + "&tag=loser&rating=g").then((res) => {
                    setGiphy(res.data.data.images.downsized_large.url);
                });
                document.getElementById("outcome").innerHTML = "You Lost :(";
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
                    <h2>You</h2>
                    <img id="userDice" src={process.env.PUBLIC_URL + userDice} />
                </div>

                <div class="column center">
                    <h2>Computer</h2>
                    <img id="computerDice" src={process.env.PUBLIC_URL + computerDice} />
                </div>
            </div>
            <p id="outcome" className="center"></p>
            <img src={giphy} className="gif center" />
            <br />
        </div>
    );
}

export default App;
