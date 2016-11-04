function QuizGame(){

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

QuizGame.prototype.getQuestions = function(){
	console.log('questions fetched!')
}

module.exports = QuizGame