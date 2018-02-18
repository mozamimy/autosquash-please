# autosquash-please

An WebExtension to prevent merging of a pull request that contains `fixup!` commits on GitHub (also Enterprise).

![](https://raw.githubusercontent.com/mozamimy/ss/master/autosquash-please.png)

## Install

Now this extension is not published on extension store of Firefox and Chrome. So this extension should be added as a temporary add-on.

### Firefox (59.0+)

Open `about:debugging` and click **Load Temporary Add-on** then select manifest.json file.

### Chrome (64.0+)

Open `chrome://extensions/` and click **Load unpacked extension** then select this directory.

After installation, **you have to set personal access token that allows `repo` operations in add-on options view**. Also you should set GHE domain and its personal access token when you use in GitHub Enterprise. This extension does not work if you forget to set them.

## License

MIT
