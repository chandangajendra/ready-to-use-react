import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "Genral"
    },
    date: {
        type: Date,
        default: Date.now
    }
}
);

const Notes = mongoose.model('Notes', NotesSchema);
model.exports = Notes;

