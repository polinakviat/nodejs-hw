import { Router } from 'express';
import {
  createNote,
  getAllNotes,
  getNoteByID,
  deleteNote,
  updateNote
}
  from '../controllers/notesController.js';

const router = Router();

router.get('/', getAllNotes);
router.get('/:noteId', getNoteByID);
router.post('/', createNote);
router.delete('/:noteId', deleteNote);
router.patch('/:noteId', updateNote);

export const notesRouter = router;


export default router;
