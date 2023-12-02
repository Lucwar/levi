"use strict";

// Define module
module.exports = (helper) => {
  /**
   * Handle sockets
   *
   * @param {Object} params - Parameters
   * @return {Promise}
   */
  return async (socket, io) => {
    let USER = {};
    let processingGeolocationData = false;

    socket.on("handleUser", async (user) => {
      USER = await global.modules.v1.users.model
        .findById(user)
        .catch((e) => console.log(e));

      socket.join(user);

      socket.emit("event", "updateUser", USER);

      if (!USER.enabled)
        return global.helpers.actions.notify({
          name: "logout",
          type: "push",
          user,
          performRequired: true,
          payload: { action: "logout" },
        });
      else helper.lib.eventEmitter.emit("send-actions", user);

      await global.modules.v1.users.model.updateOne(
        { _id: user },
        { online: true }
      );

      const onlineUsers = await global.modules.v1.users.model.distinct("_id", {
        online: true,
      });
      io.emit("event", "onlineUsers", onlineUsers);

      socket.on("logout", async () => {
        await global.modules.v1.users.model.updateOne(
          { _id: user },
          { online: false }
        );

        const onlineUsers = await global.modules.v1.users.model.distinct(
          "_id",
          { online: true }
        );
        io.emit("event", "onlineUsers", onlineUsers);
      });

      socket.on("disconnect", async () => {
        await global.modules.v1.users.model.updateOne(
          { _id: user },
          { online: false }
        );

        const onlineUsers = await global.modules.v1.users.model.distinct(
          "_id",
          { online: true }
        );
        io.emit("event", "onlineUsers", onlineUsers);
      });

      socket.on("handleTimezone", async (gmt) => {
        if (USER._id)
          await global.modules.v1.users.model
            .updateOne({ _id: USER._id }, { gmt })
            .catch((e) => console.log(e));
      });
    });




    socket.on('backgroundGeolocationData', async ({ latitude, longitude }) => {

      try {

        if (!USER || !USER._id || !USER.geolocation) return;

        if (USER.lastGeolocation && helper.lib.moment(USER.lastGeolocation).isAfter(helper.lib.moment().subtract(USER.geolocationTime, 'minutes').format())) return;

        if (processingGeolocationData) return
        else processingGeolocationData = true;

        if (!USER.sendingGeolocation) {
          USER.sendingGeolocation = true;
          await USER.save();
        }

        if (!USER.lastGeolocation) {
          USER.lastGeolocation = helper.lib.moment().format();
          await USER.save();
        }


        const emergencies = await global.modules.v1.emergencies.model.find({
          user: USER._id,
          createdAt: { $gte: helper.lib.moment().subtract(helper.settings.businessRules.emergencies.geolocationHours, 'hours').format() }
        }).sort({ createdAt: 1 });

        let guards = emergencies.reduce((guards, emergency) => [...guards, ...emergency.guards], []).map(guard => guard.toString());

        guards = [...new Set(guards)];

        const conversations = [];

        for (const guard of guards) {
          const conversation = await global.modules.v1.conversations.model.findOne({ users: { $all: [guard, USER._id] } });
          if (conversation) conversations.push(conversation);
        }


        for (const conversation of conversations) {

          const message = await global.helpers.chat.createMessage({
            type: 'map',
            map: {
              address: 'leliPutitaRika',
              addressGoogle: '',
              location: {
                type: 'Point',
                coordinates: [longitude, latitude]
              }
            },
            emergency: emergencies[0] ? emergencies[0]._id : null,
            conversation: conversation._id,
            author: USER._id,
            authorName: USER.fullName
          });

          io.in(message.conversation.toString()).emit('event', 'refreshMessages', message);

          // await global.helpers.push.notify({
          //   title: message.authorName,
          //   message: 'Geolocalización',
          //   action: true,
          //   payload: { action: 'chat', id: message.conversation },
          //   usersApp: conversation.users.filter(userconv => userconv.toString() !== message.author.toString()),
          // });

        }

        USER.lastGeolocation = helper.lib.moment().format();
        await USER.save();

        processingGeolocationData = false;

      } catch (error) {
        console.log(error);
      }
    });




    socket.on("actionPerformed", async (action) => {
      const query = {
        user: action.user,
        type: action.type,
        name: action.name,
        performed: false,
      };

      if (action.payload && action.payload.id)
        query["payload.id"] = action.payload.id;

      await global.modules.v1.actions.model
        .updateMany(query, { performed: true })
        .catch((e) => console.log(e));

      helper.lib.eventEmitter.emit("send-actions", action.user);
    });

    socket.on("newConversation", async (user) => {
      const conversation = await global.modules.v1.conversations.model
        .create({ users: [user, USER._id] })
        .catch((e) => console.log(e));

      const push = {
        title: USER.username,
        message: "Inició una nueva conversación",
        usersApp: [user],
        action: true,
        performRequired: false,
        payload: { action: "chat", id: conversation._id },
      };

      await global.helpers.push.notify(push).catch((e) => console.log(e));

      await global.helpers.actions.notify({
        name: "chat",
        type: "socket",
        user: USER._id,
        performRequired: true,
        payload: push.payload,
      });
    });

    socket.on("enterConversation", async (room) => socket.join(room));

    socket.on("leaveConversation", (room) => socket.leave(room));

    socket.on("cleanChat", async (conversation) => {
      await global.modules.v1.messages.model
        .updateMany({ conversation }, { $push: { deletedBy: USER._id } })
        .catch((e) => console.log(e));

      io.in(conversation).emit("event", "refreshMessages", null, true);
    });

    socket.on("updateMessage", async (messageId, update) => {
      const message = await global.modules.v1.messages.model
        .findByIdAndUpdate(messageId, update, { new: true })
        .populate("reply")
        .catch((e) => console.log(e));

      io.in(message.conversation).emit("event", "refreshMessage", message);
    });

    socket.on("updateConversation", async (action, conversationId, target) => {
      let conversation = await global.modules.v1.conversations.model
        .findById(conversationId)
        .populate("users")
        .catch((e) => console.log(e));
      const targetMember =
        (await global.modules.v1.users.model
          .findById(target)
          .catch((e) => console.log(e))) || {};

      conversation = conversation.toJSON();

      const handleUsersApp = () =>
        conversation.users
          .filter(
            (user) =>
              user.id !== USER._id.toString() &&
              user.id !== target &&
              !conversation.silencedBy.includes(user)
          )
          .map((user) => user.id);

      const actions = {
        newMember: {
          invalid: conversation.users.some(
            (user) => user.id.toString() === target
          ),
          messageBody: `${USER.username} agregó a ${targetMember.username}`,
          update: {
            $push: { users: target },
            ...(conversation.type === "individual" && {
              type: "group",
              admins: [USER._id],
              groupName: [
                ...conversation.users.map((user) => user.username),
                targetMember.username,
              ].join(", "),
            }),
          },
          pushs: [
            {
              body: `${USER.username} agregó a ${targetMember.username}`,
              usersApp: handleUsersApp(),
            },
            {
              body: `${USER.username} te agregó al grupo`,
              usersApp: [target],
            },
          ],
        },
        removeMember: {
          messageBody: `${USER.username} eliminó a ${targetMember.username}`,
          update: {
            $pull: {
              admins: target,
              users: target,
              silencedBy: target,
              deletedBy: target,
            },
          },
          pushs: [
            {
              body: `${USER.username} eliminó a ${targetMember.username}`,
              usersApp: handleUsersApp(),
            },
          ],
        },
        changePicture: {
          messageBody: `${USER.username} cambió la foto del grupo`,
          update: { groupPicture: target },
          pushs: [
            {
              body: `${USER.username} cambió la foto del grupo`,
              usersApp: handleUsersApp(),
            },
          ],
        },
        changeName: {
          messageBody: `${USER.username} cambió el nombre del grupo a "${target}"`,
          update: { groupName: target },
          pushs: [
            {
              body: `${USER.username} cambió el nombre del grupo a "${target}"`,
              usersApp: handleUsersApp(),
            },
          ],
        },
        leave: {
          messageBody: `${USER.username} salió del grupo`,
          update:
            conversation.admins.length === 1 &&
              conversation.admins[0].toString() === USER._id.toString()
              ? {
                admins: [
                  conversation.users.find(
                    (user) => user.id !== USER._id.toString()
                  ).id,
                ],
                $pull: {
                  users: USER._id,
                  silencedBy: USER._id,
                  deletedBy: USER._id,
                },
              }
              : {
                $pull: {
                  admins: USER._id,
                  users: USER._id,
                  silencedBy: USER._id,
                  deletedBy: USER._id,
                },
              },
          pushs: [
            {
              body: `${USER.username} salió del grupo`,
              usersApp: handleUsersApp(),
            },
          ],
        },
        silence: {
          update: {
            [conversation.silencedBy.includes(USER._id.toString())
              ? "$pull"
              : "$push"]: { silencedBy: USER._id },
          },
          pushs: [],
        },
        delete: {
          update: { $push: { deletedBy: USER._id } },
          pushs: [],
        },
      };

      console.log(conversation.admins.length);
      console.log(typeof conversation.admins[0], USER._id.toString());
      console.log(
        conversation.users.find((user) => user.id !== USER._id.toString())
      );
      console.log(actions[action]);

      if (actions[action].invalid) return console.log("Error de validación");

      conversation = await global.modules.v1.conversations.model
        .findByIdAndUpdate(conversationId, actions[action].update, {
          new: true,
        })
        .populate("users")
        .catch((e) => console.log(e));

      conversation = conversation.toJSON();

      if (actions[action].messageBody)
        await global.helpers.chat
          .createMessage({
            conversation: conversationId,
            body: actions[action].messageBody,
            author: USER._id,
            authorName: USER.username,
            type: "info",
          })
          .catch((e) => console.log(e));

      for (const push of actions[action].pushs)
        await global.helpers.push
          .notify({
            title: conversation.groupName || USER.username,
            message: push.body,
            usersApp: push.usersApp,
            action: true,
            performRequired: false,
            payload: { action: "chat", id: conversationId },
          })
          .catch((e) => console.log(e));

      io.in(conversationId)
        .in(USER._id)
        .emit("event", "refreshConversation", conversation);
    });

    socket.on("newMessage", async (payload) => {

      const message = await global.helpers.chat
        .createMessage(payload)
        .catch((e) => console.log(e));

      io.in(message.conversation.toString()).emit("event", "refreshMessages", message);

      const conversation = await global.modules.v1.conversations.model
        .findById(message.conversation)
        .catch((e) => console.log(e));

      const push = {
        title: conversation.groupName || message.authorName,
        message:
          (conversation.type === "group" ? message.authorName + ": " : "") +
          message.body,
        action: true,
        payload: {
          action: "chat", id: message.author, view: payload.view == 'sheltered' ? 'guard' : 'sheltered'
        },
        usersApp: conversation.users.filter(
          (user) => user.toString() !== message.author.toString()
        ),
      };

      await global.helpers.push.notify(push).catch((e) => console.log(e));
    });

    // Videollamada
    socket.on("joinVideoCallRoom", (roomId, userId) => {
      console.log("joinVideoCallRoom: " + roomId + ". user: " + userId);
      socket.join(roomId);
      socket
        .to(roomId)
        .broadcast.emit("event", "videoCallUserConnected", userId);

      socket.on("videoCallDisconnect", () =>
        socket
          .to(roomId)
          .broadcast.emit("event", "videoCallUserDisconnected", userId)
      );
      socket.on("disconnect", () =>
        socket
          .to(roomId)
          .broadcast.emit("event", "videoCallUserDisconnected", userId)
      );
    });
  };
};
