var QuizLogic = require('./quiz')
var fs = require('fs')
var readline = require('readline')


var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

function Game(lang) {
	var quiz = new QuizLogic()
	rl.on('line', function(data){
    	if(data == 'list'){
			this.listQuizzes()
		} else if(data.indexOf('start quiz') > -1){
			
			var index = data.indexOf('start quiz');
			
			var rest = data.substring(index + 11);
			var nextSpace = rest.indexOf(" ");
			var quizId = rest.substring(0, nextSpace > -1 ? nextSpace : rest.length);
			
			quizData = this.load(quizId)
			if(quizData){
				quiz.initalize(JSON.parse(quizData))
				quiz.start()
			}
		} else if(data == 'stop'){
			quiz.stop()
		} else if(data == 'pause'){
			quiz.pause()
		} else if(data == 'resume'){
			quiz.resume()
		} else {
			//check if the answer has been given
			quiz.checkAnswer(data)
		}
	}.bind(this))
		
} 

Game.prototype.listQuizzes = function() {
	this.quizList = []
	fs.readdir(__dirname + '/quizzes', function(err, files) {
		if (err) {
			console.log('Error')
			return
		}else{
			for(var i=0; i<files.length; i++) {
				this.quizList.push(files[i].replace(/\.[^/.]+$/, ""));
			}
		}
		var output = "";
		for(var i=0; i<this.quizList.length; i++) {
			if(i != 0) output += ", ";
			output += this.quizList[i];
		}
		console.log("Here are the quizzes I've got: " + output);
	}.bind(this));
};

Game.prototype.load = function(quizId) {
	var filePath = 'quizzes/'+ quizId +'.json'
	try {
		var data = fs.readFileSync(filePath, 'utf8');
	}catch (e) {
		console.log('No such file.')
	}
	return data
}

new Game()


module.exports = Game

