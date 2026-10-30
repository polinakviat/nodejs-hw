import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getNotes } from '../controllers/notesController.js';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
  getNoteSchema,
} from '../validations/notesValidation.js';

router.get('/notes', celebrate(getNoteSchema), getNotes);


const router = Router();

router.get('/notes', celebrate({ query: getAllNotesSchema }), getAllNotes);

router.get('/notes/:noteId', celebrate({ params: noteIdSchema }), getNoteById);

router.post('/notes', celebrate({ body: createNoteSchema }), createNote);

router.delete('/notes/:noteId', celebrate({ params: noteIdSchema }), deleteNote);

router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
