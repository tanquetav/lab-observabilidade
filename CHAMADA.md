Analisando o comportamento de aplicações: Os 3! pilares usados pelas maiores empresas do mundo para fazer observabilidade


George Tavares

Nessa palestra apresentarei traces distribuídos , como ocorre a comunicação entre os diversos microserviços, como correlacionar os logs das aplicações com o trace além de observar métricas de uma forma unificada em um dashboard. Usarei como estudo de caso a ingestão de dados usando opentelemetry para a stack de observabilidade da elastic com o kibana (dashboard da elastic) e a evolução do OTEL nesses últimos anos




O processo de telemetria de aplicações sempre foi dominado por grandes e caros players, e a implementação profunda de telemetria envolvia usar bibliotecas de determinado fabricante, gerando um lockin não muito agradável aos desenvolvedores, além de poluir o código com SDKs especificos do fabricante da solução.

Isso mudou com a CNCF impulsionando projetos opensource e fundando o opentelemetry, uma solução agnostica de fabricante que prove as mesmas funcionalidades sem vendor lockin. Cada vez mais novos aspectos de observabilidade estão sendo adicionados ao otel e hoje a situação mudou: os players estão impulsionando a evolução do otel como seu framework de observabilidade principal.

Os golden signals de aplicação estão cada vez mais cobertos pelas soluções de telemetria, apontando com mais facilidade os gargalos da aplicação e dando insights nos principais pontos de melhorias da aplicação. Hoje em dia os 3 pilares (metricas, traces e logs) estão sendo expandidos por novas técnicas de analise:
- Traces distribuídos: analisar uma aplicação isolada não é mais uma opção em sistemas distribuídos que temos hoje, uma analise distribuída é necessária
- Alertas: alertas apesar de não ser considerado por muitos um golden signal possibilita uma resposta mais efetiva em falhas que podem afetar o SLA ou SLO.
- Continuos profiling: Novas técnicas de instrumentação como eBPF estão permitindo analisar mais profundamente o contexto das aplicações quando estão rodando em ambiente produtivo, com um impacto muito menor na aplicação.

Na apresentação irei apresentar a evolução do otel nestes ultimos anos, as dores superadas, e o que podemos esperar no futuro próximo


