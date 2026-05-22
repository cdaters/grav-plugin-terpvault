# Parchment Save and Restore Notes

TerpVault currently treats saves as interpreter-owned state. For bundled Parchment playback, players should use the story's own save and restore workflow rather than a TerpVault-specific save-slot UI.

## Player guidance

Most parser works that support saving expose commands such as:

```text
SAVE
RESTORE
```

Parchment handles the resulting save interaction inside the iframe. Depending on the story format, browser, and Parchment behavior, this may involve interpreter-managed browser storage or browser file download/upload prompts.

## TerpVault scope

TerpVault does not currently:

- create named save slots
- sync saves to Grav user accounts
- inspect or rewrite interpreter save files
- provide a cross-format save manager

This is intentional for now. Save semantics vary across Z-code, Glulx, TADS, Hugo, ADRIFT, browser storage, and file-backed interpreter workflows. A custom TerpVault save manager should be added only after the adapter contract is clear and tested across supported story families.

## Future direction

Likely future work:

- document per-format save behavior as it is tested
- add optional local named slots if Parchment exposes a stable adapter hook
- add server-side saves only for authenticated Grav users
- keep interpreter-native `SAVE` / `RESTORE` as the baseline fallback
