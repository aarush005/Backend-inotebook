const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');


// Route 1: Get all the notes using: Get "/api/auth/getuser", Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }

}
)

// Route 2: Add a new note using: POST "/api/auth/addnote", Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid name').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    try {


        const { title, description, tag } = req.body;

        // If there are errors, return bad request and the bad errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
}
)


// Route 3: Update an existing Note: POST "/api/notes/updatenote", Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;

    try {
        

    //Create a newNote Object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //Find the note to be update and update it 
    let note = await Note.findById(req.params.id)
    if(!note){return res.status(404).send("Note not found")};

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not allowed to update");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:Note})
    res.json({note});

    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})
// Route 4: Delete an existing Note: PUR "/api/notes/deletenote", Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
   
   try {
    
   
    //Find the note to be deleted 
    let note = await Note.findById(req.params.id)
    if(!note){return res.status(404).send("Note not found")};

    // Allow deletion only if user owns this
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not allowed to delete");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted", note:note});
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error")
}
})

module.exports = router