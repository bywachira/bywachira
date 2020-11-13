---
title: "I keep on forgetting how to squash commits"
slug: "i-keep-forgetting-how-to-squash-commits"
date: "2020-06-15"
draft: false
tags: ["git", "squash"]
menu: "coding"
description: "Learn how to squash commits"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854494/blog/squash-commit.png"
author:
  twitter: "wachira_dev"
  name: "Erick Wachira"
---

Its been a while since I wrote something, been busy but anyway this post is a bit different. It's gonna be a short one maybe a minute read, yeah.

I keep forgetting how to squash every time so this article will help my future self to avoid a simple Google search (maybe I might still do one, but dev.to has better SEO meaning I get to look stupid when my article shows up on the first page).

## Why squash commits?

- Clean Pull Request: Be thoughtful about your fellow developers who might want to review your PR. You might get better reviews than the `LGTM`s of the world and maybe your merge request won't crash your production server.
- Rebasing issues: You ever rebased off the base branch and you have 15 commits, it takes a while, you will not only have to resolve so many conflicts but its time-wasting.

## How do we squash?

- Few things you gotta do first, your feature/bug/chore branch is up to date with the base branch(master/develop/development/the one your company or you deploys to production).
- Know how many commits your feature/chore/bug branch(ensure you are checked out to this branch) has in order to rebase the all. You can do so with a simple command:
  ```bash
   $ git log
  ```
  Another simple way is by visiting your **pull** or **merge** request on Github or whichever platform you use and check the commit number.
- Now that you have the number, let's start the reading:
  ```bash
   $ git rebase -i HEAD~<Your number of commits>
  ```

The `HEAD` just references the current branch being worked on. What will happen next is that the command will open your default terminal editor (vim or nano). The content is a list of all commits you made with `pick` keyword on your left side.

- All commits except the first one, change the `pick` keyword to `squash`. When you are done save the changes(vim -> `:wq`, nano -> `ctrl+o, enter, ctrx+x`)

- Immediately after saving, your default editor will be opened again giving you an opportunity to edit your commits, to make them more descriptive to what you wanted to achieve. After editing save it(vim -> `:wq`, nano -> `ctrl+o, enter, ctrx+x`).

- Next push your changes to a remote repo on Github or whatever else you use

```bash
$ git push --force-with-lease origin <your-branch-name>
```

That's it, so future me you got this.

### Extras

- Follow me on twitter [here](https://twitter.com/wachira_dev)
- Join Discord server for any questions [here](https://discord.gg/uCxDKD8)
