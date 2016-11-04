var QuizGame = require('./quiz')
var fs = require('fs')
var quiz = new QuizGame()

var quizData = fs.readFileSync('quizzes/general_knowledge.json', 'utf8')

quiz.initalize(JSON.parse(quizData))
quiz.start()
quiz.pause()
quiz.stop()