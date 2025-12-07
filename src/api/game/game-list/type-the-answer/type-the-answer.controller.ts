// src/api/game/game-list/type-the-answer/type-the-answer.controller.ts

import { type NextFunction, type Response } from 'express';

import { type AuthedRequest } from '@/common/interface';
import { normalizeError } from '@/common/utils/error.util';

import {
  type CreateTypeAnswerFormProps,
  createTypeAnswerFormSchema,
  type TypeAnswerQuestionProps,
} from './type-the-answer.schema';
import * as typeTheAnswerService from './type-the-answer.service';

type CreateGameRequest = AuthedRequest<
  Record<string, never>,
  unknown,
  CreateTypeAnswerFormProps
>;

type UpdateStatusRequest = AuthedRequest<
  { id: string },
  unknown,
  { status: 'DRAFT' | 'PUBLISHED' }
>;

function normalizeQuestions(questions: TypeAnswerQuestionProps[]): {
  order: number;
  question_index: number;
  question_text: string;
  correct_answer: string;
}[] {
  return questions.map(question => ({
    order: question.order,
    question_index: question.question_index,
    question_text: question.question_text ?? question.questionText ?? '',
    correct_answer: question.correct_answer ?? question.correctAnswer ?? '',
  }));
}

export async function createTypeAnswerGame(
  request: CreateGameRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { user } = request;

    if (!user || !user.id) {
      response.status(401).json({
        success: false,
        message: 'Unauthorized',
      });

      return;
    }

    const parsedBody = createTypeAnswerFormSchema.parse(
      request.body as unknown,
    );

    const {
      name,
      description,
      thumbnail_image,
      background_image,
      is_published,
      time_limit_seconds,
      score_per_question,
      questions,
    } = parsedBody;

    const normalizedQuestions = normalizeQuestions(questions);

    const createdGame = await typeTheAnswerService.createTypeAnswerGame({
      name,
      description,
      thumbnailImageFile: thumbnail_image,
      backgroundImageFile: background_image,
      isPublished: is_published,
      timeLimitSeconds: time_limit_seconds,
      scorePerQuestion: score_per_question,
      questions: normalizedQuestions,
      creatorId: user.id,
    });

    response.status(201).json({
      success: true,
      data: createdGame,
    });
  } catch (error: unknown) {
    next(normalizeError(error));
  }
}

export async function updateTypeAnswerGameStatus(
  request: UpdateStatusRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { user } = request;

    if (!user || !user.id) {
      response.status(401).json({
        success: false,
        message: 'Unauthorized',
      });

      return;
    }

    const { id } = request.params;
    const { status } = request.body;

    const updatedGame = await typeTheAnswerService.updateTypeAnswerGameStatus({
      id,
      status,
      userId: user.id,
    });

    response.status(200).json({
      success: true,
      data: updatedGame,
    });
  } catch (error: unknown) {
    next(normalizeError(error));
  }
}
