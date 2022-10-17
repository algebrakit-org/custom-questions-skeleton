<?php
include_once '../config.php';

$request = '
{
  "config": {
    "dependencies": {
      "question_editor_api": {
        "init_options": {
          "question_type_templates": {
            "akit_question_skeleton": [
              {
                "name": "Algebrakit",
                "description": "An Algebrakit question",
                "group_reference": "other",
                "defaults": {
                  "type": "custom",
                  "stimulus": "Enter an optional stimulus here",
                  "akit_exercise_id" : "0559dfb3-e548-4da3-909a-ad3526722368",
                  "instant_feedback": true,
                  "js": {
                    "question": "http://localhost/akit/learnosity-akit/dist/question.js",
                    "scorer": "http://localhost/akit/learnosity-akit/dist/scorer.js"
                  },
                  "css": ""
                }
              }
            ]
          },
          "custom_question_types": [
            {
              "custom_type": "akit_question_skeleton",
              "type": "custom",
              "name": "Algebrakit Question",
              "editor_layout": "http://localhost/akit/learnosity-akit/dist/authoring_custom_layout.html",
              "js": {
                "question": "http://localhost/akit/learnosity-akit/dist/question.js",
                "scorer": "http://localhost/akit/learnosity-akit/dist/scorer.js"
              },
              "css": "",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "properties": {
                    "akit_exercise_id": {
                      "type": "string",
                      "name": "Algebrakit ID",
                      "description": "Reference to the exercise in the Algebrakit CMS",
                      "required": true
                    },
                    "instant_feedback": {
                      "name": "Check answer button",
                      "description": "Enables the Check Answer button underneath the question, which will provide the student with instant feedback on their response(s).",
                      "type": "boolean",
                      "required": false,
                      "default": false
                    }
                }
              }
            }
          ]
        }
      }
    }
  }
}
';
$signedRequest = signAuthoringRequest(json_decode($request, true));

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Author API - Skeleton</title>
    <script src="//authorapi.staging.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
    </style>
</head>
<body>
<div id="learnosity-author"></div>
<div>
    <div class="client-request-json" data-type="initOptions">
        <div><b>Request init options</b></div>
        <textarea readonly></textarea>
    </div>
    <div class="client-request-json" data-type="htmlLayout">
        <div><b>Custom Question HTML Layout</b></div>
        <textarea readonly></textarea>
    </div>
</div>

<script>
    window.activity = <?php echo $signedRequest; ?>;

    window.questionEditorApp = LearnosityAuthor.init(activity, {
        readyListener() {
            console.log('ready');
        },
        errorListener(e) {
            console.error(e);
        },
    });

    // Display the current request init options & html layout
    document.querySelector('[data-type="initOptions"] > textarea').value = `${JSON.stringify(window.activity, null, 2)}`;
    document.querySelector('[data-type="htmlLayout"] > textarea').value = `<?php echo (file_get_contents('dist/authoring_custom_layout.html')) ?>`;
</script>
</body>
</html>
