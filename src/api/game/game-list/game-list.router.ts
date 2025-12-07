/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-default-export */
import { Router } from 'express';

import { QuizController } from './quiz/quiz.controller';
import TypeTheAnswerRouter from './type-the-answer/type-the-answer.route';

const GameListRouter = Router();

GameListRouter.use('/quiz', QuizController);
GameListRouter.use('/type-the-answer', TypeTheAnswerRouter);

export default GameListRouter;
