use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
#[derive(Debug)]
pub struct TodoAccount {
    pub authority: Pubkey,      // 32 bytes
    pub tasks: Vec<Task>,       // 4 bytes + (task_size * number_of_tasks)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Task {
    pub content: String,        // Variable length, max TASK_CONTENT_LENGTH
    pub completed: bool,        // 1 byte
    pub created_at: i64,        // 8 bytes
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = ACCOUNT_SPACE,
        seeds = [b"todo", authority.key().as_ref()],
        bump
    )]
    pub todo_account: Account<'info, TodoAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ManageTodo<'info> {
    #[account(
        mut,
        seeds = [b"todo", authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub todo_account: Account<'info, TodoAccount>,
    pub authority: Signer<'info>,
}