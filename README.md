# Transpetro Study Tracker

Painel de acompanhamento de estudos para concurso, com progresso por matéria e um timer Pomodoro embutido.

## Funcionalidades

- Matérias e tópicos de estudo com checkbox de conclusão e progresso por matéria
- Adição livre de novos tópicos
- Medidor de progresso geral (gauge) e contagem de dias até a prova
- Timer Pomodoro (25 min foco / 5 min pausa) com contador de ciclos concluídos
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
  StudyTracker.jsx          — componente principal, junta hooks e UI
  storage-polyfill.js       — implementa window.storage via localStorage
  constants.js              — matérias/tópicos padrão, datas, durações do timer
  utils.js                  — funções utilitárias (ex.: dias até a prova)
  hooks/
    useStudySubjects.js     — estado das matérias/tópicos e persistência
    usePomodoro.js          — estado e lógica do timer Pomodoro
  components/
    Gauge.jsx               — medidor SVG de progresso geral
    GlobalStyles.jsx        — fontes e estilos globais
    DashboardHeader.jsx     — cabeçalho com dias restantes e gauge
    PomodoroPanel.jsx       — painel do timer
    SubjectCard.jsx         — card expansível de cada matéria
    TopicRow.jsx            — linha de um tópico individual
```

## Notas

O componente `StudyTracker` foi originalmente criado como um Artifact de arquivo único no Claude.ai, que expõe uma API `window.storage` própria daquele sandbox. Para rodar como app local, `storage-polyfill.js` reimplementa essa mesma API usando `localStorage`, sem precisar alterar a lógica do componente.
