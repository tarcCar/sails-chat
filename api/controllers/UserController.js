module.exports = {

  async create(req, res) {
    try {
      const nome = req.body.nome;
      if (!nome) {
        return res.badRequest('Nome é obrigatorio!');
      }
      let user = await User.findOne({ nome });
      if (!user) {
        user = await User.create(req.body).fetch();
      }
      return res.ok(user);
    } catch (e) {
      return res.badRequest(e);
    }
  },

  async chats(req, res) {
    try {
      const user = req.params.user;
      const { rows } = await Chat.getDatastore().sendNativeQuery(`SELECT c.* FROM chat_users__user_chats uc
      inner join chat c on c.id = uc.chat_users
      where uc.user_chats = $1` , [user]);

      const chatsIds = rows.map(r => r.id);

      const [chats, mensagens ] = await Promise.all([
        Chat.find({
          id: chatsIds
        }),
        Mensagem.find({ chat: chatsIds}).populate('sender')
      ]);

      chats.forEach(chat => {
        chat.mensagens = mensagens.filter(m => m.chat === chat.id);
      });

      return res.ok(chats);
    } catch (e) {
      console.log(e);
      return res.badRequest(e);
    }
  },

  async chatsNotIn(req, res) {
    try {
      const user = req.params.user;
      const { rows } = await Chat.getDatastore().sendNativeQuery(`select c.* from chat c 
      where c.id not in (SELECT uc.chat_users FROM chat_users__user_chats uc
      where uc.user_chats = $1)` , [user]);
      const chatsIds = rows.map(r => r.id);

      const [chats, mensagens ] = await Promise.all([
        Chat.find({
          id: chatsIds
        }),
        Mensagem.find({ chat: chatsIds}).populate('sender')
      ]);

      chats.forEach(chat => {
        chat.mensagens = mensagens.filter(m => m.chat === chat.id);
      });
      return res.ok(chats);
    } catch (e) {
      console.log(e);
      return res.badRequest(e);
    }
  },
};
