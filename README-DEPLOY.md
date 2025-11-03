# AtendeChat Frontend - Deployment Guide

## 📋 Pré-requisitos

- Node.js 18+ instalado localmente
- Acesso SSH ao servidor VPS (app.diasolutions.ia.br)
- Nginx instalado no servidor
- Certificado SSL configurado (Let's Encrypt)

## 🏗️ Arquitetura

```
┌─────────────────┐      HTTPS      ┌──────────────────┐
│                 │ ─────────────▶ │                  │
│  Usuário Final  │                 │  Nginx (VPS)     │
│                 │ ◀───────────── │  Port 443        │
└─────────────────┘                 └──────────────────┘
                                            │
                                            │ Serve static files
                                            ▼
                                    ┌──────────────────┐
                                    │   /var/www/      │
                                    │   frontend/dist  │
                                    └──────────────────┘
                                            │
                                            │ API Calls
                                            ▼
                                    ┌──────────────────┐
                                    │ api.diasolutions │
                                    │     .ia.br       │
                                    └──────────────────┘
```

## 🚀 Deploy Manual

### 1. Build Local

```bash
# Instalar dependências
npm install

# Gerar build de produção
npm run build
```

### 2. Preparar Servidor (primeira vez apenas)

```bash
# Conectar ao servidor
ssh root@app.diasolutions.ia.br

# Criar diretório
sudo mkdir -p /var/www/frontend/dist

# Configurar Nginx
sudo cp nginx.conf /etc/nginx/sites-available/atendechat
sudo ln -s /etc/nginx/sites-available/atendechat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Configurar SSL
sudo certbot --nginx -d app.diasolutions.ia.br
```

### 3. Upload dos Arquivos

```bash
# Via rsync (recomendado)
rsync -avz --delete dist/ root@app.diasolutions.ia.br:/var/www/frontend/dist/

# Ou via SCP
scp -r dist/* root@app.diasolutions.ia.br:/var/www/frontend/dist/
```

### 4. Verificar Deploy

```bash
# Testar o site
curl -I https://app.diasolutions.ia.br

# Verificar logs
ssh root@app.diasolutions.ia.br 'sudo tail -f /var/log/nginx/atendechat-access.log'
```

## ⚡ Deploy Automatizado

```bash
# Tornar script executável (primeira vez)
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

## 🔧 Configuração de Variáveis de Ambiente

As variáveis de ambiente são definidas em `.env.production`:

```env
VITE_API_BASE_URL=https://api.diasolutions.ia.br
VITE_APP_NAME=AtendeChat
VITE_APP_VERSION=6.0.0
```

**IMPORTANTE:** Estas variáveis são injetadas no build. Para alterar, é necessário rebuild.

## 🐛 Troubleshooting

### Build falha

```bash
# Limpar cache e node_modules
rm -rf node_modules dist
npm install
npm run build
```

### Erro 404 em rotas do React Router

Verifique se o Nginx está configurado com `try_files $uri $uri/ /index.html;`

### Erro de CORS

Verifique se o backend (`api.diasolutions.ia.br`) tem os headers CORS corretos:

```
Access-Control-Allow-Origin: https://app.diasolutions.ia.br
Access-Control-Allow-Credentials: true
```

### SSL não funciona

```bash
# Renovar certificado
sudo certbot renew --nginx
```

## 📊 Monitoramento

### Logs de Acesso

```bash
ssh root@app.diasolutions.ia.br 'sudo tail -f /var/log/nginx/atendechat-access.log'
```

### Logs de Erro

```bash
ssh root@app.diasolutions.ia.br 'sudo tail -f /var/log/nginx/atendechat-error.log'
```

### Status do Nginx

```bash
ssh root@app.diasolutions.ia.br 'sudo systemctl status nginx'
```

## 🔄 Rollback

Se algo der errado após deploy:

```bash
# Conectar ao servidor
ssh root@app.diasolutions.ia.br

# Restaurar backup mais recente
LATEST_BACKUP=$(ls -t /var/www/frontend-backup-* | head -1)
sudo rm -rf /var/www/frontend/dist
sudo cp -r $LATEST_BACKUP/dist /var/www/frontend/

# Reload Nginx
sudo systemctl reload nginx
```

## 📝 Checklist Pré-Deploy

- [ ] Testar build localmente com `npm run preview`
- [ ] Verificar se `.env.production` está correto
- [ ] Confirmar que backend está respondendo
- [ ] Backup da versão atual está disponível
- [ ] Certificado SSL está válido
- [ ] Nginx está rodando sem erros

## 🎯 Próximos Passos (Opcional)

### CI/CD com GitHub Actions

Criar `.github/workflows/deploy.yml` para deploy automático em cada push para `main`.

### CDN

Considerar uso de Cloudflare ou AWS CloudFront para cache global de assets estáticos.

### Monitoring

Implementar Sentry ou LogRocket para tracking de erros em produção.
