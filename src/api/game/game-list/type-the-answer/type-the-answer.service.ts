// src/api/game/game-list/type-the-answer/type-the-answer.service.ts

import { type GameStatus } from '@prisma/client'; // kalau ada enum GameStatus di Prisma

import { prisma } from '@/common/prisma';

import { type TypeAnswerQuestionProps } from './type-the-answer.schema';

interface NormalizedQuestion {
  order: number;
  question_text: string;
  correct_answer: string;
}

export interface CreateTypeAnswerGameArgs {
  name: string;
  description: string;
  thumbnailImageFile: unknown;
  backgroundImageFile?: unknown;
  isPublished: boolean;
  timeLimitSeconds: number;
  scorePerQuestion: number;
  questions: NormalizedQuestion[];
  creatorId: string;
  templateId: string; // sesuaikan sama kebutuhanmu
}

export interface UpdateTypeAnswerGameStatusArgs {
  id: string;
  status: GameStatus | 'DRAFT' | 'PUBLISHED';
  userId: string;
}

export async function createTypeAnswerGame(args: CreateTypeAnswerGameArgs) {
  const {
    name,
    description,
    thumbnailImageFile,
    backgroundImageFile,
    isPublished,
    timeLimitSeconds,
    scorePerQuestion,
    questions,
    creatorId,
    templateId,
  } = args;

  // TODO: ganti dengan logic upload file kamu sendiri
  const thumbnailUrl = await uploadFile(thumbnailImageFile);
  const backgroundUrl = backgroundImageFile
    ? await uploadFile(backgroundImageFile)
    : null;

  const status: GameStatus = (
    isPublished ? 'PUBLISHED' : 'DRAFT'
  ) as GameStatus;

  const publishedAt = isPublished ? new Date() : null;

  return prisma.typeAnswerGame.create({
    data: {
      templateId,
      creatorId,
      title: name,
      description,
      thumbnailUrl,
      backgroundUrl: backgroundUrl ?? undefined,
      timeLimitSec: timeLimitSeconds,
      pointsPerQuestion: scorePerQuestion,
      status,
      publishedAt: publishedAt ?? undefined,
      questions: {
        create: questions.map(question => ({
          order: question.order,
          text: question.question_text,
          answer: question.correct_answer,
        })),
      },
    },
    include: {
      questions: true,
    },
  });
}

export async function updateTypeAnswerGameStatus(
  args: UpdateTypeAnswerGameStatusArgs,
) {
  const { id, status, userId } = args;

  return prisma.typeAnswerGame.update({
    where: {
      id,
      creatorId: userId,
    },
    data: {
      status: status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    },
  });
}
