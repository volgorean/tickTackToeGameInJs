var Player = {
  players: [],
  create: function(playerName) {
    var player = Object.create(Player);
    player.playerName = playerName;
    Player.players.push(player);
    player.spotsUsed = [];
    return player;
  }
};
var Space = {
  create: function(coordinateX, coordinateY) {
    var space = Object.create(Space);
    space.coordinateX = coordinateX;
    space.coordinateY = coordinateY;
    space.markedBy = "";
    return space;
  },
  markBy: function(player) {
    this.markedBy = player;
  }
};  
var Board = {
  turns : [1, 2, 3, 4, 5, 6, 7, 8, 9],
  wins: [[[1,1],[1,2],[1,3]], [[2,1],[2,2],[2,3]], [[3,1],[3,2],[3,3]],
        [[1,1],[2,1],[3,1]], [[1,2],[2,2],[3,2]], [[1,3],[2,3],[3,3]], 
        [[1,1],[2,2],[3,3]], [[3,1],[2,2],[1,3]]],
  spaces: [],
  create: function() {
    var board = Object.create(Board);
    for (var i=1; i < 4; i++) {
      for (var j=1; j <4; j++) {
        var space = Space.create(i,j);
        Board.spaces.push(space);
      };
    };
    return board;  
  },
  find: function(coordinateX, coordinateY) {
    var name = "";
    var found = this.spaces.filter(function(space) {
      return space = (coordinateY === space.coordinateY && coordinateX === space.coordinateX);
    });
    var name = found[0].markedBy.playerName;
    return  name;
  },
  didWin: function(player) {
    var winner = false;
    var inArow = 0;
    Board.wins.forEach(function(win) {
      inArow = 0;
      win.forEach(function(coordinateSet) {
        if (Board.find(coordinateSet[0], coordinateSet[1]) === player.playerName) {
          inArow += 1;
          if (inArow === 3) {
            winner = true;
          }
        }
      });
    });  
    return winner;
  }
};
var Game = {
  create: function() {
    var game = Object.create(Game);
    var playerX = Player.create("PlayerX");
    var playerO = Player.create("PlayerO");
    var board = Board.create();
    var currentPlayer = playerX.playerName;
    return game;
  }
};

$(document).ready(function() {
  var game = Game.create();
  var turnCounter = 9;
  var playerXWins = 0;
  var playerOWins = 0;
  var gameOver = false;
  
  $('#gameboard td').click(function() {
    if (turnCounter > 0) {
      var position = $(this).data("number");
      if (Board.spaces[position].markedBy.playerName !== undefined) {
        alert("Please choose an empty space");
        this.reset();
      } else {
        if (turnCounter % 2 === 1) {
          $(this).text("X");
          Board.spaces[position].markBy(Player.players[0]);
        } else {
          Board.spaces[position].markBy(Player.players[1]);
          $(this).text("O");
        }

        if(Board.didWin(Player.players[0]) === true || Board.didWin(Player.players[1])) {
          if (Board.spaces[position].markedBy.playerName === Player.players[0].playerName) {
            playerXWins +=1;
            $()
          } else {
            playerOWins +=1;
          }
          $('#scoreboard').show();
          $('span#player-x-score').text(playerXWins);
          $('span#player-o-score').text(playerOWins);
          gameOver = true;
        } else if (turnCounter === 1){
          alert("Game OVER! CATS");
          gameOver = true;
        }
        turnCounter--;
      } 
    } 

    if (gameOver === true) {
      for (var i = 0; i < 9 ; i++) {
        $('#' + i).text("");
      }
      gameOver = false;
      turnCounter = 9;
      Board.spaces = [];
      Player.players = [];
      Game.create();
    }
  });
});
