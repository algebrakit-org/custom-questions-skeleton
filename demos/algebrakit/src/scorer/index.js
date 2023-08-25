import {getScoreForSession} from '../util/akit';

export default class Scorer {

    constructor(question, response) {
        this.question = question;
        this.response = response;
        this.sessionScore = null;
    }

    /**
     * Check if the current question's response is valid or not
     * 
     * Note: this implementation is asynchronous, so Learnosity has to use this
     * function like this:
     * let valid = await Scorer.isValid()
     * 
     * let valid = Scorer.isValid()
     * 
     * 
     * (Required)
     * @returns {boolean}
     */
    isValid() {
        // TODO: 
        // Let's discuss how we can make use of other information Algebrakit provides, such as
        // - skill tags      (references to known mathematical skills and mistakes)
        // - progress        (value between 0-100)
        // - partial scoring (marksTotal, marksEarned)

        // Assuming the session contains only one scorable interaction, which is what Learnosity expects,
        //
        if(this.response) {
            if(this.response.scoring) {
                console.log(`isValid (from response data) result = ${this.response.scoring.finished}`)
                return this.response.scoring.finished;
            }

            let promise;
            if(!this.sessionScore) {
                promise = getScoreForSession(this.response.sessionId);
            } else {
                promise = Promise.resolve(this.sessionScore);
            }
    
            return promise.then(score => {
                this.sessionScore = score;
                console.log(`isValid (asynchronous) result = ${this.sessionScore.scoring.finished}`)
                return this.sessionScore.scoring.finished;
            });
        }

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
        if(this.response) {
            if(this.response.event!='interaction-evaluate') return null;
            
            // Take score from response data, if possible.
            // E.g. does not work when the Algebrakit question runs in assessment mode.
            // Also, this assumes that the session contains just one scorable question.
            if(this.response.scoring) {
                let sc = this.response.scoring;
                let score = sc.marksEarned / sc.marksTotal * this.maxScore();
                console.log(`score (from response data) = ${score}`);
                return score;
            }

            let promise;
            if(!this.sessionScore) {
                promise = getScoreForSession(this.response.sessionId);
            } else {
                promise = Promise.resolve(this.sessionScore);
            }
    
            return promise.then(sc => {
                this.sessionScore = sc;
                let score =  sc.marksEarned / sc.marksTotal * this.maxScore();
                console.log(`score (asynchronous) = ${score}`)
                return score;
            });
        } else {
            return null;
        }

    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        return  this.question.marks_total? this.question.marks_total: 1;
    }

    /**
     * Check if the current question is scorable or not.
     * For example:
     * - If there is no valid response data set in the question, this method should return false
     * - If this question type is not scorable (like an essay or open ended question) then this will return false
     * @returns {boolean}
     */
    canValidateResponse() {
        if(this.response){
            let scoring = this.response.scoring;
            return !!scoring;
        }
        return true;
    }
}
