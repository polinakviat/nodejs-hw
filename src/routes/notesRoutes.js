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
  getAllNotesSchema,
  updateNoteSchema,
} from "../validations/notesValidation.js";
import { noteIdSchema as noteIdParamSchema } from "../validations/notesValidation.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// 2. Додаємо middleware до всіх шляхів, що починаються з /notes
router.use("/notes", authenticate);

router.get("/notes", celebrate(getAllNotesSchema), getNotes);
router.get("/notes/:noteId", celebrate(noteIdParamSchema), getNoteById);
router.post("/notes", celebrate(createNoteSchema), createNote);
router.delete("/notes/:noteId", celebrate(noteIdParamSchema), deleteNote);
router.patch("/notes/:noteId", celebrate(updateNoteSchema), updateNote);

export default router;
