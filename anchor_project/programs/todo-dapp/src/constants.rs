pub const MAX_CONTENT_LENGTH: usize = 280;

// Seeds
pub const USER_SEED_PREFIX: &[u8] = b"user";
pub const TASK_SEED_PREFIX: &[u8] = b"task";

// Account size constants
pub const DISCRIMINATOR_SIZE: usize = 8;
pub const PUBKEY_SIZE: usize = 32;
pub const STRING_PREFIX_SIZE: usize = 4;
pub const BOOL_SIZE: usize = 1;
pub const U64_SIZE: usize = 8;

pub const TASK_ACCOUNT_SIZE: usize = DISCRIMINATOR_SIZE + // discriminator
    PUBKEY_SIZE +                 // authority
    STRING_PREFIX_SIZE + MAX_CONTENT_LENGTH + // content
    BOOL_SIZE +                   // completed
    U64_SIZE;                     // index


// Reduce the number of tasks to stay within limits
pub const MAX_TASKS: usize = 10;  // Reduced from 50
pub const TASK_CONTENT_LENGTH: usize = 100;  // Reduced from 200
// Calculate space:
// 8 (discriminator) + 
// 32 (pubkey) + 
// 4 (vec len) + 
// (task_size * max_tasks)
// where task_size = content_length + 1 (bool) + 8 (i64)
pub const ACCOUNT_SPACE: usize = 8 + 32 + 4 + (TASK_CONTENT_LENGTH + 1 + 8) * MAX_TASKS;

pub const USER_ACCOUNT_SIZE: usize = DISCRIMINATOR_SIZE + U64_SIZE; // discriminator + task_count