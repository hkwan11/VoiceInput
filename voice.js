//setup initial variable values
var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

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
        // showInfo('info_speak_now');
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

    // recognition.onend = function() {
    //     recognizing = false;
    //     if (ignore_onend) {
    //         return;
    //     }
    //     start_img.src = 'mic.gif';
    //     if (!final_transcript) {
    //         showInfo('info_name');
    //         return;
    //     }
    //     showInfo('');
    //     if (window.getSelection) {
    //         window.getSelection().removeAllRanges();
    //         var range = document.createRange();
    //         range.selectNode(document.getElementById('final_span'));
    //         window.getSelection().addRange(range);
    //     }
    // };
    
    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = 'mic.gif';
        // if (!final_transcript) {
        //     showInfo('info_name');
        //     return;
        // }
        // showInfo('');
        // if (window.getSelection) {
        //     window.getSelection().removeAllRanges();
        //     var range = document.createRange();
        //     range.selectNode(document.getElementById('final_span'));
        //     window.getSelection().addRange(range);
        // }
        // if (create_email) {
        //     create_email = false;
        //     createEmail();
        // }
    };

    fields = ['f_first', 'f_middle', 'f_last', 'f_email', 'f_phone', 'f_address']
    currentfield = 0

    //collects voice results into final and interim transcripts
    recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                console.log("Final: " + event.results[i][0].transcript)
            } 
            else {
                interim_transcript += event.results[i][0].transcript;
                console.log("Interim: " + event.results[i][0].transcript)
            }
        }


        //splits up the final transcript into capitalized words in an array ie. [John, Warren, Smith]
        final_transcript = (linebreak(capitalize(final_transcript))).split(" "); 
        //assigns fid to specific field id based on currentfield index
        fid = getcurrentfield();
        //selects the html element with specific fid and updates html field to equal to the correct element in the final_transcript array
        console.log("Entire transcript: " + final_transcript.toString());
        $(fid).html(final_transcript[currentfield])
        //updates current highlighted div
        updatecurrent();
        

        // final_span.innerHTML   = linebreak(final_transcript);
        // interim_span.innerHTML = linebreak(interim_transcript);

        //var temp = final_transcript.split(" ")
        //fills in data based on first word
        // //Name Indicator
        // if (temp[0] == 'Name') {
        //     // first_name.innerHTML  = temp[1];
        //     // middle_name.innerHTML = temp[2];
        //     // last_name.innerHTML   = temp[3];
        //     $("#testname").html(final_transcript)
        // }
        // if (temp[0] == 'Address') {
        //     // street_number.innerHTML = temp[1];
        //     // street_name.innerHTML = temp[2];
        //     // city.innerHTML = temp[4]; //to account for "street", "avenue", etc.
        //     // state.innerHTML= temp[5];
        //     // zipcode.innerHTML = temp[6];
        //     $("#testaddress").html(final_transcript)
        // }
        // if (final_transcript || interim_transcript) {
        //     showButtons('inline-block');
        // }
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
    getcurrentfield().closest("div").addClass("currentfield")
}

function updatecurrent() {
    getcurrentfield().closest("div").removeClass("currentfield")
    currentfield += 1
    getcurrentfield().closest("div").addClass("currentfield")
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

// function showInfo(s) {
//     if (s) {
//         for (var child = info.firstChild; child; child = child.nextSibling) {
//             if (child.style) {
//                 child.style.display = child.id == s ? 'inline' : 'none';
//             }
//         }
//         info.style.visibility = 'visible';
//     } 
//     else {
//         info.style.visibility = 'hidden';
//     }
// }