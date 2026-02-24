# language: pt
@session:profile
Funcionalidade: Navegação pelo Dashboard

@dashboard
Cenário: Criar um novo agendamento pelo botão do Dashboard
Dado que acessei a tela de dashboard
E clico no botão de novo agendamento
E seleciono um serviço
E seleciono uma data
E seleciono um horário
Quando clico no botão de confirmação de agendamento
Então deve ser exibido o toast de sucesso no agendamento

@dashboard
Cenário: Ver todos agendamentos através do botão do Dashboard
Dado que acessei a tela de dashboard
Quando clico no botão ver todos
Então devo ser redirecionado para a tela de agendamentos

@dashboard
Cenário: Acessar a tela de serviços pelo menu lateral
Dado que acessei a tela de dashboard
Quando clico no botão de serviços no menu lateral
Então devo ser redirecionado para a tela de serviços

@dashboard
Cenário: Acessar a tela de agendamentos pelo menu lateral
Dado que acessei a tela de dashboard
Quando clico no botão de agendamentos no menu lateral
Então devo ser redirecionado para a tela de agendamentos

@dashboard
Cenário: Sair da aplicação
Dado que acessei a tela de dashboard
Quando clico no botão sair no menu lateral
Então devo ser redirecionado para a tela de login