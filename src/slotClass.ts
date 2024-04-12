import configuration from "./configuration.js";
import { WinningLinesHashMap, WinningSymbols } from "./customTypes.js";

export class Slot {
    private board: number[][]; // Board with Reels and Row
    private totalWinings: number[][]; // Total winning information for all spins
    private totalWins: number; // Total win for all spins
    private winningLines: WinningLinesHashMap = {}; // Information about current spin

    private readonly _reelsCount: number;
    private readonly _rowsCount: number;
    private readonly _symbols: {[key: number]: number[]};
    private readonly _lines: [][];
    private readonly _reels: [][];

    constructor(config: any = configuration) {
        
        this.totalWinings = [];
        this.totalWins = 0;
        this._reelsCount = config.reelsCount;
        this._rowsCount = config.rowsCount;
        this._symbols = config.symbols;
        this._lines = config.lines;
        this._reels = config.reels;  

        this.board = [];
        for (let i = 0; i < this._rowsCount; i++) {
            this.board.push(new Array(this._reelsCount).fill(0));
        }
        
    }

    
    // Overloaded Function for game without bets
    public slotSpin():void;
    // Overloaded Function for game with bets
    public slotSpin(capital:number, bet:number, paylines:number[]):void| number;
    // Function for spinning the reels
    public slotSpin(capital?:number, bet?:number, paylines?:number[]):void | number{

        for(let i = 0; i < this._reels.length; i++){
            const randomIndexReel:number = Math.floor(Math.random() * this._reels[i].length);

            if(randomIndexReel == this._reels[i].length - 1){

                this.board[0][i] = this._reels[i][randomIndexReel]
                this.board[1][i] = this._reels[i][randomIndexReel - randomIndexReel];
                this.board[2][i] = this._reels[i][randomIndexReel - randomIndexReel + 1];

            }else if(randomIndexReel == this._reels[i].length - 2){

                this.board[0][i] = this._reels[i][randomIndexReel]
                this.board[1][i] = this._reels[i][randomIndexReel + 1];
                this.board[2][i] = this._reels[i][randomIndexReel - randomIndexReel];

            }else{
            
                this.board[0][i] = this._reels[i][randomIndexReel]
                this.board[1][i] = this._reels[i][randomIndexReel + 1];
                this.board[2][i] = this._reels[i][randomIndexReel + 2]; 
            } 
            
        }

        //Check if the game has a bet or not! If not it will continue with the winnings form configuration.ts. If there is a bet, it will calculate a win percentage based of configuration.ts and the bet!
        //Percentage calculation is described below on row 164, 165!

        if(capital === undefined && bet === undefined && paylines === undefined){
            this.checkLines(this.board);
        }else{
            if(capital !== undefined && bet !== undefined && paylines !== undefined)
            return this.checkLines(this.board, capital, bet, paylines);
        }
    };



    // Overloaded Function for game without bets
    public checkLines(board: number[][]):void;
    // Overloaded Function for game with bets
    public checkLines(board: number[][], capital:number, bet:number, paylines:number[]):void | number;
    // Function for checking winning lines
    public checkLines(board: number[][], capital?:number, bet?:number, paylines?:number[]):void | number {

        //Check if the game has a bet or not!
        if(capital === undefined && bet === undefined && paylines === undefined){
            
            this.winningLines = {}
            let winningLineIndex: number = 1;

            this._lines.forEach(line => {

                let winningLineSymbols:number[] = [];

                for (let i = 0; i < line.length; i++){ 
                    if(winningLineSymbols.length === 0){

                        winningLineSymbols.push(board[line[i]][i])

                    }else if(winningLineSymbols[winningLineSymbols.length - 1] === board[line[i]][i]){

                        winningLineSymbols.push(board[line[i]][i]);

                    }else{

                        winningLineSymbols.splice(0, winningLineSymbols.length)
                        winningLineSymbols.push(board[line[i]][i]);

                    }
                }
                
                if(winningLineSymbols.length >= 3){
                    //Save information for Total winnins
                    this.totalWinings.push([winningLineIndex, winningLineSymbols[0], winningLineSymbols.length,  this._symbols[winningLineSymbols[0]][winningLineSymbols.length - 1]]);
                    this.totalWins += this._symbols[winningLineSymbols[0]][winningLineSymbols.length - 1]
                    
                    //Save information for current winnings
                    let winningLine: WinningSymbols = [winningLineSymbols[0], winningLineSymbols.length]
                    this.winningLines[winningLineIndex] = winningLine;
                }

                winningLineIndex++;

            })

        }else{
            
            if(capital !== undefined && bet !== undefined && paylines !== undefined){
                
                //Aditional variable when the game has a bet!
                let winCurrentSpin:number = 0;
                let totalWinCurrentSpin:number = 0;
                let  betPerLine:number = bet / paylines.length;

                this.winningLines = {}
                let winningLineIndex: number = 1;
    
                this._lines.forEach(line => {

                    if(paylines.lastIndexOf(winningLineIndex) !== -1){    
    
                        let winningLineSymbols:number[] = [];
        
                        for (let i = 0; i < line.length; i++){ 
                            if(winningLineSymbols.length === 0){
        
                                winningLineSymbols.push(board[line[i]][i])
        
                            }else if(winningLineSymbols[winningLineSymbols.length - 1] === board[line[i]][i]){
        
                                winningLineSymbols.push(board[line[i]][i]);
        
                            }else if(winningLineSymbols.length >= 3 && winningLineSymbols[winningLineSymbols.length - 1] !== board[line[i]][i]){
                                break;
                            }else if(winningLineSymbols.length < 3 && winningLineSymbols[winningLineSymbols.length - 1] !== board[line[i]][i]){
        
                                winningLineSymbols.splice(0, winningLineSymbols.length)
                                winningLineSymbols.push(board[line[i]][i]);
        
                            }
                        }
                        
                        if(winningLineSymbols.length >= 3){
                            //  Percentage calculation = (1 + (Winning value from configuration.ts / 100)) * betPerLine
                            //  betPerLine = bet / paylines;

                            //  Save information for Total winnins
                            winCurrentSpin = (1 + this._symbols[winningLineSymbols[0]][winningLineSymbols.length - 1] / 100) * betPerLine;
                            totalWinCurrentSpin += winCurrentSpin;

                            this.totalWinings.push([winningLineIndex, winningLineSymbols[0], winningLineSymbols.length,  winCurrentSpin]);
                            this.totalWins += winCurrentSpin;
                            
                            //Save information for current winnings
                            let winningLine: WinningSymbols = [winningLineSymbols[0], winningLineSymbols.length]
                            this.winningLines[winningLineIndex] = winningLine;
                        }
                    
                    }

                    winningLineIndex++;
    
                })
               
                return capital + totalWinCurrentSpin;

            }

        }


    }



    // Function for displaying the board
    public displayBoard(){

        //Displays the board
        this.board.forEach(row => {
            console.log(row.join(" | "));
        });

        //Chech if "checkLines()" found wins, and display information about the current winning board
        if(Object.keys(this.winningLines).length !== 0){

            console.log("\n");
            
            let currentWin: number = 0;
            for (const key in this.winningLines) {
                if (Object.prototype.hasOwnProperty.call(this.winningLines, key)) {
                    const element = this.winningLines[key];
                    
                    console.log("Winning line: " + key + "| Winning symbol: " + element[0] + "| Number of winning symbols: " + element[1] + "| Win: " + this._symbols[element[0]][element[1] - 1]);
                    
                    currentWin += this._symbols[element[0]][element[1] - 1];
                }
            }
            
            console.log("\nTotal win from this board: " + currentWin);
        }

        console.log("_________________\n")
            
    };



    // Overloaded Function for game without bets
    public spin(counter:number):void;
    // Overloaded Function for game with bets
    public spin(counter:number, capital: number, bet: number, paylines: number[]): void;
    // Main Spin function
    public spin(counter: number, capital?: number, bet?:number, paylines?:number[]):void{

        //Check if there is enough capital for the bet
        if(capital !== undefined && bet !== undefined && capital < bet){
            console.log("Capital isn't enought! Change the bet, or change to more capital");
            return 
        }

        //Check if the game has a bet or not!
        if (capital === undefined && bet === undefined && paylines === undefined) {

            const startTime = performance.now();
            while(counter > 0) {
                this.slotSpin();
                this.displayBoard();
                counter--;
            }
            const endTime = performance.now();
            const elapsedTime = endTime - startTime;

            
            console.log("Total win:" + this.totalWins);
            console.log("Execution time: " + elapsedTime + " ms.\n");

        }else{

            const startTime = performance.now();
            while(counter > 0) {

                let winOrNot: number | void;
                if(capital !== undefined && bet !== undefined && paylines !== undefined){

                    if(capital < bet){
                        break;
                    }

                    winOrNot = this.slotSpin(capital, bet, paylines);
                    if(typeof winOrNot === 'number'){
                        capital = winOrNot;
                    }
                    this.displayBoard();

                }
                counter--;
            }
            const endTime = performance.now();
            const elapsedTime = endTime - startTime;

            
            console.log("Total win:" + this.totalWins);
            console.log("Capital - All bets + Total win: " + capital);
            console.log("Execution time: " + elapsedTime + " ms.\n");

        }

    }

}
