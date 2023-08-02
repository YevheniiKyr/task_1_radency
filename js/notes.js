//time of creation, note content, note category

let notes = [
    {id: 1, createdAt: new Date(), content: "dweddede", category: "Task", dates: ["2/3/2000"], archived: false},
    {id: 2, createdAt: new Date(), content: "dweddede", category: "Task", dates: ["2/3/2000"], archived: false},
    {id: 3, createdAt: new Date(), content: "dweddede", category: "Task", dates: ["2/3/2000"], archived: false},
    {id: 4, createdAt: new Date(), content: "dweddede", category: "Idea", dates: ["2/3/2000"], archived: false},
    {id: 5, createdAt: new Date(), content: "dweddede", category: "Idea", dates: ["2/3/2000"], archived: false},
    {id: 6, createdAt: new Date(), content: "dweddede", category: "Random Thought", dates: ["2/3/2000"], archived: false},
    {id: 7, createdAt: new Date(), content: "dweddede", category: "Random Thought", dates: ["2/3/2000"], archived: false}
]

const noteCategories = ["Task", "Random Thought", "Idea"]

$(document).ready(function () {



    populateTable();
    populateArchive();
    populateStats();

    function populateTable() {

        let tbody = $("#notes").html('');

        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            if (!note.archived) {
                let row = createNoteRow(note)
                row.appendTo(tbody);
            }
        }
        populateStats();
    }

    function populateArchive() {

        let tbody = $("#archivatedTasks").html('');

        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            if (note.archived) {
                let row = createArchivatedNoteRow(note)
                row.appendTo(tbody);
            }
        }
        populateStats();
    }

    function populateStats() {
        let tbody = $("#statsTasks").html('');

        for (const category of noteCategories) {
            let row = createCategoryStatsRow(category)
            row.appendTo(tbody);
        }
    }




    function createCategoryStatsRow(category) {
        let row = $("<tr>");
        let notesOfCategory = notes.filter(note => note.category === category)
        let archived = notesOfCategory.filter(note => note.archived === true).length
        // Create and append the table cells with note data
        $("<td>").text(category).appendTo(row);
        $("<td>").text(notesOfCategory.length - archived).appendTo(row);
        $("<td>").text(archived).appendTo(row);


        return row;
    }

    function createNoteRow(note) {

        let row = $("<tr>");

        // Create and append the table cells with note data
        $("<td style='display: none;'>").text(note.id).appendTo(row);
        $("<td>").text(formatDate(note.createdAt)).appendTo(row);
        $("<td>").text(note.content).appendTo(row);
        $("<td>").text(note.category).appendTo(row);
        $("<td>").text(note.dates).appendTo(row);

        let actions = $("<td>").appendTo(row);

        $("<button>").text("Edit").appendTo(actions).on('click', function () {
            //   let rowIndex = $(this).closest("tr").index();
            let row = $(this).closest("tr")
            let id = parseInt(row.find("td").eq(0).text());
            console.log("id", id)
            openEditWindow(id);
        });

        $("<button>").text("Remove").appendTo(actions).on('click', function () {

            let row = $(this).closest("tr")
            let id = parseInt(row.find("td").eq(0).text());
            notes = notes.filter(note => note.id !== id);
            populateTable()

        });

        $("<button>").text("Archive").appendTo(actions).on('click', function () {
            let row = $(this).closest("tr")
            let id = parseInt(row.find("td").eq(0).text());
            let idx = notes.findIndex(note => note.id === id)
            notes.at(idx).archived = true;
            populateTable()
            populateArchive();
        });


        function openEditWindow(id) {

            let idx = notes.findIndex(note => note.id === id)
            let note = notes[idx];
            console.log(idx)
            // Populate the edit window with the note data
            $("#editId").val(id);
            $("#editContent").val(note.content);
            $("#editCategory").val(note.category);
            $("#editDates").val(note.dates.join(', '));

            // Display the edit window
            $("#editWindow").show();
        }


        return row;
    }


    function createArchivatedNoteRow(note) {

        let row = $("<tr>");

        $("<td style='display: none;'>").text(note.id).appendTo(row);
        // Create and append the table cells with note data
        $("<td>").text(formatDate(note.createdAt)).appendTo(row);
        $("<td>").text(note.content).appendTo(row);
        $("<td>").text(note.category).appendTo(row);
        $("<td>").text(note.dates).appendTo(row);

        let actions = $("<td>").appendTo(row);

        $("<button>").text("Unarchive").appendTo(actions).on('click', function () {

            let row = $(this).closest("tr")
            let id = parseInt(row.find("td").eq(0).text());
            let idx = notes.findIndex(note => note.id === id)
            notes.at(idx).archived = false;
            populateTable()
            populateArchive();
        });


        return row;
    }




    // Call the function to populate the table when the page is loaded


    function parseDates(text) {

        let dateRegex = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g;
        let datesArray = text.match(dateRegex);
        console.log(datesArray)
        if (!datesArray) {
            return [];
        }

        return datesArray;
    }

    function formatDate(date) {
        return `${date.getHours()}:${date.getMinutes()} ${date.getDay() - 1}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }


    $("#createNoteButton").on("click", function (e) {
        e.preventDefault();
        let content = $("#noteInput").val()
        let newNote = {
            id: notes.length + 1,
            createdAt: new Date(),
            content: content,
            category: $("#categorySelect").val(),
            dates: parseDates(content),
            archived: false
        }
        console.log(newNote.category)
        let newRow = createNoteRow(newNote)
        notes.push(newNote)
        // Append the new row to the table body
        $("#notes").append(newRow);
        populateStats();
    });


    $("#openArchive").on("click", function (e) {
        e.preventDefault()
        $("#archive").show()
        $("#closeArchive").show()
        $("#openArchive").hide()
    })


    $("#closeArchive").on("click", function () {
        $("#archive").hide()
        $("#closeArchive").hide()
        $("#openArchive").show()
    })

    $("#editForm").on("submit", function (event) {
        event.preventDefault();
        function closeEditWindow() {
            // Close the edit window
            $("#editWindow").hide();
        }

        // Get the edited data from the form
        let id = parseInt($("#editId").val());
        let idx = notes.findIndex(note => note.id === id)

        let content = $("#editContent").val()
        let editedNote = {
            id: id,
            createdAt: notes[idx].createdAt,
            content: content,
            category: $("#editCategory").val(),
            dates: parseDates(content)
        };

        // Update the corresponding note in the notes array
        notes[idx] = editedNote;

        // Update the table to reflect the changes
        populateTable();

        // Close the edit window
        closeEditWindow();

    })

    $("#closeEdit").on("click", function (e) {
        $("#editWindow").hide()
    })


})