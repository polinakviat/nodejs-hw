import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json({
      status: 200,
      message: "All notes retrieved",
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteByID = async (req, res, next) => {
  try {
    const { noteID } = req.params;
    const note = await Note.findById(noteID);
    if (!note) {
      throw createHttpError(404, 'Note not found');
    }
    res.status(200).json({
      status: 200,
      message: "Note retrieved",
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });
  if (!note) {
    throw createHttpError(404, "Note not found");

  }
  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId },
    req.body,
    { returnDocument: "after" }
  );

  if (!note) {
    throw createHttpError(404, "Note not found");
  }
  res.status(200).json(note);
};
