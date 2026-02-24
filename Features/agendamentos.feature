# language: pt
@session:profile
Funcionalidade: Agendamentos

@agendamentos
Cenário: Criar um novo agendamento com sucesso
Dado que acessei a tela de agendamentos
E clico no botão novo agendamento
E seleciono um serviço
E seleciono uma data
E seleciono um horário
Quando clico no botão de confirmação de agendamento
Então deve ser exibido o toast de sucesso no agendamento

@agendamentos
Cenário: Botão de confirmação de agendamento desativado
Dado que acessei a tela de agendamentos
Quando não realizo a seleção de nada
Então o botão de confirmação de agendamento deve estar desativado