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
        timeBetweenIncorrectResponses: 10
	}
	this.questions = []
	this.currentQuestionIndex = 0
	this.state = State.IDLE
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
    this.currentQuestion.pendingAnswersCount = this.currentQuestion.answersNeeded || this.currentQuestion.answers.length;
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
            this.getCorrectAnswers()
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
    if(this.currentQuestionIndex == this.questions.length-1) {
        setTimeout((function() {
        	console.log('SCORE: ' + this.score)
        }.bind(this)), 3000)
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
    var correct = false;
    while(i >= 0 && this.currentQuestion.pendingAnswersCount > 0) {
        for(var j=0; j<this.currentQuestion.pendingAnswers[i].text.length; j++) {
            if(userText.indexOf(this.currentQuestion.pendingAnswers[i].text[j].toLowerCase()) > -1) {
                correct = true
                this.currentQuestion.pendingAnswersCount--;
                this.currentQuestion.pendingAnswers.splice(i, 1);
                break;
            }
        }
        i--;
    }

    if(correct) {
        var points = this.currentQuestion.points;
        this.score += points
        console.log('CORRECT ANSWER...')
        if(this.currentQuestion.pendingAnswersCount == 0) {
            this.endQuestion();
        }
        if(this.currentQuestion.pendingAnswers.length != 0)
            console.log(this.currentQuestion.pendingAnswers.length + " more left.")
    }else{
        console.log('INCORRECT ANSWER...')
    }
}

QuizLogic.prototype.getOtherPossibleAnswers== function(otherAnswers){
    var answersText = ""
    for(var i=0; i<otherAnswers.length; i++) {
        if(i != 0) {
            if(i == otherAnswers.length-1) {
                answersText += " and "
            }else{
                answersText += ", "
            }
        }
        answersText += otherAnswers[i].text[0]
    }
    return answersText
}

QuizLogic.prototype.getCorrectAnswers = function() {
    var text = "";
    var len = this.currentQuestion.answers.length
    for(var i=0; i<len; i++) {
        if(i > 0 && i < len-1) text += ", "
        if(i > 0 && i == len-1) text += " and "
        text += this.currentQuestion.answers[i].text[0]
        
    }
    console.log("CORRECT ANSWER(S): " + text)
}

module.exports = QuizLogic