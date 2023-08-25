console.log(`
==============================================================================================
THE SCRIPT BELOW IS BEING USED TO TEST THE SERVER SIDE SCORING FOR YOUR CUSTOM QUESTION
----
Update the questionResponseJson with your question json & response
==============================================================================================
`);

// QuestionResponseJson that will be used to test your Scorer logic
const questionResponseJson = {
    question: {"response_id":"custom-806e20c4-d2d2-465c-8a21-35674d6d796f","type":"custom","stimulus":"Stimulus of the custom question","js":{"question":"http://localhost/akit/learnosity-akit/dist/question.js","scorer":"http://localhost/akit/learnosity-akit/dist/scorer.js"},"css":"","valid_response":"not applicable","instant_feedback":true,"akit_exercise_id":"0559dfb3-e548-4da3-909a-ad3526722368","score":1},
    response: {"interactions":[{"type":"multistep","scorable":true,"refId":"hkQtm"}],"sessionId":"806e20c4-d2d2-465c-8a21-35674d6d796f","refId":"hkQtm","scoring":{"marks":{"max":1,"min":1},"marksEarned":1,"marksTotal":1,"penalties":{"marksPenalty":0,"hintsRequested":0,"mathErrors":0,"notationErrors":0},"finished":true,"stepList":[{"parents":[],"name":"solution","latexName":null,"definitionIndex":0,"marks":1,"marksMin":1,"marksMax":1,"description":null}]},"progress":1,"tags":[{"ID":"ExpandSingleBrackets","weight":100},{"ID":"EquationsBalanceMethodArrangeTerms","weight":100},{"ID":"EquationsOperationsAdd","weight":100},{"ID":"AlgebraAddingLikeTerms","weight":100},{"ID":"EquationsBalanceMethodArrangeTerms","weight":100},{"ID":"EquationsOperationsAdd","weight":100},{"ID":"EquationsBalanceMethodDivideCoefficient","weight":100},{"ID":"EquationsOperationsMultiply","weight":100}]}
};

// Path to the scorer file that you need to debug
const scorerUrl = './dist/scorer.js';

// Mock LearnosityAmd object that will be used to transform the scorer into a class that we can use to debug later on
global.LearnosityAmd = {
    define: ([], resolveCallback) => {
        if (!resolveCallback) {
            throw new Error('No callback to resolve Scorer exists');
        }

        const result = resolveCallback();

        if (!result.Scorer) {
            throw new Error('No Scorer class');
        }

        runTest(result.Scorer, questionResponseJson.question, questionResponseJson.response);
    }
};

// Load the Scorer
require(scorerUrl);

function runTest(Scorer, question, response) {
    const scorer = new Scorer(question, response);

    console.log(`
**************
TEST OUTPUT
**************
    `);

    console.log('isValid:', scorer.isValid());
    console.log('validateIndividualResponses:', scorer.validateIndividualResponses());
    console.log('score:', scorer.score());
    console.log('max score:', scorer.maxScore());
}
