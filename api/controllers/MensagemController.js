module.exports = {
  async send(req, res) {
    try {

      if (!req.isSocket) {
        return res.badRequest();
      }

      const [chat, user] = await Promise.all([
        Chat.findOne(req.body.chat).populate('users'),
        User.findOne(req.body.sender)
      ]);

      if (!chat) {
        return res.badRequest('Chat não encontrado!');
      }

      if (!user) {
        return res.badRequest('Usuário não encontrado!');
      }
      let message = await Mensagem.create(req.body).fetch();

      [message] = await Promise.all([
        Mensagem.findOne(message.id).populate('sender'),
        Chat.addToCollection(chat.id, 'mensagens').members(message.id)
      ]);

      sails.sockets.broadcast(chat.id, 'newMessage', { message }, req);

      return res.ok(message);
    } catch (e) {
      console.log(e);
      return res.badRequest(e);
    }
  }

};

