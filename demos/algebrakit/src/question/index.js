import { PREFIX } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { createSession, addAkitScriptTagIfNeccessary } from '../util/akit';

// When previewing an exercise, we need to create an Algebrakit session ID.
// Normally, this session ID is equal to the response ID of Learnosity, which is a UUID. 
// However, during previewing, Learnosity generates non-UUID responseIds. So we will create
// our own session ID and reuse it as long as the same Algebrakit exercise is referenced.
const SESSION_CACHE = {
    exerciseId: null,
    sessionId: null,
    reponseId: null,    // identifies the learnosity question. Is changed whenever the question changes
    interactions: null  // info on the interactions in this exercise
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// note: this is an unsecure solution, only allowed for testing and demo
// The API key should not be available in the frontend
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const AKIT_API_KEY = 'bGVhcm5vc2l0eS5kZW1vLWludGVncmF0aW9uLjRmMzg3MTFlMDQ0MTJmMGZkZTk2NjNhMmVjMzVhYTU5M2VjYWM3ZTBiZDQ2ZWUyM2MxYmRlZjY1ZWJlNzc5NDQ1MzY5MjE2NjhiZDY2ZWY2MmNhMjE1ZmVlNDRmZjQ4MA==';
// const AKIT_HOST  = 'https://api.algebrakit.com';
// const AKIT_SCRIPT_SRC = 'https://widgets.algebrakit.com/akit-widgets.min.js';

const AKIT_HOST  = 'http://localhost:3000';
const AKIT_SCRIPT_SRC = 'http://localhost:4000/akit-widgets.js';
const AKIT_CONFIG = {
        config: {
            styles: {
                general: {
                    'border-radius': '10px'
                },
                multistep: {
                    'color-worksheet-bg': 'white',
                    'border-worksheet': '1px solid #ccc',
                    'color-buttons-bg': 'white',
                    'color-buttons-bg-hover': '#ccc',
                },
            }

        }
    };
const RESPONSE_ID_PREFIX = 'custom-';

export default class AlgebrakitQuestion {
    constructor(init, lrnUtils) {
        this.init = init;
        this.lrnUtils = lrnUtils;

        this.events = init.events;
        this.el = init.$el.get(0);

        // the question object that was used by the client to initialise the question
        // See table 1 in https://help.learnosity.com/hc/en-us/articles/360000758817-Creating-Custom-Questions#scoring
        let questionObj = init.question;
        this.akitExerciseId = questionObj.akit_exercise_id; // exercise ID is given by the client

        // Get the Algebrakit sessionId from Learnosity's response ID.
        this.forceCreateAkitSession = false;  // will be set to true by getUUIDFromResponseId if we need to create our own session
        let responseId = questionObj.response_id;
        this.sessionId = this.getUUIDFromResponseId(responseId);

        this.exerciseElm = null;
        this.session = null;   // the response from /session/create
        
        addAkitScriptTagIfNeccessary()
            .then(() => this.render())
            .then(() =>{
                this.registerPublicMethods();

                if (init.state === 'review') {
                    init.getFacade().disable();
                }

                // let Learnosity know the question is rendered and ready
                init.events.trigger('ready');
            });
    }

    render() {
        const { el, init, lrnUtils } = this;
        const { question, response } = init;

        let promise = Promise.resolve();

        
        // Create an Algebrakit session through a secure proxy. 
        // This proxy needs to be provided by Learnosity and needs to take care of the following:
        // - authenticate that this is a valid learnosity user, having an Algebrakit license
        // - add the Algebrakit x-api-key header to the request.
        // update 12-2022: Always call create session, because init.state is unreliable
        //                 If the session already exists, than this session will be retrieved
        return createSession(this.akitExerciseId, this.sessionId).then((resp) => {
            this.session = resp;
            
            let akitStr;
            if(this.session && this.session.html) {
                //prevent roundtrip to the server for initialization by using the optimized html
                akitStr = this.session.html;
                this.sessionId = this.session.sessionId;
                this.handleEvents();
            } else if(this.sessionId) {
                //generic approach. The web component will retrieve info from the web service
                let mode = '';
                if(init.state=='review') mode = 'review-mode';
                akitStr = `<akit-exercise session-id="${this.sessionId}" ${mode}></akit-exercise>`
                this.handleEvents();
            } else {
                akitStr = 'Not rendering Algebrakit exercise: no valid session ID';
            }
                
            el.innerHTML = `
                <div class="${PREFIX} lrn-response-validation-wrapper">
                    <div class="lrn_response_input">
                        ${akitStr}
                    </div>            
                    <div class="${PREFIX}-checkAnswer-wrapper"></div>
                    <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
                </div>
            `;

            // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
            // first before rendering your question's components
            return Promise.all([
                lrnUtils.renderComponent('SuggestedAnswersList', el.querySelector(`.${PREFIX}-suggestedAnswers-wrapper`)),
                lrnUtils.renderComponent('CheckAnswerButton', el.querySelector(`.${PREFIX}-checkAnswer-wrapper`))
            ]).then(([suggestedAnswersList]) => {
                this.suggestedAnswersList = suggestedAnswersList;
    
                this.exerciseElm = el.querySelector('akit-exercise');
                return AlgebraKIT.waitUntilReady(this.exerciseElm);
            });
                
        }).catch(err => {
            console.log(err);
        })

    }

    /**
     * The responseId is a unique ID given by Learnosity. Algebrakit uses a similar concept, called 'sessionId'. 
     * It is simplest if the sessionId is equal to the responseId. That way, we don't have to manage a store that obtains
     * the Algebrakit sessionId from the responseId. 
     * During normal production, the resopnseId is a UUID. However, during previewing Learnosity uses a simpler id like
     * 'custom-1' which we cannot use as a sessionId. In that case, we will create our own sessionId and store it in a 
     * local cache. 
     */
    getUUIDFromResponseId(responseId) {
        if(!responseId) return responseId = '';

        let sessionId = (responseId.startsWith(RESPONSE_ID_PREFIX)) 
            ?responseId.substring(RESPONSE_ID_PREFIX.length)
            :responseId;

        // Is this a UUID, then return it
        // This is the case during normal production
        if(sessionId.split('-').length==5) return sessionId;

        // When previewing in Learnosity, then Learnosity generated a temporary response Id.
        // We create our own session ID and make sure it is reused while the same exercise ID is being reviewed
        if(SESSION_CACHE.exerciseId == this.akitExerciseId && SESSION_CACHE.responseId == responseId ) {
            // reuse the session ID we created earlier
            sessionId = SESSION_CACHE.sessionId;
        } else {
            // create a session ID to be used during review
            this.forceCreateAkitSession = true;
            sessionId = uuidv4();
            SESSION_CACHE.exerciseId = this.akitExerciseId;
            SESSION_CACHE.sessionId = sessionId;
            SESSION_CACHE.responseId = responseId;
        }

        return sessionId;
    }
    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init } = this;

        // The facade object defines the public methods of Learnosity's Question instance. 
        // Add or override public methods on the facade object to make those available on instances of the custom Question object.
        // Example: clients can do something like this on Learnosity's Question API
        // - questionsApp.question("custom-question-1").disable()
        const facade = init.getFacade();

        facade.disable = () => {
            this.exerciseElm.setAttribute('interactive-mode', false);
        };
        facade.enable = () => {
            this.exerciseElm.setAttribute('interactive-mode', true);
        };
    }

    handleEvents() {
        const { events } = this;
        if(!this.sessionId) return;

        AlgebraKIT.addExerciseListener(this.sessionId, obj => {
            switch(obj.event) {
                case 'exercise-created': {
                    // store information of interactions
                    SESSION_CACHE.interactions = obj.data.interactions;
                    break;
                }   
                case 'interaction-submit-state-changed':
                case 'interaction-evaluate': 
                case 'interaction-hint': {
                    if(!obj.data.replay) {
                        let scoreObj = {
                            interactions: SESSION_CACHE.interactions,
                            sessionId: obj.sessionId,
                            refId: obj.refId,
                            scoring: obj.data.scoring,
                            progress: obj.data.progress,
                            tags: obj.data.tags,
                            event: obj.event
                        }
                        events.trigger('changed', scoreObj)

                        console.log('QUESTION JSON');
                        console.log(JSON.stringify(this.init.question));

                        console.log('RESPONSE JSON');
                        console.log(JSON.stringify(scoreObj));

                    }
                    break;
                }


                default: {
                    //skip
                    break;
                }
            }
        });

        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
        events.on('validate', options => {
            this.exerciseElm.submit();
        });
    }

}


