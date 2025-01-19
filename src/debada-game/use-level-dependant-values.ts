import {computed, Ref} from 'vue';
import {JudgesCount} from './judges-count';
import {Question} from './question';

// 各レベル固有の処理を切り出したもの
export function useLevelDependantValues({
  currentJudgesCount,
  currentQuestionIndex,
  selectedEasyQuestions,
  selectedMiddleQuestions,
  selectedHardQuestions,
}: {
  currentJudgesCount: Ref<JudgesCount>;
  currentQuestionIndex: Ref<number>;
  selectedEasyQuestions: Question[];
  selectedMiddleQuestions: Question[];
  selectedHardQuestions: Question[];
}) {
  // 現在のレベルの中で何問目か
  const questionIndexInCurrentDifficulty = computed<number>(() => {
    if (
      currentQuestionIndex.value >=
      selectedEasyQuestions.length + selectedMiddleQuestions.length
    ) {
      return (
        currentQuestionIndex.value -
        (selectedEasyQuestions.length + selectedMiddleQuestions.length)
      );
    } else if (currentQuestionIndex.value >= selectedEasyQuestions.length) {
      return currentQuestionIndex.value - selectedEasyQuestions.length;
    } else {
      return currentQuestionIndex.value;
    }
  });

  // 現在のレベルで何問あるか
  const questionsTotalCountInCurrentDifficulty = computed<number>(() => {
    if (currentJudgesCount.value === 1) {
      return selectedEasyQuestions.length;
    } else if (currentJudgesCount.value === 3) {
      return selectedMiddleQuestions.length;
    } else if (currentJudgesCount.value === 5) {
      return selectedHardQuestions.length;
    } else {
      throw new Error(
        `想定外のcurrentJudgesCount: ${currentJudgesCount.value}`
      );
    }
  });

  // ブロックモードを有効化したいインデックスの配列を返す
  const blockModeQuestionIndicesInCurrentDifficulty = computed<
    Readonly<number[]>
  >(() => {
    if (currentJudgesCount.value === 1) {
      return Object.freeze([3]);
    } else if (currentJudgesCount.value === 3) {
      return Object.freeze([1]);
    } else if (currentJudgesCount.value === 5) {
      return Object.freeze([2]);
    } else {
      throw new Error(
        `想定外のcurrentJudgesCount: ${currentJudgesCount.value}`
      );
    }
  });

  // 次のレベルを返す。なければnull
  const nextJudgesCount = computed<JudgesCount | null>(() => {
    if (currentJudgesCount.value === 1) {
      return 3;
    } else if (currentJudgesCount.value === 3) {
      return 5;
    } else if (currentJudgesCount.value === 5) {
      return null; // 次はない
    } else {
      throw new Error(
        `想定外のcurrentJudgesCount: ${currentJudgesCount.value}`
      );
    }
  });

  return {
    questionIndexInCurrentDifficulty,
    questionsTotalCountInCurrentDifficulty,
    blockModeQuestionIndicesInCurrentDifficulty,
    nextJudgesCount,
  };
}
