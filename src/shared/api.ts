export type InitResponse = {
  type: 'init';
  postId: string;
  scores: number[];
  global_scores: number[];
  username: string;
};

export type SaveScoresRequest = {
  level: number;
  score: number;
};

export type SaveScoresResponse = {
  type: 'scores-saved';
  scores: number[];
  global_scores: number[];
};
