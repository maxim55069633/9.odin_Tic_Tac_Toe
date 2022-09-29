

const gameboard = (()=>{
    //encapulate all the related properties and methods to the gameboard object

    let _level= 3; //the Default level is 3


    const board_record = Array.from({length: _level * _level}).fill("null");
    //null represents that this cell hasn't been occupied by Player A or Player B.

    const create_board = (n) =>{

        const board_div=document.querySelector(".gameboard");
        for(let i=0; i<n; i++)
        {
            const row_div=document.createElement("div");
            row_div.classList.add("row");

            for(let j=0; j<n; j++)
            {
                const unit_div=document.createElement("div");
                unit_div.classList.add("unit");
                row_div.appendChild(unit_div);
            }

            board_div.appendChild(row_div);
        }

        _level=n;
    }

    const get_level =()=> {return _level};

    return { board_record, create_board, get_level};
} )();

gameboard.create_board(3);


const player =(player_icon)=>{
    let _player_level=gameboard.get_level();
    const player_record = Array.from({length:_player_level * _player_level }).fill("null");

    return {player_record, player_icon};
}
const player_A=player("X");
const player_B=player("O");