var shuffle = require('shuffle-array')

var States = {
	IDLE: "idle",
	RUNNING: "running",
	STOPPED: "stopped",
	PAUSED: "paused"
}

function QuizGame(){
	this.quizConfig = {
		thinkTime: 20,
		pointsPerQuestion: 1,
		betweenQuestionsTime: 10
	}
	this.questions = []
	this.currentQuestionIndex = 0
	this.state = States.IDLE;
}

QuizGame.prototype.initalize = function(quiz){
	this.questions = quiz.questions

	for(var c in quiz.config){
		this.quizConfig[c] = quiz.config[c]
	}
	if(this.quizConfig.shuffle){
		shuffle(this.questions);
	}

	for(var i in this.questions){
		console.log(this.questions[i].text)
	}
}

QuizGame.prototype.start = function(){
	console.log('game started')
}

QuizGame.prototype.stop = function(){
	console.log('game stopped')
}

QuizGame.prototype.pause = function() {
	console.log('game paused')
}

module.exports = QuizGame