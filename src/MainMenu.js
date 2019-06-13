Memory.MainMenu = function (game) {
	this.playButton = null;
};

Memory.MainMenu.prototype = {
	create: function () {
		if (Memory.supportsStorage() && (localStorage["played"] == undefined || localStorage["played"] == false)) {
			Memory.clearStorage();
			localStorage["played"] = true;
		}

		this.add.sprite(0, 0, 'menuBackground');
		this.logo =  this.add.sprite(900, 500, 'logo');
		this.logo.anchor.setTo(0.5);
		this.logo.scale.setTo(0.065);
		this.playButton = this.add.button(250, 420, 'playButton', this.gotoGame, this);
	},

	gotoGame: function (pointer) {
		this.state.start('GridSelect');
	},
};
