import { Note } from '../models/note.js';
import createHttpError from 'http-errors';


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

export const getAllNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      tag,
      search,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);

    // Побудова запиту
    const query = Note.find();

    if (tag) {
      query.where('tag').equals(tag);
    }

    if (search) {
      query.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      });
    }

    // Виправлене сортування та пагінація
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notes = await query
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(perPage));

    res.status(200).json({
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      title,
      content,
      search,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'asc', // Додано деструктуризацію сортування
    } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);

    const notesQuery = Note.find();

    if (search) {
      notesQuery.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (title) {
      notesQuery.where('title').equals(title);
    }

    if (content) {
      notesQuery.where('content').equals(content);
    }
    if (tag) {
      notesQuery.where('tag').equals(tag);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [totalItems, notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(perPage)),
    ]);

    const totalPages = Math.ceil(totalItems / Number(perPage));

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};
