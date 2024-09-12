const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4, v4 } = require("uuid");



const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    const { title, text } = req.body;
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };

      const parsedNotes = JSON.parse(data);
      parsedNotes.push(newNote);
      fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (err) => {
        console.log(err);
      });
      res.json("Note added succesfully");
    }
  });
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(JSON.parse(data));
  });
});

app.get("/api/notes/:id", (req, res) => {
  const noteID = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    const singleNote = JSON.parse(data);

    const notes = singleNote.filter((note) => note.id === noteID);
    return notes.length > 0
      ? res.json(notes)
      : res.json("No note with that ID");
  });
});

app.delete('/api/notes/:id', (req,res)=> {
    const noteID = req.params.id
    fs.readFile("./db/db.json", "utf8", (err,data) => {
        if(err){
            console.log(err)
        }
        const deleteNote = JSON.parse(data)

        const result = deleteNote.filter((removedNote)=> removedNote.id !== noteID)

        fs.writeFile('./db/db.json', JSON.stringify(result), (err) => {
            if(err){
                console.error(err)
            }
        })

        res.json("Success")
    })
})

app.listen(PORT, () => {
  console.log(`App is listening on port http://localhost:${PORT}`);
});
