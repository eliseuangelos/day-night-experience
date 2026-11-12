# DAY & NIGHT EXPERIENCE

<p align="center">
  <a href="https://eliseuangelos.github.io/day-night-experience/" target="_blank">
    <img src="https://img.shields.io/badge/VER_DEMONSTRAÇÃO-00D9FF?style=for-the-badge&logo=googlechrome&logoColor=050505" alt="Ver Demonstração">
  </a>
  <a href="https://eliseuangelos.github.io/day-night-experience/construtor/" target="_blank">
    <img src="https://img.shields.io/badge/ABRIR_CONSTRUTOR-7952B3?style=for-the-badge&logo=codepen&logoColor=white" alt="Abrir Construtor">
  </a>
  <a href="https://eliseuangelos.github.io/" target="_blank">
    <img src="https://img.shields.io/badge/SITE_PESSOAL-111827?style=for-the-badge&logo=googlechrome&logoColor=00D9FF" alt="Site Pessoal">
  </a>
  <a href="https://github.com/eliseuangelos" target="_blank">
    <img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://linkedin.com/in/eliseu-fernandes-laurindo" target="_blank">
    <img src="https://img.shields.io/badge/LINKEDIN-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</p>

<p align="center"><strong>Uma transição entre claro e escuro em que a luz atravessa uma representação animada da Terra.</strong></p>

---

## Sobre o projeto

O **DAY & NIGHT EXPERIENCE** é um projeto pessoal de estudo e experimentação que explora uma forma visual de alternar entre temas claro e escuro em páginas web. A demonstração combina um controle de alternância com uma animação cinematográfica da Terra, evidenciando a mudança de iluminação e a adaptação dos elementos da interface.

O repositório também inclui o **DAY & NIGHT BUILDER**, um construtor que permite personalizar a aparência e o comportamento do alternador, visualizar o resultado e gerar os arquivos necessários para integrá-lo a outros sites.

**Demonstração:** [eliseuangelos.github.io/day-night-experience](https://eliseuangelos.github.io/day-night-experience/)  
**Construtor:** [DAY & NIGHT BUILDER](https://eliseuangelos.github.io/day-night-experience/construtor/)

## Objetivos do projeto

- Explorar e demonstrar uma experiência diferenciada de alternância entre temas claro e escuro.
- Oferecer um componente que possa ser configurado e reutilizado em outros projetos web.
- Permitir que pessoas sem necessidade de editar o código-fonte personalizem o controle visual.
- Gerar arquivos independentes para integração em páginas estáticas ou projetos existentes.
- Experimentar animações, organização de interfaces, preferências de usuário e recursos nativos da web.

## Áreas da aplicação

### 1. DAY & NIGHT EXPERIENCE — Demonstração

A página inicial apresenta o alternador em funcionamento e uma interface de exemplo com superfícies, cartões, botões e formulário. Os controles permitem testar a passagem de dia para noite e de noite para dia, ativar ou desativar a animação, experimentar velocidades e limpar a preferência salva.

### 2. DAY & NIGHT BUILDER — Construtor

O construtor oferece duas modalidades:

- **Somente botões:** alternador leve de tema claro/escuro, sem o palco animado da Terra.
- **Experiência completa:** alternador com a animação cinematográfica, com opções para configurar rotação, nuvens e velocidade da transição.

Também é possível personalizar características do controle, como formato, ícones, dimensões, posição, espaçamento, cores e transições. O resultado pode ser visualizado antes da exportação.

## Funcionalidades

- Alternância entre tema claro e tema escuro.
- Animação da Terra renderizada em Canvas 2D na modalidade completa.
- Opções de rotação e exibição de nuvens.
- Três velocidades predefinidas de transição: lenta, normal e rápida.
- Modalidade independente com somente os botões de alternância.
- Personalização visual e de posicionamento do controle.
- Pré-visualização das configurações no construtor.
- Geração dos arquivos diretamente no navegador do visitante.
- Download do pacote completo em ZIP ou de arquivos individuais.
- Persistência da preferência de tema por `localStorage`.
- Opção para respeitar a preferência de aparência do sistema operacional.
- Suporte à preferência de movimento reduzido (`prefers-reduced-motion`).
- API JavaScript para integração em outras páginas.
- Funcionamento sem backend ou banco de dados próprio.

## Arquivos gerados pelo construtor

O pacote personalizado reúne os arquivos principais para integração:

| Arquivo | Finalidade |
|---|---|
| `day-night.js` | Lógica JavaScript do alternador personalizado. |
| `day-night.css` | Estilos necessários ao componente. |
| `integracao.html` | Exemplo de inclusão em uma página HTML. |
| `instrucoes.txt` | Orientações de instalação e configuração. |
| `README.md` | Resumo técnico da versão gerada. |

Os arquivos também podem ser baixados separadamente. Na modalidade somente botões, o pacote não inclui o motor gráfico e os estilos específicos da experiência cinematográfica.

## Integração básica

A inclusão básica do componente em uma página HTML segue este padrão:

```html
<link rel="stylesheet" href="component/day-night.css">
<script src="component/day-night.js"></script>
<script>
  DayNight.init({ position: 'top-right' });
</script>
```

Para conhecer as opções disponíveis, consulte o [manual de utilização](https://github.com/eliseuangelos/day-night-experience/blob/main/docs/COMO-USAR.md) e os exemplos do repositório.

## Tecnologias utilizadas

| Tecnologia ou recurso | Aplicação |
|---|---|
| HTML5 | Estrutura da demonstração, do construtor e dos exemplos. |
| CSS3 | Temas, variáveis, responsividade, transições e apresentação visual. |
| JavaScript | Alternância, configurações, geração e integração do componente. |
| Canvas 2D | Renderização da representação animada da Terra. |
| SVG | Ícones e elementos vetoriais. |
| localStorage | Persistência da preferência de tema. |
| GitHub Pages | Publicação estática da demonstração e do construtor. |

## Execução local

```bash
git clone https://github.com/eliseuangelos/day-night-experience.git
cd day-night-experience
python3 -m http.server 8000
```

Acesse `http://localhost:8000/` para a demonstração e `http://localhost:8000/construtor/` para o construtor. Como o construtor carrega módulos com `fetch`, utilize um servidor HTTP local em vez de abrir os arquivos diretamente pelo protocolo `file://`.

Para reconstruir os arquivos distribuíveis e executar os testes do projeto, consulte os scripts em `tools/` e a documentação técnica do repositório. A rotina de testes utiliza Node.js 18 ou superior e Python 3 para a validação do pacote ZIP.

## Sobre o autor

Sou **Eliseu Fernandes Laurindo**, profissional com experiência em atividades administrativas e operacionais e estudante autodidata de tecnologia. Estudo HTML e CSS desde aproximadamente 2010 e exploro fundamentos de JavaScript. Na adolescência, comecei a experimentar estruturas de jogos digitais; mais tarde, atuei como tutor de um MMORPG multiplataforma e internacional, mantive uma fanpage própria e desenvolvi scripts e calculadoras para auxiliar jogadores.

Hoje aplico essa curiosidade em projetos próprios, com foco em aprendizagem, experimentação e utilidades práticas. **Não sou desenvolvedor profissional nem possuo formação acadêmica específica em desenvolvimento de software.** Sou estudante e entusiasta de tecnologia e inteligência artificial. Ferramentas de IA podem apoiar minhas pesquisas, o planejamento e a revisão do projeto, dentro de um processo contínuo de estudo e validação.

- **Demonstração:** [DAY & NIGHT EXPERIENCE](https://eliseuangelos.github.io/day-night-experience/)
- **Construtor:** [DAY & NIGHT BUILDER](https://eliseuangelos.github.io/day-night-experience/construtor/)
- **Site pessoal:** [eliseuangelos.github.io](https://eliseuangelos.github.io/)
- **GitHub:** [github.com/eliseuangelos](https://github.com/eliseuangelos)
- **LinkedIn:** [linkedin.com/in/eliseu-fernandes-laurindo](https://linkedin.com/in/eliseu-fernandes-laurindo)

## Licença

Na verificação deste repositório, não foi identificado um arquivo `LICENSE`. A publicação pública do código no GitHub não deve ser interpretada, por si só, como uma licença de uso, modificação ou redistribuição. Consulte o autor antes de reutilizar o código e considere adicionar uma licença explícita caso queira definir permissões de uso.

---

<p align="center"><em>“Quanto mais aumenta nosso conhecimento, mais evidente fica nossa ignorância.”</em><br><strong>John F. Kennedy</strong></p>
