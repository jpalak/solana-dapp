use anchor_lang::prelude::*;

#[error_code]
pub enum TodoError {
    #[msg("The content must be 280 characters or less")]
    ContentTooLong,
    #[msg("Arithmetic overflow when updating task count")]
    ArithmeticOverflow,
    #[msg("Invalid authority provided for this operation")]
    InvalidAuthority,
    #[msg("Task index is invalid")]
    InvalidTaskIndex,
    #[msg("Task not found")]
    TaskNotFound,
    #[msg("Invalid task state transition")]
    InvalidTaskState,
    #[msg("Invalid task content")]
    InvalidContent,
    #[msg("Task already completed")]
    TaskAlreadyCompleted,
}