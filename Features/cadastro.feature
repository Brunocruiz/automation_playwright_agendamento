# language: pt
@session:none
Funcionalidade: Cadastro

@cadastro @critical
Cenário: Cadastro na aplicação com sucesso
Dado que acessei a tela de cadastro
E preencho o campo de nome 
E preencho o campo de email com email aleatório
E preencho o campo de senha
E preencho o campo de confirmação de senha
Quando clico no botão de cadastro
Então deve ser exibido um toast de conta criada

@cadastro @critical
Cenário: Cadastro na aplicação sem preencher campos
Dado que acessei a tela de cadastro
E mantenho os campos vazios
Quando clico no botão de cadastro
Então deve ser exibido mensagens de erro indicando os campos de cadastro

@cadastro @critical
Cenário: Cadastro na aplicação com senhas diferentes
Dado que acessei a tela de cadastro
E preencho o campo de nome
E preencho o campo de email
E preencho o campo de senha incorretamente
E preencho o campo de confirmação de senha
Quando clico no botão de cadastro
Então deve ser exibido mensagens de erro indicando que as senhas não coincidem

@cadastro @critical
Cenário: Redirecionamento para tela de login
Dado que acessei a tela de cadastro
Quando clico no link de login
Então devo ser redirecionado para a tela de login