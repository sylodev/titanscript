# titanscript

> *the packages in this repository are incomplete and have a load of bugs that still have to be ironed out.*

> *the vscode extension is yet to be published.*

TitanScript is the name of the scripting language Atlas uses primarily for Actions. This monorepo contains useful tools and programs for working with it. 

# notes

The interpreter and runtime tags aren't present in this repository as they aren't necessary for what we're trying to do. You can find each package and what it does under `packages/`. This project is using a different parser to what the live bot is using because the live version is more complicated and less fastly, that and I was too lazy to port it to typescript and clean up the code enough to make it open source. The differences should be minimal and the new parser is faster and easier to work with.

Tag metadata is exported from the bot and is updated here whenever I feel like it. That data is stored in [packages/parser/src/data/tags.json](/packages/parser/src/data/tags.json). **Do not update this data directly**; if you want to improve tag descriptions contact us with the changes you want and we'll consider changing it.

# todo

- [ ] Testing
- [ ] Script formatter
- [ ] Support for `{a!command}` tags
- [ ] `vsc-extension:` Auto-completing `{user.random}` or any tag with no arguments with an existing closing bracket doubles the closing brackets, so it becomes `{user.random}}`. [video](https://sylver.is-fucking.gay/f/LZjXeu)
- [ ] `vsc-extension:` Auto-complete doesn't play nice if you are right of a dot. [video](https://i.sylver.me/f/xrJAlr.gif)
- [ ] `vsc-extension:` Hover provider data is usually for the wrong tag unless you hover over the end of the tag.
- [ ] `vsc-extension`: `Ctrl + /` will add spaces around the content which fucks it up when you uncomment and is generally ugly. [image](https://sylver.likes-to.party/f/sLbaJY)