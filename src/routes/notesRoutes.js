import { Router } from "express";
import { celebrate } from "celebrate";
import {
  getNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from "../controllers/notesController.js";
import {
  createNoteSchema,
  getNotesSchema,
  noteIdParamSchema,
  updateNoteSchema,
} from "../validations/notesValidation.js";

// 1. Імпортуємо middleware
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// 2. Додаємо middleware до всіх шляхів, що починаються з /notes
router.use("/notes", authenticate);

router.get("/notes", celebrate(getNotesSchema), getNotes);
router.get("/notes/:noteId", celebrate(noteIdParamSchema), getNoteById);
router.post("/notes", celebrate(createNoteSchema), createNote);
router.delete("/notes/:noteId", celebrate(noteIdParamSchema), deleteNote);
router.patch("/notes/:noteId", celebrate(updateNoteSchema), updateNote);

export default router;
