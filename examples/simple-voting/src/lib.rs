#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env, String};
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, Address, Env, Map, String, Vec,
};

// ─── Storage Keys ────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Proposal(u32),
    Vote(u32, Address),
    ProposalCount,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Choice {
    Yes,
    No,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Proposal {
    pub id: u32,
    pub title: String,
    pub yes_votes: u32,
    pub no_votes: u32,
    pub is_active: bool,
}

    /// Admin address that can create proposals and take snapshots.
    Admin,
    /// Token balance snapshot: (snapshot_id, voter) -> balance
    Snapshot(u32, Address),
    /// Proposal metadata keyed by proposal_id.
    Proposal(u32),
    /// Individual vote record: (proposal_id, voter) -> Vote
    Vote(u32, Address),
    /// Running count of proposals (used as auto-increment id).
    ProposalCount,
    /// Running count of snapshots.
    SnapshotCount,
}

// ─── Types ───────────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Proposal {
    pub id: u32,
    pub title: String,
    pub snapshot_id: u32,
    pub yes_votes: i128,
    pub no_votes: i128,
    pub abstain_votes: i128,
    pub closed: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VoteChoice {
    Yes,
    No,
    Abstain,
}

// ─── Errors ──────────────────────────────────────────────────────────────────

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    ProposalNotFound = 1,
    AlreadyVoted = 2,
    ProposalClosed = 3,
}

    /// Caller is not the contract admin.
    Unauthorized = 1,
    /// Proposal does not exist.
    ProposalNotFound = 2,
    /// Voter already cast a ballot on this proposal.
    AlreadyVoted = 3,
    /// Voting on a closed proposal is not allowed.
    ProposalClosed = 4,
    /// Voter had zero balance at snapshot time.
    NoVotingPower = 5,
    /// Snapshot does not exist.
    SnapshotNotFound = 6,
}

// ─── Contract ────────────────────────────────────────────────────────────────

#[contract]
pub struct SimpleVoting;

#[contractimpl]
impl SimpleVoting {
    /// Create a new proposal and return its ID.
    pub fn create_proposal(env: Env, title: String) -> u32 {
        let count_key = DataKey::ProposalCount;
        let id: u32 = env.storage().instance().get(&count_key).unwrap_or(0);
        let proposal = Proposal {
            id,
            title,
            yes_votes: 0,
            no_votes: 0,
            is_active: true,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Proposal(id), &proposal);
        env.storage().instance().set(&count_key, &(id + 1));
        id
    }

    /// Cast a yes or no vote. Each address may vote only once per proposal.
    // ── Initialisation ───────────────────────────────────────────────────────

    /// Initialise the contract, setting `admin` as the privileged account.
    pub fn init(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::ProposalCount, &0_u32);
        env.storage()
            .instance()
            .set(&DataKey::SnapshotCount, &0_u32);
    }

    // ── Snapshot management ──────────────────────────────────────────────────

    /// Record token balances for a set of voters at the current ledger.
    /// Only the admin may call this. Returns the new snapshot id.
    ///
    /// `balances` is a map of `voter_address -> token_balance`.
    pub fn take_snapshot(
        env: Env,
        caller: Address,
        balances: Map<Address, i128>,
    ) -> Result<u32, Error> {
        caller.require_auth();
        Self::assert_admin(&env, &caller)?;

        let snapshot_id = Self::next_snapshot_id(&env);

        for (voter, balance) in balances.iter() {
            env.storage()
                .persistent()
                .set(&DataKey::Snapshot(snapshot_id, voter), &balance);
        }

        Ok(snapshot_id)
    }

    /// Query the snapshotted balance of a voter.
    pub fn snapshot_balance(env: Env, snapshot_id: u32, voter: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Snapshot(snapshot_id, voter))
            .unwrap_or(0)
    }

    // ── Proposal management ──────────────────────────────────────────────────

    /// Create a new proposal tied to `snapshot_id`.
    /// Only the admin may call this. Returns the new proposal id.
    pub fn create_proposal(
        env: Env,
        caller: Address,
        title: String,
        snapshot_id: u32,
    ) -> Result<u32, Error> {
        caller.require_auth();
        Self::assert_admin(&env, &caller)?;
        Self::assert_snapshot_exists(&env, snapshot_id)?;

        let proposal_id = Self::next_proposal_id(&env);
        let proposal = Proposal {
            id: proposal_id,
            title,
            snapshot_id,
            yes_votes: 0,
            no_votes: 0,
            abstain_votes: 0,
            closed: false,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Proposal(proposal_id), &proposal);

        Ok(proposal_id)
    }

    /// Admin closes a proposal, preventing further votes.
    pub fn close_proposal(
        env: Env,
        caller: Address,
        proposal_id: u32,
    ) -> Result<(), Error> {
        caller.require_auth();
        Self::assert_admin(&env, &caller)?;

        let mut proposal = Self::load_proposal(&env, proposal_id)?;
        proposal.closed = true;
        env.storage()
            .persistent()
            .set(&DataKey::Proposal(proposal_id), &proposal);

        Ok(())
    }

    // ── Voting ───────────────────────────────────────────────────────────────

    /// Cast a weighted vote on a proposal.
    ///
    /// The voter's voting power equals their token balance at snapshot time.
    /// Each address may vote at most once per proposal.
    pub fn vote(
        env: Env,
        voter: Address,
        proposal_id: u32,
        choice: Choice,
    ) -> Result<(), Error> {
        voter.require_auth();

        choice: VoteChoice,
    ) -> Result<(), Error> {
        voter.require_auth();

        let mut proposal = Self::load_proposal(&env, proposal_id)?;

        if proposal.closed {
            return Err(Error::ProposalClosed);
        }

        let vote_key = DataKey::Vote(proposal_id, voter.clone());
        if env.storage().persistent().has(&vote_key) {
            return Err(Error::AlreadyVoted);
        }

        let proposal_key = DataKey::Proposal(proposal_id);
        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&proposal_key)
            .ok_or(Error::ProposalNotFound)?;

        if !proposal.is_active {
            return Err(Error::ProposalClosed);
        }

        match choice {
            Choice::Yes => proposal.yes_votes += 1,
            Choice::No => proposal.no_votes += 1,
        }

        env.storage().persistent().set(&proposal_key, &proposal);
        env.storage().persistent().set(&vote_key, &choice);
        let weight: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Snapshot(proposal.snapshot_id, voter.clone()))
            .unwrap_or(0);

        if weight == 0 {
            return Err(Error::NoVotingPower);
        }

        // Record the choice so the voter cannot vote twice.
        env.storage().persistent().set(&vote_key, &choice);

        // Accumulate weighted votes.
        match choice {
            VoteChoice::Yes => proposal.yes_votes += weight,
            VoteChoice::No => proposal.no_votes += weight,
            VoteChoice::Abstain => proposal.abstain_votes += weight,
        }

        env.storage()
            .persistent()
            .set(&DataKey::Proposal(proposal_id), &proposal);

        Ok(())
    }

    /// Close a proposal so no further votes are accepted.
    pub fn close_proposal(env: Env, proposal_id: u32) -> Result<(), Error> {
        let key = DataKey::Proposal(proposal_id);
        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::ProposalNotFound)?;
        proposal.is_active = false;
        env.storage().persistent().set(&key, &proposal);
        Ok(())
    }

    /// Return the current vote tally for a proposal.
    pub fn tally(env: Env, proposal_id: u32) -> Result<Proposal, Error> {
    // ── Queries ──────────────────────────────────────────────────────────────

    /// Return full proposal state.
    pub fn get_proposal(env: Env, proposal_id: u32) -> Result<Proposal, Error> {
        Self::load_proposal(&env, proposal_id)
    }

    /// Return the weighted tally for a proposal as (yes, no, abstain).
    pub fn tally(env: Env, proposal_id: u32) -> Result<(i128, i128, i128), Error> {
        let p = Self::load_proposal(&env, proposal_id)?;
        Ok((p.yes_votes, p.no_votes, p.abstain_votes))
    }

    /// Return the choice a particular voter made, or None if they haven't voted.
    pub fn voter_choice(
        env: Env,
        proposal_id: u32,
        voter: Address,
    ) -> Option<VoteChoice> {
        env.storage()
            .persistent()
            .get(&DataKey::Vote(proposal_id, voter))
    }

    /// Return the list of snapshot ids that currently exist.
    pub fn snapshot_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::SnapshotCount)
            .unwrap_or(0)
    }

    /// Return the total number of proposals created.
    pub fn proposal_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::ProposalCount)
            .unwrap_or(0)
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    fn assert_admin(env: &Env, caller: &Address) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap();
        if *caller != admin {
            return Err(Error::Unauthorized);
        }
        Ok(())
    }

    fn assert_snapshot_exists(env: &Env, snapshot_id: u32) -> Result<(), Error> {
        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::SnapshotCount)
            .unwrap_or(0);
        if snapshot_id >= count {
            return Err(Error::SnapshotNotFound);
        }
        Ok(())
    }

    fn load_proposal(env: &Env, proposal_id: u32) -> Result<Proposal, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Proposal(proposal_id))
            .ok_or(Error::ProposalNotFound)
    }

    /// Return how a specific address voted, or None if they have not voted.
    pub fn get_vote(env: Env, voter: Address, proposal_id: u32) -> Option<Choice> {
        env.storage()
            .persistent()
            .get(&DataKey::Vote(proposal_id, voter))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, String};

    fn setup() -> (Env, soroban_sdk::Address, SimpleVotingClient<'static>) {
    fn next_snapshot_id(env: &Env) -> u32 {
        let id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::SnapshotCount)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::SnapshotCount, &(id + 1));
        id
    }

    fn next_proposal_id(env: &Env) -> u32 {
        let id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::ProposalCount)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::ProposalCount, &(id + 1));
        id
    }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, Map, String};

    // ── Fixtures ─────────────────────────────────────────────────────────────

    struct Ctx {
        env: Env,
        admin: Address,
        client: SimpleVotingClient<'static>,
    }

    fn setup() -> Ctx {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(SimpleVoting, ());
        let client = SimpleVotingClient::new(&env, &contract_id);
        (env, contract_id, client)
    }

    #[test]
    fn test_create_proposal_returns_first_id() {
        let (env, _, client) = setup();
        let title = String::from_str(&env, "Should we add feature X?");
        let id = client.create_proposal(&title);
        assert_eq!(id, 0);
    }

    #[test]
    fn test_proposal_ids_increment() {
        let (env, _, client) = setup();
        let id0 = client.create_proposal(&String::from_str(&env, "Proposal A"));
        let id1 = client.create_proposal(&String::from_str(&env, "Proposal B"));
        let id2 = client.create_proposal(&String::from_str(&env, "Proposal C"));
        assert_eq!(id0, 0);
        assert_eq!(id1, 1);
        assert_eq!(id2, 2);
    }

    #[test]
    fn test_vote_yes_increments_yes_count() {
        let (env, _, client) = setup();
        let alice = Address::generate(&env);
        let id = client.create_proposal(&String::from_str(&env, "Fund the grant?"));

        client.vote(&alice, &id, &Choice::Yes);

        let proposal = client.tally(&id);
        assert_eq!(proposal.yes_votes, 1);
        assert_eq!(proposal.no_votes, 0);
    }

    #[test]
    fn test_vote_no_increments_no_count() {
        let (env, _, client) = setup();
        let bob = Address::generate(&env);
        let id = client.create_proposal(&String::from_str(&env, "Change the logo?"));

        client.vote(&bob, &id, &Choice::No);

        let proposal = client.tally(&id);
        assert_eq!(proposal.yes_votes, 0);
        assert_eq!(proposal.no_votes, 1);
    }

    #[test]
    fn test_tally_reflects_all_votes() {
        let (env, _, client) = setup();
        let alice = Address::generate(&env);
        let bob = Address::generate(&env);
        let carol = Address::generate(&env);
        let dave = Address::generate(&env);

        let id = client.create_proposal(&String::from_str(&env, "Upgrade protocol?"));

        client.vote(&alice, &id, &Choice::Yes);
        client.vote(&bob, &id, &Choice::Yes);
        client.vote(&carol, &id, &Choice::No);
        client.vote(&dave, &id, &Choice::Yes);

        let proposal = client.tally(&id);
        assert_eq!(proposal.yes_votes, 3);
        assert_eq!(proposal.no_votes, 1);
    }

    #[test]
    fn test_one_vote_per_address() {
        let (env, _, client) = setup();
        let alice = Address::generate(&env);
        let id = client.create_proposal(&String::from_str(&env, "Double vote attempt"));

        client.vote(&alice, &id, &Choice::Yes);
        let result = client.try_vote(&alice, &id, &Choice::No);

        assert_eq!(result, Err(Ok(Error::AlreadyVoted)));

        let proposal = client.tally(&id);
        assert_eq!(proposal.yes_votes, 1);
        assert_eq!(proposal.no_votes, 0);
    }

    #[test]
    fn test_vote_on_nonexistent_proposal() {
        let (env, _, client) = setup();
        let alice = Address::generate(&env);
        let result = client.try_vote(&alice, &99, &Choice::Yes);
        assert_eq!(result, Err(Ok(Error::ProposalNotFound)));
    }

    #[test]
    fn test_tally_on_nonexistent_proposal() {
        let (_, _, client) = setup();
        let result = client.try_tally(&99);
        assert!(matches!(result, Err(Ok(Error::ProposalNotFound))));
    }

    #[test]
    fn test_vote_on_closed_proposal() {
        let (env, _, client) = setup();
        let alice = Address::generate(&env);
        let id = client.create_proposal(&String::from_str(&env, "Close me"));

        client.close_proposal(&id);
        let result = client.try_vote(&alice, &id, &Choice::Yes);

        assert_eq!(result, Err(Ok(Error::ProposalClosed)));
    }

    #[test]
    fn test_close_proposal_marks_inactive() {
        let (env, _, client) = setup();
        let id = client.create_proposal(&String::from_str(&env, "To be closed"));

        let before = client.tally(&id);
        assert!(before.is_active);

        client.close_proposal(&id);

        let after = client.tally(&id);
        assert!(!after.is_active);
    }

    #[test]
    fn test_get_vote_returns_none_before_voting() {
        let (env, _, client) = setup();
        let alice = Address::generate(&env);
        let id = client.create_proposal(&String::from_str(&env, "Empty ballot"));

        assert_eq!(client.get_vote(&alice, &id), None);
    }

    #[test]
    fn test_get_vote_returns_choice_after_voting() {
        let (env, _, client) = setup();
        let alice = Address::generate(&env);
        let bob = Address::generate(&env);
        let id = client.create_proposal(&String::from_str(&env, "Record the vote"));

        client.vote(&alice, &id, &Choice::Yes);
        client.vote(&bob, &id, &Choice::No);

        assert_eq!(client.get_vote(&alice, &id), Some(Choice::Yes));
        assert_eq!(client.get_vote(&bob, &id), Some(Choice::No));
    }

    #[test]
    fn test_votes_are_independent_across_proposals() {
        let (env, _, client) = setup();
        let alice = Address::generate(&env);

        let id0 = client.create_proposal(&String::from_str(&env, "Proposal 0"));
        let id1 = client.create_proposal(&String::from_str(&env, "Proposal 1"));

        client.vote(&alice, &id0, &Choice::Yes);
        client.vote(&alice, &id1, &Choice::No);

        let p0 = client.tally(&id0);
        let p1 = client.tally(&id1);

        assert_eq!(p0.yes_votes, 1);
        assert_eq!(p0.no_votes, 0);
        assert_eq!(p1.yes_votes, 0);
        assert_eq!(p1.no_votes, 1);
        let admin = Address::generate(&env);
        client.init(&admin);
        Ctx { env, admin, client }
    }

    fn make_snapshot(ctx: &Ctx, pairs: &[(Address, i128)]) -> u32 {
        let mut map = Map::new(&ctx.env);
        for (addr, bal) in pairs {
            map.set(addr.clone(), *bal);
        }
        ctx.client.take_snapshot(&ctx.admin, &map)
    }

    fn make_proposal(ctx: &Ctx, snapshot_id: u32) -> u32 {
        ctx.client.create_proposal(
            &ctx.admin,
            &String::from_str(&ctx.env, "Test Proposal"),
            &snapshot_id,
        )
    }

    // ── Snapshot tests ────────────────────────────────────────────────────────

    #[test]
    fn test_snapshot_records_balances() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let bob = Address::generate(&ctx.env);

        let sid = make_snapshot(&ctx, &[(alice.clone(), 1_000), (bob.clone(), 500)]);

        assert_eq!(ctx.client.snapshot_balance(&sid, &alice), 1_000);
        assert_eq!(ctx.client.snapshot_balance(&sid, &bob), 500);
    }

    #[test]
    fn test_snapshot_unknown_voter_returns_zero() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let stranger = Address::generate(&ctx.env);

        let sid = make_snapshot(&ctx, &[(alice.clone(), 1_000)]);

        assert_eq!(ctx.client.snapshot_balance(&sid, &stranger), 0);
    }

    #[test]
    fn test_multiple_snapshots_are_independent() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);

        let sid0 = make_snapshot(&ctx, &[(alice.clone(), 100)]);
        let sid1 = make_snapshot(&ctx, &[(alice.clone(), 900)]);

        assert_eq!(ctx.client.snapshot_balance(&sid0, &alice), 100);
        assert_eq!(ctx.client.snapshot_balance(&sid1, &alice), 900);
    }

    // ── Proposal tests ────────────────────────────────────────────────────────

    #[test]
    fn test_create_proposal_increments_counter() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let sid = make_snapshot(&ctx, &[(alice, 100)]);

        assert_eq!(ctx.client.proposal_count(), 0);
        make_proposal(&ctx, sid);
        assert_eq!(ctx.client.proposal_count(), 1);
        make_proposal(&ctx, sid);
        assert_eq!(ctx.client.proposal_count(), 2);
    }

    #[test]
    fn test_create_proposal_fails_for_unknown_snapshot() {
        let ctx = setup();
        let result = ctx.client.try_create_proposal(
            &ctx.admin,
            &String::from_str(&ctx.env, "Bad Proposal"),
            &99,
        );
        assert_eq!(result, Err(Ok(Error::SnapshotNotFound)));
    }

    #[test]
    fn test_non_admin_cannot_create_proposal() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let sid = make_snapshot(&ctx, &[(alice.clone(), 100)]);

        let result = ctx.client.try_create_proposal(
            &alice,
            &String::from_str(&ctx.env, "Rogue Proposal"),
            &sid,
        );
        assert_eq!(result, Err(Ok(Error::Unauthorized)));
    }

    // ── Weighted tally tests ──────────────────────────────────────────────────

    #[test]
    fn test_weighted_yes_vote() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let sid = make_snapshot(&ctx, &[(alice.clone(), 1_000)]);
        let pid = make_proposal(&ctx, sid);

        ctx.client.vote(&alice, &pid, &VoteChoice::Yes);

        let (yes, no, abstain) = ctx.client.tally(&pid);
        assert_eq!(yes, 1_000);
        assert_eq!(no, 0);
        assert_eq!(abstain, 0);
    }

    #[test]
    fn test_weighted_no_vote() {
        let ctx = setup();
        let bob = Address::generate(&ctx.env);
        let sid = make_snapshot(&ctx, &[(bob.clone(), 250)]);
        let pid = make_proposal(&ctx, sid);

        ctx.client.vote(&bob, &pid, &VoteChoice::No);

        let (yes, no, _) = ctx.client.tally(&pid);
        assert_eq!(yes, 0);
        assert_eq!(no, 250);
    }

    #[test]
    fn test_weighted_abstain_vote() {
        let ctx = setup();
        let carol = Address::generate(&ctx.env);
        let sid = make_snapshot(&ctx, &[(carol.clone(), 75)]);
        let pid = make_proposal(&ctx, sid);

        ctx.client.vote(&carol, &pid, &VoteChoice::Abstain);

        let (_, _, abstain) = ctx.client.tally(&pid);
        assert_eq!(abstain, 75);
    }

    #[test]
    fn test_multiple_voters_weighted_tally() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let bob = Address::generate(&ctx.env);
        let carol = Address::generate(&ctx.env);

        // alice=1000, bob=500, carol=200
        let sid = make_snapshot(
            &ctx,
            &[
                (alice.clone(), 1_000),
                (bob.clone(), 500),
                (carol.clone(), 200),
            ],
        );
        let pid = make_proposal(&ctx, sid);

        ctx.client.vote(&alice, &pid, &VoteChoice::Yes);
        ctx.client.vote(&bob, &pid, &VoteChoice::No);
        ctx.client.vote(&carol, &pid, &VoteChoice::Yes);

        let (yes, no, abstain) = ctx.client.tally(&pid);
        assert_eq!(yes, 1_200); // alice(1000) + carol(200)
        assert_eq!(no, 500);    // bob(500)
        assert_eq!(abstain, 0);
    }

    #[test]
    fn test_higher_balance_dominates_tally() {
        let ctx = setup();
        let whale = Address::generate(&ctx.env);
        let minnow = Address::generate(&ctx.env);

        let sid = make_snapshot(
            &ctx,
            &[(whale.clone(), 10_000), (minnow.clone(), 1)],
        );
        let pid = make_proposal(&ctx, sid);

        ctx.client.vote(&whale, &pid, &VoteChoice::No);
        ctx.client.vote(&minnow, &pid, &VoteChoice::Yes);

        let (yes, no, _) = ctx.client.tally(&pid);
        assert!(no > yes, "whale's No should dominate minnow's Yes");
        assert_eq!(yes, 1);
        assert_eq!(no, 10_000);
    }

    // ── Guard tests ───────────────────────────────────────────────────────────

    #[test]
    fn test_double_vote_is_rejected() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let sid = make_snapshot(&ctx, &[(alice.clone(), 100)]);
        let pid = make_proposal(&ctx, sid);

        ctx.client.vote(&alice, &pid, &VoteChoice::Yes);
        let result = ctx.client.try_vote(&alice, &pid, &VoteChoice::No);
        assert_eq!(result, Err(Ok(Error::AlreadyVoted)));
    }

    #[test]
    fn test_zero_balance_voter_is_rejected() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let stranger = Address::generate(&ctx.env);

        let sid = make_snapshot(&ctx, &[(alice.clone(), 500)]);
        let pid = make_proposal(&ctx, sid);

        let result = ctx.client.try_vote(&stranger, &pid, &VoteChoice::Yes);
        assert_eq!(result, Err(Ok(Error::NoVotingPower)));
    }

    #[test]
    fn test_vote_on_closed_proposal_is_rejected() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let sid = make_snapshot(&ctx, &[(alice.clone(), 100)]);
        let pid = make_proposal(&ctx, sid);

        ctx.client.close_proposal(&ctx.admin, &pid);
        let result = ctx.client.try_vote(&alice, &pid, &VoteChoice::Yes);
        assert_eq!(result, Err(Ok(Error::ProposalClosed)));
    }

    #[test]
    fn test_vote_on_missing_proposal_is_rejected() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let result = ctx.client.try_vote(&alice, &99, &VoteChoice::Yes);
        assert_eq!(result, Err(Ok(Error::ProposalNotFound)));
    }

    // ── Voter choice query ────────────────────────────────────────────────────

    #[test]
    fn test_voter_choice_returned_correctly() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);
        let sid = make_snapshot(&ctx, &[(alice.clone(), 300)]);
        let pid = make_proposal(&ctx, sid);

        assert!(ctx.client.voter_choice(&pid, &alice).is_none());
        ctx.client.vote(&alice, &pid, &VoteChoice::Abstain);
        assert_eq!(
            ctx.client.voter_choice(&pid, &alice),
            Some(VoteChoice::Abstain)
        );
    }

    // ── Snapshot isolation ────────────────────────────────────────────────────

    #[test]
    fn test_votes_use_snapshot_not_current_balance() {
        let ctx = setup();
        let alice = Address::generate(&ctx.env);

        // Snapshot alice at 0; then imagine she "gained" tokens after.
        // Because we only record what take_snapshot was called with,
        // any subsequent snapshot would be separate.
        let sid_empty = make_snapshot(&ctx, &[]); // alice absent → 0 power
        let pid = make_proposal(&ctx, sid_empty);

        // alice tries to vote; she has zero power at that snapshot
        let result = ctx.client.try_vote(&alice, &pid, &VoteChoice::Yes);
        assert_eq!(result, Err(Ok(Error::NoVotingPower)));
    }
}
