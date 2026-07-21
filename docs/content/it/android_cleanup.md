# Шпаргалка по удалению ненужных программ из Android

Данная заметка специально для тех, кого раздражает мусорные программы на ведре, которые нельзя удалить стандартными средствами Android (через настройки).

Для начала нужно скачать ADB (Android Debug Bridge) и запустить пару команд.
На телефоне должна быть разрешена отладка по USB, а на компьютере установлен USB-драйвер устройства (иногда само работает).

Скачать ADB для разных операционных систем можно по следующим ссылкам:

[Windows](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)
[Linux](https://dl.google.com/android/repository/platform-tools-latest-linux.zip)

Извлекаем содержимое zip-архива в любое удобное место, и уже там запускаем терминал (консоль).
В консоли нужно запустить `adb shell` и выполнять следующие команды уже там.

*Все команды ниже выполняются уже внутри adb shell. В данных командах `pm` - пакетный менеджер, идёт "в комплекте" с adb.*

Вывести список установленных пакетов и найти в нём заданные строки:
`pm list packages | grep '<OEM/Carrier/App Name>'`

Для удаления конкретного пакета:
`pm uninstall -k --user 0 <name of package>`

**Обратите внимание: ошибка `Failure [INSTALL_FAILED_INVALID_APK: Missing existing base package]`
может возникать, если ввести только одно тире перед user.**

Ключ -k (keep the data) сохраняет данные приложения: оно будет удалено, но содержимое папки
`/data/data/...` останется на месте! Если хотите освободить место - ключ надо убрать.

Ключ `--user 0` говорит о том, что приложение нужно удалить для пользователя со следующим uid,
для пользователей с другим uid оно останется  и технически системное приложение не удаляется,
а просто помечается соответствующим флагом, но это надёжнее чем hide\block.

А еще можно не удалить, а отключать:
`pm disable-user com.samsung.clipboardsaveservice`
или
`pm disable com.samsung.clipboardsaveservice`

И включать:
`pm enable com.samsung.clipboardsaveservice`

А если удалили, то можно и установить через консоль:
`cmd package install-existing com.samsung.clipboardsaveservice`

Хэлпер с примитивным гуем для PowerShell: https://github.com/farag2/ADB-Debloating/tree/master

## Список имён некоторых сервисов
Прежде чем удалять всё подряд, сначала ознакомьтесь со списком ниже, проверьте то что хотите удалить, возможно это уже описано.

```
## Реклама и телеметрия

    MSA (com.miui.msa.global) – Рекламный сервис Xiaomi.

    Support components (com.google.mainline.telemetry) – Система сбора телеметрии от Google. Противоречивые сведения. Кто-то пишет, что удалял, кто-то что категорически нельзя.

    Analytics (com.miui.analytics) – Собирает аналитические данные о работе устройства и передаёт их через интернет.
    Меню SIM-карты (com.android.stk) – используется операторами связи для показа полноэкранных уведомлений (как правило, рекламных).
    Main components (com.google.mainline.adservices) – Рекламный сервис Google.
    com.android.providers.partnerbookmarks – также связано с рекламными сервисами Google.
    Facebook App Installer (com.facebook.system), Facebook App Manager (com.facebook.system), Facebook Services (com.facebook.services) – Сервисы Facebook (запрещена в РФ).

## Системные сервисы и утилиты

    Bullet Screen Notification (com.xiaomi.barrage) – Дублирует уведомления на ПК через браузерное расширение (работает только в Chrome и Firefox), также может использоваться для работы "Взаимосвязанности" в экосистеме Xiaomi.
    Call Log Backup/Restore (com.android.calllogbackup) – Отвечает за резервное копирование журнала звонков.
    Cell Broadcast Service (com.google.android.cellbroadcastservice) – Сервис массовых SMS-рассылок от операторов, включая экстренные оповещения от МЧС (в моём регионе неактуально).
    Данные для экстренных случаев (com.android.emergency) – Неактуально для российских пользователей.
    MmsService (com.android.mms.service) – Загружает MMS-сообщения в фоновом режиме, но не влияет на ручную загрузку.
    Print Service Recommendation Service (com.google.android.printservice.recommendation) – Не влияет на саму возможность печати, поэтому удалено.
    System Print Service (com.android.bips), Print Spooler (com.android.printspooler) – Системные службы печати. Используются только при наличии принтера.
    MDMConfig (com.mediatek.mdmlsample) и MDMLSample (com.mediatek.mdmlsample) – Утилита от MediaTek для организаций и корпоративных пользователей.
    Генератор журналов (com.bsp.catchlog) – Помогает составлять системные журналы, например, для просмотра данных о состоянии батареи смартфона. Редко использую, к тому же есть более продвинутые аналоги.
    Отчет (com.miui.bugreport) – Позволяет отправлять разработчикам отчёты о сбоях в работе HyperOS.
    DebugLoggerUI (com.debug.loggerui) – Системный сервис сбора информации о сбоях системы.
    Dynamic System Updates (com.android.dynsystem) – Позволяет временно установить другую версию Android, но по факту не используется компаниями.

## Навигация и управление интерфейсом

    3 Button Navigation Bar (com.android.internal.systemui.navbar.threebutton) – В Android отвечает за отображение кнопок навигации на экране смартфона.
    com.android.systemui.navigation.bar.overlay – Управляет жестовой навигацией в "чистом" Android. Для HyperOS не имеет смысла.
    Transparent navigation bar (com.android.internal.systemui.navbar.transparent) – Прозрачная навигационная панель, которая включается в меню для разработчиков. Для меня бесполезна.

## Google-сервисы

    Gmail (com.google.android.gm) – Почтовое приложение Google, удалил, так как использую Яндекс Почту.
    Android System SafetyCore (com.google.android.safetycore) – Установилось автоматически, пользы не приносит, при этом имеет доступ к интернету.
    Google Assistant (com.google.android.apps.googleassistant) – Голосовой ассистент, который оказался в списке только потому, что многие его удаляют.
    Google One Time Init (com.google.android.onetimeinitializer) – Используется при первоначальной настройке смартфона, при сбросе до заводских настроек восстанавливается автоматически.
    Компоненты Google Assistant (com.android.hotwordenrollment.xgoogle, com.android.hotwordenrollment.okgoogle) – Не связаны с командой «Ok Google», и если удаляете сам ассистент, то логично удалить и эти приложения. На своём смартфоне я их оставил, так как пользуюсь Gemini (как установить, рассказывал ранее).
    Google One (com.google.android.apps.subscriptions.red) – Доступ к данным из всех сервисов Google, хранящихся в облаке.
    Google Meet (com.google.android.apps.tachyon) – Приложение для видеозвонков (ранее Google Duo).
    Отзывы о Маркете (com.google.android.feedback) – Формирует отчёты о сбоях в магазине приложений.
    Google TV (com.google.android.videos) – Ранее Google Play Фильмы, позволяет покупать и смотреть видео.
    Конфиденциальность в рекламе (com.google.android.adservices.api) – Полезная служба, которой, увы практически никто не пользуется.
    Android Auto (com.google.android.projection.gearhead) – Служит для подключения смартфона к мультимедиа автомобиля.

## Помимо этого можно удалить приложения YouTube, YouTube Music и Google Карты, если не пользуетесь.

## Приложения Xiaomi

    Mi Coin (com.xiaomi.payment) – приложение для внутренних платежей в сервисах Xiaomi.
    Mi Connect (com.xiaomi.mi_connect_service) – Управление устройствами Xiaomi, в том числе и через Mi Home. Если используете компоненты умного дома, не удаляйте.
    Mi Браузер (com.mi.globalbrowser) – Встроенный браузер Xiaomi.
    Mi Видео (com.miui.videoplayer) – Встроенный видеоплеер Xiaomi, который я заменил из-за большого количества рекламы и уведомлений.
    MIUI Daemon (com.miui.daemon) – Собирает статистику об использовании устройства.
    SoterService (com.tencent.soter.soterserver) – Служит для проведения платежей в китайских соцсетях.
    Справочник (com.miui.yellowpage) – Неактуально за пределами Китая, так как содержит информацию о номерах телефонов только китайских организаций.
    com.miui.systemui.carriers.overlay – Кнопки вызовов по Wi-Fi в панели управления (шторке).

    com.miui.analytics - шпион
    com.android.providers.partnerbookmarks - бесполезные рекламные закладки в браузере
    com.xiaomi.joyose - китайская байда
    com.google.android.printservice.recommendation - реклама
    com.tencent.soter.soterserver - китайская хрень
    com.google.mainline.telemetry - шпион
    com.xiaomi.discover - автообновление сяоми программ
    com.facebook.system - мерзость
    com.miui.msa.global - главный рекламный модуль на девайсе
    com.miui.yellowpage - китайская дрянь

# Легенда по пунктам ниже
# "ДА" - МОЖНО УДАЛЯТЬ. Приложения засоряющие систему, не нужные в системе (перенести в отдельную папку)
# "ТОЧНО ДА" - ЖЕЛАТЕЛЬНО УДАЛИТЬ. Приложения, которые можно смело удалять, при необходимости устанавливается с Маркета, им не место в системе.
# "МОЖНО" - МОЖНО УДАЛИТЬ, ЕСЛИ УВЕРЕНЫ. Приложения, удаление которых не повлияет на систему, но их желательно оставить (по некоторым причинам). Удалять, если точно знаете что оно Вам не нужно.
# "ВРЯДЛИ" - ЛУЧШЕ НЕ УДАЛЯТЬ. Приложения, по которым мало информации. Удаление может привести к сбоям работы смартфона.
# "НЕТ" - НЕ УДАЛЯТЬ. Приложения которые не нужно или не желательно удалять. Удаление влечет за собой бутлуп или сбои других зависимых приложений или ошибки.

    AnalyticsCore - ДА, китайский бэкдор
    AutoTest - НЕТ, Основные тесты железа смартфона. В дополнение к автотесту функций смартфона через кнопку версии ядра в "О телефоне". Дополнение к Assemble test.
    BasicDreams - ДА, заставки
    Bluetooth - НЕТ, функционал Bluetooth
    BluetoothMidiService - НЕТ, Приложение, предназначенное для подключений мультимедийных устройств Bluetooth: тачпады и ему подобных.
    BookmarkProvider - ДА, Импорт/синхронизация закладок встроенного браузера, не связан с Chrome
    CameraTools - НЕТ, Функционал камеры
    CaptivePortalLoginGoogle - НЕТ, Функция, позволяющая аутентифицировать пользователей с помощью web-браузера. Обычно используется для взимания платы Google.
    CarrierDefaultApp - НЕТ, Состояние мобильного Интернета, контроль/квоты мобильного трафика.
    CertInstaller - НЕТ, устанавливает сертификаты для приложений.
    cit - НЕТ, Инженерное меню, тесты
    com.miui.qr - ДА, Тест сканера QR-кодов. Часть тестового меню.
    EasterEgg - ДА, Пасхалка
    facebook-appmanager - ТОЧНО ДА, FB
    factoryTest - ДА, Тест телефона (*#0*#), китайский. После удаления аппарат не реагирует на любой сервис код. Не имеет отношения к Инженерному меню cit.apk.
    FidoAuthen - ДА, оплата покупок по отпечатку (китайское)
    FidoClient - ДА, оплата покупок по отпечатку (китайское)
    GFManager - НЕТ, Сканер отпечатка камеры
    GFTest - НЕТ, Тест сканера отпечатков пальцев
    GoogleExtShared - НЕТ, Общая библиотека Android
    GooglePrintRecommendationService - МОЖНО (да), Служба печати (гугловский облачный принтер)
    HTMLViewer - НЕТ, Отвечает за просмотр html-файлов и справок для некоторых приложений. Лучше оставить.
    HybridAccessory - МОЖНО, Приложение "Smart Scenes". Компонент для запуска гибридных приложений, созданных с использованием веб-технологий. Платформа, которая позволяет разрабатывать и использовать гибридные приложения.
    HybridPlatform - МОЖНО, Quick Apps это аналог Instant Apps для магазина приложений MIUI. Система по созданию сайтов для продажи и прочего. (постоянно висит в фоне и жрет ресурсы)
    Joyose - НЕТ, Защита от фейковых вышек связи (при удалении проблемы с СМС оповещением)
    KeyChain - НЕТ, Связан с работой сертификатов и ключей безопасности, возможно паролей.
    LiveWallpapersPicker - ДА, Выбор живых обоев (если не используете "живые обои")
    MiBugReportGlobal - МОЖНО, Приложение "Отчет" (Bug Reports). Отправка отчета об ошибках при работе системы (постоянно висит в фоне и жрет ресурсы). (удал.с MIServiceGlobal)
    MiCloudSync - МОЖНО, Синхронизация с серверами Xiaomi. (удалять если не пользуетесь)
    MiLinkGlobal - ДА, Приложение "Трансляция". Трансляция изображения с телефона на монитор.
    MintKeyboard - ДА, Клавиатура Mint для восточных стран
    MIRadioGlobalBuiltin - НЕТ, FM-Радио
    MiSound - НЕТ, Наушники. Регулировка звуковых эффектов через bluetooth
    miui - НЕТ, Оболочка MIUI Фрэймворк
    MiuiBiometric - НЕТ, Разблокировку экрана по лицу
    MiuiBluetooth - НЕТ, Функционал Bluetooth
    MiuiDaemon - ДА, Сбор статистики для китайских шпионов
    MIUIDeskClockGlobal - НЕТ, Часы
    MIUIFileExplorerGlobal - МОЖНО, Файловый менеджер с рекламой (при удалении заменить)
    MIUIFrequentPhrase - ДА, Частые фразы для стандартной клавиатуры (можно удалить при использовании Gboard)
    MIUIGuardProviderGlobal - НЕТ, Приложение "Компоненты безопасности". Антивирус в приложении "Безопасность".
    MIUIHealthGlobal - ДА, Приложение "Пульс". Измеритель пульса MIUI (при помощи вспышки и камеры). Сомнительный функционал.
    MIUIMiPicks - МОЖНО (да), Китайский маркет "Get Apps". Если оставить, то ограничить ативность (как у любых других MI сервисов)
    MiuiPrintSpoolerBeta - МОЖНО (да), Приложение "Спулер печати". Системна служба для печати со смартфона на принтер стандартным средствами. (удалять если не печатаете стандартным способом).
    MIUIScreenshot - НЕТ, Создание скриншотов экрана.
    MiuiSecurityAddGlobal - НЕТ, Приложение "Плагин системной службы"/"Плагин службы безопасности". Настройки производительности системы.
    miuisystem - НЕТ, Оболочка MIUI
    MIUISystemUIPlugin - НЕТ, Оболочка MIUI
    MIUIThemeManagerGlobal - НЕТ, Менеджер тем
    MIUIVideoPlayer - МОЖНО (да), Видео плеер от MIUI. (Лучше установить MX)
    MiuixEditor_global - нет информации
    MIWallpaper - НЕТ, Обои. Онлайн сервис обоев MI-Обои. Смена обоев от времени суток. Анимации на рабочем столе.
    MSA-Global - ДА, Служба рекламы
    NotificationCenter - НЕТ, Шторка уведомлений. Статусбар.
    PacProcessor - НЕТ, обработка прокси-сервера, настройки внутренней прокси
    PartnerBookmarksProvider - ДА, Импортер закладок стокового браузера (партнеры chrome)
    PaymentService - ДА, Служба платежей (Micredit китайский)
    PlayAutoInstallStubApp - НЕТ, Компонент установки фирменного ПО производителя/оператора при первоначальной настройке смартфона (в зависимости от региона).
    pnNfcNci - НЕТ, Служба NFC
    PowerChecker - НЕТ, Приложение "Power Detector". Контроль батареи и активности.
    PowerKeeper - НЕТ, Системный монитор расхода энергии. "Питание и производительность".
    SarAuth - НЕТ, Функционал датчика SAR (Specific Absorption Rate). Контролирует излучение энергии.
    SecureElement - НЕТ, Служба Безопасности в устройстве NFC, безопасное хранение и работоспособность платежных приложений
    SecurityCoreAdd - НЕТ, Ядро системы безопасности. Настройки блокировки приложений, второй пользователь (второе пространство)
    SensorTestTool - МОЖНО, Тест меню сканера отпечатков пальцев
    sileadManager - НЕТ, Сканер отпечатков, функционал, калибровка (подэкранный модуль).
    SimAppDialog - НЕТ, "Приложение для СИМ-карты". Используется для инициализации новой симки.
    Stk - НЕТ, Приложение для отображения меню оператора. Влияет на автонастройку APN и ММS.
    Updater - МОЖНО, Служба обновления прошивки (можно удалить при ручном обновлении прошивок)
    WallpaperBackup - МОЖНО, Нужна для того, чтобы обои сохранялись на рабочем столе, даже после удаления картинки-источника.
    WMService - НЕТ, Фреймверк
    XiaomiAccount - НЕТ, Mi Аккаунт (выйти при удалении). Если оставить, то отключить всю активность. При удалении могут возникнуть проблемы, т.к. это основное приложение аккаунта пользователя.
    XiaomiServiceFrameworkGlobal - НЕТ, Заморозить после первого запуска.
    XiaomiSimActivateService - ВРЯДЛИ, Сервис активации XiaomiSIM (китайский). Если оставить возможны ложные уведомления о том, что SIM-карта не активирована. Наверное можно заморозить.
    XMSFKeeperAll - НЕТ, "Xiaomi Service Framework Keeper". Связано с Поиском устройства и "Xiaomi Service Framework".

    AuthManager - НЕТ, Управление правами приложений и автозапуском
    Backup - МОЖНО (да), стоковый бэкап
    BackupRestoreConfirmation - НЕТ, визуализация подтверждения бэкапа/восстановление настроек
    barrage - ВРЯДЛИ, Приложение "Bullet screen notification". Возможно связано с быстрыми ответами. (после удаления возможны сбои)
    BlockedNumberProvider - НЕТ, Хранилище заблокированных номеров
    BuiltInPrintService - МОЖНО (да), служба управления принтерами
    CalendarProvider - НЕТ, "Память календаря". Синхронизация календаря в телефоне с аккаунтом Google и другими календарями, а так же отвечает за уведомления
    CallLogBackup - НЕТ, Бэкап и восстановление лога звонков
    CellBroadcastLegacyApp - НЕТ, Экстренные оповещения по безпроводным сетям
    CleanMaster - НЕТ, "Глубокая очистка"/"Очистка". Программа для очистки.
    CloudBackup - МОЖНО (да), китайский бэкап
    ConfigurationClient - НЕТ, Конфигурация точки доступа.
    ContactsProvider - НЕТ, Синхронизация контактов. Даёт сторонним приложениям возможность доступа к Вашим контактам на устройстве
    DocumentsUIGoogle - НЕТ, Приложение "Файлы". Дает разрешение другим приложениям, для доступа к файлам на носителях, в т.ч. и внутреннем
    DownloadProvider - НЕТ, Обеспечивает загрузку файлов вручную и из Маркета
    DownloadProviderUi - НЕТ, Оболочка приложения загрузки из стокового браузера. Лучше оставить
    dtag-appenabler - ДА, Приложение "AppEnabler" (by Telekom Deutschland GmbH). Немецкий сервис. Автоустановка дополнительного софта от Sony. Итеграцию Facebook и ANT.
    DynamicSystemInstallationService - ВРЯДЛИ, Приложение "Dynamic System Updates". Даёт возможность сначала попробовать обновление перед установкой.
    ExternalStorageProvider - НЕТ, Внешний накопитель
    facebook-installer - ТОЧНО ДА, FB
    facebook-services - ТОЧНО ДА, FB
    FusedLocation - НЕТ, Геоданные из нескольких источников
    GooglePackageInstaller - НЕТ, Установщик пакетов/приложений
    InCallUI - НЕТ, MIUI Звонилка, (MI Dialer)
    InputDevices - НЕТ, Устройства ввода и настройки клавиатуры
    LocalTransport - НЕТ, хранение геоданных из нескольких источников
    ManagedProvisioning - НЕТ, Настройка рабочего профиля, администраторы устройства
    MediaProviderLegacy - НЕТ, Связь разных приложений с Хранилищем мультимедиа. Оптимизирует индексированные метаданные.
    MiRcs - ВРЯДЛИ, Mi Rich Communication Services - (китайский) протокол обмена данными между операторами сотовой связи, а также между операторами и устройствами. Пакет от Xiaomi.
    MIServiceGlobal - МОЖНО (да), MI Службы и обратная связь. Отзывы, создание журналов ошибок и отчетов. (удал.с MiBugReportGlobal)
    MISettings - НЕТ, Настройки
    MiuiCalendarGlobal - НЕТ, Календарь от MIUI
    MiuiCamera - НЕТ, Камера
    MiuiContactsGlobal - НЕТ, Приложение Контакты от MIUI
    MiuiFreeformService - НЕТ, "Плавающие окна". Ссоздание окна в другом окне.
    MIUIGalleryGlobal - НЕТ, Галерея
    MIUIGlobalMinusScreenWidget - НЕТ, "Лента виджетов" (меню виджетов)
    MiuiHome - НЕТ, Модуль для кастомизации рабочего стола MIUI. Настройка сетки иконок.
    MIUIMmsGlobalAndroidS - НЕТ, СМС/ММС сообщения, основной компонент
    MIUIMusicGlobal - НЕТ, Музыка (лучше оставить)
    MiuiVpnDialogs - НЕТ, VPN настройка
    MIUIYellowPageGlobal - НЕТ, "Справочник" компаний (китайский). Призван оповещать, что за номер вам звонит или прислал смс. Есть зависимости у других приложений.
    MmsService - НЕТ, сервис sms и mms
    MtpService - НЕТ, Сервис сопряжения с ПК
    MusicFX - ДА, стоковый эквалайзер
    NetworkPermissionConfigGoogle - НЕТ, Обеспечение работы сети
    NetworkStackGoogle - НЕТ, Служба подключения к интернету
    ONS - НЕТ, Opportunistic Network Service Сканирует сеть и сопоставляет результаты
    Provision - НЕТ, Блокировка экрана при первом запуске. Файл который задает настройки при первой загрузке.
    ProxyHandler - НЕТ, Помогает приложениям подключаться через прокси-сервер
    RtMiCloudSDK - НЕТ, Синхронизация с серверами Xiaomi. Связано с галереей, контактами и звонилкой.
    SecurityCenter - НЕТ, Безопасность. Набор инструментов по обслуживанию телефона.
    SettingsProvider - НЕТ, Осуществляет прием и применение настроек, полученных в текстовом или сервисном сообщении.
    SharedStorageBackup - МОЖНО (да), Пакет для резервного копирования файлов встроенным бекапером. Резервное копирование гугл. Библиотека хранилища данных резервного копирования.
    Shell - НЕТ, Оболочка (Сообщения об ошибках). Подключение по ADB.
    SoundPicker - НЕТ, "Звуки". Меню выбора мелодий, картинок.
    Tag - НЕТ, Метки NFC
    Telecom - НЕТ, сервис телефонии
    TelephonyProvider - НЕТ, Используется для хранения смс, контактов и вызовов
    TeleService - НЕТ, сервис телефонии, телефон (голосовая почта)
    Traceur - МОЖНО (да), "Трассировка системы". Сервис из меню для разработчиков. Отслеживание и анализ рабочих процессов в целях повышения производительности системы. Запись активности устройство за несколько секунд (в файл).
    UserDictionaryProvider - НЕТ, Словари для клавиатуры. Пользовательский словарь для предугадывания слов при наборе. Влияет на работу стандартной клавиатуры Android.

    CalendarGoogle - МОЖНО, Google календарь
    CallFeaturesSetting - НЕТ, Дополнительные функции для вызовов (блокировка).
    Chrome - НЕТ, Chrome
    com.google.android.modulemetadata - НЕТ, системное приложение
    ConfURIDialer - НЕТ, Служба конференц связи (для цифрового сигнала)
    DeviceStatisticsService - ВРЯДЛИ, нет информации
    Gmail2 - НЕТ, Gmail (лучше оставить)
    GoogleContacts - НЕТ, Контакты
    GoogleContactsSyncAdapter - МОЖНО, Синхронизация контактов с Google аккаунтом (удалять если не планируется синхронизация)
    GoogleLocationHistory - МОЖНО, История местоположения от Google
    GoogleOne - ДА, Сервис от Google "все в одном" для хранения и резервного копирования всех данных.
    LatinImeGoogle - НЕТ, Клавиатура от Google
    Maps - МОЖНО, Google-карты
    Messages - НЕТ, SMS/MMS мессенджер от Google
    MiuiTelecomOverlay - ВРЯДЛИ, связано с телефонией
    PhotoTable - ДА, Приложение "Заставки". Фотографические, во время зарядки устройства.
    PowerOffAlarm - НЕТ, Отвечает за включение/выключение телефона (будильник, расписание).
    remoteSimLockAuthentication - НЕТ, Удалённое управление sim-картами
    remotesimlockservice - НЕТ, Удалённое управление sim-картами
    RideModeAudio - ВРЯДЛИ, "RideMode Recording list", нет информации
    SpeechServicesByGoogle - НЕТ, Функции голосового ввода
    talkback - МОЖНО, "Специальные возможности". Приложение для помощи в управлении смартфоном, людям с ограниченными возможностями.
    TrichromeLibrary - НЕТ, Связано с библиотеками Chrome и WebView.
    uimgbaservice - ВРЯДЛИ, нет информации (эмулятор)
    uimlpaservice - ВРЯДЛИ, нет информации
    uimremoteclient - ДА, UIM (Universal Input Method) многоязыковая система ввода
    uimremoteserver - ДА, UIM (Universal Input Method) многоязыковая система ввода
    WebViewGoogle - НЕТ, Компонент для просмотра веб контента. Используется множеством приложений.
    xdivert - НЕТ, Связано с телефонией. Принятие входящего звонка на вторую сим карту, если при этом, вы уже разговариваете по первой. (вероятно для смартфонов с двумя модулями связи)
    YouTube - МОЖНО, YouTube

    AndroidAutoStub - МОЖНО (да), Сервис для водителей (Android auto)
    CarrierServices - НЕТ, SMS/MMS мессенджер от Google. "Google Carrier Services", чаты.
    ConfigUpdater - НЕТ, Выполняет настройку приложения (любого) при его установке
    GmsCore - НЕТ, Сервисы Google Play
    GoogleAssistant - МОЖНО, Google Ассистент.
    GoogleDialer - НЕТ, Номеронабиратель, телефон.
    GoogleOneTimeInitializer - МОЖНО (да), Настройки гугла при первом запуске телефона, мастер установки доп. приложений. Устанавливает все что нужно и ненужно
    GooglePartnerSetup - ВРЯДЛИ, Позволяет сторонним приложениям получить доступ к сервисам гугл
    GoogleRestore - ДА, Google сервис "Восстановление данных". Позволяет восстановить данные со старого телефона при помощи кабеля или резервной копии в облачном хранилище. Полезно при первой настройке.
    HotwordEnrollmentOKGoogleHEXAGON - ВРЯДЛИ, Компонент Google, ОК-Google (Ассистент).
    HotwordEnrollmentXGoogleHEXAGON - ВРЯДЛИ, Компонент Google, ОК-Google (Ассистент).
    ImsServiceEntitlement - НЕТ, IMS-сервис стандарт передачи данных в сетях 2G+, но при этом используя IP-телефонию (Wi-Fi звонки, IP Multimedia Subsystem)
    Phonesky - НЕТ, Google Play Market
    SettingsIntelligence - НЕТ, Дополнение к настройкам, рекомендации и поиск в настройках.
    Turbo - НЕТ, Следит за состоянием аккумулятора. Предоставляет информацию использовании АКБ.
    Velvet - НЕТ, Поиск Google
    Wellbeing - ДА, "Цифровое благополучие" от Google. Статистика и время использования телефона.

    CACertService - НЕТ, Геолокация, A-GPS.
    CneApp - НЕТ, Сервис интернет подключения. Автоматически выбирает, когда ему лучше использовать Wi-Fi, а когда 3G/4G.
    IFAAService - НЕТ, Internet Finance Authentication Alliance. Сервис платежей (подтверждения).
    IWlanService - ВРЯДЛИ, нет информации
    MipayService - ВРЯДЛИ, MI-Pay, система платежей
    SoterService - ДА, Биометрическое подтверждение китайских платежей в китайских соц сетях.
    TimeService - НЕТ, Синхронизация и управление временем (time-keeper).
    TrustZoneAccessService - НЕТ, Режимы работы с GPU. Безопасный доступ к памыти сторонних приложений

## Ещё список:

    # ПРЕДУПРЕЖДЕНИЕ: отключение может повлечь за собой
    # ___существенные___ ограничения в функционале смартфона
    com.google.android.googlequicksearchbox # Поиск
    com.android.providers.partnerbookmarks  # Partner Bookmarks
    com.google.android.partnersetup         # Partner Setup
    com.google.android.calculator           # Калькулятор
    com.google.android.calendar             # Календарь
    com.google.android.apps.docs            # Google Drive
    com.google.android.gm                   # GMail
    com.google.android.apps.maps            # Google Maps
    com.google.android.gms.location.history # Google Maps
    com.google.android.videos               # Google Movies
    com.google.android.apps.photos          # Google Photos
    com.android.vending                     # Google Play Store
    com.google.android.feedback             # Market Feedback Agent
    com.google.android.apps.tachyon         # Google Meet (Duo)
    com.google.android.apps.youtube.music   # YT Music
    com.google.android.youtube              # YT

# ОПАСНО: ниже - системные приложения, есть ___риск_"окирпичить"_смартфон___
# ВНИМАНИЕ: ___замените____ Клавиатуру и Сообщения перед удалением
    com.google.android.onetimeinitializer   # Google One Time Init
    com.google.android.apps.nbu.files       # Файлы
    com.google.android.tts                  # Google TTS Engine
    com.google.android.apps.wellbeing       # Цифровое благополучие
    com.google.android.inputmethod.latin    # Клавиатура GBoard
    com.google.android.apps.messaging       # Сообщения

# ВНИМАНИЕ: Получите бесконечные уведомления, ___если_не_отключили___ приложения выше!
    com.google.android.gms                  # Google Play Services
    com.google.android.gsf                  # Google Services Framework

    ru.oneme.app          # MAX
    ru.rostel             # Госуслуги

# VK, OK, Mail
    ru.ok.messages        # ТамТам
    ru.zen.android        # Дзен
    ru.ok.android         # Одноклассники
    ru.mail.mailapp       # Почта@Mail.ru
    ru.mail.search.electroscope  # Маруся
    com.vk.im             # VK Мессенджер
    com.vkontakte.android # VK
    com.vk.vkvideo        # VK Видео
    ru.vk.store           # RuStore

# Яндекс
    com.yandex.alice      # Алиса
    com.yandex.aliceapp   # Алиса
    com.yandex.browser    # Яндекс Браузер
    com.yandex.zen        # Дзен
    ru.yandex.disk        # Яндекс Диск
    ru.yandex.yandexmaps  # Яндекс Карты
    com.yandex.searchapp  # Яндекс c Алисой
    ru.yandex.searchplugin # Яндекс Поиск

# Разное
    com.kms.free          # Касперский Free
    com.ncloudtech.cloudoffice # МойОфис
    ru.litres.android     # Литрес
    ru.sberbankmobile     # Сбербанк
    ru.ozon.app.android   # OZON
    com.wildberries.ru    # WB
    ru.crptech.mark       # Честный знак
    ru.nspk.mirpay        # MIR Pay
    ru.rutube.app         # Rutube
    rtb.mobile.android    # Rutube
```

Имя пакета можно также поискать, например тут (имя сервиса видно на странице загрузки APK):
https://apkpure.net/ru/my-honor/com.hihonor.phoneservice/download

Меню сим-карт, говорят, можно удалить: «»На телефонах с процессором MTK удалял `Stk1.apk` из системной папки и меню SIM карт пропадало»
Для МегаФон: Запретить запуск «StkAppService».

**Если не хочется удалять всё руками, давно придумали Shell-скрипт хелпер для удаления:**

```bash
#!/usr/bin/env bash
set -euo pipefail

# Добавляем проверку подключения устройства
check_adb() {
    if ! adb devices | grep -q 'device$'; then
        echo "Ошибка: подключите устройство ADB и разрешите отладку по USB"
        exit 1
    fi
}

# Функция для получения списка пакетов
get_packages() {
    adb shell 'pm list packages -f' | \
    sed -n 's/.*:\(.*\)=\(.*\)/\2 \1/p' | \
    sort -k1
}

# Основной цикл
main() {
    check_adb

    while true; do
        echo "Загружаем список пакетов..."

        # Получаем список и форматируем для выбора
        if ! selection=$(get_packages | fzf -m --height=40% --layout=reverse \
            --header="Выберите пакеты для удаления (Tab для выбора, Enter для удаления)" \
            --bind='ctrl-c:abort' \
            --preview='echo {1}' \
            --preview-window=down:1 | cut -d' ' -f1); then
            echo "Выход"
            break
        fi

        if [ -z "$selection" ]; then
            echo "Ничего не выбрано. Выход."
            break
        fi

        # Подтверждение удаления
        echo "Выбраны пакеты:"
        echo "$selection"
        read -rp "Удалить эти приложения? (y/N): " confirm

        if [[ $confirm =~ ^[Yy]$ ]]; then
            echo "$selection" | while read -r pkg; do
                echo -n "Удаляем $pkg... "
                if adb shell pm uninstall --user 0 "$pkg" &>/dev/null; then
                    echo "OK"
                else
                    echo "ОШИБКА"
                fi
            done
        else
            echo "Отменено"
        fi

        read -rp "Продолжить? (Y/n): " continue
        [[ $continue =~ ^[Nn]$ ]] && break
    done
}

main
```

Сохраните скрипт как adb-cleaner.sh

Дайте права на выполнение: chmod +x adb-cleaner.sh

Запустите: ./adb-cleaner.sh

Тема на 4PDA: https://4pda.to/forum/index.php?showtopic=236256
