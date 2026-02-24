# language: pt
@session:none
Funcionalidade: Login

@login @critical
Cenário: Logar na aplicação com sucesso
Dado que acessei a tela de login
E preencho o campo de email
E preencho o campo de senha
Quando clico no botão de login
Então devo ser redirecionado para o dashboard

@login @critical
Cenário: Logar na aplicação com email incorreto
Dado que acessei a tela de login
E preencho o campo de email incorretamente
E preencho o campo de senha
Quando clico no botão de login
Então devo ser exibido um toast de credenciais inválidas

@login @critical
Cenário: Logar na aplicação com senha incorreta
Dado que acessei a tela de login
E preencho o campo de email
E preencho o campo de senha incorretamente
Quando clico no botão de login
Então devo ser exibido um toast de credenciais inválidas

@login @critical
Cenário: Logar na aplicação sem preenchimento de campos
Dado que acessei a tela de login
E mantenho os campos de email e senha vazios
Quando clico no botão de login
Então devo ser exibido mensagens de erro indicando os campos

@login @critical
Cenário: Redirecionamento para tela de cadastro
Dado que acessei a tela de login
Quando clico no link de cadastre-se
Então devo ser redirecionado para a tela de cadastro