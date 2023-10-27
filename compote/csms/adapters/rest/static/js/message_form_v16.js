/*global $, ace, console*/
$('document').ready(function () {
    const enumItems = window.filenames;
    const titleMap = Object.fromEntries(window.filenames.map((name) => [name, name]));
    console.log(enumItems)

    var formObject = {
        schema: {
            message: {
                title: 'JSON Form message to start from',
                type: 'string',
                'enum': enumItems,
                'default': 'UnlockConnector'
            },
            greatform: {
                title: 'JSON Form object to render',
                type: 'string'
            }
        },
        form: [
            {
                key: 'message',
                notitle: true,
                repend: 'Try with',
                htmlClass: 'trywith',
                titleMap: titleMap,
                onChange: function (evt) {
                    var selected = $(evt.target).val();
                    loadMessage(selected);
                    if (history) history.pushState(
                        {message: selected},
                        'Message - ' + selected,
                        '?message=' + selected);
                    window.selectedValue = selected;
                }
            },
            {
                key: 'greatform',
                type: 'ace',
                aceMode: 'json',
                width: '100%',
                height: '' + (window.innerHeight - 800) + 'px',
                notitle: true,
                onChange: function () {
                    generateForm();
                }
            }
        ]
    };
    /**
     * Extracts a potential form to load from query string
     */
    var getRequestedMessage = function () {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        var param = null;
        for (var i = 0; i < vars.length; i++) {
            param = vars[i].split('=');
            if (param[0] === 'message') {
                if (param[1].charAt(param[1].length - 1) == '/')
                    return param[1].replace('/', '');
                return param[1];
            }
        }
        return null;
    };

    /**
     * Loads and displays the message identified by the given name
     */
    var loadMessage = function (message) {
        $.ajax({
            url: '../../static/json/16/' + message + '.json',
            dataType: 'text'
        }).done(function (code) {
            var aceId = $('#form .ace_editor').attr('id');
            var editor = ace.edit(aceId);
            editor.getSession().setValue(code);
            console.log(message)
        }).fail(function () {
            $('#result').html('Sorry, I could not retrieve the message!');
        });
    };


    /**
     * Displays the form entered by the user
     * (this function runs whenever once per second whenever the user
     * changes the contents of the ACE input field)
     */

    var counter = 1;

    var generateForm = function () {
        var values = $('#form').jsonFormValue();

        // Reset result pane
        $('#result').html('');

        // Parse entered content as JavaScript
        // (mostly JSON but functions are possible)
        var createdForm = null;
        try {
            // Most messages should be written in pure JSON,
            // but playground is helpful to check behaviors too!
            eval('createdForm=' + values.greatform);
        } catch (e) {
            $('#result').html('<pre>Entered content is not yet a valid' +
                ' JSON Form object.\n\nJavaScript parser returned:\n' +
                e + '</pre>');
            return;
        }

        // Render the resulting form, binding to onSubmitValid
        try {
            createdForm.onSubmitValid = function (values) {
                if (console && console.log) {
                    console.log('Values extracted from submitted form', values);
                    console.log('message sent', values);

                }
                var endpoint = values.message; // get the value of the dropdown field
                console.log(endpoint);

                var selected = window.selectedValue.toLowerCase()


                var settings = {
                    "url": "/api/context/0/v16/" + selected,
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify(values),
                };


                $.ajax(settings).done(function (response) {
                    // Remove line breaks after { and before } in values
                    const formattedValues = JSON.stringify(values, null, 2)
                        .replace(/^{/, '').replace(/}$/, '')
                        .replace(/^\s+/gm, ''); // Remove leading spaces

                    const table = document.getElementById('input-output-table');
                    const newRow = table.insertRow(1);

                    const counterCell = newRow.insertCell(0);
                    counterCell.textContent = counter;

                    const selectedCell = newRow.insertCell(1);
                    selectedCell.textContent = selected;

                    const inputCell = newRow.insertCell(2);
                    inputCell.textContent = formattedValues;

                    const outputCell = newRow.insertCell(3);
                    outputCell.textContent = JSON.stringify(response);

                    // Show the table after the first entry
                    document.getElementById('table-container').style.display = 'block';

                    counter++;
                });
                window.alert('Form submitted. Values object:\n' +
                    JSON.stringify(values, null, 2));
            };
            createdForm.onSubmit = function (errors, values) {
                if (errors) {
                    console.log('Validation errors', errors);
                    return false;
                }
                return true;
            };
            $('#result').html('<form id="result-form" class="form-vertical"></form>');
            $('#result-form').jsonForm(createdForm);
        } catch (e) {
            $('#result').html('<pre>Entered content is not yet a valid' +
                ' JSON Form object.\n\nThe JSON Form library returned:\n' +
                e + '</pre>');
            return;
        }
    };

    // Render the form
    $('#form').jsonForm(formObject);

    // Wait until ACE is loaded
    var itv = window.setInterval(function () {
        var message = getRequestedMessage() || 'UnlockConnector';
        $('.trywith select').val(message);
        if (window.ace) {
            window.clearInterval(itv);
            loadMessage(message);
        }
    }, 1000);
});
