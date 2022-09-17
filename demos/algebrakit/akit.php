<?php

    namespace AlgebrakitSdk;

    const AKIT_HOST = 'https://api.algebrakit.com';
    const WIDGETS_HOST = 'https://widgets.algebrakit.com';
    const MINIFIED = true;
    
    // const AKIT_HOST = 'http://localhost:3000';      // for testing
    // const WIDGETS_HOST = 'http://localhost:4000';
    // const MINIFIED = true;

    // The API Key provides access to the Algebrakit webservice
    const AKIT_API_KEY = 'YWxnZWJyYWtpdC5DTVMtTWFydGlqbi42YTQzMGM1ZjRiZTQxZGExMmVhNjc3NTU1OTNlY2IwMDg3YzczMTQ2Nzk5ZDdiNmIyNmE2NWJmNWFiZjY2NjgyYjkzY2ZmMTcxMzM5ODQ2NzQ3MWIyOWNiNjdlZWQxZjg=';

    function getAkitScriptTag() {
        $minStr = MINIFIED?'.min':'';
        return "<script src='".WIDGETS_HOST."/akit-widgets$minStr.js'></script>";  
    }

    class CreateSessions {
        
        const ENDPOINT_CREATE_SESSION = '/session/create';

        private array $specs;

        public function __construct(array $specs) {
            $this->specs = $specs;
        }

        public function create() {
            $req  = $this->_createRequest();
            $resp = $this->_send($req);
            return $resp;
        }

        private function _createRequest() {
            $exercises = array();
            foreach($this->specs as $spec) {
                $exercises[] = array(
                    'exerciseSpec' => json_decode($spec)
                );
            }
            $request = array(
                'api-version' => '2',
                'exercises' => $exercises
            );
            return $request;
        }

        private function _send($data) {
            $curl = curl_init(AKIT_HOST.self::ENDPOINT_CREATE_SESSION);
    
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-type: application/json", "x-api-key: ".AKIT_API_KEY));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
         
            $json_response  = curl_exec($curl);
            $sessionData = json_decode($json_response);
            return $sessionData;
        }
    }

?>