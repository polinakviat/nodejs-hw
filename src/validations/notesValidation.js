import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { tags } from '../contacts/tags.js';

// Кастомна функція валідації для MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Схема для валідації noteId в параметрах маршруту
export const noteIdSchema = Joi.object({
  noteId: Joi.custom(objectIdValidator, 'ObjectId validation').required(),
});

// Схема для валідації POST /notes (тіло запиту)
export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow('').optional(),
  tag: Joi.string().valid(...tags).optional(),
});

// Схема для валідації PATCH /notes/:noteId (параметри + тіло запиту)
export const updateNoteSchema = Joi.object({
  params: Joi.object({
    noteId: Joi.custom(objectIdValidator, 'ObjectId validation').required(),
  }),
  body: Joi.object({
    title: Joi.string().min(1).optional(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string().valid(...tags).optional(),
  }).min(1), // Перевірка, що тіло запиту не порожнє (хоча б одне поле присутнє)
});


export const getNoteSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

export const getAllNotesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(5).max(20).default(10),
  tag: Joi.string().valid(...tags).optional(),
  search: Joi.string().allow('').optional(),
  sortBy: Joi.string().valid('_id', 'title', 'createdAt', 'updatedAt', 'tag').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc', '1', '-1').default('asc'),
});
