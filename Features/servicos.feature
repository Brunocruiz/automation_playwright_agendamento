# language: pt
@session:profile
Funcionalidade: Serviços

@servicos
Cenário: Criar um novo agendamento através da tela de serviços
Dado que acessei a tela de serviços
E clico no botão agendar
E seleciono uma data
E seleciono um horário
Quando clico no botão de confirmação de agendamento
Então deve ser exibido o toast de sucesso no agendamento