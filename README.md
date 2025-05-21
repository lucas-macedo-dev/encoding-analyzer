# 📦 Encoding Analyzer

> Detecta automaticamente arquivos com encoding diferente do esperado e alerta o usuário com uma opção para reabrir o arquivo com outro encoding.

## ✨ Funcionalidades

- 🔍 Detecta automaticamente o encoding do arquivo ao abri-lo
- ⚠️ Compara com o encoding esperado e exibe alerta em caso de diferença
- 📜 Lista de encodings disponíveis para reabrir o arquivo corretamente
- 🧠 Ignora arquivos binários (opcional)

## 🔧 Configurações

Acesse as configurações do VS Code e procure por `Encoding Analyzer`:

| Configuração | Tipo     | Padrão  | Descrição |
|--------------|----------|---------|-----------|
| `encodingAnalyzer.expectedEncoding` | `string`  | `"utf8"` | Define o encoding esperado dos arquivos |
| `encodingAnalyzer.ignoreBinaryFiles` | `boolean` | `true`  | Ignora arquivos binários durante a análise |

## 🧪 Como Usar

1. Instale a extensão.
2. Abra qualquer arquivo no VS Code.
3. Se o encoding for diferente do esperado, você receberá um alerta com opção de reabrir o arquivo com o encoding correto.

## 🛠️ Contribuindo

Sinta-se à vontade para abrir issues ou pull requests com sugestões de melhoria!

## 🧑‍💻 Autor

Criado por [lucas-macedo-dev](https://github.com/lucas-macedo-dev)

---

📘 **Licença:** MIT