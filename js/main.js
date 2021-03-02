feather.replace()

const colors = document.querySelector("#menu-colors")
const notes = document.querySelector("#notes")
const noteModel = document.querySelector("#note-model")
const NOTES_KEY = "@notehub-notes"

const selectColor = (e) =>{
    var element = e.target
    var color = element.style.backgroundColor
    colors.classList.toggle("show")
    createNote(color)
}

const toggleColors = (e) =>{
    e.preventDefault()
    colors.classList.toggle("show")
}

(loadNotes = ()=>{
    if(localStorage.getItem(NOTES_KEY)){
        const prevNotes = JSON.parse(localStorage.getItem(NOTES_KEY))
        notes.innerHTML = ""
        for (const note of prevNotes) {
            const noteElement = noteModel.cloneNode(true)
            noteElement.children[0].innerHTML = note.date
            noteElement.classList.remove("hide")
            noteElement.style.backgroundColor = note.bgColor
            noteElement.children[1].innerHTML = note.content
            noteElement.children[1].dataset.edit = note.id
            noteElement.id = note.id
            noteElement.children[2].children[0].dataset.delete = note.id
            notes.append(noteElement)
        }
    }
    
})()

const createNote = (color) =>{
    
    const note = {
        date: new Date().toLocaleString(),
        bgColor: color,
        content: "",
        id:create_UUID()
    }
    if(!localStorage.getItem(NOTES_KEY)){
        localStorage.setItem(NOTES_KEY,JSON.stringify([note]))
    }else{
        const prevNotes = JSON.parse(localStorage.getItem(NOTES_KEY))
        const updatedNotes = [...prevNotes,note]
        localStorage.setItem(NOTES_KEY,JSON.stringify(updatedNotes))
    }
    loadNotes()
    saveAnimation()


}

const deleteNote = (e) =>{const prevNotes = JSON.parse(localStorage.getItem(NOTES_KEY))
    const deleteId = e.target.dataset.delete
    const updatedNotes = prevNotes.filter(note =>{
        return note.id != deleteId
    })
    localStorage.setItem(NOTES_KEY,JSON.stringify(updatedNotes))
    loadNotes()
    saveAnimation()
    
}
const deleteAll = () =>{
    localStorage.setItem(NOTES_KEY,JSON.stringify([]))
    loadNotes()
    saveAnimation()
}
const checkDelete = (e,type) =>{
    Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: type == 'note'? 'Yes, delete it!' : 'Yes, delete all notes'
    }).then((result) => {
    if (result.isConfirmed) {
        if(type == 'note'){
            deleteNote(e)
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }else{
            deleteAll()
            Swal.fire(
                'Deleted!',
                'All notes has been deleted.',
                'success'
            )
        }
        
    }
    })
}

const handleType = (e) =>{

    const prevNotes = JSON.parse(localStorage.getItem(NOTES_KEY))
    const noteId = e.target.dataset.edit
    const indexForUpdate = prevNotes.findIndex(note => note.id == noteId)
    prevNotes[indexForUpdate].content = e.target.innerHTML
    localStorage.setItem(NOTES_KEY,JSON.stringify(prevNotes))
    saveAnimation()
}

const saveAnimation = () =>{
    document.querySelector("#saving-status").style.visibility = "visible"
    setTimeout(()=>{
        document.querySelector("#saving-status").style.visibility = "hidden"
    },1000)
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}




    