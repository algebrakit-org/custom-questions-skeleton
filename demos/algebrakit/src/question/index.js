import { PREFIX } from './constants';
import { v4 as uuidv4 } from 'uuid';

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
// const AKIT_HOST  = 'https://api.staging.algebrakit.com';
// const AKIT_SCRIPT_SRC = 'https://widgets.staging.algebrakit.com/akit-widgets.min.js';

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
        
        this.addAkitScriptTagIfNeccessary()
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
        promise = this.post(
            '/session/create', 
            {
                exercises: [{
                    exerciseId: this.akitExerciseId,
                    version: 'latest',
                    _overrideSessionId: this.sessionId
                }],
                assessmentMode: false,
                'api-version': 2
            }).then(resp => {
                if(!resp || resp.length!=1 || !resp[0].success) throw Error('Failed to create Algebrakit session');
    
                // For simplicity: assuming we generated a single session for a single exercise ID (no batch processing)
                this.session = resp[0].sessions[0];
            });

        return promise.then(() => {

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
                            tags: obj.data.tags
                        }
                        events.trigger('changed', scoreObj)

                        // this.getScore(this.sessionId).then(scoreResult => {
                        //     events.trigger('changed', scoreResult)
                        // });
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

    getScore(sessionId) {
        return this.post(
            '/session/score', 
            {
                sessionId: sessionId,
                'api-version': 2
            });
    }

    /**
     * Perform Post
     * @param {string} url 
     * @param {any} data 
     * @returns a promise with the response if succesful. If not succesful, rejects with an error message (string)
     */
    post(url, data) {

        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', AKIT_HOST+url, true);
            xhr.setRequestHeader('x-api-key', AKIT_API_KEY);
            xhr.onload = function () {
                if (xhr.status === 200) {// This is called even on 404 etc, so check the status
                    var contentType = xhr.getResponseHeader('content-type');
                    if (contentType && contentType.search('application/json') >= 0) {
                        let result = {};
                        if (xhr.responseText.length > 0) {
                            result = eval('(' + xhr.responseText + ')');
                        }
                        resolve(result)
                    } else {
                        reject(Error('Invalid response from akit proxy'));
                    }
                } else {
                    if (xhr.response) {
                        reject(Error(xhr.response));
                    }
                    reject(Error(xhr.statusText));
                }
            };
            // Handle network errors
            xhr.onerror = function (args) {
                reject(Error("Network Error"));
            };
    
            // Make the request
            var isBinary = (data.constructor === FormData);
            if (isBinary) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
                xhr.responseType = "arraybuffer"; //xhr 2
            } else if (typeof (data) === 'string') {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            } else {
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                data = JSON.stringify(data);
            }
            xhr.send(data);
        });
    }

    /**
     * Load the Algebrakit frontend API by adding the <script src="https://widgets.algebrakit.com/akit-widgets.min.js"> to the DOM.
     * Returns when the script is loaded and executed (and so the AlgebraKIT object is available).
     */
    addAkitScriptTagIfNeccessary() {
        if(window.AlgebraKIT && window.AlgebraKIT._api) return Promise.resolve();

        window.AlgebraKIT = AKIT_CONFIG;
        return new Promise(function(resolve, reject) {
            const s = document.createElement('script');
            let r = false;
            s.type = 'text/javascript';
            s.src = AKIT_SCRIPT_SRC;
            s.async = true;
            s.onerror = function(err) {
              reject(err, s);
            };
            s.onload = s.onreadystatechange = function() {
              // console.log(this.readyState); // uncomment this line to see which ready states are called.
              if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                resolve();
              }
            };
            const t = document.getElementsByTagName('script')[0];
            t.parentElement.insertBefore(s, t);
          });
        
    }
}


