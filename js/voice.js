//setup initial variable values
var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

$(document).ready(function() {
        highlightcurrent()
    }
    )

if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} 
else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        start_img.src = 'mic-animate.gif';
    };

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            start_img.src = 'mic.gif';
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = 'mic.gif';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } 
            else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };
    
    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = 'mic.gif';
    };

    fields = ['first_name_textbox','middle_name_textbox','last_name_textbox','email_textbox', 'phone_textbox', 'address_textbox', 'city_textbox', 'state_selectbox', 'zipcode_textbox']
    currentfield = 0

    //collects voice results into final and interim transcripts
    recognition.onresult = function(event) {
        console.log("onresult")
        var interim_transcript = ""
        var final_transcript = ""
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                console.log("Final: " + event.results[i][0].transcript)
            } 
            else {
                interim_transcript += event.results[i][0].transcript;
                return;
            }
        }

        //slice to take out extra space preceding word
        if (fields[currentfield] == 'first_name_textbox') {
             final_transcript = linebreak(capitalize(final_transcript));
        }
        else {
            final_transcript = linebreak(capitalize(final_transcript)).slice(1); 
        }
        console.log("Final outside loop: " + final_transcript)
        //assigns fid to specific field id based on currentfield index
        fid = getcurrentfield();
        //selects the html element with specific fid and updates html field to equal to the correct element in the final_transcript array
        if (final_transcript == 'Back') {
            final_transcript = '';
            moveBack();
            return
        }
        if (final_transcript == 'Next') {
            final_transcript = '';
            updatecurrent();
            return
        }
        if (final_transcript == 'Delete') {
            final_transcript = '';
            $(fid).val(final_transcript);
            return
        }

        if  (fields[currentfield] == 'email_textbox') {
            final_transcript = final_transcript.split(" ").join('').replace(/(\S+)(at)(\S+)(\.)(\S+)/, '$1@$3$4$5');
            final_transcript = final_transcript.split(" ").join('').replace('underscore', '_');
            final_transcript = final_transcript.split(" ").join('').replace('dot', '.');
            $(fid).val(final_transcript); 
        }
        if  (fields[currentfield] == 'phone_textbox') {
            console.log('prev phone: ' + final_transcript)
            final_transcript = final_transcript.split(" ").join('').replace(/(\d\d\d)(-)(\d\d\d)(-)(\d\d\d\d)/, '($1) $3$4$5');
            console.log('final phone: ' + final_transcript)
            $(fid).val(final_transcript);     
        }
        if (fields[currentfield] == 'address_textbox') {
            $(fid).val(final_transcript);
        }
        else {
            //final_transcript = final_transcript.split(" ").join('');
            $(fid).val(final_transcript);
        }
        //console.log("Entire transcript: " + final_transcript_array.toString());
        //updates current highlighted div
        updatecurrent();
    };
} //ends else statement

function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function getcurrentfield() {
    fid = "#" + fields[currentfield]
    return $(fid)
}

function highlightcurrent() {
    getcurrentfield().closest("div.form-group").find("label").addClass("currentfield")
}

function updatecurrent() {
    getcurrentfield().closest("div.form-group").find("label").removeClass("currentfield")
    currentfield += 1
    getcurrentfield().closest("div.form-group").find("label").addClass("currentfield")
}

function moveBack() {
    getcurrentfield().closest("div.form-group").find("label").removeClass("currentfield")
    currentfield -= 1
    getcurrentfield().closest("div.form-group").find("label").addClass("currentfield")
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript       = '';
    recognition.start();
    ignore_onend           = false;
    // final_span.innerHTML   = '';
    // interim_span.innerHTML = '';
    start_img.src          = 'mic-slash.gif';
    // showInfo('info_allow');
    start_timestamp        = event.timeStamp;
    highlightcurrent()
    
}