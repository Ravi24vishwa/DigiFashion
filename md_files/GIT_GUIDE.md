# Git Guide for DigiFashion Project

A simple and practical guide to understanding git concepts and workflows for the DigiFashion React Native project.

---

## Table of Contents
1. [What is Git?](#what-is-git)
2. [Commits](#commits)
3. [Staging](#staging)
4. [Stash](#stash)
5. [Common Workflows](#common-workflows)
6. [Best Practices](#best-practices)
7. [Useful Commands](#useful-commands)

---

## What is Git?

Git is a **version control system** that tracks changes to your code. Think of it as a detailed history of your project where you can:
- Save snapshots of your code at different points in time
- See who changed what and when
- Go back to previous versions if something breaks
- Collaborate with other developers without losing anyone's work

---

## Commits

### What is a Commit?

A **commit** is a snapshot of your entire project at a specific point in time. It's like saving a checkpoint in a video game.

**Key points:**
- Each commit has a unique ID (hash)
- Commits include a message describing what changed
- Commits track WHO made the change and WHEN
- You can revert to any previous commit if needed

### Example Commit

```
commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Author: John Doe <john@example.com>
Date:   Jan 12 2026 10:30:00

    Fixed login button styling in SignUpButton component
    
    - Adjusted padding and margin
    - Changed button color to match design specs
    - Removed unused CSS classes
```

### Creating a Commit

In DigiFashion, when you make changes to files like `src/screens/auth/LoginScreen.jsx`:

```bash
# 1. See what files changed
git status

# 2. Stage your changes (see Staging section below)
git add src/screens/auth/LoginScreen.jsx

# 3. Create a commit with a message
git commit -m "Fixed login button styling in SignUpButton component"
```

### Good Commit Messages

Write clear, descriptive commit messages:

❌ **Bad:**
```
fixed stuff
updated code
changes
```

✅ **Good:**
```
Fixed authentication error handling in LoginScreen
Add validation for email input in SignUpButton
Updated cart item count in CartContext
```

### Commit Structure for DigiFashion

When working on features:

```
git commit -m "Feature: Add product search functionality

- Implemented search bar in home screen
- Added search API integration
- Updated ProductGrid to filter results
- Added loading spinner during search"
```

---

## Staging

### What is Staging?

**Staging** is the area between your working files and your commit. It lets you choose exactly which changes to include in your next commit.

Think of it like packing a suitcase:
- **Working Directory** = All your clothes on the floor
- **Staging Area** = Clothes you've selected to pack
- **Commit** = Sealed suitcase ready to go

### Why Stage?

You might change multiple files, but want to commit different changes separately:

```
Modified files:
- src/screens/home/HomeScreen.jsx (changed banner carousel)
- src/CommonHelper/BannerCarousel.js (fixed image loading)
- src/contexts/CartContext.js (added new state)
```

You could make 3 separate commits:

```bash
# Commit 1: Banner changes
git add src/screens/home/HomeScreen.jsx src/CommonHelper/BannerCarousel.js
git commit -m "Fixed banner carousel image loading issue"

# Commit 2: Cart context update
git add src/contexts/CartContext.js
git commit -m "Added new cart state management"
```

### Staging Commands

```bash
# Stage a specific file
git add src/CommonHelper/CustomProductList.jsx

# Stage multiple files
git add src/screens/home/ src/components/ProductCard.js

# Stage all changes
git add .

# View what's staged
git status

# Unstage a file (remove from staging)
git reset src/screens/auth/LoginScreen.jsx

# See detailed changes you're about to commit
git diff --staged
```

### Before and After Staging

```
BEFORE: git status
On branch main
Changes not staged for commit:
  modified:   src/screens/home/HomeScreen.jsx
  modified:   src/CommonHelper/BannerCarousel.js
  modified:   src/contexts/CartContext.js

AFTER: git add src/screens/home/HomeScreen.jsx src/CommonHelper/BannerCarousel.js
       git status
On branch main
Changes to be committed:
  modified:   src/screens/home/HomeScreen.jsx
  modified:   src/CommonHelper/BannerCarousel.js

Changes not staged for commit:
  modified:   src/contexts/CartContext.js
```

---

## Stash

### What is Stash?

**Stash** is a temporary storage for changes you're not ready to commit yet. It's like putting your work in a drawer while you work on something else.

### When to Use Stash

You're working on a feature, but suddenly need to:
- Fix an urgent bug on a different branch
- Switch to a different task
- Clean up your working directory without losing changes

### Stash Workflow

```bash
# You're working on a new feature
# Modified files:
#  - src/screens/home/HomeScreen.jsx
#  - src/CommonHelper/FilterDrawer.jsx

# Urgent: Need to fix a bug on main branch
# Use stash to save your current work
git stash save "Work in progress on new product filters"

# Your working directory is now clean
# You can switch branches or work on something else
git checkout main
# ... fix the bug ...
git commit -m "Fixed critical auth issue"

# Come back to your feature branch
git checkout feature-branch

# Restore your stashed work
git stash pop

# Or if you saved multiple stashes, list them
git stash list
# Pick the one you want
git stash pop stash@{0}
```

### Stash Commands

```bash
# Save current changes to stash with a description
git stash save "Description of what you're working on"

# Or shorter version
git stash

# View all stashed changes
git stash list

# Apply the most recent stash
git stash pop

# Apply a specific stash (keeps it in the list)
git stash apply stash@{0}

# Delete a stash
git stash drop stash@{0}

# See what's in a stash before applying
git stash show stash@{0}
```

### Stash Example for DigiFashion

```bash
# You're adding a new filtering feature
# Modified: src/CommonHelper/FilterDrawer.jsx
# Modified: src/components/FilterBar.js

git stash save "WIP: Add advanced product filters"

# Manager asks you to fix payment issue immediately
git checkout main
# ... make fixes to payment ...
git commit -m "Fixed payment validation bug"

# Return to your feature
git checkout feature/advanced-filters
git stash pop  # Your changes are back!
```

---

## Common Workflows

### Workflow 1: Making a Simple Change

```bash
# 1. Check current status
git status

# 2. Make your changes to files (using your editor)

# 3. Review what changed
git diff src/screens/auth/LoginScreen.jsx

# 4. Stage and commit
git add src/screens/auth/LoginScreen.jsx
git commit -m "Updated login screen error message styling"

# 5. Push to remote repository
git push origin main
```

### Workflow 2: Working on a Feature Branch

```bash
# 1. Create a new branch for your feature
git checkout -b feature/product-search

# 2. Make changes and commit
git add src/screens/home/HomeScreen.jsx
git commit -m "Added search input field to home screen"

git add src/api/apiService.js
git commit -m "Added search API endpoint"

# 3. Push your branch
git push origin feature/product-search

# 4. Create a Pull Request (for code review)
# (Done through GitHub/GitLab interface)

# 5. Once approved, merge to main
git checkout main
git merge feature/product-search
```

### Workflow 3: Handling Interruptions

```bash
# You're working on feature A
# Modified: src/CommonHelper/BannerCarousel.jsx
# Modified: src/screens/home/HomeScreen.jsx

# Urgent: Bug reported in CartContext
git stash save "Banner carousel improvements"

# Switch and fix the bug
git checkout main
git checkout -b hotfix/cart-bug
git add src/contexts/CartContext.js
git commit -m "Fixed cart item count calculation"
git push origin hotfix/cart-bug

# Return to your feature
git checkout feature/banner-improvements
git stash pop

# Continue working
git add src/CommonHelper/BannerCarousel.jsx
git commit -m "Completed banner carousel animation"
```

### Workflow 4: Undoing Changes

```bash
# If you haven't committed yet
git checkout src/screens/auth/LoginScreen.jsx  # Discard changes

# If you've staged but not committed
git reset src/screens/auth/LoginScreen.jsx  # Unstage
git checkout src/screens/auth/LoginScreen.jsx  # Discard

# If you've already committed
git revert HEAD  # Creates a new commit that undoes the previous one

# Or go back to a specific commit
git reset --hard a1b2c3d4  # WARNING: Loses all changes after this commit
```

---

## Best Practices

### 1. Commit Frequency
- ✅ Commit frequently (multiple times per day)
- ✅ Commit logical units of work
- ❌ Don't commit everything at once at end of day
- ❌ Don't wait weeks between commits

### 2. Commit Messages
- Start with a verb: "Add", "Fix", "Update", "Remove", "Refactor"
- Keep first line under 50 characters
- Add detailed explanation if needed
- Reference issue numbers if applicable

```
✅ Good:
Fix race condition in product loading
Add input validation to email fields
Update API error handling

❌ Bad:
fixed
stuff updated
changes in many files
```

### 3. Branching Strategy
- Create branches for features: `feature/product-search`
- Create branches for fixes: `hotfix/login-bug`
- Keep `main` branch stable and deployable
- Delete branches after merging

```bash
# Feature branch
git checkout -b feature/shopping-cart

# Hotfix branch
git checkout -b hotfix/auth-issue

# After merging, delete local and remote
git branch -d feature/shopping-cart
git push origin --delete feature/shopping-cart
```

### 4. Before Pushing
```bash
# Review your changes
git diff

# Check your commits
git log --oneline -5

# Ensure clean status
git status

# Then push
git push origin feature/your-feature
```

### 5. For DigiFashion Specifically

Since this is a React Native e-commerce app:

- **Keep commits focused**: One feature at a time
  ```bash
  # ✅ Good: Separate commits for API and UI
  git commit -m "Add search API endpoint"
  git commit -m "Add search UI to HomeScreen"
  
  # ❌ Bad: Everything together
  git commit -m "Added search feature"
  ```

- **Commit structure**: Group by feature area
  ```bash
  # Cart feature
  git add src/contexts/CartContext.js src/components/Cart/
  git commit -m "Enhanced cart state management"
  
  # Product display
  git add src/components/ProductCard.js src/screens/home/
  git commit -m "Improved product card layout"
  ```

- **Don't commit sensitive data**:
  ```bash
  # .gitignore already handles:
  # - node_modules/
  # - API keys in local.properties
  # - Build artifacts in android/build/
  
  # Always check before committing
  git status
  ```

---

## Useful Commands

### Viewing History
```bash
# See commit history (simple)
git log --oneline

# See commit history with branches
git log --oneline --graph --all

# See changes in a specific commit
git show a1b2c3d4

# See who changed each line (for debugging)
git blame src/screens/home/HomeScreen.jsx
```

### Branches
```bash
# List local branches
git branch

# List all branches (local + remote)
git branch -a

# Create and switch to new branch
git checkout -b feature/my-feature

# Switch branch
git checkout main

# Delete branch
git branch -d feature/my-feature
```

### Checking Status
```bash
# Full status
git status

# Short status
git status -s

# See unstaged changes
git diff

# See staged changes
git diff --staged

# See changes in specific file
git diff src/screens/home/HomeScreen.jsx
```

### Saving Work
```bash
# Stash with message
git stash save "WIP: product filters"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{1}
```

### Undoing
```bash
# Discard changes in working directory
git checkout src/file.jsx

# Unstage a file
git reset src/file.jsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (lose changes)
git reset --hard HEAD~1

# Create commit that undoes previous commit
git revert HEAD
```

### Remote Operations
```bash
# Push your branch
git push origin feature/your-feature

# Pull latest changes
git pull origin main

# Fetch without merging
git fetch origin

# See remote branches
git branch -r
```

---

## Quick Reference Table

| Task | Command |
|------|---------|
| Check what changed | `git status` |
| See detailed changes | `git diff` |
| Stage a file | `git add src/file.jsx` |
| Stage all files | `git add .` |
| Unstage a file | `git reset src/file.jsx` |
| Commit changes | `git commit -m "message"` |
| Save work temporarily | `git stash save "message"` |
| Restore stashed work | `git stash pop` |
| View commit history | `git log --oneline` |
| Create a branch | `git checkout -b feature/name` |
| Switch branches | `git checkout main` |
| Push to remote | `git push origin branch-name` |
| Pull from remote | `git pull origin main` |
| Undo uncommitted changes | `git checkout src/file.jsx` |
| View a past commit | `git show abc123` |

---

## Troubleshooting

### "I committed something I shouldn't have"
```bash
# If not pushed yet, undo the commit but keep changes
git reset --soft HEAD~1
# Then decide what to keep and recommit
```

### "I lost my stashed work"
```bash
# Check if it's still in stash list
git stash list

# Can recover recent stashes even if dropped
git reflog
```

### "I'm on the wrong branch"
```bash
# See what branch you're on
git branch

# Switch to correct branch
git checkout main
```

### "I have merge conflicts"
```bash
# See which files have conflicts
git status

# Open the conflicted file and look for:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>>

# Fix the conflicts, then
git add resolved-file.jsx
git commit -m "Resolved merge conflicts"
```

---

## Need Help?

For more complex git scenarios, you can:
1. Use `git help <command>` (e.g., `git help stash`)
2. Check online resources like GitHub's git guides
3. Ask a senior developer on the team

Remember: **It's almost impossible to permanently lose code in git!** Most operations are recoverable.

---

## Notes for Your Team

- **Keep commits small and logical** - easier to review and understand
- **Push regularly** - don't wait until end of day
- **Pull before you push** - avoid conflicts
- **Use descriptive branch names** - not "branch1" or "test"
- **Never force push** unless absolutely necessary and discussed with team
- **Delete merged branches** - keeps repository clean

---

Good luck with DigiFashion development! 🚀
