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
                method._mediaRecorder = new MediaRecorder(stream);
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

function setupMediaRecorder() {
    method._chunks = [];
    var recorder = method._mediaRecorder;
    recorder.ondataavailable = function (e) {
        method._chunks.push(e.data);
    };
    recorder.onstop = function (e) {
        var blob = new Blob(method._chunks, { 'type': 'audio/webm'});
        method._chunks = [];
        method._settings.onstopped(blob);
    };
}

method.start = function () {
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