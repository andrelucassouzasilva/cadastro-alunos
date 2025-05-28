const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

router.post('/alunos', async (req, res) => {
  try {
    const { nome_completo, usuario_acesso, senha, email_aluno, observacao } = req.body;

    if (!nome_completo || !usuario_acesso || !senha || !email_aluno) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const [result] = await db.execute(
      'INSERT INTO alunos (nome_completo, usuario_acesso, senha_hash, email_aluno, observacao) VALUES (?, ?, ?, ?, ?)',
      [nome_completo, usuario_acesso, senha_hash, email_aluno, observacao || null]
    );

    res.status(201).json({ mensagem: 'Aluno cadastrado com sucesso.', id: result.insertId });
  } catch (erro) {
    console.error(erro);
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Usuário ou e-mail já existe.' });
    }
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;
