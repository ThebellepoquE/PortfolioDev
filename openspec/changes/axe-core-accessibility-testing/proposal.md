# Proposal: axe-core-accessibility-testing

## Intent

Add axe-core accessibility testing as a **blocking CI gate** for WCAG 2.1 AA compliance. This transforms accessibility from manual, inconsistent checks into automated, deterministic validation that runs on every PR.

**Why:** Accessibility is not optional — it is a legal requirement and a marker of professional craft. Automated axe-core tests catch ~30% of a11y issues in CI before they reach production.

## Scope

### Included
- Complete migration from `happy-dom` to `jsdom` for test environment
- Integration of `vitest-axe` with `axe-core`
- Shared `checkA11y()` utility for component tests
- A11y test blocks added to all 10 existing component test files
- CI pipeline integration (same `pnpm test -- --run` command)
- Documentation in README about limitations

### Excluded
- E2E accessibility testing (Playwright-based)
- WCAG 2.2 AAA compliance
- Separate test script (a11y is integrated, not optional)

## Approach

**Complete jsdom migration** (not dual environment):
- All tests run in jsdom, including existing 74 unit tests
- axe-core works correctly in jsdom (happy-dom has `Node.prototype.isConnected` bug)
- Migration verified before Phase 2 begins

**vitest-axe integration:**
- `vitest-axe/extend-expect` added to setup.ts
- Custom `checkA11y()` wrapper with `rules.region { enabled: false }` to reduce false positives
- All component tests include an accessibility describe block

**False positive handling:**
- `color-contrast` rule: use `it.skip` with TODO comment (not global disable)
- `region` rule: disabled in utility config, not per-test
- Document in README that color-contrast requires manual browser verification

**CI gate:**
- Same `pnpm test -- --run` runs unit + a11y tests
- CI fails on any axe-core violation (no threshold, strict mode)

## Success Criteria

1. All 74 existing tests pass after jsdom migration
2. 10 component test files have a11y describe blocks
3. CI pipeline runs axe-core and blocks on violations
4. README documents limitations and manual verification requirements
5. Rollback plan documented and tested

## Risks

| Risk | Level | Mitigation |
|------|-------|------------|
| jsdom breaks existing tests | Low | Phase 1 verification gate before Phase 2 |
| color-contrast false positives | Medium | Use `it.skip` per-component, not global |
| CI performance increase | Low | axe runs are fast, 80 tests complete in ~3s |

## Rollback Plan

If Phase 1 verification fails:

1. Revert `vitest.config.ts`: `environment: 'happy-dom'`
2. Remove from `package.json`: `axe-core`, `jsdom`, `vitest-axe`
3. Revert `src/test/setup.ts`: remove `vitest-axe/extend-expect` import
4. Delete `src/test/a11y-utils.ts`
5. Run `pnpm install && pnpm test -- --run`

Backup: `git stash` before starting migration