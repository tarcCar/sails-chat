module.exports = {
  async join(req, res) {
    try {

      if (!req.isSocket) {
        return res.badRequest();
      }

      const [chat, user] = await Promise.all([
        Chat.findOne(req.body.chat).populate('users'),
        User.findOne(req.body.user)
      ]);

      if (!chat) {
        return res.badRequest('Chat não encontrado!');
      }

      if (!user) {
        return res.badRequest('Usuário não encontrado!');
      }

      const userInChat = chat.users.find(u=> u.id === user.id);
      if(!userInChat) {
        await Chat.addToCollection(chat.id, 'users').members(user.id);
      }
      sails.sockets.join(req, chat.id);

      sails.sockets.broadcast(chat.id, 'userEnterInChat', { user: user.nome}, req);

      return res.ok();
    } catch (e) {
      return res.badRequest(e);
    }
  },
  async leave(req, res) {
    try {

      if (!req.isSocket) {
        return res.badRequest();
      }

      const chat= await Chat.findOne(req.body.chat).populate('users');

      if (!chat) {
        return res.badRequest('Chat não encontrado!');
      }

      sails.sockets.leave(req, chat.id);

      return res.ok();
    } catch (e) {
      return res.badRequest(e);
    }
  }

};
