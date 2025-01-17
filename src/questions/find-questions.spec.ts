import {findQuestions} from './find-questions';

describe('findQuestions', () => {
  describe('mode=typing-practice', () => {
    it('例外にならずにも戻り値を返せること', () => {
      const result = findQuestions('typing_practice');
      expect(result.selectedEasyQuestions.length).toBeGreaterThanOrEqual(1);
      expect(result.selectedMiddleQuestions.length).toBeGreaterThanOrEqual(1);
      expect(result.selectedHardQuestions.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('mode=word-quiz', () => {
    it('例外にならずにも戻り値を返せること', () => {
      const result = findQuestions('word_quiz');
      expect(result.selectedEasyQuestions.length).toBeGreaterThanOrEqual(1);
      expect(result.selectedMiddleQuestions.length).toBeGreaterThanOrEqual(1);
      expect(result.selectedHardQuestions.length).toBeGreaterThanOrEqual(1);
    });
  });
});
