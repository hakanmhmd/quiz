var shuffle = require('shuffle-array')

var State = {
	IDLE: "idle",
	QUESTION_PENDING: "pending",
  	QUESTION_ANSWERED: "answered",
	PAUSED: "paused"
}

function QuizLogic(){
	this.quizConfig = {
		startTime: 5,
		thinkTime: 20,
		pointsPerQuestion: 1,
		betweenQuestionsTime: 10,
		showScoreInterval: 5,
        timeBetweenIncorrectResponses: 10
	}
	this.questions = []
	this.currentQuestionIndex = 0
	this.state = State.IDLE;
	this.score = 0
}

QuizLogic.prototype.initalize = function(quiz){
	this.questions = quiz.questions

	for(var c in quiz.config){
		this.quizConfig[c] = quiz.config[c]
	}
	if(this.quizConfig.shuffle){
		shuffle(this.questions)
	}
}

QuizLogic.prototype.start = function(){
	if(this.state == State.IDLE){
		this.currentQuestionIndex = 0
        this.startQuestion()
	}
}

QuizLogic.prototype.pause = function() {
    if(this.state != State.PAUSED) {
        this.prePausedState = this.state
        this.state = State.PAUSED
    }
}

QuizLogic.prototype.resume = function() {
    if(this.state == State.PAUSED) {
        this.state = this.prePausedState
    }
}

QuizLogic.prototype.stop = function() {
    clearInterval(this.interval)
    this.state = State.IDLE
}

QuizLogic.prototype.startQuestion = function() {
	console.log('QUESTION CHOSEN...')
    if(this.state != State.QUESTION_PENDING) {
        this.state = State.QUESTION_PENDING;
        this.prepareQuestion();    
    }
}

QuizLogic.prototype.prepareQuestion = function() {
	console.log('QUESTION GETTING READY...')
    setTimeout(this.outputQuestion.bind(this), this.quizConfig.startTime * 1000)
}

QuizLogic.prototype.outputQuestion = function() {
    this.interval = setInterval(this.update.bind(this), 1000);
    this.currentQuestion = this.questions[this.currentQuestionIndex]; 
    this.currentQuestion.timeLeft = this.currentQuestion.time || this.quizConfig.thinkTime;
    this.currentQuestion.points = this.currentQuestion.points || this.quizConfig.pointsPerQuestion;
    this.currentQuestion.answerCount = this.currentQuestion.answersNeeded || this.currentQuestion.answers.length;
    this.currentQuestion.pendingAnswers = this.currentQuestion.answers; 

    console.log('QUESTION: ' + this.currentQuestion.text)
}

QuizLogic.prototype.update = function() {
    if(this.state == State.PAUSED){
    	return
    }
    this.currentQuestion.timeLeft--
        if(this.currentQuestion.timeLeft <= 0) {
        	console.log('QUESTION TIMEOUT...')
            this.endQuestion()
        }else{
            if(this.currentQuestion.timeLeft == 10) {
                console.log('10 SECONDS LEFT...')
            }
       }
}

QuizLogic.prototype.endQuestion = function() {
    this.state = State.QUESTION_ANSWERED
    clearInterval(this.interval)
    this.showScoreCount++
    if(this.showScoreCount >= this.quizConfig.showScoreInterval && this.currentQuestionIndex < this.questions.length-1) {
        setTimeout((function() {
        	console.log('SCORE: ' + this.score)
        }.bind(this)), 3000)
        this.showScoreCount = 0;
        setTimeout(this.nextQuestion.bind(this), 3000 + this.quizConfig.betweenQuestionsTime * 1000)
    }else{
        setTimeout(this.nextQuestion.bind(this), this.quizConfig.betweenQuestionsTime * 1000)
    }
}

QuizLogic.prototype.nextQuestion = function() {
    if(this.state == State.QUESTION_ANSWERED) {
        if(this.currentQuestionIndex < this.questions.length-1) {
            this.currentQuestionIndex++;
            this.startQuestion();
        }else{
            this.complete();
        }
    }
}

QuizLogic.prototype.complete = function() {
    this.state = State.IDLE;
    console.log('QUIZ COMPLETED...')
}

QuizLogic.prototype.checkAnswer = function(text) {
    var userText = text.toLowerCase();
    var i = this.currentQuestion.pendingAnswers.length-1;
    var correctAnswers = [];
    while(i >= 0 && this.currentQuestion.answerCount > 0) {
        for(var j=0; j<this.currentQuestion.pendingAnswers[i].text.length; j++) {
            if(userText.indexOf(this.currentQuestion.pendingAnswers[i].text[j].toLowerCase()) > -1) {
                correctAnswers.push(this.currentQuestion.pendingAnswers[i].text[0]);
                this.currentQuestion.answerCount--;
                this.currentQuestion.pendingAnswers.splice(i, 1);
                break;
            }
        }
        i--;
    }
    if(correctAnswers.length > 0) {
        var points = this.currentQuestion.points * correctAnswers.length;
        this.score += points
        console.log('CORRECT ANSWER...')
        if(this.currentQuestion.answerCount == 0) {
            if(this.currentQuestion.pendingAnswers.length > 0) {
                console.log('OTHER POSSIBLE ANSWERS...')
            }
            this.endQuestion();
        }
    }else{
        var now = new Date().getTime();
        if(now - this.lastIncorrectAnswerPing > this.quizConfig.timeBetweenIncorrectResponses * 1000) {
            console.log('INCORRECT ANSWER...')
            this.lastIncorrectAnswerPing = now;
        }
    }
};

module.exports = QuizLogic