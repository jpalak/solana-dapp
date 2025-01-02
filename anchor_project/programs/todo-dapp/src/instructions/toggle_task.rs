use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

pub fn toggle_task(ctx: Context<ManageTodo>, index: u32) -> Result<()> {
    let todo_account = &mut ctx.accounts.todo_account;
    require!(
        (index as usize) < todo_account.tasks.len(),
        TodoError::InvalidTaskIndex
    );
    todo_account.tasks[index as usize].completed = !todo_account.tasks[index as usize].completed;
    Ok(())
}