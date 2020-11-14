const { response } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { request } = require("http");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let notes = [];

app.listen(PORT, () => {
    console.log("listining on PORT " + PORT);
});

app.get("/notes", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "index.html"))
});

app.get("/api/notes", (request, response) => {
    readNoteFromFile();
    response.json(notes);
})

app.get("/api/notes/:id", (request, response) => {
    response.json(notes.filter(note => note.id === request.params.id));
})

app.post("/api/notes", (request, response) => {
    let note = request.body;
    note.id = "" + (notes.length + 1);
    notes.push(note);
    writeNoteToFile();
    response.json(notes);

})

app.delete("/api/notes/:id", (request, response) => {
    notes = notes.filter(note => {
        return note.id !== request.params.id;
    });
    writeNoteToFile();
    response.json(notes);
})


const writeNoteToFile = () => {
    fs.writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(notes), (error) => {
        if (error) throw error;
    });
}

const readNoteFromFile = () => {
    fs.readFileSync(path.join(__dirname, "db", "db.json"), "utf8", (error, data) => {
        if (error) {
            throw error;
        }
        if (data === "") {
            notes = [];
        } else {
            notes = JSON.parse(data);
        }
    });
}



