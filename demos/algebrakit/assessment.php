<?php
include_once '../config.php';
include_Once './akit.php';


// The specification of an Algebrakit question, as created using the Algebrakit Authoring Web Component
// Algebrakit supports creating multiple questions in one call.
$akitSpecs = array(
    '{"id":"544df9be-33a2-403e-add7-c042545988f0","name":null,"majorVersion":0,"metadata":null,"type":"SPECIFICATION","audience":"uk_KS5","definition":{"type":"EXERCISE","questionMode":"ALL_AT_ONCE","elements":[{"type":"QUESTION","mathRendering":"PREPROCESSED","id":"Q1","content":"<p><akit-interaction ref-id=\\"eWIc7\\" ref-name=\\"TestInteraction\\"></akit-interaction></p>","instructionType":"SCRIPT","interactions":[{"showHints":true,"palette":"equations","interactionOptions":{},"id":"eWIc7","name":"TestInteraction","ans":{"action":"CALCULATE","id":"$$\\\\verb|solution|$$","type":"ALGEBRA","defs":[{"def":"Solve[$$2\\\\left(1-3x\\\\right)=-4$$, $$x$$]","score":1,"marks":1,"preconds":[],"decimals":-1}],"evalMode":"EQUIVALENT","parameter":null,"showStartExpression":true,"buggyDefs":[],"alternatives":[],"answers":[],"modes":[],"accuracyMode":"EXACT","accuracyEnabled":null,"targetUnitConvert":true},"instruction":"Solve the equation.","contextHints":[],"steps":[]}]}],"audience":"uk_KS5","script":null,"scriptVariables":[],"definitions":null,"translations":{},"modes":[],"exerciseContext":{"properties":{"x":[{"type":"VARIABLE","notations":[]}]}}},"contentVersion":"2.0"}'
);

// $akitSessionId = null; // moved to config.php as it could be a request parameter

$akitHtml = null;
$akitMarks = -1;
if(strcmp($state, 'initial')==0) {
    // Create an AlgebraKiT session. The response from Algebrakit contains (among others):
    // - a session ID
    // - optimized HTML for quickly rendering the question in the DOM
    // - the total number of marks
    // TODO: We might be able to reduce latency by creating the akit and lrn sessions in parallel 
    //       To make this possible, the akit session ID should be known in advance (e.g. equal to the lrn session id)

    $CreateSessionsObj = new AlgebrakitSdk\CreateSessions($akitSpecs);
    $AkitResp = $CreateSessionsObj->create();
    $interactionResp = $AkitResp[0];
    if(!$interactionResp->success || !isset($interactionResp->sessions)) {
        echo 'Failed to create Algebrakit session';
    } else {
        $akitSessionId = $AkitResp[0]->sessions[0]->sessionId;
        $akitHtml = $AkitResp[0]->sessions[0]->html;
        $akitMarks = $AkitResp[0]->sessions[0]->marksTotal;
    }
}

// Create the Learnosity question object   
$responseId = "lrn-akit-$sessionId";
// $request = '{
//     "state": "' . $state . '",
//     "session_id": "' . $sessionId . '",
//     "showCorrectAnswers": false,
//     "questions": [
//         {
//             "response_id": "' . $responseId . '",
//             "type": "custom",
//             "js": {
//             "question": "/dist/question.js",
//             "scorer": "/dist/scorer.js"
//             },
//             "css": "/dist/question.css",
//             "instant_feedback": true,
//             "akit_id": "0559dfb3-e548-4da3-909a-ad3526722368"
//         }
//     ]
// }';

$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "showCorrectAnswers": false,
    "questions": [
        {
            "response_id": "' . $responseId . '",
            "type": "custom",
            "js": {
            "question": "/dist/question.js",
            "scorer": "/dist/scorer.js"
            },
            "css": "/dist/question.css",
            "instant_feedback": true,
            "akit_id": "akit-exercise-id",
            "akit_session_id": "'.$akitSessionId.'",
            "valid_response": "'.$akitSessionId.'",
            "akit_html": '.($akitHtml!=null?json_encode($akitHtml):'""').',
            "marks_total": '.$akitMarks.'
        }
    ]
}';


$requestData = json_decode($request, true);
$signedRequest = signAssessmentRequest($requestData);


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Questions API - Skeleton</title>
    <script src="//questions.staging.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
    </style>
</head>
<body>

<div class="client-question-info">
    Response ID: <code><?php echo $responseId; ?></code><br>
    Algebrakit Session ID: <code><?php echo $akitSessionId; ?></code>
</div>
<span class="learnosity-response question-<?php echo $responseId; ?>"></span>
<div class="client-save-wrapper">
    <span class="learnosity-save-button"></span>
</div>
<div id="redirect_response" class="client-hidden">
    Save Successful! Do you want to go to
    <button type="button" class="client-btn" data-action="resume">Resume</button> or
    <button type="button" class="client-btn" data-action="review">Review</button> mode ?
</div>
<div class="client-request-json">
    <div><b>Request init options</b></div>
    <textarea readonly></textarea>
</div>

<script>
    // some style configurations
    AlgebraKIT = {
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
    }
</script>

<?php 
    echo AlgebrakitSdk\getAkitScriptTag();
?>
<script>
    // The $akitHtml contains <script> tags, which seem to be not allowed in the browser, so replace them by something else...
    window.activity = <?php echo str_replace('script>', '_script>', $signedRequest); ?>;

    window.questionsApp = LearnosityApp.init(activity, {
        readyListener() {
            console.log('ready');
        },
        errorListener(e) {
            console.error(e);
        },
        saveSuccess(responseIds) {
            console.log('save success', responseIds);

            // for sharedScript.js to display resume/review options
            if (window.__onSaveSuccess) {
                window.__onSaveSuccess(responseIds);
            }
        },
    });

    <?php echo file_get_contents('../sharedAssessmentScript.js'); ?>
</script>
</body>
</html>
