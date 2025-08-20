class Question {
  constructor(questionId, questionText, correctAnswer, incorrectAnswers) {
    this.questionId = questionId;
    this.questionText = questionText;
    this.correctAnswer = correctAnswer;
    this.incorrectAnswers = incorrectAnswers;
  }

  /**
   * Get all answers shuffled randomly
   * @returns {string[]} Array of all answers in random order
   */
  getShuffledAnswers() {
    const allAnswers = [this.correctAnswer, ...this.incorrectAnswers];
    return this.shuffleArray(allAnswers);
  }

  /**
   * Get all answers in original order (correct first, then incorrect)
   * @returns {string[]} Array of all answers
   */
  getAnswers() {
    return [this.correctAnswer, ...this.incorrectAnswers];
  }

  /**
   * Check if the provided answer is correct
   * @param {string} answer - The answer to check
   * @returns {boolean} True if correct, false otherwise
   */
  isCorrectAnswer(answer) {
    return this.correctAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
  }

  /**
   * FISHER YATES YEEEEAAAAAH
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

exports.Question = Question;
