# titanscript

**The packages that exist are currently incomplete. The extension is not published and still has a load of issues.**

This is the monorepo containing tooling and other useful utilities for TitanScript. You can find each package and what it does under `packages/`. The only thing you won't find here is the interpreter and runtime tags, as those are a lot more complicated and a lot more dependent on Atlas itself. This project is also using a different parser, which is a dumbed down version of the VX parser that will eventually be put into use. The differences should be minimal and it's faster and easier to work with compared to the current parser. 

Tag information is exported from the bot by a script and is stored in `packages/parser/data/tags.json`. You shouldn't update this directly, if you want to improve tag descriptions contact us directly with the changes you want and we'll consider them.

# todo

- [ ] Testing
- [ ] `vsc-extension:` Auto-completing `{user.random}` or any tag with no arguments with an existing closing bracket doubles the closing brackets, so it becomes `{user.random}}`. [video](https://sylver.is-fucking.gay/f/LZjXeu)
- [ ] `vsc-extension:` Auto-complete doesn't play nice if you are right of a dot. [video](https://i.sylver.me/f/xrJAlr.gif)