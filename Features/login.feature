# language: pt
Funcionalidade: Login

@login @critical
Cenário: Logar na aplicação com sucesso
Dado que acessei a tela de login
E preencho o campo de email
E preencho o campo de senha
Quando clico no botão de login
Então devo ser redirecionado para o dashboard