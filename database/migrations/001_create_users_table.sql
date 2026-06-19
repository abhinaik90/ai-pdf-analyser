-- ============================================================================
-- Migration: 001_create_users_table.sql
-- Phase: 1 - Authentication (Registration, Login, JWT)
--
-- WHY THIS FILE EXISTS:
-- This is the ONE table Phase 1 needs. Every later phase (PDFs, embeddings,
-- chat) will reference users.id as a foreign key, so getting this table
-- right now matters a lot.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------

-- pgcrypto gives us gen_random_uuid() to generate UUID primary keys.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- citext ("case-insensitive text") makes email comparisons case-insensitive
-- automatically at the database level. Without it, 'John@x.com' and
-- 'john@x.com' would be treated as two different emails unless we remembered
-- to LOWER() every single query - citext removes that risk entirely.
CREATE EXTENSION IF NOT EXISTS citext;

-- ----------------------------------------------------------------------------
-- TABLE: users
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (

    -- Primary key. UUID (not a sequential integer) so user IDs can't be
    -- guessed/enumerated (e.g. if an ID ever appears in a URL or JWT payload,
    -- an attacker can't try id=1, id=2, id=3... to find other users).
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Display name shown in the dashboard/UI. Capped at 100 characters as a
    -- sane limit and to prevent abuse (e.g. pasting in huge strings).
    name VARCHAR(100) NOT NULL,

    -- Login identifier. CITEXT type = automatically case-insensitive.
    -- UNIQUE = no two accounts can share the same email (enforced by the
    -- database itself, not just app-layer validation).
    email CITEXT NOT NULL UNIQUE,

    -- The bcrypt HASH of the password - never the plaintext password itself.
    -- 255 chars gives headroom even though bcrypt hashes are ~60 chars,
    -- in case we switch to a longer hashing algorithm later (e.g. Argon2).
    password_hash VARCHAR(255) NOT NULL,

    -- Lets us disable an account (suspicious activity, user-requested
    -- deactivation) WITHOUT deleting their data/PDFs/chat history.
    -- Login logic will check this flag and reject login if false.
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Nullable on purpose: a brand-new user hasn't logged in yet, so there's
    -- no value to store until their first successful login.
    last_login_at TIMESTAMPTZ,

    -- Audit columns. TIMESTAMPTZ ("timestamp with time zone") stores the
    -- moment in UTC and converts correctly for users in any timezone.
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- ------------------------------------------------------------------------
    -- CONSTRAINTS (safety nets at the database level, in addition to
    -- whatever validation the backend does - so bad data can NEVER get in,
    -- even if there's a bug in the application code)
    -- ------------------------------------------------------------------------

    -- Reject obviously malformed emails (basic shape check: text@text.text).
    -- This is a backstop, not the only validation - the backend will also
    -- validate emails before they ever reach this query.
    CONSTRAINT chk_users_email_format
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),

    -- Bcrypt hashes are always 60 characters. This constraint guards against
    -- a future bug where someone accidentally stores a plaintext password or
    -- an empty string instead of a real hash - it would be rejected outright.
    CONSTRAINT chk_users_password_hash_length
        CHECK (char_length(password_hash) >= 50),

    -- Prevent empty/whitespace-only names from slipping through.
    CONSTRAINT chk_users_name_not_blank
        CHECK (char_length(btrim(name)) > 0)
);

-- ----------------------------------------------------------------------------
-- INDEXES
-- ----------------------------------------------------------------------------

-- Note: the UNIQUE constraint on email above already creates a unique index
-- automatically - that index is what makes "SELECT * FROM users WHERE email =
-- ..." (used on every login attempt) fast. We don't need to create it again.

-- Index on created_at for future admin/reporting queries
-- (e.g. "how many users signed up this month").
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

-- ----------------------------------------------------------------------------
-- AUTO-UPDATE TRIGGER for updated_at
-- ----------------------------------------------------------------------------

-- WHY: Without this, every UPDATE query in the app would need to remember to
-- manually set updated_at = now(). That's easy to forget. Instead, the
-- database handles it automatically, every time, no matter which code path
-- updates the row.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_set_updated_at ON users;

CREATE TRIGGER trg_users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
