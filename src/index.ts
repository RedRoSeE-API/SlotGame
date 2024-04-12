import {Slot} from "./slotClass.js";

let slotGame: Slot = new Slot;

// Tested with up to 10 000 000 spins without bets. On MacBook Pro 14, Chip: Apple M1 Pro, approximate execution time is 155.83 seconds.
// Tested with up to 10 000 000 spins with bets. On MacBook Pro 14, Chip: Apple M1 Pro, approximate execution time is 186.67 seconds.

// Paylines:
//      Payline 1        |       Payline 2       |       Payline 3        |       Payline 4        |        Payline 5        
//   1 | 1 | 1 | 1 | 1   |   - | - | - | - | -   |   - | - | - | - | -    |   4 | - | 4 | - | 4    |   - | - | - | - | -    
//   - | - | - | - | -   |   2 | 2 | 2 | 2 | 2   |   - | - | - | - | -    |   - | 4 | - | 4 | -    |   5 | - | 5 | - | 5    
//   - | - | - | - | -   |   - | - | - | - | -   |   3 | 3 | 3 | 3 | 3    |   - | - | - | - | -    |   - | 5 | - | 5 | -    
//                       |                       |                        |                        |
 
// slotGame.spin(<NumberOfSpins>, <Capital>, <Bet>, <[Playlines]>);
// Example for game without bets: slotGame.spin(10);
// Example for game with bets: slotGame.spin(100, 500, 5, [1, 3, 5]);

slotGame.spin(10, 1000, 5, [1,2,3,4,5]);


