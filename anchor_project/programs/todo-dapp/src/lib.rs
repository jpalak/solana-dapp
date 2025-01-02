use anchor_lang::prelude::*;
use crate::state::*;
use crate::instructions::*;

pub mod instructions;
pub mod state;
pub mod errors;
pub mod constants;

declare_id!("HaH9whuijUtKQK7jr2Su5GNqRRPRDLUXQxEKoQ94VhfU");

#[program]
pub mod todo_program {
    use super::*;

    pub fn initialize_account(ctx: Context<Initialize>) -> Result<()> {
        initialize(ctx)
    }

    pub fn adding_task(ctx: Context<ManageTodo>, content: String) -> Result<()> {
        add_task(ctx, content)
    }

    pub fn removing_task(ctx: Context<ManageTodo>, index: u32) -> Result<()> {
        remove_task(ctx, index)
    }

    pub fn toggling_task(ctx: Context<ManageTodo>, index: u32) -> Result<()> {
        toggle_task(ctx, index)
    }
}