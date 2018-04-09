var EmojiGame;

;(function(){
	'use strict';
	
	var gameData = {
		tryCount: 0,
		successCount: 0,
		clickProcessing: false, //prevent multi-clicking
		incrementTryCount(){
			this.tryCount++;
		},
		getTryCount(){
			return this.tryCount;
		},
		incrementSuccessCount(){
			this.successCount++;
		},
		getSuccessCount(){
			return this.successCount;
		},
		setClickProcessing(value){
			this.clickProcessing = value;
		},
		getClickProcessing(){ //check if a click has already started
			return this.clickProcessing;
		}
	};

	EmojiGame = function(args){
		this.args = args;
		this.emojiList = [
			"👻",
			"👽",
			"💗",
			"💣",
			"👍",
			"🍌",
			"🍕",
			"🎲"
		];
		this.matchingPairs = [];
		this.init();
	};
	
	EmojiGame.prototype.init = function(){
		this.board			= (this.paramExist(this.args, "gameBoardIdName")) ? document.querySelector('#' + this.paramExist(this.args, "gameBoardIdName")) : null;
		this.boardSize	= (this.args["boardSize"]) ? this.paramExist(this.args, "boardSize") : 4;
		this.tileSize		= (this.args["tileSize"]) ? this.paramExist(this.args, "tileSize") : 80;
		
		if(this.board === null){
			return;
		}
		
		//create header for board
		this.header = document.createElement('DIV');
		this.header.className = 'header';
		this.header.innerHTML = '&nbsp;';
		this.board.append(this.header);
		
		this.createBoard();
	};
	
	EmojiGame.prototype.createBoard = function(){
		//duplicate emojiList
		this.emojiList = this.emojiList.concat(this.emojiList);
		//shuffle our array;
		this.emojiList.shuffleArray();
		
		//create container for tiles
		var tileWrapper = document.createElement('DIV');
		tileWrapper.className = 'tileWrapper';
		this.board.append(tileWrapper);
		
		for(var i=0; i<this.emojiList.length; i++){
			var tile = this.createTile(this.emojiList[i], i);
			tileWrapper.append(tile);
		}
	};
	
	EmojiGame.prototype.createTile = function(styleName, index){
		var container = document.createElement('DIV');
		container.className = 'tile';
		container.dataset.id = index;
		container.onclick = this.handleTileClick.bind(this);
		
		return container;
	}
	
	EmojiGame.prototype.paramExist = function(obj, key){
		if(typeof this.args[key] == "undefined" || this.args[key] == ""){
			console.log('Missing ' + key + '.');
			return;
		}
		
		return this.args[key];
	}
	
	EmojiGame.prototype.handleTileClick = function(e){
		var target = e.currentTarget;
		
		if(gameData.getClickProcessing() || target.innerHTML != ''){
			return;
		}
		
		gameData.setClickProcessing(true);
		
		this.matchingPairs.push(target);
		target.innerHTML = this.emojiList[parseInt(target.dataset.id)];
		
		//do nothing if this.matchingPairs only contains one
		if(this.matchingPairs.length <= 1){
			gameData.setClickProcessing(false);
			return;
		}
		
		gameData.incrementTryCount();
		
		var tile1 = this.emojiList[parseInt(this.matchingPairs[0].dataset.id)];
		var tile2 = this.emojiList[parseInt(this.matchingPairs[1].dataset.id)];
		
		//evaluate match condition
		if(tile1 === tile2){
			//remove click event on matching pair
			for(var i=0; i<this.matchingPairs; i++){
				this.matchingPairs[i].onClick = 0;
			}
			
			this.matchingPairs = [];
			this.header.innerHTML = 'Nice!';
			gameData.incrementSuccessCount();
			
			//check if all matches have been found.
			if(gameData.getSuccessCount() == (this.emojiList.length * .5)){
				this.header.innerHTML = 'Awesome! Only took ' + gameData.getTryCount() + ' trys.';
			} else {
				gameData.setClickProcessing(false);
			}
		} else {
			this.header.innerHTML = 'OOPS! Try again.';
			setTimeout((function(){
				for(var i=0; i < this.matchingPairs.length; i++){
					this.matchingPairs[i].innerHTML = '';
				}
				this.header.innerHTML = '&nbsp;';
				gameData.setClickProcessing(false);
				//empty matchingPairs to be reused
				this.matchingPairs = [];
			}).bind(this), 2000);
		}
	}
	
	Array.prototype.shuffleArray = function(){
		for(var i=0; i<this.length; i++){
			var ran = Math.floor(Math.random() * this.length);
			var valueToMove = this[i];
			
			this[i] = this[ran];
			this[ran] = valueToMove;
		}
	};
})();

var emojiGame = new EmojiGame({
		"gameBoardIdName": "gameBoard",
		"boardSize": "",
		"tileSize": "",
	});