import { PREFIX } from './constants';

export default class AlgebrakitQuestion {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);
        this.exerciseElm = null;
        this.akitSessionId = null;

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();

            if (init.state === 'review') {
                init.getFacade().disable();
            }

            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init, lrnUtils } = this;
        const { question, response } = init;

        this.akitSessionId = init.question.akit_session_id;
        let akitStr;
        if(init.state=='initial' && init.question.akit_html) {
            //prevent roundtrip to the server for initialization by using the optimized html
            akitStr = init.question.akit_html.replace('_script>', 'script>');
        } else {
            //generic approach. The web component will retrieve info from the web service
            let mode = '';
            if(init.state=='review') mode = 'review-mode';
            akitStr = `<akit-exercise session-id="${this.akitSessionId}" ${mode}></akit-exercise>`
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
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init } = this;
        // Attach the methods you want on this object
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

        AlgebraKIT.addExerciseListener(this.akitSessionId, obj => {
            switch(obj.event) {
                case 'exercise-created': {
                    break;
                }   
                case 'interaction-evaluate': 
                case 'interaction-hint': {
                    if(!obj.data.replay) {
                        events.trigger('changed', obj)
                    }
                    break;
                }
                default: {
                    //skip
                    break;
                }
            }
        })

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
