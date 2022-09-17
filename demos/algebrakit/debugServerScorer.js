console.log(`
==============================================================================================
THE SCRIPT BELOW IS BEING USED TO TEST THE SERVER SIDE SCORING FOR YOUR CUSTOM QUESTION
----
Update the questionResponseJson with your question json & response
==============================================================================================
`);

// QuestionResponseJson that will be used to test your Scorer logic
const questionResponseJson = {
    question: {
        type: 'custom',
        js: {
            question: '/dist/question.js',
            scorer: '/dist/scorer.js'
        },
        css: '/dist/question.css',
        instant_feedback: true,
        // TODO - requires implementation - add the rest of your question json
        akit_session_id: "bbc14779-70a6-49d7-975b-7622c4a2d6b3",
        marks_total: 1
    },
    response: {
        // TODO - Requires implementation - the shape of your question response
        // value:
        value: {
            "sessionId": "bbc14779-70a6-49d7-975b-7622c4a2d6b3",
            "refId": "dIcEW",
            "event": "interaction-evaluate",
            "data": {
                "replay": false,
                "exerciseFinished": false,
                "progress": 0,
                "items": [
                    {
                        "type": "expression",
                        "status": "NO_MATCH",
                        "input": [
                            {
                                "mimeType": "application/x-tex",
                                "content": "$$2x=x$$"
                            }
                        ],
                        "feedback": null
                    }
                ],
                "scoring": {
                    "marks": {
                        "max": 0,
                        "min": 0
                    },
                    "marksEarned": 0,
                    "marksTotal": 1,
                    "penalties": {
                        "marksPenalty": 0,
                        "hintsRequested": 0,
                        "mathErrors": 2,
                        "notationErrors": 0
                    },
                    "finished": false,
                    "stepList": [
                        {
                            "parents": [],
                            "name": "solution",
                            "latexName": null,
                            "definitionIndex": 0,
                            "marks": 1,
                            "marksMin": 0,
                            "marksMax": 0,
                            "description": null
                        }
                    ]
                },
                "interactionType": "multistep",
                "tags": []
            }
        }
    }
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
