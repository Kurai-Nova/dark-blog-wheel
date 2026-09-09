import React from "react";

import { Spoiler } from "@Components";

export const NginxNotes: React.FC = () => {

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <h2>Nginx</h2>

      <h3>Содержание</h3>
      <ul>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-base")}>Базовая настройка</a></li>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-proxy-example")}>Проксирование NodeJS и раздача статики</a></li>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-https")}>HTTPS с Certbot</a></li>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-security")}>Повышение безопасности Nginx</a></li>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-logs")}>Логи Nginx</a></li>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-location")}>Особенности location и proxy_pass</a></li>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-keepalive")}>Keepalive и HTTP</a></li>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-websocket")}>Особенности проксирования и WebSocket</a></li>
        <li><a href="#/it" onClick={(event) => scrollToSection(event, "nginx-buffering")}>Тонкая настройка буферизации</a></li>
      </ul>

      <section id="nginx-base">
        <h3>Базовая настройка</h3>

        Перезагрузить Nginx, проверив конфиг перед перезагрузкой: <code>{`sudo nginx -t && sudo systemctl restart nginx`}</code>
        <br /><br />

        Редактировать главный файл конфигурации: <code>{`nano /etc/nginx/nginx.conf`}</code>
        <br />
        Файлы сайтов, доступных на хосте: <code>{`cd /etc/nginx/sites-available && ls `}</code>
        <br /><br />

        Для включения сайта, находясь в каталоге sites-enabled (ЭТО ВАЖНО) создать символьную ссылку на файл (для примера): <code>{`ln -s /etc/nginx/sites-available/matthew ./matthew`}</code>
        <br /><br />

        Для более нового подхода, конфиги в conf.d: <code>{`cd /etc/nginx/conf.d && ls `}</code>
        <br /><br />

        Для повышения безопасности отключить отображение версии в заголовках:
        <br />
        редактировать файл конфигурации <code>{`sudo nano /etc/nginx/nginx.conf`}</code> в нём раскомментировать строку <code>{`server_tokens off;`}</code> в секции <code>{`http`}</code>
        <br /><br />

        Для basic_auth с Nginx, нужно поставить <code>{`apache2-utils`}</code> для генерации пароля:
        <code>{`sudo apt-get install apache2-utils`}</code><br />
        Затем добавить нового юзера:
        <code>{`sudo htpasswd -c /etc/nginx/.htpasswd username`}</code><br />
        Не забываем установить права на файл:
        <code>{`sudo chown root:www-data /etc/nginx/.htpasswd`}</code><br />
        <code>{`sudo chmod 640 /etc/nginx/.htpasswd`}</code>
      </section>

      <section id="nginx-proxy-example">
        <h3>Проксирование NodeJS и раздача статики</h3>

        Пример конфига Nginx для проксирования на несколько NodeJS:
        <pre><code>{`server {
        listen 443;
        http2  on; # Важно! У listen 80 лучше не включать http2;
        server_name 45.153.71.94 second.domen.com;
        auth_basic "Restricted area"; # Если хотим закрыть basic auth
        auth_basic_user_file /etc/nginx/auth.basic;

        root /var/www/root; # Нужно для статики
        index index.htm index.html;

        location ^~ /api {
                # Serving by NodeJS
                auth_basic off;
                proxy_pass http://localhost:3000/api;

                # Передаём исходное имя хоста клиента
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $remote_addr; # Форвардим реальный IP
        }

        # Чтобы отдавать статику по адресу:
        location ^~ /docs-helper {
                auth_basic "Restricted area";
                auth_basic_user_file /etc/nginx/auth.basic;

                alias /var/www/docshelper/;
                try_files $uri $uri/ /index.html; # Пригодится для SPA
                index index.htm index.html;
        }

        # Касается статики по любому пути
        location ~* \\.(css|png|jpg|jpeg|gif|ico|svg)$ {
                access_log off; # Отключаем лог, чтобы не мусорить
                expires max; # Можно поставить 7d например
                add_header Cache-Control "public, no-transform";
                auth_basic off;  # Отключает аутентификацию
        }

        # Отдаём конкретный файл по заданному адресу
        location ^~ /payment_fail {
                alias /var/www/payments_statuses/;
                index fail.htm fail.html;
        }
}`}</code></pre>
      </section>

      <section id="nginx-https">
        <h3>Настройка HTTPS для Nginx в режиме прокси</h3>

        <code>{`sudo snap install --classic certbot`}</code><br />
        <code>{`sudo ln -s /snap/bin/certbot /usr/bin/certbot`}</code><br />
        <code>{`sudo certbot --nginx`}</code>

        Далее выбрать домен который следует защитить сертификатом.
        <br /><br />

        Certbot автоматически изменяет ваш файл конфигурации Nginx. Вам не нужно менять его, чтобы включить HTTPS. Имейте в виду, что сертификаты, сгенерированные Certbot, имеют срок действия. Certbot наверняка запросит ваш адрес электронной почты. Вы получите электронное письмо с уведомлением об истечении срока действия вашего сертификата за несколько недель до крайнего срока. Вам нужно только повторить следующую команду, чтобы повторно сгенерировать и переустановить сертификат:
        <code>{`sudo certbot --nginx`}</code>

        Для удалению сертификата и всех соответствующих файлов из каталога конфигурации letsencrypt:
        <code>{`certbot delete`}</code>

        Для проверки корректности и подготовки к обновлению (чтоб обновить, просто убрать <code>{`--dry-run`}</code>):
        <code>{`sudo certbot renew --dry-run`}</code>
      </section>

      <section id="nginx-security">
        <h3>Повышение безопасности Nginx</h3>

        Проверка и перезагрузка: <code>{`sudo nginx -t && sudo systemctl restart nginx`}</code>
        <br /><br />

        Обязательно удаляем дефолтный конфиг: <code>{`rm /etc/nginx/conf.d/default.conf`}</code>
        <br /><br />

        Чтобы отслеживать запросы сканеров безопасности и т.п. Создать файл с блокируемыми адресами: <code>{`sudo nano /etc/nginx/blocked-paths.conf`}</code> :
        <pre><code>{`# Это общий location (добавить перед остальными)
location ~* (?:\\.php|(^|/)(?:\\.git|\\.env|cgi-bin|wp-admin|wp-includes|wordpress|backup|passwd|shadow|bitrix|laravel|owa)(/|$)) {
    auth_basic off; # Берите все, на здоровье
    access_log off; # Чтобы не засорять лог
    log_not_found off;

    # Маскировка под текстовый файл с паролями
    default_type text/plain;
    add_header Content-Type "text/plain; charset=utf-8";
    add_header Content-Encoding "gzip";

    # Отключаем буферизацию, чтобы сразу начинать отдавать файл
    proxy_buffering off;
    sendfile on;
    tcp_nopush on;
    gzip off;
    gzip_vary on;
    gzip_static on;

    # Отключаем кеширование
    add_header Cache-Control "no-store, no-cache, must-revalidate";
    expires -1;

    # Ограничение скорости: 1 КБ/с
    limit_rate_after 0;
    limit_rate 1k;

    # Возвращаем zip-бомбу
    root /etc/nginx/bombs;
    try_files /passwd.gz =200;
}
`}</code></pre>

        <pre><code>{`# Общий блок server для игнорирования неподходящих доменов
server {
    listen 80;
    server_name _;
    include /etc/nginx/blocked-paths.conf; # zip-бомба всем кулхацкерам
    return 444;  # Закрыть остальные соединения без ответа
}

server {
    # Добавить блок перед остальными location
    # Обязательно убдиться, что пути из файла не используются!
    include /etc/nginx/blocked-paths.conf;
    # Далее остальные блоки location
}`}</code></pre>

        <Spoiler
          title={<strong>Создание zip-бомбы</strong>}
        >
          <pre><code>{`# Создать 10 ГБ нулей и сжать gzip'ом
dd if=/dev/zero bs=10M count=1024 | gzip -c -9 > passwd.gz

# Разместить в защищенной директории
sudo mkdir -p /etc/nginx/bombs
sudo mv passwd.gz /etc/nginx/bombs/
sudo chown root:root /etc/nginx/bombs/passwd.gz
sudo chmod 644 /etc/nginx/bombs/passwd.gz`}</code></pre>
        </Spoiler>

        <br />

        <h4>Блокировка перебора пароля для роутов защищённых Basic Auth</h4>

        1. В общем конфиге Nginx (<code>{`nano /etc/nginx/nginx.conf`}</code>) в секции http нужно добавить директиву <code>{`limit_req_zone`}</code>:
        <pre><code>{`http {
    # существующие директивы ...

    # Зона для блокировки по IP с ошибками аутентификаци
    # Объём памяти для хранения IP - 10мб (80к адресов), частота не больше 5 запросов в минуту
    limit_req_zone $binary_remote_addr zone=auth_failures:10m rate=5r/m;

    # остальные директивы ...
}`}</code></pre>

        2. В конфигах каждого отдельного сайта править защищённые локэшн:
        <pre><code>{`    location / {
        auth_basic "Restricted Area";
        # ....
        # При ошибке аутентификации направляем в internal location
        error_page 401 @auth_error;
    }

    location @auth_error {
        # Применяем лимит только к IP с ошибками аутентификации
        # Допускаем "всплески" до 3 раз без задержки, чтоб исключить проблемы на клиентах
        limit_req zone=auth_failures burst=3 nodelay;

        # Возвращаем 401
        return 401;
    }`}</code></pre>

        <h4>Блокировка по левым UserAgent</h4>

        1. В основной конфиг, в секцию http добавить мэппинг:
        <pre><code>{`    map $http_user_agent $bad_ua {
        default 0;
        ~*(wget|curl|nikto|sqlmap|nmap|metasploit|hydra|havij|zmap|masscan|gobuster|dirb|acunetix|nessus|openvas) 1;
        ~*(crawler|scanner|brute|force|attack|exploit|inject) 1;
        ~*(zgrab|ffuf|wpscan|joomscan|drupalscan|whatweb|subdomain) 1;
        ~*(python|perl|ruby|java|client|library|libredtail) 1;
        ~*\\b(test|debug|config|setup|install)\\b 1;
        ~*Hello\\s+from\\s+Palo\\s+Alto 1;
    }`}</code></pre>

        2. Далее в нужном блоке server или location:
        <pre><code>{`if ($bad_ua) {
    return 444;
}`}</code></pre>

        <h4>Дополнительные заголовки для безопасности</h4>

        <pre><code>{`http {
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
}`}</code></pre>

        Допустимо также внутри <code>{`server`}</code> добавлять эти заголовки. Следует учитывать, что <code>{`add_header`}</code> внутри <code>{`location`}</code> отключает наследование всех вышестоящих <code>{`add_header`}</code>!
      </section>

      <section id="nginx-logs">
        <h3>Логи Nginx</h3>

        <h4>Очистка access.log</h4>

        Правильно (без потери дескриптора) тереть логи вот так:
        <code>{`sudo > /var/log/nginx/access.log`}</code>

        А вот так обрезать:
        <code>{`sudo truncate -s 300 /var/log/nginx/access.log`}</code>

        Урезать все log-файлы в папке: <code>{`sudo truncate -s 0 *.log`}</code>
        <br /><br />

        <h4>Фильтрация логов Nginx</h4>

        <pre><code>{`http {
        # Фильтрация логов: не пишем 444
        log_format main '[$time_local] $remote_addr - $remote_user | '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" "$http_x_forwarded_for"';

        # Фильтрация логов: не пишем 444
        map $status $loggable {
            444     0;
            default 1;
        }

        # Вариант для исключения по методу OPTIONS-запросов (кроме ошибочных):
        map "$status:$request_method" $loggable {
            default          1;
            ~^301:           0;
            ~^[23]..:OPTIONS$ 0;
        }

        access_log  /var/log/nginx/access.log  main if=$loggable;
}`}</code></pre>
      </section>

      <section id="nginx-location">
        <h3>Особенности настройки Nginx</h3>

        Особенности работы с location. Ниже на первый взгляд 2 очевидные записи, но не все так просто, как может показаться.
        <pre><code>{`location /user/ {
    proxy_pass http://user.example.com;
}

location /login/ {
    proxy_pass http://login.example.com/;
}`}</code></pre>

        У первого <code>{`proxy_pass`}</code> нет завершающего слэша, поэтому Nginx сохраняет весь URI целиком и просто подставляет его после домена. Если клиент запрашивает <code>{`/user/profile?id=1`}</code>, то upstream получит:
        <code>{`http://user.example.com/user/profile?id=1`}</code>

        То есть префикс <code>{`/user/`}</code> не вырезается. Такой вариант чаще используют, когда путь на backend уже включает этот префикс, и вы хотите прокидывать URI «как есть», без манипуляций.
        <br /><br />

        Во втором примере:
        <pre><code>{`location /login/ {
    proxy_pass http://login.example.com/;
}`}</code></pre>

        Здесь у <code>{`proxy_pass`}</code> есть завершающий слэш, а значит Nginx отбрасывает совпавшую часть <code>{`location`}</code>’а (<code>{`/login/`}</code>) и подставляет всё, что идёт после неё. Если клиент запрашивает <code>{`/login/check?status=id`}</code>, то upstream получит:
        <code>{`http://login.example.com/check?status=id`}</code>
      </section>

      <section id="nginx-keepalive">
        <h3>Keepalive и HTTP</h3>

        Использование keepalive в upstream и переход на HTTP/1.1 позволяют nginx не создавать TCP-соединение к бэкенду при каждом запросе, а переиспользовать уже установленное. Это критично в системах с большим числом коротких запросов: накладные расходы на установку TCP-сессии, а тем более TLS-рукопожатия, легко превосходят само время обработки на бэкенде.
        <br /><br />

        С версии 1.29.4 поддерживает проксирование в HTTP/2 через директиву:
        <code>{`proxy_http_version 1.0 | 1.1 | 2;`}</code>

        По умолчанию используется HTTP/1.0 (что очень странно на 25 год), но для keepalive рекомендуется HTTP/1.1 или HTTP/2, так как они корректно поддерживают многоразовые соединения и дают дополнительную экономию на уровне протокола. При работе на протоколе 1.0 каждый запрос на backend закрывается через директиву Connection: Closeи не переиспользуется снова.
        <br /><br />

        Переиспользование соединений важно потому, что TCP — это протокол с дорогостоящей установкой и разрушением состояния. Установка соединения требует трёхстороннего handshake, его завершение — четырёхстороннего, а при активном трафике это приводит к накоплению сокетов в переходных состояниях. Повторное использование освобождает систему от постоянного создания новых структур ядра, экономит CPU на обработке handshake, уменьшает рост очередей backlog и исключает паразитные задержки, возникающие при пиках RPS.
        <br /><br />

        Пул keepalive-соединений позволяет nginx держать сокеты в состояниях <code>{`ESTABLISHED`}</code> и переиспользовать их многократно, избегая большого числа соединений, попадающих в <code>{`TIME_WAIT`}</code> и засоряющих таблицу сокетов. Это напрямую повышает производительность: снижается нагрузка на ядро, уменьшается латентность, повышается пропускная способность при высоком RPS.
        <br /><br />

        Важно, чтобы бэкенд корректно поддерживал keep-alive и reuse соединений. Сама инфраструктура должна выдерживать рост числа долгоживущих TCP-сокетов: требуется достаточный лимит файловых дескрипторов, обновлённые параметры <code>{`net.ipv4.tcp_keepalive_*`}</code>, корректные somaxconn и <code>{`tcp_max_syn_backlog`}</code>.
        <pre><code>{`upstream backend {
  server 10.0.0.10:8080;
  keepalive 4; # количество keepalive соединений в пуле, указывается х2 от кол-во серверов в upstream
  keepalive_timeout 10s;
  keepalive_requests 512;
  keepalive_time 15m;
}`}</code></pre>

        Параметр <code>{`keepalive 4`}</code> задаёт количество поддерживаемых постоянных (persistent) соединений в пуле. keepalive_timeout 10s означает, что соединение может оставаться открытым для повторного использования до 10 секунд без активности. keepalive_requests 512 ограничивает число запросов, которые могут быть обработаны через одно keepalive-соединение, а keepalive_time 15m задаёт общий срок жизни соединения в пуле (через 15 минут соединение обновится). Запросы проксируются на upstream с использованием HTTP/2, при этом заголовок Connection очищается, чтобы избежать закрытия соединения при проксировании.
      </section>

      <section id="nginx-websocket">
        <h3>Особенности проксирования в Nginx</h3>

        <pre><code>{`location ^~ /api {
        proxy_pass http://localhost:3000/users/;
        # В proxy_pass есть завершающий хэш, поэтому Nginx
        # отбрасывает совпавшую часть location’а и в
        # API будут приходить запросы вида example.com/users/profile?id=1

        # Параметры проксирования для корректной работы WebSocket
        proxy_http_version 1.1;
        proxy_set_header Connection 'upgrade';
        # Передаём исходный заголовок Upgrade для перехода на WebSocket
        proxy_set_header Upgrade $http_upgrade;

        # обходит кеш, если клиент запрашивает обновление соединения
        proxy_cache_bypass $http_upgrade;

        # Передаём исходное имя хоста клиента и IP-адрес (если запущены в контейнере)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
}`}</code></pre>

        Важно! После включения передачи доп. хедеров, может возникнуть необходимость увеличить размер хэша загаловков (в общем блоке http):
        <pre><code>{`http {
    proxy_headers_hash_max_size 1024;
    proxy_headers_hash_bucket_size 128;
    # ...
}`}</code></pre>

        <h4>Использование map в Nginx для корректной настройки WebSocket</h4>

        <pre><code>{`http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        location /ws/ {
            proxy_pass http://example.com:8080;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
        }
    }
}`}</code></pre>

        Входным параметром выступает <code>{`$http_upgrade`}</code>, отражающий содержимое заголовка <code>{`Upgrade`}</code>. Если заголовок присутствует и содержит любое непустое значение, в <code>{`$connection_upgrade `}</code>записывается upgrade. Если заголовок отсутствует или пустой, переменная получает значение close. Такая логика применяется для корректной работы WebSocket, требующих переключения протокола: при наличии запроса на апгрейд сервер обязан вернуть
      </section>

      <section id="nginx-buffering">
        <h3>Тонкая настройка буферизации Nginx для ускорения</h3>

        <code>{`proxy_buffering on;`}</code>

        В Nginx буферы — это область памяти, используемая для временного хранения данных при приёме, обработке и передаче HTTP-запросов и ответов. Они критически важны для производительности, так как позволяют Nginx работать с асинхронным и неблокирующим I/O, не дожидаясь, пока клиент или upstream сервер полностью отправят или примут данные.
        <br /><br />

        Когда Nginx получает HTTP-запрос, тело запроса сначала помещается в <code>{`client_body_buffer`}</code>. Если запрос маленький, он полностью помещается в буфер, что позволяет быстро передать его upstream или обработчику. Если запрос превышает размер буфера, Nginx записывает остаток на диск во временный файл. Размер и количество буферов настраиваются через директивы типа <code>{`client_body_buffer_size`}</code>.
        <code>{`client_body_buffer_size 16k;`}</code>

        Это значит, что Nginx будет выделять 16 килобайт для хранения тела запроса. Если тело больше, оно будет сброшено на диск, что замедляет обработку. Важный момент: слишком маленькие буферы приводят к частым обращениям к диску и увеличению latency, слишком большие — к лишнему потреблению памяти и снижению общей производительности при большом количестве одновременных подключений. Обычно рекомендуется балансировать размер буферов под средний размер ответов вашего сервиса.
        <br /><br />

        Потестировать ответы можно через скрипт:
        <code>{`curl -s -w "%{size_download} %{size_header}" -o /dev/null https://example.com | awk '{print "Тело: "$1" + Заголовки: "$2" = Всего: "$1+$2" байт"}'`}</code>

        <h4>Дополнительные рекомендации</h4>

        Желательно отключить игнорирование невалидных заголовков, которые нарушают RFC 2076:
        <code>{`ignore_invalid_headers off;`}</code>

        Заголовок <code>{`X_TEST: test`}</code> будет считаться невалидным, когда <code>{`X-TEST: test`}</code> пройдет валидацию.
        <br /><br />

        Добавление заголовка HSTS — принудительно заставляет использовать HTTPS для последующих соединений и защищая от MITM и down grade атак:
        <code>{`add_header Strict-Transport-Security "max-age=31536000" always;`}</code>
      </section>
    </div>
  );
};
