# Backtrack

## Web Analytics

Recorded before switching the root layout to `@vercel/analytics/next` on 2026-10-17.

- Pre-change SHA: `84c9b6a` (`84c9b6a7fd6c7c78a0b904f0bbdbff004aaccf1b` on `master`)

If this pull request is still unmerged, close the draft and delete `cursor/vercel-web-analytics-1543`. The site stays on `84c9b6a`.

If it was merged, check out `master`, pull, and revert the analytics commit:

```
git checkout master
git pull origin master
git revert <analytics-commit-sha>
git push origin master
```

Vercel Instant Rollback: open the project for www.changemytrajectory.com, find the deployment built from `84c9b6a`, and roll production back to it.

## SEO changes

Recorded before the SEO changes on 2026-10-17.

- Branch at record time: `master`
- HEAD SHA: `fdbacf3852b458873ce350374ff587f4a1730ed4`
- Production deploy SHA: `fdbacf3852b458873ce350374ff587f4a1730ed4`

These steps put the site back to that revision. Do not merge the SEO pull request if you only want to discard it.

## If the pull request is still unmerged

1. Close the draft pull request. Do not merge it.
2. Delete the feature branch on the remote and locally.

```
git push origin --delete cursor/seo-fixes-1543
git checkout master
git branch -D cursor/seo-fixes-1543
```

Production stays on `fdbacf3852b458873ce350374ff587f4a1730ed4`.

## If the pull request was merged

Revert the merge commit on `master`. Use the merge commit SHA, not the feature commit.

```
git checkout master
git pull origin master
git revert -m 1 <merge-commit-sha>
git push origin master
```

`-m 1` keeps `master` as the mainline parent.

## Vercel Instant Rollback

Use this if production is already serving the SEO deploy and you want the previous build back immediately, including before a git revert finishes building.

1. Open the Vercel project for www.changemytrajectory.com.
2. Go to Deployments.
3. Find the production deployment built from SHA `fdbacf3852b458873ce350374ff587f4a1730ed4`.
4. Open that deployment and choose Instant Rollback.
5. Confirm the rollback so production traffic returns to that deployment.

Instant Rollback repoints the production alias. It does not delete the later deployment. Follow it with the git revert above so the next push does not redeploy the SEO changes.
