/**
 * @name DiscordFolderOrganizerBeta
 * @author ClaytonTDM
 * @authorId 838197580462293042
 * @version 1.0.0
 * @description Based on DevilBro's Read All Notifications plugin.
 * @donate https://clickette.link/donate
 */
module.exports = (_ => {
	const changeLog = {
		
	};
    
	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor (meta) {for (let key in meta) this[key] = meta[key];}
		getName () {return this.name;}
		getAuthor () {return this.author;}
		getVersion () {return this.version;}
		getDescription () {return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it. \n\n${this.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(this.name)) window.BDFDB_Global.pluginQueue.push(this.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		var _this;
		var blacklist, clearing;
		function clickFolders(delay) {
            const buttons = document.getElementsByClassName("folderIconWrapper-1oRIZr");
            for(var i = 0; i < buttons.length; i++){
                buttons[i].click();
            }
            setTimeout(function() {
            for(var i = 0; i < buttons.length; i++){
                buttons[i].click();
            }}, delay);
        }
		const ReadAllButtonComponent = class ReadAllButton extends BdApi.React.Component {
			clearClick() {
                clickFolders(100);			}
			clearGuilds(guildIds) {
                clickFolders(100);			}
			getGuilds() {
                clickFolders(100);			}
			getUnread() {
                clickFolders(100);			}
			getPinged() {
                clickFolders(100);			}
			getMuted() {
                clickFolders(100);			}
			getPingedDMs() {
                clickFolders(100);                
			}
			render() {
				return BDFDB.ReactUtils.createElement("div", {
					className: BDFDB.disCNS.guildouter + BDFDB.disCN._readallnotificationsbuttonframe,
					children: BDFDB.ReactUtils.createElement("div", {
						className: BDFDB.disCNS.guildiconwrapper + BDFDB.disCN._readallnotificationsbuttoninner,
							children: BDFDB.ReactUtils.createElement("div", {
							className: BDFDB.disCNS.guildiconchildwrapper + BDFDB.disCN._readallnotificationsbuttonbutton,
							children: "folderize",
							onClick: _ => {
								BDFDB.ModalUtils.confirm(_this, _this.labels.modal_confirmnotifications, _ => this.clearClick());
							},
							onContextMenu: event => {
								BDFDB.ContextMenuUtils.open(_this, event, BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuGroup, {
									children: [
										BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
											label: _this.labels.context_unreadguilds,
											id: BDFDB.ContextMenuUtils.createItemId(_this.name, "mark-unread-read"),
											action: _ => this.clearGuilds(this.getUnread())
										}),
										BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
											label: _this.labels.context_pingedguilds,
											id: BDFDB.ContextMenuUtils.createItemId(_this.name, "mark-pinged-read"),
											action: _ => this.clearGuilds(this.getPinged())
										}),
										BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
											label: _this.labels.context_mutedguilds,
											id: BDFDB.ContextMenuUtils.createItemId(_this.name, "mark-muted-read"),
											action: _ => this.clearGuilds(this.getMuted())
										}),
										BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
											label: _this.labels.context_guilds,
											id: BDFDB.ContextMenuUtils.createItemId(_this.name, "mark-all-read"),
											action: _ => this.clearGuilds(this.getGuilds())
										}),
										BDFDB.ContextMenuUtils.createItem(BDFDB.LibraryComponents.MenuItems.MenuItem, {
											label: _this.labels.context_dms,
											id: BDFDB.ContextMenuUtils.createItemId(_this.name, "mark-dms-read"),
											action: _ => BDFDB.DMUtils.markAsRead(this.getPingedDMs())
										})
									]
								}));
							}
						})
					})
				});
			}
		};
	
		return class ReadAllNotificationsButton extends Plugin {
			onLoad () {
				_this = this;
				

			
				this.modulePatches = {
					after: [
						"GuildsBar",
						"InboxHeader"
					]
				};
				
				this.css = `
					${BDFDB.dotCN.messagespopouttabbar} {
						flex: 1 0 auto;
					}
					${BDFDB.dotCN.messagespopoutcontrols} {
						display: flex;
					}
					${BDFDB.dotCN.messagespopoutcontrols} > * {
						margin-left: 10px;
					}
					${BDFDB.dotCN._readallnotificationsbuttonframe} {
						height: 24px;
						margin-bottom: 10px;
					}
					${BDFDB.dotCN._readallnotificationsbuttonframe}:active {
						transform: translateY(1px);
					}
					${BDFDB.dotCN._readallnotificationsbuttoninner} {
						height: 24px;
					}
					${BDFDB.dotCN._readallnotificationsbuttonbutton} {
						border-radius: 4px;
						height: 24px;
						font-size: 12px;
						line-height: 1.3;
						white-space: nowrap;
						cursor: pointer;
					}
				`;
			}
			
			onStart () {
				let loadedBlacklist = BDFDB.DataUtils.load(this, "blacklist");
				this.saveBlacklist(!BDFDB.ArrayUtils.is(loadedBlacklist) ? [] : loadedBlacklist);

				this.forceUpdateAll();
			}
			
			onStop () {
				this.forceUpdateAll();
			}

			
		
			forceUpdateAll () {
				BDFDB.DiscordUtils.rerenderAll();
			}
			
			processGuildsBar (e) {
				let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, {name: "UnreadDMs"});
				if (index > -1) children.splice(index + 1, 0, BDFDB.ReactUtils.createElement(ReadAllButtonComponent, {}));
			}

			processInboxHeader (e) {
				if (!this.settings.general.addClearButton || e.instance.props.tab != BDFDB.DiscordConstants.InboxTabs.MENTIONS) return;
				let mentionedMessages = BDFDB.LibraryStores.RecentMentionsStore.getMentions();
				if (!mentionedMessages || !mentionedMessages.length) return;
				let controls = BDFDB.ReactUtils.findChild(e.returnvalue, {props: [["className", BDFDB.disCN.messagespopoutcontrols]]});
				if (controls) controls.props.children = [
					controls.props.children,
					BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TooltipContainer, {
						text: `${BDFDB.LanguageUtils.LanguageStrings.CLOSE} (${BDFDB.LanguageUtils.LanguageStrings.FORM_LABEL_ALL})`,
						children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Clickable, {
							className: BDFDB.disCNS.messagespopoutbutton + BDFDB.disCNS.messagespopoutbuttonsecondary + BDFDB.disCN.messagespopoutbuttonsize32,
							children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SvgIcon, {
								nativeClass: true,
								name: BDFDB.LibraryComponents.SvgIcon.Names.CLOSE,
								width: 16,
								height: 16
							}),
							onClick: _ => {
								let clear = _ => {
									if (clearing) return BDFDB.NotificationUtils.toast(`${this.labels.toast_alreadyclearing} - ${BDFDB.LanguageUtils.LibraryStrings.please_wait}`, {type: "danger"});
									let messages = [].concat(mentionedMessages).filter(n => n);
									if (messages.length) {
										clearing = true;
										let toast = BDFDB.NotificationUtils.toast(`${this.labels.toast_clearing} - ${BDFDB.LanguageUtils.LibraryStrings.please_wait}`, {timeout: 0, ellipsis: true});
										for (let i = 0; i < messages.length; i++) BDFDB.TimeUtils.timeout(_ => {
											BDFDB.LibraryModules.RecentMentionUtils.deleteRecentMention(messages[i].id);
											if (i == messages.length - 1) {
												clearing = false;
												toast.close();
												BDFDB.NotificationUtils.toast(this.labels.toastcleared, {type: "success"});
											}
										}, i * 1000);
									}
								};
								clear();
							}
						})
					})
				].flat(10);
			}
			
			saveBlacklist (savedBlacklist) {
				blacklist = savedBlacklist;
				BDFDB.DataUtils.save(savedBlacklist, this, "blacklist");
			}

			setLabelsByLanguage () {
				switch (BDFDB.LanguageUtils.getLanguage().id) {

					default:		// English
						return {
							context_dms:						"Direct Messages",
							context_guilds:						"Servers",
							context_mutedguilds:				"Muted Servers",
							context_pingedguilds:				"Pinged Servers",
							context_unreadguilds:				"Unread Servers",
							modal_confirmmentions:				"Are you sure you want to organize your folders?",
							modal_confirmnotifications:			"Are you sure you want to organize your folders?",
							toast_alreadyclearing:				"Already organizing folders",
							toast_cleared:						"All folders have been organized.",
							toast_clearing:						"Organizing folders"
						};
				}
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(changeLog));
})();
