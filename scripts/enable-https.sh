#!/usr/bin/env bash
# jadenzhou.top 一键启用 HTTPS
# 前提：
#   1) 火山引擎 DNS 中 jadenzhou.top / www 的 A 记录已指向本实例的【公网 EIP】
#   2) 该 EIP 已绑定到本机，安全组已放行入站 80 和 443
#   3) 公网可通过 http://jadenzhou.top 打开本站
set -euo pipefail

DOMAIN="jadenzhou.top"
EMAIL="${1:?用法: ./enable-https.sh your-email@example.com}"

echo ">> 校验域名解析..."
MY_PUBLIC="$(curl -s --max-time 8 https://ifconfig.me)"
RESOLVED="$(getent hosts "$DOMAIN" | awk '{print $1}' | head -1 || true)"
echo "   本机出口IP: $MY_PUBLIC"
echo "   域名解析IP: ${RESOLVED:-无}"

if [ -z "$RESOLVED" ]; then
  echo "!! 域名暂无解析，请先在火山引擎添加 A 记录后重试。"
  exit 1
fi

echo ">> 申请并自动配置 Let's Encrypt 证书（nginx）..."
certbot --nginx \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos \
  --email "$EMAIL" \
  --redirect

echo ">> 完成。测试自动续期..."
certbot renew --dry-run

echo ">> 现在可访问 https://$DOMAIN"
