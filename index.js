var QuizLogic = require('./quiz')
var fs = require('fs')
var rl = require('readline')
var quiz = new QuizLogic()
var prompts = rl.createInterface(process.stdin, process.stdout)


function Game(lang) {
	if(!lang){
		lang = 'en'
	}
	this.lang = lang
	this.promptUser()
		
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
		prompts.question("Which one do you want to play?", function(quizName){
			console.log(quizName)
			var quizData = fs.readFileSync('quizzes/'+ quizName +'.json', 'utf8')
			quiz.initalize(JSON.parse(quizData))
		})
	}.bind(this));
};

new Game()


module.exports = Game

