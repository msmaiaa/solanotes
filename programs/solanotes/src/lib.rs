use anchor_lang::prelude::*;

declare_id!("BkdhfUz2R7hhvt9PVoTbS8zGf3ztPHhDDGFm4zPrwuvV");

#[program]
pub mod solanotes {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_notes = 0;
        Ok(())
    }
    pub fn create_note(ctx: Context<CreateNote>, title: String, body: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;
        let note = Note {
            title,
            body,
            user_address: *user.to_account_info().key,
        };
        base_account.notes.push(note);
        base_account.total_notes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space=9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Note {
    pub title: String,
    pub body: String,
    pub user_address: Pubkey,
}

#[derive(Accounts)]
pub struct CreateNote<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct BaseAccount {
    pub total_notes: u16,
    pub notes: Vec<Note>,
}
