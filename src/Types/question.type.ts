export interface BlankType {
  id: number;
  position: string;
  correctAnswer: string;
  type: string;
}

export interface DragWordsType {
  word: string;
  color: string;
  id: number;
}

export interface QuestionType {
  paragraph: string;
  blanks: BlankType[];
  dragWords: DragWordsType[];
}
