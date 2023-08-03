//time of creation, note content, note category

let notes = [
    {name: "djdjdjd", id: 1, createdAt: new Date(), content: "dweddede", category: "Task", dates: ["2/3/2000"], archived: false},
    {name: "djdjdjd", id: 2, createdAt: new Date(), content: "dweddede", category: "Task", dates: ["2/3/2000"], archived: false},
    {name: "djdjdjd", id: 3, createdAt: new Date(), content: "dweddede", category: "Task", dates: ["2/3/2000"], archived: false},
    {name: "djdjdjd", id: 4, createdAt: new Date(), content: "dweddede", category: "Idea", dates: ["2/3/2000"], archived: false},
    {name: "djdjdjd", id: 5, createdAt: new Date(), content: "dweddede", category: "Idea", dates: ["2/3/2000"], archived: false},
    {name: "djdjdjd", id: 6, createdAt: new Date(), content: "dweddede", category: "Random Thought", dates: ["2/3/2000"], archived: false},
    {name: "djdjdjd", id: 7, createdAt: new Date(), content: "dweddede", category: "Random Thought", dates: ["2/3/2000"], archived: false}
]

const noteCategories = ["Task", "Random Thought", "Idea"]

const Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

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
        $("<td>").text(note.name).appendTo(row);
        $("<td>").text(formatDate(note.createdAt)).appendTo(row);
        $("<td>").text(note.content).appendTo(row);
        $("<td>").text(note.category).appendTo(row);
        $("<td>").text(note.dates).appendTo(row);

        let actions = $("<td>").appendTo(row);

        let editImage = $("<img>", {
            src: "../icons/edit.png",
            alt: "Edit",
            class: "table_icons", // Add any additional CSS classes if needed
        });

        let deleteImage = $("<img>", {
            src: "../icons/delete.png",
            alt: "Delete",
            class: "table_icons", // Add any additional CSS classes if needed
        });

        let archiveImage = $("<img>", {
            src: "../icons/archive.png",
            alt: "Archive",
            class: "table_icons", // Add any additional CSS classes if needed
        });

        $("<button>").append(editImage).appendTo(actions).addClass("table_button").on('click', function () {
            let row = $(this).closest("tr")
            let id = parseInt(row.find("td").eq(0).text());
            console.log("id", id)
            openEditWindow(id);
        });

        $("<button>").append(deleteImage).appendTo(actions).addClass("table_button").on('click', function () {
            let row = $(this).closest("tr")
            let id = parseInt(row.find("td").eq(0).text());
            notes = notes.filter(note => note.id !== id);
            populateTable()

        });

        $("<button>").append(archiveImage).appendTo(actions).addClass("table_button").on('click', function () {
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
            $("#editName").val(note.name);
            $("#editId").val(id);
            $("#editContent").val(note.content);
            $("#editCategorySelect").val(note.category);
            $("#editDates").val(note.dates.join(', '));
            // Display the edit window
            $("#editWindow").css("display", "flex");
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

        let unarchiveImage = $("<img>", {
            src: "../icons/unarchive.png",
            alt: "Archive",
            class: "table_icons", // Add any additional CSS classes if needed
        });

        $("<button>").append(unarchiveImage).appendTo(actions).addClass("table_button").on('click', function () {
            let row = $(this).closest("tr")
            let id = parseInt(row.find("td").eq(0).text());
            let idx = notes.findIndex(note => note.id === id)
            notes.at(idx).archived = false;
            populateTable()
            populateArchive();
        });

        return row;
    }

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
        return `${Months[date.getMonth()]} ${date.getDay()-1}, ${date.getFullYear()}`;
    }


    $("#createNoteButton").on("click", function (e) {
        e.preventDefault();
        let content = $("#noteInput").val()
        let newNote = {
            name: $("#noteName").val(),
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
        console.log("editId", id)

        let idx = notes.findIndex(note => note.id === id)
        let note = notes[idx]
        let content = $("#editContent").val()
        let editedNote = {
            name:  $("#editName").val(),
            id: id,
            createdAt: note.createdAt,
            content: content,
            category: $("#editCategorySelect").val(),
            dates: parseDates(content)
        };

        // Update the corresponding note in the notes array
        notes[idx] = editedNote;

        // Update the table to reflect the changes
        populateTable();
        // Close the edit window
        closeEditWindow();

    })

    $("#closeEdit").on("click", function () {
        $("#editWindow").hide()
    })

    $("#openCreateWindow").on("click", function () {
        $("#createNoteBlock").css("display", "flex")
    })
    $("#closeCreateWindow").on("click", function () {
        $("#createNoteBlock").css("display", "none")
    })

})