pragma solidity ^0.4.24;

contract Quiz
{
    address public quiz_master; // adress of the quizmaster i.e the host of the game
    Player[] private players; //will store a list of all the players registered for the game
    uint public regpfee; // stores the participation fees of each player
    uint tfee; // total fees of the game
    uint public tplayers = 0;
    uint public curr_len = 0;
    mapping(address => bool) public isWinner;   // balances, indexed by addresses
    bool registrationDone;
        constructor (uint num_players, uint registrationFee) public  payable//quiz master will dictate # of players and pfee
        {
            quiz_master = msg.sender;// store the address of the quiz_master
            regpfee = registrationFee;
            tfee = regpfee * num_players;
            tplayers = num_players;
        }
    struct Question_Paper
    {
        uint256 correct_ans_1;
        uint256 correct_ans_2;
        uint256 correct_ans_3;
        uint256 correct_ans_4;
    }
    
    struct Player
    {
        address account; // stores his adress
        uint256[4] ans_arr; // stores his 4 answers
        uint256 time_stamp ; // stores the block number
    }
    

    
    function registerplayers(uint256[4] ans_arr) public payable returns (uint)// function to register the players
    {
        require(msg.sender != quiz_master, "Quiz master can't play the game");
        require(msg.value == regpfee, "Unacceptable Registration Fee"); // the value must be greater than the pfee
        // quiz_master.transfer(regpfee);
        for(uint i = 0;i<4;i++)
        {
            uint temp_ans = ans_arr[i];
            require (temp_ans==1 || temp_ans==2 || temp_ans==3 || temp_ans==4 || temp_ans==0 , "Answer must be in {1,2,3,4} [0 for unknown]");         
        }
        players.push(Player(msg.sender, ans_arr, block.number)); // push that player and his 4 choices in the player array
        curr_len = players.length;
        return curr_len;
    }
    
    
    // function regpfee(uint256 _pfee) public
    // {
    //     pfee = _pfee;
    // }

    function getnumplayers() public returns(uint)
    {
        return players.length;
    }
    
    function getplayers() external view returns(address[]) //displays all registered players so far
    {
        address[] memory ids = new address[](players.length);
        uint counter = 0;
        for(uint i = 0; i < players.length; i++)
        {
            ids[counter] = players[i].account;
            counter++;
        }
        return ids;
    }
    

    modifier restricted()
    {
        // Ensure the participant awarding the ether is the manager
        require(msg.sender == quiz_master,"Only quiz master is allowed to perform this operation");
        _;
    }
    function registrationComplete() restricted
    {
        require(address(this).balance==tfee,"tFee not equal to contractBalance");
        registrationDone = true;
    }
    function random() private view returns (uint)
    {
        return uint(keccak256(block.difficulty, now, players.length));
    }
    
    function pickWinner(uint256[4]ans) public restricted payable
    {
        
        Question_Paper storage question; // Question paper declared
        question.correct_ans_1 = ans[0]; // correct ans decided by quiz_master as this is a restricted function
        question.correct_ans_2 = ans[1];
        question.correct_ans_3 = ans[2];
        question.correct_ans_4 = ans[3];
        Player[][4] q_correct_ans; // stores the ans for all the players in all the questions
        for(uint i = 0;i < players.length; i++)
        {
            if(players[i].ans_arr[0] == question.correct_ans_1)
            {
                q_correct_ans[0].push(players[i]); // getting possible winnners of q1 based on ans
            }
            if(players[i].ans_arr[1] == question.correct_ans_2)
            {
                q_correct_ans[1].push(players[i]); // getting possible winners of q2 based on ans
            }
            if(players[i].ans_arr[2] == question.correct_ans_3)
            {
                q_correct_ans[2].push(players[i]); // getting possible winners of q3 based on ans
            }
            if(players[i].ans_arr[3] == question.correct_ans_4)
            {
                q_correct_ans[3].push(players[i]); // getting possible winners of q4 based on ans
            }
            
            for(uint j = 0; j < 4; j++) // For each question
            {
                address round_winner;
                uint256 round_stamp;
                round_winner = q_correct_ans[j][0].account; // stores that question's winner's address
                round_stamp = q_correct_ans[j][0].time_stamp; // stores that question's winning time stamp
                for(uint k = 0; k < q_correct_ans[j].length; k++) // For Each Player
                {
                    if(round_stamp < q_correct_ans[j][k].time_stamp) // If time stamp is greater then replace winner
                    {
                        round_stamp = q_correct_ans[j][k].time_stamp;
                        round_winner = q_correct_ans[j][k].account;
                    }
                }
                // require(calcul(3,16,4)*tfee>0,"Non Zero Reward");
                // round_winner.transfer(calcul(3,16,4)*tfee); // Need to send this amount to the account, But some error in Remix Right Now
                // round_winner.transfer(20*10**18);
                isWinner[round_winner]=true;
            }
        }

        // return round_winner;
    }
    
    function calcul(uint a, uint b, uint precision) view returns ( uint) { // just a multiplier with specified precision

     return a*(10**precision)/b;
    }
    
    function masterClaim () restricted 
    {

        require (address(this).balance==calcul(1,4,4)*tfee,"Contract balance more than 1/4 of tFee");
        quiz_master.transfer(address(this).balance);
        
    }
    
    function claim() public returns (uint)
    {
        // require(amount <= balanceOf[msg.sender]);
        require(isWinner[msg.sender],"Only winners can claim");
        uint amount = calcul(3,16,4)*tfee;
        uint prevBal = msg.sender.balance;
        msg.sender.transfer(amount);
        require(prevBal+amount==msg.sender.balance,"Not Received by Winner");
        return amount;
    }
}

//msg.sender.transfer(amount);