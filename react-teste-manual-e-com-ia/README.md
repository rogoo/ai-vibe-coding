# Teste humano vs Teste IA
O grosso do projeto foi criado pela IA, com exceção dos testes - pois queria comprar a diferença do teste manual e feito pela IA.

Primeiro quis escrever os testes manualmente, para depois (no projeto cópia), pedir que a IA criasse os testes, com o objetivo de evitar ser influenciado.

**Resumo:** Óbvio que a grande vantagem da IA foi a rapidez. Este é uma parte do desenvolvimento que agora pode ser bastante rápido e seguro, pois IA é fenomenal em seguir templates (criar teste de um componente já pronto).

## Projeto Teste Manual (teste-manual-por-euzinho)
Este foi o teste feito manualmente por mim.

## Projeto Teste feito por IA (teste-usando-ia)
Este foi o teste feito pela IA (Claude Opus).

### Lições aprendidas
Comparando a diferença dos projetos.

**> Arquivo setupTests.ts**
Achei boa a IA ter criado este arquivo, para evitar a constante importação do clássico ***testing-library/jest-dom***.

**> Header.test.tsx**
Achei útil a função que a IA criou para evitar a repetição.
```
function renderHeader(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
    </MemoryRouter>,
  );
}
```
E teve um cenário que não fiz, que foi colocar um link não existe no header (exemplo, **/users/new**) e ver se o link de Users ficava ativo.

**> About.test.tsx**
Arquivo com texto estático, não muito o que fazer de teste que não seja verificar título e itens do texto que sejam importantes.

**> UserForm.test.tsx**
Meu arquivo continha 382 linhas e o da IA tinha 159.

Eu acabei colocando validações extras no codigo, como botão Save só habilita depois dos campos preenchidos e coloquei um campo telefone pra validar pattern do telefone, que esqueci de copiar depois para o que IA gerou... rs

Achei interessante ele ter gerado um mock das rotas e na rota da **lista** ter renderizado um simples texto para facilitar a verificação do sucesso ao redirecionar o usuário para a lista.

**Não Vou listar Todas Comparações**

# Resumo
A IA as fezes faz caquinha codificando, mas para escrever testes unitários é muito boa. Vida longa a IA... rs
