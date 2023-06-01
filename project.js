// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin slots
// 5. Check if winner
// 6. Allocate money
// 7. Play again? Out of money?

const prompt = require("prompt-sync")();

const ROWS = 5;
const COLS = 3;


const SYMBOLS_COUNT = {
    "A": 1,
    "B": 3,
    "C": 6,
};


const SYMBOLS_COST = {
    "A": 20,
    "B": 8,
    "C": 4,
};


const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit, try again.");
        }
        else {
            return numberDepositAmount;
        }
    }
};


const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("How many lines do you want to bet on? ( 1 / ... / " + ROWS.toString() + " ): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > ROWS) {
            console.log("Invalid number, try again.");
        }
        else {
            return numberOfLines;
        }
    }
};


const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Your balance is $" + balance + ". Please enter your bet amount per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet < 0 || numberBet > balance / lines) {
            console.log("Invalid number, try again.");
        }
        else {
            return numberBet;
        }
    }
};


const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = []
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};


const transpose = (reels) => {
    const reelsRows = [];
    for (let i = 0; i < ROWS; i++) {
        reelsRows.push([]);
        for (let j = 0; j < COLS; j++) {
            reelsRows[i].push(reels[j][i]);
        }
    }
    return reelsRows;

};


const printRows = (reelsRows) => {
    for (const row of reelsRows) {
        let rowString = "";
        for (const [j, symbol] of row.entries()) {
            rowString += symbol;
            if (j != COLS - 1) {
                rowString += "   |   ";
            }
        }
        console.log(rowString);
    }
};


const getWinnings = (reelsRows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = reelsRows[row];
        let winner = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                winner = false;
                break;
            }
        }
        console.log("This is the winner: " + winner.toString());


        if (winner) {
            winnings += (bet * SYMBOLS_COST[symbols[0]]);
            console.log("This is the symbol cost: " + SYMBOLS_COST[symbols[0]].toString());
            console.log("This is the winnings: " + winnings.toString());
        }
        else if (row == lines - 1 && winnings == 0){
            winnings -= bet;
        }
    }
    return winnings;
};


const printWinner = (winnings) => {
    if (winnings > 0) {
        console.log("-------- YOU WON! --------");
        console.log("You won $" + winnings.toString() + "!");
    }
    else {
        console.log("-------- YOU LOST --------");
        console.log("You lost $" + (winnings * -1).toString() + " :( ");
    }
}


const checkPlayAgain = () => {
    let again = prompt("Enter 'y' to play again: ");
    if (again == 'y') {
        return true;
    }
    return false;
}


const refundBalance = (balance) => {
    let fund = prompt("Balance: $0  |  Would you like to deposit more? (y / n): ")
    if (fund == 'y') {
        return true;
    }
    return false;
}


const playSlots = () => {
    let again = true;
    let balance = deposit();

    while (again) {
        const lines = getNumberOfLines();
        let bet = getBet(balance, lines) * lines;
        console.log("Your total bet amount is: $" + bet.toString());

        const reels = spin();
        const reelsRows = transpose(reels);
        printRows(reelsRows);

        const winnings = getWinnings(reelsRows, bet, lines);
        printWinner(winnings);
        balance += winnings;

        if (balance > 0) {
            again = checkPlayAgain();
        }
        else {
            refunding = refundBalance(balance);
            if (refunding) {
                balance = deposit();
            }
            else {
                again = false;
            }
        }
    }
    console.log("Thank you for playing!");
};


playSlots();



