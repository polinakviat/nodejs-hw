import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомна функція валідації для MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Схема для валідації noteId в параметрах маршруту (згорнута з Segments.PARAMS)
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.custom(objectIdValidator, 'ObjectId validation').required(),
  }),
};

// Схема для валідації POST /notes (тіло запиту)
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }),
};

// Схема для валідації PATCH /notes/:noteId (містить і params, і body)
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.custom(objectIdValidator, 'ObjectId validation').required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).optional(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }).min(1), // Перевірка, що тіло запиту не порожнє
};

// Схема для валідації GET /notes (query параметри)
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS).optional(),
    search: Joi.string().allow('').optional(),
    sortBy: Joi.string().valid('_id', 'title', 'createdAt', 'updatedAt', 'tag').optional(),
    sortOrder: Joi.string().valid('asc', 'desc', '1', '-1').optional(),
  }),
};
