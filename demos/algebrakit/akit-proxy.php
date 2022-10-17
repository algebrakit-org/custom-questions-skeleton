<?php

// --------------------------------------------------------------------------------------------------------------------
//
// This is a proxy to the Algebrakit webservice, which is required to access restricted functionality of 
// Algebrakit. For example: creating new Algebrakit sessions.
//
// This is just a temporary proxy for development. Ultimately, the proxy should perform the following tasks:
// - validate that the call is legitimate. Does the caller have a valid Learnosity/Algebrakit licence?
// - add the x-api-key header to the call
//
// This proxy gets the target URL from a request parameter. This is good enough for now, but the Algebrakit 
// frontend components (e.g. the authoring tool) expects the proxy to work through the URL directly.
// E.g. a POST to /algebrakit/session/create on Learnosity should be proxied to htts://algebrakit.com/session/create.
//
// --------------------------------------------------------------------------------------------------------------------

// const AKIT_HOST = 'https://api.algebrakit.com';      // for testing

const AKIT_HOST = 'http://localhost:3000';      // for testing

// The API Key provides access to the Algebrakit webservice
const AKIT_API_KEY = 'YWxnZWJyYWtpdC5DTVMtTWFydGlqbi42YTQzMGM1ZjRiZTQxZGExMmVhNjc3NTU1OTNlY2IwMDg3YzczMTQ2Nzk5ZDdiNmIyNmE2NWJmNWFiZjY2NjgyYjkzY2ZmMTcxMzM5ODQ2NzQ3MWIyOWNiNjdlZWQxZjg=';

if (!function_exists('curl_version')) {
    die("cURL extension is not loaded!");
}

$url = $_GET['url'];
$data= file_get_contents('php://input');

$curl = curl_init(AKIT_HOST.$url);
    
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-type: application/json", "x-api-key: ".AKIT_API_KEY));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

$json_response  = curl_exec($curl);

header('Content-Type: application/json');
echo($json_response);
exit();

?>
