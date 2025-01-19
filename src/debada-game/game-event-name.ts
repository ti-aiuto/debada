export type GameEventName =
  | 'game_start'
  | 'game_complete'
  | 'time_is_up'
  | 'level_up'
  | 'question_complete_with_nodding'
  | 'question_complete_without_nodding'
  | 'block_mode_start'
  | 'block_mode_succeeded'
  | 'block_mode_failed'
  | 'abort_game';
