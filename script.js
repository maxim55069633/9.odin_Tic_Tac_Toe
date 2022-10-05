

const gameboard = (()=>{
    //encapulate all the related properties and methods to the gameboard object

    let board_record = Array.from({length: 3 * 3}).fill("");
    // represents that this cell hasn't been occupied by Player A or Player B.

    const board_record_reset =() =>{
    // This reset is for AI game
        for(let i=0; i<3 ; i++)
        {
            for(let j=0; j<3; j++)
            {
                board_record[i*3+j]="";
            }
        }

        const units=document.querySelectorAll(".unit");
        units.forEach(item => item.classList.remove("gameover","winner_background"));

        const new_prompt=document.querySelector(".prompt_line");
        new_prompt.classList.remove("winner_background","tie");
        new_prompt.textContent="Next player should be: O (Human)";

    }


    const create_board = () =>{

    

        const board_div=document.querySelector(".gameboard");
        for(let i=0; i<3; i++)
        {
            const row_div=document.createElement("div");
            row_div.classList.add("row");

            for(let j=0; j<3; j++)
            {
                const unit_div=document.createElement("div");
                unit_div.classList.add("unit");
                unit_div.setAttribute("id",i*3+j);
                row_div.appendChild(unit_div);
            }

            board_div.appendChild(row_div);
        }


    }

    const display_record= ()=>{
        for(let i=0;i<3;i++)
        {
            for(let j=0;j<3;j++){
                const unit_to_be_modified=document.getElementById(i*3+j);

                unit_to_be_modified.textContent=board_record[i*3+j];
            }
        }
    }


    return { board_record, create_board, display_record, board_record_reset};
} )();




const player =(player_icon)=>{
    const player_record = Array.from({length:9 }).fill("");

    const player_reset =() =>{
        // This reset is for AI game
                for(let i=0; i<3 ; i++)
                {
                    for(let j=0; j<3; j++)
                    {
                        player_record[i*3+j]="";
                    }
                }
            }

    return {player_record, player_icon, player_reset};
}


const game_controller = (

    () => {


        const _players=[player("X"), player("O")];

        const _end_game=(winner_player, winner_line)=>{

            const winner_prompt=document.querySelector(".prompt_line");

            if(winner_line !== null )
            { // it's not a tie
                for(let i=0; i< 3; i++)
                {
                    const unit_to_be_modified=document.getElementById(winner_line[i]);
                    unit_to_be_modified.classList.add("gameover","winner_background");
                }
                
                winner_prompt.classList.add("winner_background");
                winner_prompt.textContent="Winner is player: " + winner_player.player_icon;
            } else {
                // it's a tie
                winner_prompt.classList.add("tie");
                winner_prompt.textContent=`IT"S A TIE!`;
            }
        }

        const _outcome=(player)=>{

            let _winner_sum=0;
            // check each row
            for( let i=0; i< 3; i++)
            {
                let winner_line =Array.from({length: 3}).fill(0);
                _winner_sum=0;

                for(let j=0; j<3; j++)
                {
                    if (player.player_record[i*3+j] === player.player_icon)
                    {
                        _winner_sum += 1;
                        winner_line[j]=i*3+j;
                    }
                }
            

                if (_winner_sum === 3)
                    {
                        _end_game(player, winner_line);
                        return true;
                    }
            

            }

            // check each columner
            for( let i=0; i<3;i++)
            {
                let winner_line =Array.from({length: 3}).fill(0);
                _winner_sum=0;

                for(let j=0; j<3; j++)
                {
                    if(player.player_record[3*j+i] === player.player_icon )
                    {
                        _winner_sum += 1;
                        winner_line[j]=3*j+i;
                    }
                }
                if (_winner_sum === 3)
                {
                    _end_game(player, winner_line);
                    return true;
                }
            }

            // check two diagonals
            let winner_line =Array.from({length: 3}).fill(0);
            _winner_sum=0
            for(let i=0; i<3; i++)
            {
                if(player.player_record[3*i+i] ===player.player_icon)
                    {
                        _winner_sum +=1;
                        winner_line[i]=3*i+i;
                    }
            }

            if (_winner_sum === 3)
            {
                _end_game(player, winner_line);
                return true;
            }

            winner_line =Array.from({length: 3}).fill(0);
            _winner_sum=0;
            for(let i=0; i<3; i++)
            {
                if(player.player_record[(3-1)*(i+1)] === player.player_icon)
                    {
                        _winner_sum +=1;
                        winner_line[i]=(3-1)*(i+1);
                    }
            }
            if (_winner_sum === 3)
            {
                _end_game(player, winner_line);
                return true;
            }

            if (_winner_sum !== 3 
                && 
                // How to make use of array filter?
                gameboard.board_record.filter(
                    (item)=>{ if (item === "") return true; else return false; }
                ).length === 0 
            ){
                _end_game(null,null);
                return true;
                //there isn't a winner, but the game ends
            }

            return false; 
        }

        const _choose_player=(event)=>{

            let _move_count = gameboard.board_record.filter(
                (item)=>{ if (item !== "") return true; else return false; }
            ).length; 
            
            const unit_to_be_modified = event.target;
            const is_there_a_winner=document.querySelector(".gameover");
            // If there is a winner, no need to take more action
            if ( gameboard.board_record[unit_to_be_modified.id] === "" && is_there_a_winner === null)
            {
                const current_player = _players[_move_count%2] ;
                
                gameboard.board_record[unit_to_be_modified.id]=current_player.player_icon;
                _players[_move_count%2].player_record[unit_to_be_modified.id]=current_player.player_icon;
                gameboard.display_record(); 

                _outcome(current_player);

                _move_count++;

                const next_player=document.querySelector(".next_player");
                if (next_player !== null)
                    next_player.textContent=_players[_move_count%2].player_icon;
            }     

        }

        const start_control=()=>{
            const click_listener=document.querySelectorAll(".unit");
            click_listener.forEach( item =>item.addEventListener('click', _choose_player) );
        };


        // How to reload a page?
        const restart=()=>{
            const restart_button=document.querySelector(".new_game");
            restart_button.addEventListener('click',
            ()=>{location.reload(); return false;}
            );
        }

        // Unbeatable AI

        // Understand I should duplicate an array when it works as an argument to be passed to a function.
        const duplicate_record = (current_record)=>{

            let test_record = Array.from({length: 3 * 3}).fill("");
    
            for(let i=0; i<3 ; i++)
            {
                for(let j=0; j<3; j++)
                {
                   test_record[i*3+j] = current_record[i*3+j];
                }
            }
            return test_record;
        }

        const _AI_winner_value=(current_record, current_player)=>{
           
            let _winner_sum=0;
            // check each row
            for( let i=0; i<3; i++)
            {
                let winner_line =Array.from({length: 3}).fill(0);
                _winner_sum=0;

                for(let j=0; j<3; j++)
                {
                    if (current_record[i*3+j] === current_player.player_icon)
                    {
                        _winner_sum += 1;
                        winner_line[j]=i*3+j;
                    }
                }
            

                if (_winner_sum === 3)
                    {
                        if (current_player.player_icon === "X")
                            return 1;
                        else 
                            return -1;
                    }
            

            }

            // check each columner
            for( let i=0; i<3;i++)
            {
                let winner_line =Array.from({length: 3}).fill(0);
                _winner_sum=0;

                for(let j=0; j<3; j++)
                {
                    if(current_record[ 3*j+i ] === current_player.player_icon )
                    {
                        _winner_sum += 1;
                        winner_line[j]=3*j+i;
                    }
                }
                if (_winner_sum === 3)
                {
                    if (current_player.player_icon === "X")
                        return 1;
                    else 
                        return -1;
                }
            }

            // check two diagonals
            {
                let winner_line =Array.from({length: 3}).fill(0);
                _winner_sum=0
                for(let i=0; i<3; i++)
                {
                    if(current_record[3*i+i] ===current_player.player_icon)
                        {
                            _winner_sum +=1;
                            winner_line[i]=3*i+i;
                        }
                }
                if (_winner_sum === 3)
                {
                    if (current_player.player_icon === "X")
                        return 1;
                    else 
                        return -1;
                }
            }

            {
                let winner_line =Array.from({length: 3}).fill(0);
                _winner_sum=0;
                for(let i=0; i<3; i++)
                {
                    if(current_record[(3-1)*(i+1)] === current_player.player_icon)
                        {
                            _winner_sum +=1;
                            winner_line[i]=(3-1)*(i+1);
                        }
                }
                if (_winner_sum === 3)
                {
                    if (current_player.player_icon === "X")
                        return 1;
                    else 
                        return -1;
                }
            }

            // Is it a Tie?
            if (_winner_sum !== 3 
                && 
                current_record.filter(
                    (item)=>{ if (item === "") return true; else return false; }
                ).length === 0 
            ){
                return 0;
                //there isn't a winner, but the game ends
            }

        }

        const _minimax_value = (current_record, move_index) => {
            const moves_taken = current_record.filter(
                (item)=>{ if (item !== "") return true; else return false; }
            ).length;
            const current_player = _players[moves_taken %2 ] ;

        // verify the assumption by marking one more new cell
            current_record[move_index] = current_player.player_icon;
            
            if ( _AI_winner_value(duplicate_record(current_record), current_player) == 1 )
                {return 10; }
            else if (_AI_winner_value(duplicate_record(current_record), current_player) == 0 )
                { return 0; }
            else if (_AI_winner_value(duplicate_record(current_record), current_player) == -1)
                {return -10; };
                 
            if (current_player.player_icon === "X")
            {
             // the next player should be "O", because player X has already taken a move.
                
                let empty_cell_index=[]
                // collect the empty cells
                const empty_cells = current_record.filter( (item, index)=>{ 
                    if( item === "" )
                    {
                        empty_cell_index.push(index);
                        return true;
                    } else {
                        return false;
                    }
                    } )
                // build a object to collect minimax value
                let collect_of_minimax_value = {};

                empty_cell_index.forEach(item => {
                // calculate the minimax_value for each cells
                // The value of item is the possible move for the current player
                    collect_of_minimax_value[item]= _minimax_value( duplicate_record(current_record), item);
                // We can infer the current player according to the condition of borad_record
                } )

                // choose the move with the smallest minimax_value, player "O" needs to prevent the victory of player "X"
                {
                    let smallest_minimax_value = 2022;
                    for (let item in collect_of_minimax_value)
                    {
                        if (collect_of_minimax_value[item] <= smallest_minimax_value)
                        {
                            smallest_minimax_value = collect_of_minimax_value[item];
                            
                        }
                    }


                    return smallest_minimax_value;
                }

            } else {
                // if the next player is X, we need to find a maximal minimax_value
                let empty_cell_index=[]
                // collect the empty cells
                const empty_cells = current_record.filter( (item, index)=>{ 
                    if( item === "" )
                    {
                        empty_cell_index.push(index);
                        return true;
                    } else {
                        return false;
                    }
                    } )
                // build a object to collect minimax value
                let collect_of_minimax_value = {};

                empty_cell_index.forEach(item => {
                // calculate the minimax_value for each cells
                // The value of item is the possible move for the current player
                    collect_of_minimax_value[item]=_minimax_value( duplicate_record(current_record), item);
                } )

                // choose the move with the biggest minimax_value, so the player "X" has the biggest possibility to win the game
                {
                    let biggest_minimax_value = -2022;
                    for (let item in collect_of_minimax_value)
                    {
                        if (collect_of_minimax_value[item] >= biggest_minimax_value)
                        {
                            biggest_minimax_value = collect_of_minimax_value[item];
                        }
                    }

                    return biggest_minimax_value;
                }
            }
        }

        const _new_round_vs_AI=(event)=>{

            // human's move
            const player_move = event.target;
            if( gameboard.board_record[player_move.id] === "" )
            {
                gameboard.board_record[player_move.id]="O";
                _players[1].player_record[player_move.id] = "O";   
            } else {
                return;
            }

            gameboard.display_record();

            
            //check if there is a winner?
            if (_outcome(_players[1]))
            {
                gameboard.display_record();
                return;
            }   

            // computer's move
            let empty_cell_index=[]
            // collect the empty cells
            const empty_cells = gameboard.board_record.filter( (item, index)=>{ 
                if( item === "" )
                {
                    empty_cell_index.push(index);
                    return true;
                } else {
                    return false;
                }
                } )

            // build a object to collect minimax value
            let collect_of_minimax_value = {};

            empty_cell_index.forEach(item => {
            // calculate the minimax_value for each cells
            // The value of item is the possible move for the current player
                collect_of_minimax_value[item]=_minimax_value(duplicate_record(gameboard.board_record), item);
            } )


            // choose the move with the highest minimax_value
            let biggest_minimax_value = -2022;
            let target_move = 0;
            for (let item in collect_of_minimax_value)
            {
                if (collect_of_minimax_value[item] >= biggest_minimax_value)
                {
                    target_move=item;
                    biggest_minimax_value = collect_of_minimax_value[item];
                }
            }


            gameboard.board_record[target_move]="X";
            _players[0].player_record[target_move] = "X";   

            gameboard.display_record();

            //check if there is a winner?
            if (_outcome(_players[0]))
            {
                gameboard.display_record();
                return ; 
            }

        }

        const _new_AI_game=()=>{

            const intro=document.querySelector(".introduction");
            intro.textContent="The opening move is Computer as Player X. And then human (Player O) and computer (Player X) play their moves alternatively."
            const another_prompt= document.createElement("span");
            another_prompt.textContent="You may need to wait a few seconds for the AI to calculate next move.";
            another_prompt.classList.add("bold");
            intro.appendChild(another_prompt);
      
            // reset the gamerecord and gameboard
            gameboard.board_record_reset();


            _players[0].player_reset();
            _players[1].player_reset();

        // fill a random cell with "X"
            const AI_first_move_index= Math.floor(Math.random()*9);
            gameboard.board_record[ AI_first_move_index ] ="X";
            _players[0].player_record[AI_first_move_index] = "X";
            gameboard.display_record();

            const click_listener=document.querySelectorAll(".unit");
            click_listener.forEach( item =>item.removeEventListener('click', _choose_player) );
            click_listener.forEach( item => item.addEventListener("click", _new_round_vs_AI));

        }


        const start_a_game_with_AI = ()=>{

            const play_with_AI_button =document.querySelector(".unbeatable_ai");
            play_with_AI_button.addEventListener("click", _new_AI_game);
        }

        return {start_control,restart, start_a_game_with_AI};

    }
)();

gameboard.create_board();
game_controller.start_control();
game_controller.restart();
game_controller.start_a_game_with_AI();

