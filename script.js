

const gameboard = (()=>{
    //encapulate all the related properties and methods to the gameboard object

    let _level= 3; //the Default level is 3


    const board_record = Array.from({length: _level * _level}).fill("");
    // represents that this cell hasn't been occupied by Player A or Player B.

    const create_board = (n) =>{

        _level=n;

        const board_div=document.querySelector(".gameboard");
        for(let i=0; i<n; i++)
        {
            const row_div=document.createElement("div");
            row_div.classList.add("row");

            for(let j=0; j<n; j++)
            {
                const unit_div=document.createElement("div");
                unit_div.classList.add("unit");
                unit_div.setAttribute("id",i*_level+j);
                row_div.appendChild(unit_div);
            }

            board_div.appendChild(row_div);
        }


    }

    const display_record= ()=>{
        for(let i=0;i<_level;i++)
        {
            for(let j=0;j<_level;j++){
                const unit_to_be_modified=document.getElementById(i*_level+j);

                unit_to_be_modified.textContent=board_record[i*_level+j];
            }
        }
    }

    const get_level =()=> {return _level};

    return { board_record, create_board, get_level, display_record};
} )();




const player =(player_icon)=>{
    let player_level=gameboard.get_level();
    const player_record = Array.from({length:player_level * player_level }).fill("");

    return {player_record, player_icon,player_level};
}

const game_controller = (

    () => {

        let _move_count=0;

        const _players=[player("X"), player("O")];

        const _end_game=(winner_player, winner_line)=>{

            const winner_prompt=document.querySelector(".prompt_line");

            if(winner_line!==null)
            { // it's not a tie
                for(let i=0; i<winner_player.player_level; i++)
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

        const _is_winner=(player)=>{

            let _winner_sum=0;
            // check each row
            for( let i=0; i<player.player_level; i++)
            {
                let winner_line =Array.from({length: player.player_level}).fill(0);
                _winner_sum=0;

                for(let j=0; j<player.player_level; j++)
                {
                    if (player.player_record[i*player.player_level+j] === player.player_icon)
                    {
                        _winner_sum += 1;
                        winner_line[j]=i*player.player_level+j;
                    }
                }

                if (_winner_sum === player.player_level)
                    {
                        _end_game(player, winner_line);
                        return;
                    }
            }

            // check each columner
            for( let i=0; i<player.player_level;i++)
            {
                let winner_line =Array.from({length: player.player_level}).fill(0);
                _winner_sum=0;

                for(let j=0; j<player.player_level; j++)
                {
                    if(player.player_record[player.player_level*j+i] === player.player_icon )
                    {
                        _winner_sum += 1;
                        winner_line[j]=player.player_level*j+i;
                    }
                }
                if (_winner_sum === player.player_level)
                {
                    _end_game(player, winner_line);
                    return;
                }
            }

            // check two diagonals
            let winner_line =Array.from({length: player.player_level}).fill(0);
            _winner_sum=0
            for(let i=0; i<player.player_level; i++)
            {
                if(player.player_record[player.player_level*i+i] ===player.player_icon)
                    {
                        _winner_sum +=1;
                        winner_line[i]=player.player_level*i+i;
                    }
            }

            if (_winner_sum === player.player_level)
            {
                _end_game(player, winner_line);
                return;
            }

            winner_line =Array.from({length: player.player_level}).fill(0);
            _winner_sum=0;
            for(let i=0; i<player.player_level; i++)
            {
                if(player.player_record[(player.player_level-1)*(i+1)] === player.player_icon)
                    {
                        _winner_sum +=1;
                        winner_line[i]=(player.player_level-1)*(i+1);
                    }
            }
            if (_winner_sum === player.player_level)
            {
                _end_game(player, winner_line);
                return;
            }

            // Is it a Tie?
            // const is_there_a_winner=document.querySelector(".gameover");
            if (_winner_sum !== player.player_level 
                && 
                gameboard.board_record.filter(
                    (item)=>{ if (item === "") return true; else return false; }
                ).length === 0 
                // &&
                // is_there_a_winner === null
                // the length of the gameboard record equals 0, indicating that all the cells are marked. It's a tie
            ){
                _end_game(player,null);
                return;
            }

        }

        const _choose_player=(event)=>{
            
            const unit_to_be_modified = event.target;
            const is_there_a_winner=document.querySelector(".gameover");
            // If there is a winner, no need to take more action
            if ( gameboard.board_record[unit_to_be_modified.id] === "" && is_there_a_winner === null)
            {
                const current_player = _players[_move_count%2] ;
                
                gameboard.board_record[unit_to_be_modified.id]=current_player.player_icon;
                _players[_move_count%2].player_record[unit_to_be_modified.id]=current_player.player_icon;
                gameboard.display_record(); 
                
                _is_winner(current_player);

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

        const restart=()=>{
            const restart_button=document.querySelector(".new_game");
            restart_button.addEventListener('click',
            ()=>{location.reload(); return false;}
            );
        }

        return {start_control,restart};

    }
)();

gameboard.create_board(3);
game_controller.start_control();
game_controller.restart();

