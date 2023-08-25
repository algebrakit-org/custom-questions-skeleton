import {AKIT_API_KEY, AKIT_HOST, AKIT_SCRIPT_SRC, AKIT_CONFIG} from '../config';

/**
 * Create or retrieve a single session from a reference to an exercise in the Algebrakit CMS.
 * The sessionId is used as follows:
 * - If the session already exists, it is returned. No new session is created in that case.
 * - Otherwise, a session is created for the exercise. The new session will get the provided session Id.
 * Notes: Algebrakit supports creating multiple sessoins in one batch call. However, this implementation 
 * can create only one.
 * @param {string} exerciseId 
 * @param {string} sessionId 
 * @returns 
 */
export function createSession(exerciseId, sessionId) {
    return jsonPost('/session/create', {
            exercises: [{
                exerciseId: exerciseId,
                version: 'latest',
                _overrideSessionId: sessionId
            }],
            assessmentMode: false,
            'api-version': 2
    })
    .then(resp => {
        if(!resp || resp.length!=1 || !resp[0].success) throw Error('Failed to create Algebrakit session');
        return resp[0].sessions[0];
    });
}

export function getScoreForSession(sessionId) {
    return jsonPost('/session/score', {
            sessionId: sessionId,
            'api-version': 2
    }).catch(err => {
        if(!err) err = `Exception occurred while trying to get score from Algebrakit for sessionId=${sessionId}`;
        console.log(err);
        throw err;
    });
}

function jsonPost(url, body) {
    return fetch(AKIT_HOST+url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'x-api-key': AKIT_API_KEY
        },
        body: JSON.stringify(body)
    }).then(resp => {
        if(resp && resp.status == 200) {
            return resp.json();
        } else {
            throw `JSON post returned status ${resp.status}`;
        }
    })

}


/**
 * Load the Algebrakit frontend API by adding the <script src="https://widgets.algebrakit.com/akit-widgets.min.js"> to the DOM.
 * Returns when the script is loaded and executed (and so the AlgebraKIT object is available).
 */
export function addAkitScriptTagIfNeccessary() {
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
