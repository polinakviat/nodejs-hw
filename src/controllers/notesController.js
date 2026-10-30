import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const notes = await Note.findById(noteId);
    if (!notes) {
      throw createHttpError(404, 'Note not found');
    }
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const notes = await Note.create(req.body);
    res.status(201).json(notes);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const notes = await Note.findOneAndDelete({
      _id: noteId,
    });
    if (!notes) {
      throw createHttpError(404, "Note not found");

    }
    res.status(200).json(notes);
  }
  catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const notes = await Note.findOneAndUpdate(
      { _id: noteId },
      req.body,
      { returnDocument: "after" }
    );

    if (!notes) {
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};
