module.exports = {
  attributes: {
    nome: { type: 'string', required: true },
    users: {
      via: 'chats',
      collection: 'User'
    },
    mensagens: {
      via: 'chat',
      collection: 'Mensagem'
    }
  },
  migrate: 'alter'
};

