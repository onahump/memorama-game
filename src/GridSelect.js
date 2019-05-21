Memory.GridSelect = function (game) {};

Memory.GridSelect.prototype = {
	create: function () {
		this.setGridSize(4, 3);
	},
	setGridSize: function(cols, rows) {
		Memory.gridCols = cols;
		Memory.gridRows = rows;
		this.state.start('Game');
	},
};
