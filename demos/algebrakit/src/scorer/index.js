export default class Scorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
    }

    /**
     * Check if the current question's response is valid or not
     * (Required)
     * @returns {boolean}
     */
    isValid() {
        if(this.response && this.response.data){
            let scoring = this.response.data.scoring;
            if(scoring) {
                return !!scoring.finished;
            }
        }
        return false;
    }

    /**
     * Returns an object displaying the validation state of each individual item inside the stored response
     * For example:
     * The student response value is: { min: 10, max: 20 } and our correct answer is { min: 10, max: 30 }
     * Then we expect the result of this validateIndividualResponses will be:
     * { min: true, max: false }
     * @returns {{}|null}
     */
    validateIndividualResponses() {
        // TODO: Requires implementation
        return null;
    }

    /**
     * Returns the score of the stored response
     * TODO: in assessment mode, the scoring needs to be retrieved from algebrakit first. This would make this function async
     * @returns {number|null}
     */
    score() {
        if(this.response && this.response.data){
            let scoring = this.response.data.scoring;
            if(scoring) {
                return scoring.marksEarned;
            }
        }
        return 0;
    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        return  this.question.marks_total;
    }

    /**
     * Check if the current question is scorable or not.
     * For example:
     * - If there is no valid response data set in the question, this method should return false
     * - If this question type is not scorable (like an essay or open ended question) then this will return false
     * @returns {boolean}
     */
    canValidateResponse() {
        if(this.response && this.response.data){
            let scoring = this.response.data.scoring;
            return !!scoring;
        }
        return true;
    }
}
