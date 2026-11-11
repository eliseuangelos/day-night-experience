# DAY & NIGHT EXPERIENCE

Um clique e a Terra gira: a luz atravessa o planeta e a página amanhece ou anoitece diante de você.

O **DAY & NIGHT EXPERIENCE** é um projeto pessoal que apresenta uma forma visual de alternar entre temas claro e escuro. A experiência combina um botão de alternância com uma animação cinematográfica da Terra e inclui o **DAY & NIGHT BUILDER**, uma ferramenta para personalizar e gerar versões do componente para utilização em outros sites.

<p align="center">
  <a href="https://eliseuangelos.github.io/day-night-experience/">Ver demonstração</a> ·
  <a href="https://eliseuangelos.github.io/day-night-experience/construtor/">Abrir construtor</a> ·
  <a href="https://github.com/eliseuangelos/day-night-experience">Repositório no GitHub</a>
</p>

---

## Visão geral

O projeto possui duas áreas principais:

### 1. DAY & NIGHT EXPERIENCE — Demonstração

A página inicial apresenta o alternador de temas em funcionamento. Ao alternar entre dia e noite, uma representação animada da Terra revela a mudança de iluminação e o novo tema da interface.

A demonstração também oferece controles para testar a alternância, experimentar as velocidades e observar como diferentes elementos da página se adaptam aos temas.

**A página inicial original permanece como a porta de entrada do projeto.**

[Acessar a demonstração](https://eliseuangelos.github.io/day-night-experience/)

### 2. DAY & NIGHT BUILDER — Construtor

O construtor permite criar uma versão personalizada do alternador, visualizar as alterações e baixar os arquivos para integrar o componente a outro site.

O visitante pode escolher entre duas modalidades:

- **Somente botões:** alternador de tema claro/escuro sem o efeito visual da Terra. É a opção mais leve para quem deseja apenas os controles de alternância.
- **Experiência completa:** alternador com a animação cinematográfica da Terra, com opções para ativar ou desativar a rotação e as nuvens, além de escolher a velocidade da transição.

O construtor também permite personalizar características do botão, como formato, ícones, tamanho, posição, espaçamento, transições e cores.

[Acessar o DAY & NIGHT BUILDER](https://eliseuangelos.github.io/day-night-experience/construtor/)

---

## Funcionalidades

- Alternância entre modo claro e modo escuro.
- Efeito visual cinematográfico com representação animada da Terra em Canvas 2D.
- Animação de rotação configurável.
- Exibição de nuvens configurável.
- Três velocidades de transição: lenta, normal e rápida.
- Modalidade independente, somente com botões, sem o motor gráfico da Terra.
- Personalização da aparência e do posicionamento do botão.
- Pré-visualização das configurações no construtor.
- Geração de arquivos personalizados diretamente no navegador.
- Download do pacote completo em ZIP ou dos arquivos individualmente.
- Persistência da preferência de tema com `localStorage`.
- Opção para respeitar a preferência de tema do sistema operacional.
- Suporte a `prefers-reduced-motion`.
- API JavaScript para integração em outras páginas.
- Sem necessidade de backend ou banco de dados.

### Velocidades disponíveis

| Opção | Duração de referência |
|---|---:|
| Lenta | 4.200 ms |
| Normal | 2.800 ms |
| Rápida | 1.600 ms |

---

## Arquivos gerados pelo construtor

Ao personalizar o componente, o construtor prepara um pacote chamado `day-night-personalizado.zip`, que contém:

| Arquivo | Finalidade |
|---|---|
| `day-night.js` | Lógica JavaScript do componente personalizado. |
| `day-night.css` | Estilos necessários para a apresentação do componente. |
| `integracao.html` | Exemplo de integração em uma página HTML. |
| `instrucoes.txt` | Manual de instalação e configuração em português. |
| `README.md` | Resumo técnico da versão personalizada. |

Os arquivos também podem ser baixados separadamente. Na modalidade **Somente botões**, o gerador exclui o motor gráfico da Terra e os estilos específicos do palco cinematográfico. Na experiência completa, o pacote considera as opções selecionadas para rotação, nuvens e velocidade.

A geração acontece no navegador do visitante, sem enviar as configurações para um servidor do projeto.

---

## Tecnologias utilizadas

O projeto foi construído com tecnologias nativas da web:

- **HTML5** — estrutura das páginas e dos componentes.
- **CSS3** — identidade visual, temas, variáveis CSS, responsividade e transições.
- **JavaScript** — lógica de alternância, configurações, construtor e geração dos arquivos.
- **Canvas 2D** — renderização da representação animada da Terra na experiência completa.
- **SVG** — ícones e elementos vetoriais.
- **localStorage** — armazenamento local da preferência de tema.
- **GitHub Pages** — hospedagem estática da demonstração e do construtor.

O componente não depende de frameworks JavaScript, backend ou banco de dados. O projeto pode ser publicado como um site estático.

---

## Como utilizar o componente em outro site

A maneira mais simples é utilizar os arquivos distribuídos no próprio repositório ou gerar uma versão personalizada pelo construtor.

### Utilizando os arquivos publicados

Adicione o CSS no `<head>` da página:

```html
<link
  rel="stylesheet"
  href="https://eliseuangelos.github.io/day-night-experience/component/day-night.css"
>
```

Antes do fechamento do `<body>`, adicione o JavaScript e inicialize o componente:

```html
<script src="https://eliseuangelos.github.io/day-night-experience/component/day-night.js"></script>
<script>
  DayNight.init({
    position: 'top-right'
  });
</script>
```

O componente aplica o tema por meio do atributo `data-theme` por padrão. A página hospedeira deve definir os estilos correspondentes aos temas claro e escuro, por exemplo, utilizando seletores como `:root[data-theme="light"]` e `:root[data-theme="dark"]`.

> Para projetos em produção, avalie baixar e hospedar os arquivos no próprio site. Assim, você controla a versão utilizada e não depende da disponibilidade de um endereço externo.

### Personalização da inicialização

A API `DayNight.init()` aceita opções para controlar o funcionamento do componente. Entre as configurações disponíveis estão:

- `mode`: modalidade do componente (`button` ou `cinematic`).
- `speed`: velocidade (`slow`, `normal`, `fast` ou duração numérica em milissegundos).
- `rotation`: ativa ou desativa a rotação do planeta, quando disponível.
- `clouds`: ativa ou desativa as nuvens, quando disponíveis.
- `button`: configurações do botão, como tamanho, posição e espaçamento.
- `themes`: nomes utilizados para identificar os temas claro e escuro.
- `attribute`: forma de aplicação do tema, como `data-theme` ou `class`.
- `persistence`: controla o armazenamento da preferência.
- `storageKey`: define a chave utilizada no `localStorage`.
- `respectSystem`: permite considerar a preferência de tema do sistema operacional.

Exemplo de configuração da experiência completa:

```html
<script>
  DayNight.init({
    mode: 'cinematic',
    speed: 'normal',
    rotation: true,
    clouds: true,
    button: {
      size: 48,
      position: 'top-right',
      offset: 16
    },
    persistence: true,
    respectSystem: true
  });
</script>
```

Consulte o manual para conhecer as opções e adaptar a integração à estrutura do seu site:

[docs/COMO-USAR.md](docs/COMO-USAR.md)

---

## Estrutura do repositório

```text
DAY-NIGHT-EXPERIENCE/
│
├── index.html                  # Página inicial e demonstração
│
├── construtor/                 # DAY & NIGHT BUILDER
│   ├── index.html
│   ├── construtor.css
│   └── construtor.js
│
├── component/                  # Componente distribuível
│   ├── src/                    # Módulos-fonte do componente
│   │   ├── core.js
│   │   ├── globe.js
│   │   ├── clouds.js
│   │   ├── core.css
│   │   └── stage.css
│   ├── day-night.js            # JavaScript distribuído
│   └── day-night.css           # CSS distribuído
│
├── tools/                      # Geração, build, ZIP e testes
│   ├── generator.js
│   ├── zip.js
│   ├── build.js
│   └── test.js
│
├── assets/                     # Recursos visuais e estilos do site
├── docs/                       # Documentação técnica e de instalação
├── examples/                   # Exemplos de integração
├── CHANGELOG.md                # Histórico de versões
├── CONTRIBUTING.md             # Orientações de contribuição
└── README.md
```

---

## Executar localmente

Para visualizar e testar o projeto em seu computador, clone o repositório:

```bash
git clone https://github.com/eliseuangelos/day-night-experience.git
cd day-night-experience
```

Inicie um servidor local simples com Python:

```bash
python3 -m http.server 8000
```

Abra no navegador:

- Página inicial: `http://localhost:8000/`
- Construtor: `http://localhost:8000/construtor/`

**Observação:** o construtor utiliza `fetch` para carregar os módulos-fonte do componente. Por isso, deve ser aberto por meio de um servidor local, e não diretamente pelo endereço `file://`.

---

## Gerar e testar os arquivos do componente

O projeto possui scripts para reconstruir a distribuição e validar o gerador.

Requisitos para executar os testes: Node.js 18 ou superior e Python 3 para a validação do pacote ZIP.

Gerar os arquivos distribuíveis:

```bash
node tools/build.js
```

Executar os testes:

```bash
node tools/test.js
```

Os testes verificam, entre outros pontos, a geração das modalidades, a sintaxe JavaScript, a integridade do CSS, a alternância nos dois sentidos, a exclusão de recursos gráficos na modalidade somente botões e a estrutura dos pacotes gerados.

---

## Publicação no GitHub Pages

O projeto utiliza hospedagem estática e pode ser publicado pelo GitHub Pages.

1. Acesse o repositório no GitHub.
2. Entre em **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch `main` e a pasta `/ (root)`.
5. Salve as configurações e aguarde a publicação.

A demonstração publicada está disponível em:

https://eliseuangelos.github.io/day-night-experience/

O construtor está disponível em:

https://eliseuangelos.github.io/day-night-experience/construtor/

---

## Documentação

- [Como utilizar o componente](docs/COMO-USAR.md)
- [Arquitetura do projeto](docs/arquitetura.md)
- [Histórico de versões](CHANGELOG.md)
- [Orientações para contribuições](CONTRIBUTING.md)

---

## Sobre a criação

O DAY & NIGHT EXPERIENCE é um projeto pessoal de estudo, curiosidade e experimentação.

Não tenho formação acadêmica na área de desenvolvimento de software nem atuo profissionalmente como desenvolvedor. Sou apaixonado por tecnologia, gosto de estudar e aprender continuamente e tenho um interesse especial pelas possibilidades da inteligência artificial.

Este projeto nasceu da vontade de transformar aprendizado e ideias em algo prático. Durante sua criação, utilizei ferramentas de inteligência artificial como apoio à pesquisa, ao planejamento, à aprendizagem e ao desenvolvimento. A experiência também representa uma oportunidade de explorar novas tecnologias, compreender melhor como funcionam e compartilhar o resultado desse processo.

Acredito que estudar, experimentar e manter a curiosidade são formas importantes de continuar aprendendo.

---

## Licença

No momento, o repositório não possui um arquivo `LICENSE`. Portanto, os termos de reutilização, modificação e redistribuição do código ainda não estão formalmente definidos. Consulte o autor antes de assumir permissões de uso que não estejam expressamente concedidas.

---

## Créditos

**Idealização e desenvolvimento:** Eliseu Fernandes Laurindo  
**Site pessoal e profissional:** [eliseuangelos.github.io](https://eliseuangelos.github.io/)  
**Repositório:** [github.com/eliseuangelos/day-night-experience](https://github.com/eliseuangelos/day-night-experience)

Projeto desenvolvido com curiosidade, estudo contínuo e apoio de ferramentas de inteligência artificial.
