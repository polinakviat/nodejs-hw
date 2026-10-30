import { Note } from '../models/note.js';
import createHttpError from 'http-errors';


export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      title,
      content,
      search,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);

    const notesQuery = Note.find();

    if (tag) {
      notesQuery.where('tag').equals(tag);
    }

    if (title) {
      notesQuery.where('title').equals(title);
    }

    if (content) {
      notesQuery.where('content').equals(content);
    }

    if (search) {
      notesQuery.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Паралельне отримання кількості та масиву нотаток
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
