// import { Directive, ViewChild } from '@angular/core';
// import { FormPage } from './form.page';
// import { IonContent } from '@ionic/angular';
// import { Validators } from '@angular/forms';
// import { Params } from '@angular/router';

// @Directive({selector: '[ChatBasePage]'})
// export class ChatBasePage extends FormPage {

//   @ViewChild(IonContent, { static: false }) content: IonContent;
//   chatId: string;
//   chat: {[k: string]: any};
//   messages: {[k: string]: any}[];
//   messageReplying: {[k: string]: any};
//   socketInitialized: boolean;
//   reactions = [];
//   messageOptions = [];

//   ngOnInit() {
//     const subscription = this.activatedRoute.params.subscribe((params: Params) => this.handleParams(params));
//     this.subscriptions.add(subscription);
//   }

//   handleParams(params: Params) {
//     this.chatId = params.id;
//     this.getChat();
//   }

//   ionViewDidLeave() {
//     this.pageService.socket.emit(this.settings.events.chat.leaveConversation, this.chatId);
//   }

//   handleChatEndpointParams(): [string, Partial<EndPointParamsGETOne>] {
//     const endPoint = this.settings.endPoints.conversations;
//     const populates = ['users'];
//     const id = this.chatId;
    
//     return [endPoint, { id, populates }];
//   }

//   getChat() {
//     this.pageService.httpGetOne(...this.handleChatEndpointParams())
//     .then(res => this.getChatOnSuccess(res))
//     .catch(e => this.pageService.showError(e));
//   }

//   getChatOnSuccess(res: any) {
    
//     this.chat = res.data;
//     this.chat.otherUser = res.data.users.find(user => user.id !== this.user.id);
//     this.chat.userInConversation = res.data.users.some(user => user.id === this.user.id);

//     this.pageService.socket.emit(this.settings.events.chat.enterConversation, this.chatId);
    
//     this.getMessages();
//   }

//   handleMessagesEndpointParams(): [string, Partial<EndPointParams>] {
//     const endPoint = this.settings.endPoints.messages;
//     const filters = { conversation: this.chatId };
//     const sort = { createdAt: 1 };
//     const populates = ['reply'];
    
//     return [endPoint, { sort, filters, populates }];
//   }

//   getMessages() {
//     this.messages = [];

//     this.pageService.httpGetAll(...this.handleMessagesEndpointParams())
//     .then(res => this.getMessagesOnSuccess(res))
//     .catch(e => this.pageService.showError(e));
//   }
  
//   getMessagesOnSuccess(res: any) {
//     for (const message of res.data) this.addMessage(message);
//   }

//   addMessage(message) {
    
//     const Message = this.formatMessage(message);

//     this.messages.push(Message);
//     this.chat.lastMessage = Message;
    
//     this.scroll();
//   }

//   formatMessage(message) {
//     if (this.user.id === message.author) message.own = true;
    
//     const allReactions = this.reactions.map((Reaction: any) => {
      
//       const data = message.reactions.filter(reaction => reaction.type === Reaction.name);
//       const userReacted = data.some(reaction => reaction.user === this.user.id);
  
//       return { data, userReacted, ...Reaction };
//     });

//     message.reactions = allReactions.filter(reaction => reaction.data.length);

//     return { ...message };
//   }

//   getFormNew() {
//     return this.formBuilder.group({
//       message: [null, Validators.required],
//       type: ['text']
//     });
//   }

//   onSubmitPerform(item) {
//     const message = this.handleNewMessage(item);

//     this.pageService.socket.emit(this.settings.events.chat.newMessage, message, this.chat, this.user);
    
//     this.form = this.getFormNew();
    
//     this.scroll();
//   }

//   handleNewMessage(item): {[k: string]: any} {

//     const message: {[k: string]: any} = {
//       author: this.user.id,
//       authorName: this.user.username,
//       body: item.message,
//       conversation: this.chatId,
//       type: item.type
//     };

//     if (this.messageReplying) {
//       message.reply = this.messageReplying.id;
//       this.messageReplying = null;
//     }

//     return message; 
//   }

//   uploadImage() {
//     this.pageService.showImageUpload()
//     .then((resp: any) => {
//       if (!resp?.data?.file) return;

//       this.form.patchValue({ message: resp.data.file, type: 'file' });

//       this.onSubmitPerform(this.form.value);

//     }).catch(e => this.pageService.showError(e));
//   }

//   scroll() {
//     setTimeout(() => this.content.scrollToBottom(0));
//   }

//   handleReaction(type, message) {

//     message.showEmojis = false;

//     const reactions = [];
    
//     message.reactions.forEach(Reaction => Reaction.data.forEach(reaction => reactions.push(reaction)));

//     const prevReactionIndex = reactions.findIndex(reaction => reaction.user === this.user.id && reaction.type === type);

//     if (prevReactionIndex !== -1) reactions.splice(prevReactionIndex, 1);
//     else reactions.push({ user: this.user.id, type });

//     this.pageService.socket.emit(this.settings.events.chat.updateMessage, message.id, { reactions });
//   }

//   onlineUsersEvent(users: string[]) {
    
//     if (!this.chat) return;
    
//     for (const User of this.chat.users) User.online = users.some(user => user === User.id);
//   }

//   refreshMessageEvent(Message) {
    
//     Message = this.formatMessage(Message);
  
//     const index = this.messages.findIndex(message => message.id === Message.id);
//     if (index === -1) return;
    
//     this.messages[index] = Message;
//   }

//   refreshMessagesEvent(message, all?: boolean) {
    
//     if (all) return this.getMessages();
    
//     if (message.conversation !== this.chatId) return;
    
//     this.addMessage(message);
//   }

//   refreshConversationEvent(conversation) {

//     if (conversation.id !== this.chatId) return;

//     this.chat = conversation;
//     this.chat.otherUser = conversation.users.find(user => user.id !== this.user.id);
//     this.chat.userInConversation = conversation.users.some(user => user.id === this.user.id);
//   }
  
//   handlePendingActions(actions) {
    
//     if (!this.chatId) return setTimeout(() => this.handlePendingActions(actions));

//     const Action = actions.find(action => action.name === 'chat' && action.payload.id === this.chatId);

//     if (Action) this.pageService.performAction(Action);
//   }

//   showNotificationAppOpen(payload: { [k: string]: any; }): boolean {
    
//     if (payload.action === 'chat' && payload.id === this.chatId) return false;

//     return true;
//   }

// }
