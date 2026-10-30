import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
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
} from '../validations/notesValidation.js';

const router = Router();

// Єдиний маршрут для отримання всіх нотаток з фільтрацією та пагінацією
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

router.get('/notes/:noteId', celebrate({ [Segments.PARAMS]: noteIdSchema }), getNoteById);

router.post('/notes', celebrate({ [Segments.BODY]: createNoteSchema }), createNote);

router.delete('/notes/:noteId', celebrate({ [Segments.PARAMS]: noteIdSchema }), deleteNote);

// Оновлення нотатки з валідацією як params (noteIdSchema), так і body (updateNoteSchema)
router.patch(
  '/notes/:noteId',
  celebrate({
    [Segments.PARAMS]: noteIdSchema,
    [Segments.BODY]: updateNoteSchema,
  }),
  updateNote,
);

export default router;
