var Memory = {
	gridCols: 4,
	gridRows: 3,
	supportsStorage: function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	},
	clearStorage: function() {
		localStorage["4x3score"] = 0;
	},
	findScoreText: function() {
		var scoreString = "";

		if (Memory.gridCols == 4 && Memory.gridRows == 3) {
			scoreString = "4x3score";
		}

		return scoreString;
	}
};

Memory.Boot = function (game) {
};

Memory.Boot.prototype = {
    init: function () {
		this.stage.disableVisibilityChange = false;
    },

    preload: function () {
		this.load.image('menuBackground', 'assets/bkgd-menu.png');
		this.load.image('preloaderBar', 'assets/spr-loadbar.png');
		this.load.image('logo', 'assets/logo.png');
    },

    create: function () {
		this.state.start('Preloader');
    }
};
