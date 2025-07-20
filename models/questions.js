class Question {
  constructor(question, correctAnswer, incorrectAnswers) {
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.incorrectAnswers = incorrectAnswers;
  }

  getAnswers() {
    return [this.correctAnswer, ...this.incorrectAnswers];
  }
}

exports.Question = Question;
