# Study Tracker

Organize quantos estudos quiser (concursos, cursos, certificações), cada um com suas próprias matérias e tópicos, e um timer Pomodoro embutido pra manter o foco.

## Funcionalidades

- Vários estudos independentes, cada um com nome e data-alvo opcional (contagem regressiva)
- Matérias e tópicos com checkbox de conclusão, progresso por matéria e medidor geral
- Adição livre de novas matérias e tópicos em qualquer estudo
- Timer Pomodoro (25 min foco / 5 min pausa) com som ao iniciar e ao final de cada fase, e contador de ciclos concluídos
- Tutorial de boas-vindas na primeira visita (revisitável a qualquer momento)
- Progresso salvo automaticamente no `localStorage` do navegador

## Rodando o projeto

Requer Node.js 18+.

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (por padrão `http://localhost:5173`).

Outros scripts:

```bash
npm run build     # build de produção em dist/
npm run preview   # serve o build de produção localmente
```

## Estrutura

```
src/
  main.jsx                 — bootstrap da aplicação
  StudyTracker.jsx          — componente raiz: alterna entre a lista de estudos e o detalhe de um estudo
  StudyList.jsx             — tela inicial, lista de estudos + criação de novos
  StudyDetail.jsx           — tela de um estudo (matérias, tópicos, Pomodoro)
  storage-polyfill.js       — implementa window.storage via localStorage
  sound.js                  — sons do Pomodoro via Web Audio API (início e fim de fase)
  constants.js              — chaves de storage, matérias padrão do estudo seed, durações do timer
  utils.js                  — funções utilitárias (dias restantes, progresso agregado)
  hooks/
    useStudies.js           — estado de todos os estudos, migração de dados antigos e persistência
    usePomodoro.js          — estado e lógica do timer Pomodoro
  components/
    Onboarding.jsx          — tutorial de boas-vindas (modal com passos)
    StudyCard.jsx           — card de um estudo na tela inicial
    Gauge.jsx               — medidor SVG de progresso geral
    GlobalStyles.jsx        — fontes e estilos globais
    DashboardHeader.jsx     — cabeçalho de um estudo (nome, dias restantes, gauge)
    PomodoroPanel.jsx       — painel do timer
    SubjectCard.jsx         — card expansível de cada matéria
    TopicRow.jsx            — linha de um tópico individual
```

## Notas

O app foi originalmente criado como um Artifact de arquivo único no Claude.ai, que expõe uma API `window.storage` própria daquele sandbox. Para rodar como app local, `storage-polyfill.js` reimplementa essa mesma API usando `localStorage`, sem precisar alterar a lógica dos componentes.

Progresso salvo no formato antigo (versão de estudo único) é migrado automaticamente para um estudo chamado "Transpetro" na primeira vez que a nova versão carrega.
