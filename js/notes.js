
//time of creation, note content, note category

let notes = [
    { id:1, createdAt: new Date(),content: "dweddede", category: "random", dates: ["2/3/2000"], archived: false},
    { id:2, createdAt: new Date(),content: "dweddede", category: "random" ,  dates: ["2/3/2000"], archived: false},
    { id:3, createdAt: new Date(),content: "dweddede", category: "random" , dates: ["2/3/2000"], archived: false},
    { id:4, createdAt: new Date(),content: "dweddede", category: "random" , dates: ["2/3/2000"], archived: false},
    { id:5, createdAt: new Date(),content: "dweddede", category: "random", dates: ["2/3/2000"] , archived: false},
    { id:6, createdAt: new Date(),content: "dweddede", category: "random" , dates: ["2/3/2000"], archived: false},
    { id:7, createdAt: new Date(),content: "dweddede", category: "random" , dates: ["2/3/2000"], archived: false}
]

$(document).ready(function() {

    function formatDate(date){
        return `${date.getHours()}:${date.getMinutes()} ${date.getDay() - 1}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
    function edit(){

    }
    function createNoteRow(note){
        let row = $("<tr>");

        // Create and append the table cells with note data
        $("<td>").text(formatDate(note.createdAt)).appendTo(row);
        $("<td>").text(note.content).appendTo(row);
        $("<td>").text(note.category).appendTo(row);
        $("<td>").text(note.dates).appendTo(row);

        let actions = $("<td>").appendTo(row);
        $("<button>").text("Edit").appendTo(actions).on('click', function (){
            let rowIndex = $(this).closest("tr").index();
            openEditWindow(rowIndex);
        });
        $("<button>").text("Remove").appendTo(actions).on('click', function (){
            let rowIndex = $(this).closest("tr").index();
            notes = notes.filter(note => note.id !== rowIndex + 1)
            row = this.parentNode.parentNode
            row.parentNode.removeChild(row)

        });
        $("<button>").text("Archive").appendTo(actions).on('click', function (){
            let rowIndex = $(this).closest("tr").index();
            notes.at(rowIndex).archived = true;
            populateTable()
        });

        function openEditWindow(rowIndex) {
            let note = notes[rowIndex];
            // Populate the edit window with the note data
            $("#editRowIndex").val(rowIndex);
            $("#editContent").val(note.content);
            $("#editCategory").val(note.category);
            $("#editDates").val(note.dates.join(', '));

            // Display the edit window
            $("#editWindow").show();
        }




            return row;
    }
    function populateTable() {

        let tbody = $("#notes").html('');


        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            if(!note.archived) {
                let row = createNoteRow(note)
                row.appendTo(tbody);
            }
        }
    }

    // Call the function to populate the table when the page is loaded
    populateTable();

    function parseDates(text){

        let dateRegex = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g;
        let datesArray = text.match(dateRegex);
        console.log(datesArray)
        if (!datesArray) {
            return [];
        }

        return datesArray;
    }

    $("#createNoteButton").on("click", function(e) {
        e.preventDefault();
        let content = $("#noteInput").val()
        let newNote = {
            id: notes.length+1,
            createdAt: new Date(),
            content: content,
            category: $("#categorySelect").val(),
            dates: parseDates(content)
        }
        console.log(newNote.category)
       let newRow = createNoteRow(newNote)
        // Append the new row to the table body
        $("#notes").append(newRow);
    });

    $("#editForm").on("submit", function(event) {
        function closeEditWindow() {
            // Close the edit window
            $("#editWindow").hide();
        }
        event.preventDefault();
        // Get the edited data from the form
        let rowIndex = parseInt($("#editRowIndex").val());
        let content = $("#editContent").val()
        let editedNote = {
            id: notes[rowIndex].id,
            createdAt: notes[rowIndex].createdAt,
            content: content ,
            category: $("#editCategory").val(),
            dates: parseDates(content)
        };

        // Update the corresponding note in the notes array
        notes[rowIndex] = editedNote;


        // Update the table to reflect the changes
        populateTable();

        // Close the edit window
        closeEditWindow();

    })

    $("#closeEdit").on("click", function(e) {
        $("#editWindow").hide()
    })




})