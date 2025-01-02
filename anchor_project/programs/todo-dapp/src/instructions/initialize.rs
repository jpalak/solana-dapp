use anchor_lang::prelude::*;
use crate::state::*;

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let todo_account = &mut ctx.accounts.todo_account;
    todo_account.authority = ctx.accounts.authority.key();
    todo_account.tasks = Vec::new();
    
    Ok(())
}