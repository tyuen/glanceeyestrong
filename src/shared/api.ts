export type InitResponse = {
  type: 'init';
  postId: string;
  levels: string;
  scores: number[];
  username: string;
};

export type SaveScoresRequest = {
  scores: number[];
};

export type SaveScoresResponse = {
  type: 'scores-saved';
  scores: number[];
};
