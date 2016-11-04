var QuizLogic = require('./quiz')
var fs = require('fs')
var readline = require('readline')
var quiz = new QuizLogic()

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

function Game(lang) {
	if(!lang){
		lang = 'en'
	}
	this.lang = lang
	
	rl.on('line', function(data){
    	if(data == 'list'){
			this.listQuizzes()
		} else if(data.indexOf('start quiz') > -1){
			var index = data.indexOf('start quiz');
			
			var rest = data.substring(index + 11);
			var nextSpace = rest.indexOf(" ");
			var quizId = rest.substring(0, nextSpace > -1 ? nextSpace : rest.length);
			
			var quizData = fs.readFileSync('quizzes/'+ quizId +'.json', 'utf8')
			quiz.initalize(JSON.parse(quizData))
		} else if(data == 'stop quiz'){
			quiz.stop()
		} else if(data == 'pause quiz'){
			quiz.pause()
		}
	}.bind(this))
		
} 


Game.prototype.promptUser = function(){
	var that = this
	prompts.question("Choose command: ", function(command){
		if(command == 'list'){
			that.listQuizzes()
		} else if(command == 'start'){
			quiz.start()
		} else if(command == 'stop'){
			quiz.stop()
		} else if(command == 'pause'){
			quiz.pause()
		}
	})

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

new Game()


module.exports = Game

