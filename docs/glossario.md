# 📚 Glossário de IA e Machine Learning

Referência rápida de termos essenciais para entender Inteligência Artificial, Machine Learning e conceitos relacionados.

---

## Vetor

Representação matemática unidimensional de dados, composto por uma sequência de números (coordenadas). Em IA, vetores transformam informações do mundo real (palavras, imagens, características) em formato numérico que computadores conseguem processar e comparar.

**Exemplo:** uma pessoa pode ser representada pelo vetor `[altura, peso, idade]`.

Vetores são fundamentais para operações de similaridade, transformações e aprendizado em modelos de Machine Learning.

---

## Embedding

Representação densa de dados em um espaço vetorial de baixa dimensão, onde itens semanticamente similares ficam próximos uns dos outros. Embeddings são aprendidos por modelos de redes neurais e capturam relações complexas entre os dados.

**Exemplo:** palavras com significados parecidos — como "rei" e "rainha" — ficam próximas no espaço vetorial. A famosa equação `rei - homem + mulher ≈ rainha` demonstra como relações semânticas são preservadas geometricamente.

Embeddings são amplamente usados em processamento de linguagem natural (NLP), sistemas de recomendação e busca semântica.

---

## Matriz

Estrutura matemática bidimensional que organiza números em linhas e colunas. Em IA, matrizes representam transformações lineares, pesos de redes neurais e conjuntos de dados tabulares.

**Exemplo:** um conjunto de 100 usuários, cada um descrito por 5 características, é representado como uma matriz de dimensão `100 × 5`.

Operações entre matrizes (como multiplicação) são a base do funcionamento de redes neurais e transformações em espaços vetoriais.

---

## Modelo

Estrutura matemática treinada para aprender padrões a partir de dados e fazer previsões ou tomar decisões. Um modelo é definido por sua arquitetura (como os dados fluem) e seus parâmetros (valores ajustados durante o treinamento).

**Exemplo:** um modelo de classificação de e-mails aprende a distinguir entre "spam" e "não spam" com base em exemplos rotulados.

Modelos são o produto final do processo de Machine Learning e podem variar de simples equações lineares a redes neurais com bilhões de parâmetros.

---

## Treinamento

Processo iterativo pelo qual um modelo ajusta seus parâmetros internos com base em exemplos de dados, minimizando o erro entre suas previsões e os resultados esperados. Utiliza algoritmos de otimização, como o gradiente descendente.

**Exemplo:** ao treinar um modelo para reconhecer gatos em imagens, ele processa milhares de fotos rotuladas e ajusta seus pesos até conseguir identificar gatos com alta precisão.

A qualidade e a quantidade dos dados de treinamento têm impacto direto no desempenho do modelo final.

---

## Gradiente Descendente

Algoritmo de otimização usado para minimizar a função de perda de um modelo de Machine Learning. Funciona calculando a derivada (gradiente) da função de perda em relação a cada parâmetro e ajustando os parâmetros na direção oposta ao gradiente.

**Exemplo:** imagine uma bola rolando morro abaixo em busca do ponto mais baixo de um vale — o gradiente indica a inclinação e o sentido do movimento.

Variantes como SGD (Gradiente Descendente Estocástico) e Adam são amplamente usadas no treinamento de redes neurais profundas.

---

## Função de Perda (Loss Function)

Medida matemática que quantifica o quão distante as previsões do modelo estão dos valores reais esperados. O objetivo do treinamento é minimizar essa função.

**Exemplo:** para um problema de regressão, a função de perda pode ser o Erro Quadrático Médio (MSE) entre os valores previstos e os reais. Para classificação, a Entropia Cruzada (Cross-Entropy) é comumente utilizada.

A escolha da função de perda adequada é crucial para que o modelo aprenda o comportamento correto para cada tipo de tarefa.

---

## Rede Neural

Modelo computacional inspirado no funcionamento do cérebro humano, composto por camadas de neurônios artificiais interconectados. Cada neurônio recebe entradas, aplica uma transformação matemática e passa o resultado adiante.

**Exemplo:** uma rede neural com três camadas (entrada, oculta e saída) pode aprender a classificar imagens de dígitos manuscritos com alta precisão.

Redes Neurais Profundas (Deep Learning) com muitas camadas ocultas são responsáveis por avanços significativos em visão computacional, NLP e geração de conteúdo.

---

## Transformer

Arquitetura de rede neural baseada no mecanismo de atenção (attention), que processa sequências de dados de forma paralela em vez de sequencial. Revolucionou o campo de NLP e deu origem a modelos como BERT e GPT.

**Exemplo:** ao traduzir a frase "O banco à beira do rio", o Transformer usa atenção para relacionar "banco" com "rio" e inferir o contexto correto (margem do rio, não instituição financeira).

Transformers são a base dos Grandes Modelos de Linguagem (LLMs) e de muitos sistemas modernos de IA generativa.

---

## Similaridade de Cosseno

Métrica que mede o ângulo entre dois vetores no espaço vetorial, indicando o quão similares são em direção, independentemente de sua magnitude. O resultado varia de `-1` (opostos) a `1` (idênticos).

**Exemplo:** dois documentos com os mesmos temas terão vetores com ângulo pequeno entre si, resultando em alta similaridade de cosseno, mesmo que um seja muito mais longo que o outro.

É amplamente utilizada em sistemas de recomendação, busca semântica e detecção de documentos duplicados.

---

## Parâmetro

Variável interna de um modelo cujo valor é aprendido durante o treinamento. Parâmetros definem o comportamento do modelo e são ajustados para minimizar a função de perda.

**Exemplo:** os pesos (`W`) e vieses (`b`) em uma camada de rede neural são exemplos de parâmetros. Um LLM moderno pode ter centenas de bilhões de parâmetros.

Não confundir com **hiperparâmetros**, que são configurações externas do modelo (como taxa de aprendizado e número de camadas) definidas antes do treinamento.

---

## Hiperparâmetro

Configuração externa de um modelo de Machine Learning que não é aprendida durante o treinamento, mas definida previamente pelo desenvolvedor. Influencia diretamente a arquitetura do modelo e o processo de aprendizado.

**Exemplos:** taxa de aprendizado (learning rate), número de camadas da rede, tamanho do lote (batch size), número de épocas de treinamento.

A escolha adequada dos hiperparâmetros é essencial para o desempenho do modelo, e técnicas como Grid Search e Bayesian Optimization são usadas para encontrar os melhores valores.

---

## Overfitting

Fenômeno onde o modelo aprende os dados de treinamento com precisão excessiva, incluindo ruídos e detalhes irrelevantes, perdendo a capacidade de generalizar para novos dados.

**Exemplo:** um modelo que memoriza todos os exemplos de treinamento em vez de aprender padrões gerais se tornará muito preciso no treino, mas falhará ao classificar imagens que nunca viu antes.

Técnicas como regularização (L1/L2), dropout e aumento de dados (data augmentation) são utilizadas para mitigar o overfitting.

---

## Tokenização

Processo de dividir texto em unidades menores chamadas tokens, que podem ser palavras, subpalavras ou caracteres. É uma etapa de pré-processamento fundamental em NLP.

**Exemplo:** a frase "Graph Notes é incrível!" pode ser tokenizada como `["Graph", "Notes", "é", "incrível", "!"]`. Em modelos como GPT, subpalavras são usadas: `["Gra", "ph", " Not", "es", ...]`.

A forma como o texto é tokenizado afeta diretamente a eficiência e a capacidade de compreensão do modelo de linguagem.

---

*Glossário em constante expansão. Contribuições são bem-vindas!*
