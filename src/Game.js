Memory.Game = function (game) {};

var movesText = null;
var box = null;
var emitter = null;
var click = null;
var ding = null;

var rows;
var columns;

var cardWidth;
var cardSpacing;

var leftMargin;
var topMargin;

var cards;
var cardValues;
var numValues;
var lastClickedIndex;

var moves;
var tilesLeft;

Memory.Game.prototype = {
    create: function () {

		rows = Memory.gridRows;
		columns = Memory.gridCols;

		cardWidth = 100;
		cardSpacing = 20;
		var topBarHeight = 60;
		var rowWidth = (cardWidth + cardSpacing) * (columns - 1) + cardWidth;
		var columnHeight = (cardWidth + cardSpacing) * (rows - 1) + cardWidth;
		leftMargin = (1000 - rowWidth) / 2;
		topMargin = (560 - topBarHeight - columnHeight) / 2 + topBarHeight;

		cards = new Array(); //  contains actual card elements
		cardValues = new Array(); // an array with the value of each card twice
		numValues = columns * rows / 2; // the number of possible pictures/values for the cards
		lastClickedIndex = -1; // the index of the card that was last clicked

		moves = 0;
		tilesLeft = columns * rows;

		click = this.add.audio('click');
		ding = this.add.audio('ding');


		var background = this.add.sprite(0, 0, 'gameBkgd');
		this.logo =  this.add.sprite(900, 500, 'logo');
		this.logo.anchor.setTo(0.5);
		this.logo.scale.setTo(0.065);
		movesText = this.add.text(225,6, "0", {font: "42px Arial", fill: "#ffffff", fontWeight: "bold"});

		//Memory.soundControl = this.add.button(940, 0, Memory.getPauseString(), Memory.toggleMusic);
		var quitButton = this.add.button(910, 10, 'quitButton', this.quitGame, this);

		this.createGrid();
		this.assignCards();

    },

	createGrid: function () {
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < columns; j++) {
				var c = this.add.sprite(leftMargin + (cardWidth + cardSpacing) * j,
										topMargin + (cardWidth + cardSpacing) * i, 'card');
				cards.push(c);
				c.inputEnabled = true;
			}
		}
	},

	assignCards: function() {
		//  make an array to hold the possible values
		for (var i = 0; i < numValues; i++) {
			cardValues.push(i);
			cardValues.push(i);
		}
		//  add a value to each card
		for (var i = 0; i < cards.length; i++) {
			// get a rand num from the cardvalues arr
			var randNum = Math.floor(Math.random() * (cardValues.length));
			// assign it to the card's cardValue
			cards[i].cardValue = cardValues[randNum];
			//console.log("cards[" + i + "] has the card " + cardValues[randNum]);
			// remove that value from the array so it can't be used again
			cardValues.splice(randNum, 1);
			cards[i].events.onInputDown.add(checkClick, this, 0, i);
			cards[i].clickable = true;
		}
	},

	winGame: function() {
		if (Memory.supportsStorage()) {
			this.saveScore();
		}

		box = this.add.sprite(500, 280, 'gameOverBox');
		box.anchor.set(0.5, 0.5);
		box.alpha = 0.9;

		var movesText = this.add.sprite(500, 60, 'movesText');
		movesText.anchor.set(0.5, 0);

		var txtMoves = this.add.text(590, 75, moves, {font: "54px Arial", fill: "#ffffff", fontWeight: "bold"});
		var menuBtn = this.add.button(500, 200, 'gameOverMenu', function() {this.state.start('MainMenu')}, this);
		menuBtn.anchor.set(0.5, 0);
		var replayBtn = this.add.button(500, 290, 'gameOverReplay', function() {this.state.start('Game')}, this);
		replayBtn.anchor.set(0.5, 0);
	},

	quitGame: function() {
		this.state.start('MainMenu');
	},

	saveScore: function() {
		var scoreString = Memory.findScoreText();

		if (localStorage[scoreString] == 0) {
			localStorage[scoreString] = moves;
		} else {
			localStorage[scoreString] = Math.min(moves, localStorage[scoreString]);
		}
	}
};

function checkClick(obj, x, index) {
	var imp = this.input.mouse;
	var c = cards[index];
	if (c.clickable) {
		var last = cards[lastClickedIndex];
		c.loadTexture('cards', c.cardValue);

		if (index == lastClickedIndex) {
		} else if (lastClickedIndex != -1 && c.cardValue == last.cardValue) {
			// match
			ding.play();
			c.clickable = false;
			cards[lastClickedIndex] = false;
			lastClickedIndex = -1;
			moves++;
			tilesLeft -= 2;
		} else if (lastClickedIndex != -1 && c.cardValue != last.cardValue) {
			// no match - wait a bit and flip the cards over
			// disable mouse input so only 2 cards flipped at a time
			click.play();
			imp.enabled = false;
			moves++;
			setTimeout(function() {
				c.loadTexture('card');
				last.loadTexture('card');
				imp.enabled = true;
			}, 600);
			lastClickedIndex = -1;
		} else if (c.clickable) {
			// first attempt
			click.play();
			lastClickedIndex = index;
		}
		movesText.text = moves;

		//  check if player won game
		if (tilesLeft == 0) {
			this.winGame();
		}
	}
}