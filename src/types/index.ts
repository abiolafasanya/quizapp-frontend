
export type ID = string | number;


/** Auth */
export interface User {
  id: ID;
  name: string;
  email: string;
}

/**
 * ADMIN shapes (used on Questions page & API CRUD)
 * Backend Joi expects: options: [{ text: string, isCorrect: boolean }]
 */
export interface AdminOption {
  text: string;
  isCorrect: boolean;
}

export interface AdminQuestion {
  id: ID;
  text: string;
  options: AdminOption[]; // exactly 4, one isCorrect === true
  createdAt?: string;
  updatedAt?: string;
}

/** Create/Update payloads for admin CRUD */
export type CreateQuestionInput = {
  text: string;
  options: AdminOption[]; // no ids
};

export type UpdateQuestionInput = Partial<CreateQuestionInput>;

/**
 * PUBLIC quiz shapes (used by /api/quiz/start so you don't reveal answers)
 *
 */

// ✅ types.ts (only the relevant public shapes)
export interface PublicOption {
  text: string;
  id?: string | number; // allow numeric ids from API
}

export interface PublicQuestion {
  id: string | number;
  text: string;
  options: PublicOption[];
}


/** Start quiz response */
export interface QuizStartResponse {
  questions: PublicQuestion[];
}

/**
 * Submit answers payload
 * Since options don’t have ids, submit by INDEX (0..3).
 */

export interface QuizSubmitPayload {
  answers: { questionId: ID; optionId: ID }[];
  timeTakenSec: number;
}

/** Result summary */
export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  timeTakenSec: number; // seconds
}


// Submit Quiz Response
export interface SubmitApiResponse {
  status: boolean;
  data: {
    totalQuestions: number;
    correctCount: number;
    score: number;
    timeTakenSec: number;
    detail: Array<{
      questionId: number | string;
      chosenOptionId: number | string;
      correctOptionId: number | string;
      isCorrect: boolean;
    }>;
  };
}
