# Database Setup - Phase 1 (Authentication)

## Setup

```bash
chmod +x database/setup.sh
./database/setup.sh
```

This creates:
- The `pdf_ai_assistant` database
- A dedicated `pdf_app_user` role (the backend connects as this, **not** the
  `postgres` superuser — least-privilege principle, since this app handles
  confidential documents)
- Grants on tables/sequences (current and future, via `ALTER DEFAULT PRIVILEGES`)
- Runs every file in `migrations/` in order

If you'd rather run it manually, the commands are inside `setup.sh` — copy/paste
each `psql` line.

## Schema files

- `migrations/001_create_users_table.sql` — Phase 1: the `users` table, its
  constraints, indexes, and an `updated_at` auto-update trigger.

## Verified test results

This schema was created and tested against a real PostgreSQL 16 instance
before any backend code was written. Results:

| # | Test | Result |
|---|---|---|
| 1 | Valid insert (name, email, password_hash) | ✅ Succeeded — `id` auto-generated, `is_active` defaulted `true`, timestamps auto-populated |
| 2 | Duplicate email with different casing (`ALICE@EXAMPLE.com` vs `alice@example.com`) | ✅ Rejected — `citext` uniqueness is case-insensitive |
| 3 | Malformed email (`not-an-email`) | ✅ Rejected by `chk_users_email_format` |
| 4 | Short/plaintext-looking password (`hunter2`) | ✅ Rejected by `chk_users_password_hash_length` |
| 5 | Blank/whitespace-only name | ✅ Rejected by `chk_users_name_not_blank` |
| 6 | Missing required field (`password_hash` omitted) | ✅ Rejected by `NOT NULL` |
| 7 | `updated_at` trigger on `UPDATE` | ✅ `updated_at` changed, `created_at` stayed fixed |
| 8 | App role (`pdf_app_user`) can connect and `SELECT` | ✅ (initially failed due to missing table grants — fixed and re-verified) |
| 9 | Login-style lookup (`WHERE email = ...`) uses the index | ✅ `EXPLAIN` confirmed an Index Scan on `users_email_key`, not a full table scan |
| 10 | App role full CRUD (`INSERT`/`UPDATE`/`DELETE`) | ✅ All succeeded |

After testing, all test rows were deleted so the table starts empty for
Phase 1 backend development.

## Next step

Phase 1 backend code (registration/login controllers, services, repository,
JWT middleware) will connect to this exact schema. No backend code has been
written yet, per your instruction — this phase only covers the database.
