# Test Plan — Account Management System (COBOL)

This test plan documents functional test cases for the current COBOL account management application (interactive menu: View Balance, Credit Account, Debit Account, Exit). Use this with business stakeholders to validate behavior and to later implement automated unit and integration tests in Node.js.

Columns:
- Test Case ID: unique identifier
- Test Case Description: short description of behavior to validate
- Pre-conditions: data or environment setup required
- Test Steps: sequential steps to perform
- Expected Result: what should happen
- Actual Result: (to be filled during execution)
- Status: Pass / Fail (to be filled during execution)
- Comments: additional notes

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-01 | Program start and menu display | Repository compiled and `accountsystem` executable available | 1. Run `./accountsystem` 2. Observe startup | Main menu displays with options: View Balance, Credit Account, Debit Account, Exit |  |  | Verify menu text and option numbers |
| TC-02 | View balance for existing student | Student record exists: student-id `S1001` with balance `100.00` | 1. Start program 2. Choose `1` (View Balance) 3. Enter `S1001` when prompted | Program displays current balance `100.00` and status success |  |  | Use exact ID/format from `data.cob` |
| TC-03 | View balance for non-existent student | No record for student-id `S9999` | 1. Start program 2. Choose `1` 3. Enter `S9999` | Program reports `Student not found` or equivalent error message; no crash |  |  | Expected error wording should be agreed with stakeholders |
| TC-04 | Credit account with valid amount | `S1001` exists with balance `100.00` | 1. Start program 2. Choose `2` (Credit Account) 3. Enter `S1001` 4. Enter amount `25.50` | Balance updated to `125.50`; success message; file update persisted |  |  | Verify by viewing balance after operation and by inspecting file record |
| TC-05 | Credit account with zero or negative amount | `S1001` exists | 1. Start program 2. Choose `2` 3. Enter `S1001` 4. Enter amount `0` (or `-10`) | Program rejects input with validation message; balance unchanged |  |  | Confirm input validation and error text |
| TC-06 | Debit account with valid amount (less than balance) | `S1001` balance `125.50` | 1. Start program 2. Choose `3` (Debit Account) 3. Enter `S1001` 4. Enter amount `20.00` | Balance updated to `105.50`; success message; file persisted |  |  | Verify by viewing balance and file record |
| TC-07 | Debit account amount equal to balance (zero out) | `S1002` balance `50.00` | 1. Start program 2. Choose `3` 3. Enter `S1002` 4. Enter amount `50.00` | Balance becomes `0.00`; status remains valid (or transitions per business rules) |  |  | Confirm any status transition rules for zero balance |
| TC-08 | Debit account exceeding balance (overdraft) | `S1001` balance `100.00` | 1. Start program 2. Choose `3` 3. Enter `S1001` 4. Enter amount `150.00` | If overdrafts disallowed: program rejects and reports insufficient funds; balance unchanged. If allowed: balance becomes `-50.00` per business rules |  |  | Business stakeholders must confirm allowed behavior; record expected policy |
| TC-09 | Debit/Credit with invalid numeric input | `S1001` exists | 1. Start program 2. Choose `2` or `3` 3. Enter `S1001` 4. Enter non-numeric amount `abc` or `-` | Program validates input, shows error message, does not update file, and returns to menu |  |  | Edge cases: extremely large values, comma vs dot decimal separator |
| TC-10 | Data validation: missing required fields on create (if supported) | If app supports creating students, otherwise not applicable | 1. Attempt to create new student with missing name or id | Program rejects creation with clear validation error; no partial record created |  |  | If feature not present, mark as N/A in Comments |
| TC-11 | File I/O error handling (simulate read/write failure) | Simulate file permission error or disk full by making student file read-only / full | 1. Start program 2. Perform operation that writes to file (Credit/Debit) | Program returns a file I/O error message (file status checked) and does not corrupt data; graceful exit or error recovery |  |  | Confirm `FILE-STATUS` handling in code; test on staging only |
| TC-12 | Transaction atomicity (no partial updates) | Student file available; prepare to interrupt process | 1. Start a write operation 2. At write time, forcibly terminate program (or simulate crash) 3. Inspect student file | Student record is either fully updated or unchanged; no partial/corrupted record present |  |  | This may require environment-level simulation and file backups before testing |
| TC-13 | Late fee application (if due-date / late fee logic exists) | Student with `due-date` older than current date and unpaid balance | 1. Start program 2. Trigger routine that calculates fees (e.g., on startup or billing run) | Late fee applied per configured amount; balance increased; fee calculation method recorded |  |  | If not supported, mark N/A. Confirm fee constants in `data.cob` |
| TC-14 | Account status enforcement (e.g., suspended/closed) | Student `S2001` status `SUSPENDED` or `CLOSED` | 1. Start program 2. Attempt Credit/Debit or View Balance on `S2001` | Program prevents disallowed operations and displays status-restricted message |  |  | Confirm allowed operations per status with stakeholders |
| TC-15 | Audit/logging of financial changes | System configured to record audit info (who/when) | 1. Perform credit or debit 2. Inspect audit/log output | Record shows transaction, timestamp, performing user/process |  |  | If not present, mark N/A; consider adding audit trail for regulatory compliance |

Notes:
- Fill `Actual Result` and `Status` while executing these tests with stakeholders.
- For any test marked as dependent on a feature that does not exist in the current COBOL app, annotate the `Comments` cell with `N/A` and confirm whether the feature should be implemented in the Node.js rewrite.
- Use representative student IDs and amounts matching field formats in `src/cobol/data.cob` (field length and decimal scale).

After validation with stakeholders, I can convert these test cases into an automated test matrix and scaffold Node.js unit/integration tests that exercise the same scenarios.
