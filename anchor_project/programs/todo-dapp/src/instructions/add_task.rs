use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;
use crate::constants::*;

pub fn add_task(ctx: Context<ManageTodo>, content: String) -> Result<()> {
    require!(content.len() < TASK_CONTENT_LENGTH, 
    TodoError::ContentTooLong);
    
    let todo_account = &mut ctx.accounts.todo_account;
    let task = Task {
        content,
        completed: false,
        created_at: Clock::get()?.unix_timestamp,
    };
    todo_account.tasks.push(task);
    Ok(())
}