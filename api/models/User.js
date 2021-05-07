module.exports = {
  attributes: {
    nome: { type: 'string', required: true },
    chats:{
      via: 'users',
      collection: 'Chat'
    }
  },
  migrate: 'alter'
};
