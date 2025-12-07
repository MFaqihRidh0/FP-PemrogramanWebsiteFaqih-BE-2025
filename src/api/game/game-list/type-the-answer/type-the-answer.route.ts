// src/api/game/game-list/type-the-answer/type-the-answer.route.ts

import { Router, Response, NextFunction } from 'express'
import { validateAuth } from '@/common/middleware/auth.middleware'
import type { AuthedRequest } from '@/common/interface'
import type { CreateTypeAnswerFormProps } from './type-the-answer.schema'
import {
  createTypeAnswerGame,
  updateTypeAnswerGameStatus,
} from './type-the-answer.controller'

const typeTheAnswerRouter = Router()

type CreateGameRequest = AuthedRequest<
  Record<string, never>,
  unknown,
  CreateTypeAnswerFormProps
>

type UpdateStatusRequest = AuthedRequest<
  { id: string },
  unknown,
  { status: 'DRAFT' | 'PUBLISHED' }
>

typeTheAnswerRouter.post(
  '/',
  validateAuth({}),
  (
    request: CreateGameRequest,
    response: Response,
    next: NextFunction,
  ) => createTypeAnswerGame(request, response, next),
)

typeTheAnswerRouter.patch(
  '/:id/status',
  validateAuth({}),
  (
    request: UpdateStatusRequest,
    response: Response,
    next: NextFunction,
  ) => updateTypeAnswerGameStatus(request, response, next),
)

export { typeTheAnswerRouter }
