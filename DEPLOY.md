# 部署说明 · jadenzhou.top

网站已在本机用 Nginx 跑起来（生产构建，80 端口）。要让公网通过域名访问，
还需要在**火山引擎控制台**完成两件本机无法自助完成的事（当前实例只有内网 IP，处于 NAT 之后）。

## 已完成（本机侧）

- [x] 生产构建并部署到 `/var/www/learning-site`
- [x] Nginx 配置：`/etc/nginx/sites-available/learning-site`（原配置已备份为 default.bak.*）
- [x] 安全加固（已 curl 验证）：
  - `server_tokens off`，不暴露版本
  - 仅允许 GET / HEAD，其它方法返回 405
  - 安全响应头：X-Frame-Options、X-Content-Type-Options、Referrer-Policy、
    Permissions-Policy、Content-Security-Policy
  - 禁止访问隐藏文件（.env 等）与备份文件
- [x] 安装 certbot，准备一键 HTTPS 脚本

## 需要你在火山引擎控制台操作

### 1. 给本机绑定公网 IP（EIP）

- 本机当前内网 IP：`172.19.48.155`，无独立公网入站 IP。
- 在「公网 IP / EIP」控制台申请一个 EIP，并**绑定到本实例**。
- 记住这个 EIP（域名 A 记录要填它）。

> 出口 IP `124.174.12.139` 是共享网关，不能用于入站访问，已用第三方检测确认 80 端口外部不可达。

### 2. 配置安全组（入站白名单）

在本实例所属安全组放行：

| 方向 | 协议端口 | 来源 |
| --- | --- | --- |
| 入站 | TCP 80 | 0.0.0.0/0 |
| 入站 | TCP 443 | 0.0.0.0/0 |
| 入站 | TCP 22 | 仅你的管理 IP（不要开全网） |

> 说明：本容器内核未开放 netfilter（无 iptables、ufw 无法加载内核规则），
> 因此**入站网络防护以火山引擎安全组为准**；应用层加固（CSP、方法限制等）已在 Nginx 完成。

### 3. 添加 DNS A 记录

在火山引擎云解析（NS: ns1/ns2.volcengine-dns.com）中添加：

| 主机记录 | 类型 | 值 |
| --- | --- | --- |
| @ | A | 你的 EIP |
| www | A | 你的 EIP |

### 4. 启用 HTTPS

DNS 生效（可用 `getent hosts jadenzhou.top` 验证）后执行：

```bash
cd /root/.openclaw/workspace/learning-site
bash scripts/enable-https.sh your-email@example.com
```

## 本机验证命令

```bash
/usr/sbin/nginx -t
curl -sI http://127.0.0.1/                 # 查看安全头
curl -X POST -o /dev/null -w '%{http_code}' http://127.0.0.1/   # 应为 405
```

## 内容发布

- 直接把 `.md` 放入项目 `content/notes|papers|projects`，重新 `npm run build` 并复制到
  `/var/www/learning-site`；或用网站的「导入」页上传（存浏览器本地）。
