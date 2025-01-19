import {ref} from 'vue';
import {useLevelDependantValues} from './use-level-dependant-values';
import {JudgesCount} from './judges-count';

describe('useLevelDependantValues', () => {
  function build({
    currentJudgesCount = ref<JudgesCount>(1),
    currentQuestionIndex = ref(0),
    selectedEasyQuestions = [{label: 'あ', kana: 'あ'}],
    selectedMiddleQuestions = [
      {label: 'い', kana: 'い'},
      {label: 'う', kana: 'う'},
    ],
    selectedHardQuestions = [
      {label: 'え', kana: 'え'},
      {label: 'お', kana: 'お'},
      {label: 'か', kana: 'か'},
    ],
  } = {}) {
    return useLevelDependantValues({
      selectedEasyQuestions,
      selectedMiddleQuestions,
      selectedHardQuestions,
      currentJudgesCount,
      currentQuestionIndex,
    });
  }

  describe('questionIndexInCurrentDifficulty', () => {
    it('レベルごとに今は何番目か返せること', () => {
      const currentQuestionIndex = ref(0);
      const {questionIndexInCurrentDifficulty} = build({currentQuestionIndex});

      currentQuestionIndex.value = 0;
      expect(questionIndexInCurrentDifficulty.value).toEqual(0);

      currentQuestionIndex.value = 1;
      expect(questionIndexInCurrentDifficulty.value).toEqual(0);

      currentQuestionIndex.value = 2;
      expect(questionIndexInCurrentDifficulty.value).toEqual(1);

      currentQuestionIndex.value = 3;
      expect(questionIndexInCurrentDifficulty.value).toEqual(0);

      currentQuestionIndex.value = 4;
      expect(questionIndexInCurrentDifficulty.value).toEqual(1);

      currentQuestionIndex.value = 5;
      expect(questionIndexInCurrentDifficulty.value).toEqual(2);
    });
  });
});
