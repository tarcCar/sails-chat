module.exports = {
  attributes: {
    mensagem: { type: 'string', required: true },
    chat: {
      model: 'Chat'
    },
    sender: {
      model:'User'
    }
  },
  migrate: 'alter'
};

