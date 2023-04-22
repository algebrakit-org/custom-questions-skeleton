<?php
include_once '../config.php';

$QUESTION_URL = "http://localhost/akit/learnosity-akit/dist/question.js";
$SCORER_URL   = "http://localhost/akit/learnosity-akit/dist/scorer.js";
// $QUESTION_URL = "https://demo.algebrakit.nl/learnosity/question.js";
// $SCORER_URL   = "https://demo.algebrakit.nl/learnosity/scorer.js";

$responseId = "custom-$sessionId";
$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "showCorrectAnswers": true,
    "questions": [
        {
          "response_id": "' . $responseId . '",
          "type": "custom",
          "stimulus": "Stimulus of the custom question",
          "js": {
            "question": "'.$QUESTION_URL.'",
            "scorer": "'.$SCORER_URL.'"
          },
          "css": "",
          "instant_feedback": true,
          "akit_exercise_id": "0559dfb3-e548-4da3-909a-ad3526722368",
          "valid_response": "not applicable",
          "score": 1
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
    // The $akitHtml contains <script> tags, which seem to be not allowed in the browser, so replace them by something else...
    window.activity = <?php echo $signedRequest; ?>;

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
