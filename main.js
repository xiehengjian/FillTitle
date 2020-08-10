/*
 * @Author: Heng
 * @Date: 2020-05-01 08:48:29
 * @LastEditTime: 2020-08-10 09:47:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /FillTitle/main.js
 */

JSB.newAddon = function (mainPath) {
    return JSB.defineClass('FillTitle : JSExtension', /*Instance members*/{
        //Window initialize
        sceneWillConnect: function () {
            self.webController = WebViewController.new();
        },
        //Window disconnect
        sceneDidDisconnect: function () {
        },
        //Window resign active
        sceneWillResignActive: function () {
        },
        //Window become active
        sceneDidBecomeActive: function () {
        },
        notebookWillOpen: function (notebookid) {
            // Clicking note
            NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');
            self.FillTitle = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_FillTitle');
        },
        notebookWillClose: function (notebookid) {
            NSNotificationCenter.defaultCenter().removeObserverName(self, 'PopupMenuOnNote');
        },
        documentDidOpen: function (docmd5) {
        },
        documentWillClose: function (docmd5) {
        },
        controllerWillLayoutSubviews: function (controller) {
        },
        queryAddonCommandStatus: function () {
            if (Application.sharedInstance().studyController(self.window).studyMode < 3)
                return {
                    image: 'FillTitle.png',
                    object: self,
                    selector: 'toggleFillTitle:',
                    checked: self.FillTitle
                };
            return null;
        },
        onPopupMenuOnNote: function (sender) {//点击笔记
            if (!Application.sharedInstance().checkNotifySenderInWindow(sender, self.window)) return;//Don't process message from other window
            if (!self.FillTitle) return;
            let expansion=UIPasteboard.generalPasteboard().string;//获取扩充文本
            let note = sender.userInfo.note;
            let title = note.noteTitle;
            if (expansion==undefined || expansion==""){
                Application.sharedInstance().showHUD("剪贴板为空！", self.window, 2);
                
            }
            else{
            //添加前缀
            //let titleText = expansion + title;
            //添加后缀
            //let titleText = title + expansion;
            //添加标题
            let titleText = title +";"+expansion;
            note.noteTitle = titleText;
            Database.sharedInstance().setNotebookSyncDirty(note.notebookId);//同步到数据库
            NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('RefreshAfterDBChange',self,{topicid:note.notebookId});

            }
            
            
            
        },
        toggleFillTitle: function (sender) {
            var lan = NSLocale.preferredLanguages().length ? NSLocale.preferredLanguages()[0].substring(0, 2) : 'en';
            let tips = lan === 'zh' ? '标题填充已关闭' : 'FillTitle is turned off';
            if (self.FillTitle) {
                self.FillTitle = false;
            } else {
                self.FillTitle = true;
                tips = lan === 'zh' ? '点击笔记后将剪贴板的文字填充入标题' : 'Click notes to fill in the title with the clipboard text';
            }
            Application.sharedInstance().showHUD(tips, self.window, 2);
            NSUserDefaults.standardUserDefaults().setObjectForKey(self.FillTitle, 'marginnote_FillTitle');
            Application.sharedInstance().studyController(self.window).refreshAddonCommands();
        },
    }, /*Class members*/{
        addonDidConnect: function () {
        },
        addonWillDisconnect: function () {
        },
        applicationWillEnterForeground: function () {
        },
        applicationDidEnterBackground: function () {
        },
        applicationDidReceiveLocalNotification: function (notify) {
        },
    });
};

