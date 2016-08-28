var method = SimpleAudioRecorder.prototype;

/**
 * @param {Object} settings
 * @constructor
 */
function SimpleAudioRecorder(settings) {
    if (!settings) {
        settings = {};
    }
    if (!settings.onerror) {
        settings.onerror = function (err) {
            console.log('Error: ' + err);
        };
    }
    if (!settings.onready) {
        settings.onready = function () {
            console.log('Ready!');
        };
    }
    if (!settings.onformatdetermined) {
        settings.onformatdetermined = function (mime) {
            console.log('Output file will be in format: ' + mime);
        };
    }
    if (!settings.onstarted) {
        settings.onstarted = function () {
            console.log('Started!');
        };
    }
    if (!settings.onstopped) {
        settings.onstopped = function (blob) {
            console.log('Stopped. ' + blob);
        };
    }
    method._settings = settings;

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
    if (!navigator.getUserMedia) {
        method._settings.onerror('The media recorder API isn\'t supported in this browser!');
        return;
    }

    navigator.getUserMedia(
        // constraints - only audio needed for this app
        {
            audio: true
        },

        // Success callback
        function (stream) {
            try {
                var mimeToUse = getMimeToUse();
                if (!mimeToUse) return;
                method._settings.onformatdetermined(mimeToUse);
                var options = {mimeType: mimeToUse};
                method._mediaRecorder = new MediaRecorder(stream, options);
            } catch (e) {
                method._settings.onerror(e);
                return;
            }
            if (!method._mediaRecorder) {
                method._settings.onerror('The media recorder API isn\'t supported in this browser!');
                return;
            }
            method._settings.onready();
        },

        // Error callback
        function (err) {
            method._settings.onerror('getUserMedia failed: ' + err);
        }
    );
}

function getMimeToUse() {
    if (MediaRecorder.isTypeSupported('audio/webm')) {
        return 'audio/webm';
    } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        return 'audio/ogg';
    } else {
        method._settings.onerror('This browser does not support webm or ogg audio recording! Please use Chrome or Firefox.');
        return null;
    }
}

function setupMediaRecorder() {
    method._chunks = [];
    var recorder = method._mediaRecorder;
    recorder.ondataavailable = function (e) {
        method._chunks.push(e.data);
    };
    recorder.onstop = function (e) {
        var blob = new Blob(method._chunks, {'type': 'audio/webm'});
        method._chunks = [];
        method._settings.onstopped(blob);
    };
}

method.start = function () {
    if (!method._mediaRecorder) {
        console.log('WARNING: The recorder has not been prepared yet. Wait for onready.');
        return;
    }
    setupMediaRecorder();
    method._mediaRecorder.start();
    method._settings.onstarted();
    console.log('mimeType: ' + method._mediaRecorder.mimeType);
};

method.stop = function () {
    method._mediaRecorder.stop();
};

method.release = function () {
    if (method._stream)
        method._stream.stop();
};

// module.exports = SimpleAudioRecorder;