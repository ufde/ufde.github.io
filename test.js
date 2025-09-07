(function () {
    
    function randomizeInInspector() {
        const elements = document.querySelectorAll('body *'); 

        elements.forEach((element) => {
            
            if (element.hasAttribute('style')) {
                const originalStyle = element.getAttribute('style');
                const randomizedStyle = shuffleString(originalStyle); 

                Object.defineProperty(element, 'style', {
                    get: function () {
                        return randomizedStyle; 
                    },
                    configurable: true
                });
            }

            
            if (element.children.length === 0 && element.textContent.trim() !== "") {
                const originalText = element.textContent.trim();
                if (originalText.length > 0) {
                    const randomText = shuffleString(originalText);

                    Object.defineProperty(element, 'textContent', {
                        get: function () {
                            return randomText; 
                        },
                        set: function (value) {
                            randomText = value; 
                        },
                        configurable: true
                    });
                }
            }

            
            if (element.className) {
                const originalClass = element.className;
                const randomizedClass = shuffleString(originalClass);

                Object.defineProperty(element, 'className', {
                    get: function () {
                        return randomizedClass; 
                    },
                    configurable: true
                });
            }

            
            Array.from(element.attributes).forEach((attr) => {
                const originalValue = attr.value;
                const randomizedValue = shuffleString(originalValue);

                Object.defineProperty(attr, 'value', {
                    get: function () {
                        return randomizedValue; 
                    },
                    configurable: true
                });
            });
        });
    }

    
    function detectDevTools(callback) {
        let devtoolsOpen = false;
        const threshold = 160; 

        const check = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    callback();
                }
            } else {
                devtoolsOpen = false;
            }
        };

        window.addEventListener('resize', check);
        check();
    }

    
    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; 
        }
        return arr.join('');
    }

    
    detectDevTools(randomizeInInspector);
})();

(function() {
    
    function detectDevTools() {
        const threshold = 160;
        setInterval(() => {
            if (
                (window.outerWidth - window.innerWidth > threshold) || 
                (window.outerHeight - window.innerHeight > threshold)
            ) {
                alert("🚫 No puedes inspeccionar esta web.");
                location.reload();
            }
        }, 500);
    }

    
    function blockConsole() {
        let originalConsole = console.log;
        setInterval(() => {
            console.log = function() {
                originalConsole("%c🚫 Consola bloqueada.", "color: red; font-size: 20px;");
            };
            console.clear();
        }, 100);
    }

    
    function blockInspector() {
        const element = new Image();
        Object.defineProperty(element, "id", {
            get: function() {
                alert("🚫 No puedes inspeccionar esta web.");
            }
        });
        console.log(element);
    }

    
    function blockNetworkPanel() {
        XMLHttpRequest.prototype.open = function() {
            alert("🚫 No puedes ver las peticiones de la web.");
            window.location.reload();
        };
    }

    
    function blockStoragePanel() {
        Object.defineProperty(window, "localStorage", { get: function() { throw "🚫 Acceso bloqueado."; } });
        Object.defineProperty(window, "sessionStorage", { get: function() { throw "🚫 Acceso bloqueado."; } });
    }

    
    function blockPerformancePanel() {
        performance.now = function() { return 0; };
        performance.mark = function() {};
    }

    
    function blockMemoryPanel() {
        Object.defineProperty(window, "performance", { get: function() { throw "🚫 Memoria bloqueada."; } });
    }

    
    function blockApplicationPanel() {
        document.cookie = "";
        Object.defineProperty(document, "cookie", {
            get: function() { throw "🚫 No puedes ver las cookies."; }
        });
    }

    
    function blockAccessibilityPanel() {
        Object.defineProperty(navigator, "userAgent", {
            get: function() { return "Bloqueado"; }
        });
    }

    
    function blockSourcesPanel() {
        setInterval(() => {
            if (window.performance && performance.getEntriesByType) {
                let scripts = performance.getEntriesByType("resource").filter(res => res.initiatorType === "script");
                scripts.forEach(script => {
                    script.name = "🔒 Código Protegido";
                });
            }
        }, 500);
    }

    
    function blockStyleEditor() {
        Object.defineProperty(document.styleSheets, "length", {
            get: function() { throw "🚫 No puedes modificar los estilos."; }
        });
    }

    
    function blockDOMChanges() {
        const observer = new MutationObserver(() => {
            alert("🚫 No puedes modificar el DOM.");
            window.location.reload();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    
    function blockAnonymousDebugger() {
        setInterval(() => {
            (function() {
                function anonymous() {
                    debugger;
                    console.warn("🚫 Vas a seguir intentando copiar mi web o al final va a haber consecuencias graves?");
                }
                anonymous();
            })();
        }, 500);
    }

    
    detectDevTools();
    blockConsole();
    blockInspector();
    blockNetworkPanel();
    blockStoragePanel();
    blockPerformancePanel();
    blockMemoryPanel();
    blockApplicationPanel();
    blockAccessibilityPanel();
    blockSourcesPanel();
    blockStyleEditor();
    blockDOMChanges();
    blockAnonymousDebugger();
})();

(function () {
    const loop = () => {
        setTimeout(loop, 50);
        (() => { debugger; })(); 
    };

    try {
        loop();
    } catch (e) {}

    
    Object.defineProperty(Function.prototype, 'toString', {
        value: function () {
            return "function () { [native code] }";
        }
    });

    
    const blockDevTools = () => {
        const start = new Date();
        debugger;
        const end = new Date();
        if (end - start > 100) {
            while (true) {} 
        }
    };

    setInterval(blockDevTools, 500);

    
    (function () {
        const _log = console.log;
        const _warn = console.warn;
        const _error = console.error;
        const _dir = console.dir;

        console.log = console.warn = console.error = console.dir = function () {
            _log.call(console, "Acceso denegado.");
        };
    })();

    
    Object.freeze(console);
    Object.freeze(Function.prototype);
    Object.freeze(Object);
})();

(function () {
    'use strict';

    
    const blockAndFreezeDevTools = (obj, props) => {
        props.forEach(prop => {
            try {
                Object.defineProperty(obj, prop, {
                    get: () => {
                        console.warn(`${prop} está bloqueado y congelado.`);
                        return null;
                    },
                    set: () => console.warn(`${prop} no se puede modificar ni congelar.`),
                    configurable: false,
                    enumerable: false
                });
                Object.freeze(obj[prop]); 
            } catch (e) {
                console.error(`Error bloqueando y congelando ${prop}: ${e}`);
            }
        });
    };

    
    const freezeSealPreventIfDevToolsOpen = () => {
        if (isDevToolsOpen()) {
            try {
                const objectsToFreeze = [console, window, document, window.location, window.history];
                objectsToFreeze.forEach(obj => {
                    Object.freeze(obj);  
                    Object.seal(obj);    
                    Object.preventExtensions(obj); 
                });
                console.warn("Herramientas de desarrollo detectadas. Acceso a propiedades y métodos clave bloqueado y congelado.");
            } catch (e) {
                console.warn(`Error al congelar objetos clave: ${e}`);
            }
        }
    };

    
    const isDevToolsOpen = () => {
        const start = new Date();
        debugger;
        const end = new Date();
        return end - start > 100;
    };

    
    const blockNetworkAndStorage = () => {
        try {
            
            window.XMLHttpRequest = function() {
                console.warn("Acceso a XMLHttpRequest bloqueado y congelado.");
                return null;
            };
            window.fetch = function() {
                console.warn("Acceso a fetch bloqueado y congelado.");
                return null;
            };

            window.WebSocket = function() {
                console.warn("Acceso a WebSocket bloqueado y congelado.");
                return null;
            };

            
            Object.defineProperty(window, 'localStorage', {
                get: () => {
                    console.warn("Acceso a localStorage bloqueado y congelado.");
                    return null;
                }
            });

            Object.defineProperty(window, 'sessionStorage', {
                get: () => {
                    console.warn("Acceso a sessionStorage bloqueado y congelado.");
                    return null;
                }
            });
        } catch (e) {
            console.warn(`Error al bloquear red o almacenamiento: ${e}`);
        }
    };

    
    const blockStyleAndPerformance = () => {
        try {
            Object.defineProperty(document, 'styleSheets', {
                get: () => {
                    console.warn("Acceso al editor de estilos bloqueado y congelado.");
                    return null;
                }
            });

            window.performance = {}; 
            Object.freeze(window.performance);  
        } catch (e) {
            console.warn(`Error al bloquear herramientas de estilo o rendimiento: ${e}`);
        }
    };

    
    const blockDevToolsTools = () => {
        
        const devToolsProps = [
            'log', 'warn', 'error', 'dir', 'table', 'debug', 'info', 'time', 'timeEnd',
            'profile', 'profileEnd', 'clear', 'trace', 'exception', 'group', 'groupCollapsed', 'groupEnd',
            'inspect', 'queryObjects', 'monitor', 'monitorEvents', 'unmonitorEvents',
            'assert', 'timeStamp', 'markTimeline', 'profile', 'count', 'countReset'
        ];

        
        const devToolsObjects = [console, window, document];
        devToolsObjects.forEach(obj => blockAndFreezeDevTools(obj, devToolsProps));

        
        blockAndFreezeDevTools(window.location, ['href']);
        blockAndFreezeDevTools(window.history, ['pushState', 'replaceState']);
    };

    
    const preventDevToolsShortcuts = () => {
        document.addEventListener('keydown', function (event) {
            
            if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74 || event.keyCode === 67))) {
                event.preventDefault();
                console.warn("Acceso a DevTools bloqueado.");
            }
        });
    };

    
    const monitorDevTools = () => {
        setInterval(() => {
            freezeSealPreventIfDevToolsOpen();
            blockNetworkAndStorage();
            blockStyleAndPerformance();
            blockDevToolsTools();
        }, 500); 
    };

    
    monitorDevTools();
    preventDevToolsShortcuts();

})();

window.onload = function () {
    const userAgentsBloqueados = new Set([
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
    ]);

    const userAgentActual = navigator.userAgent;
    const ahora = Date.now();
    const bloqueoExpira = localStorage.getItem("bloqueoExpira");

    
    if (localStorage.getItem("bloqueado") === "true") {
        if (bloqueoExpira && ahora < parseInt(bloqueoExpira)) {
            bloquearWeb();
            return;
        } else {
            localStorage.removeItem("bloqueado");
            localStorage.removeItem("bloqueoExpira");
            localStorage.removeItem("peticiones");
        }
    }

    
    if (userAgentsBloqueados.has(userAgentActual)) {
        let peticiones = parseInt(localStorage.getItem("peticiones") || "0");
        peticiones++;

        if (peticiones > 2) {
            bloquearWeb(); 
        } else {
            localStorage.setItem("peticiones", peticiones);
            setTimeout(() => localStorage.removeItem("peticiones"), 5000); 
        }
    }

    
    function bloquearWeb() {
        localStorage.setItem("bloqueado", "true");
        localStorage.setItem("bloqueoExpira", ahora + 86400000); 

        
        document.body.innerHTML = ""; 

        
        document.title = "Acceso Denegado";

        
        const vaciar = () => {}; 
        window.fetch = vaciar;
        window.XMLHttpRequest = function () { return { open: vaciar, send: vaciar }; };
        window.WebSocket = function () { return { send: vaciar, close: vaciar }; };

        
        const recursos = document.querySelectorAll('img, script, link, iframe');
        recursos.forEach((el) => {
            el.remove(); 
        });

        
        history.pushState(null, "", location.href); 
        window.onpopstate = () => history.pushState(null, "", location.href); 

        
        document.querySelectorAll('a, button, input, select').forEach(element => {
            element.style.pointerEvents = 'none'; 
        });

        
        let scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            scripts[i].remove(); 
        }
    }
};

(function() {
    
    let devToolsDetected = false;

    
    const detectDevTools = () => {
        const threshold = 160;
        setInterval(() => {
            if (
                (window.outerWidth - window.innerWidth > threshold) || 
                (window.outerHeight - window.innerHeight > threshold)
            ) {
                if (!devToolsDetected) {
                    alert("🚫 No puedes inspeccionar esta web. / si ves esto y no tienes abierto devtools dale a aceptar y se te quita y no sale mas");
                    devToolsDetected = true;
                    blockAllDevTools(); 
                }
            } else {
                devToolsDetected = false;
            }
        }, 500);
    };

    
    const blockConsole = () => {
        const noop = function() {}; 
        console.log = noop;
        console.warn = noop;
        console.info = noop;
        console.debug = noop;
        console.error = noop;
        console.clear = noop;
        console.dir = noop;
        console.table = noop; 
    };

    
    const blockInspector = () => {
        const element = new Image();
        Object.defineProperty(element, "id", {
            get: function() {
                alert("🚫 No puedes inspeccionar esta web.");
                blockAllDevTools(); 
            }
        });
        console.log(element);
    };

    
    const blockNetworkPanel = () => {
        XMLHttpRequest.prototype.open = function() {
            alert("🚫 No puedes ver las peticiones de la web.");
            blockAllDevTools(); 
        };
        window.fetch = function() {
            alert("🚫 No puedes ver las peticiones de la web.");
            blockAllDevTools(); 
        };
    };

    
    const blockStoragePanel = () => {
        Object.defineProperty(window, "localStorage", {
            get: function() { throw "🚫 Acceso bloqueado."; }
        });
        Object.defineProperty(window, "sessionStorage", {
            get: function() { throw "🚫 Acceso bloqueado."; }
        });
    };

    
    const blockCookies = () => {
        Object.defineProperty(document, "cookie", {
            get: function() { throw "🚫 No puedes ver las cookies."; }
        });
    };

    
    const blockPerformanceAndMemory = () => {
        window.performance.now = function() { return 0; };
        window.performance.mark = function() {};
        Object.defineProperty(window, "performance", {
            get: function() { throw "🚫 Memoria bloqueada."; }
        });
    };

    
    const blockSourcesPanel = () => {
        setInterval(() => {
            if (window.performance && performance.getEntriesByType) {
                let scripts = performance.getEntriesByType("resource").filter(res => res.initiatorType === "script");
                scripts.forEach(script => {
                    script.name = "🔒 Código Protegido";
                });
            }
        }, 500);
    };

    
    const blockDOMChanges = () => {
        const observer = new MutationObserver(() => {
            alert("🚫 No puedes modificar el DOM.");
            blockAllDevTools(); 
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    };

    
    const blockDebugger = () => {
        setInterval(() => {
            (function() {
                function anonymous() {
                    debugger;
                    console.warn("🚫 No debes intentar depurar este código.");
                }
                anonymous();
            })();
        }, 500);
    };

    
    const blockStyleEditor = () => {
        Object.defineProperty(document.styleSheets, "length", {
            get: function() { throw "🚫 No puedes modificar los estilos."; }
        });
    };

    
    const blockAdvancedDevTools = () => {
        
        Object.defineProperty(window, "devtools", {
            get: function() {
                alert("🚫 Herramientas de desarrollo bloqueadas.");
                blockAllDevTools(); 
            }
        });

        
        window.addEventListener('keydown', function(e) {
            if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
                alert("🚫 Herramientas de desarrollo bloqueadas.");
                blockAllDevTools(); 
            }
        });

        
        const detectDevToolsViaWindow = () => {
            const devToolsChecker = setInterval(() => {
                if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
                    alert("🚫 Herramientas de desarrollo bloqueadas.");
                    blockAllDevTools(); 
                }
            }, 100);
        };
        detectDevToolsViaWindow();
    };

    
    const blockJavaScriptAPIs = () => {
        
        const createElement = document.createElement;
        document.createElement = function(tagName) {
            if (tagName.toLowerCase() === 'script') {
                throw "🚫 No puedes crear scripts.";
            }
            return createElement.call(document, tagName);
        };
    };

    
    const blockAllDevTools = () => {
        blockConsole();
        blockInspector();
        blockNetworkPanel();
        blockStoragePanel();
        blockCookies();
        blockPerformanceAndMemory();
        blockSourcesPanel();
        blockDOMChanges();
        blockDebugger();
        blockStyleEditor();
        blockAdvancedDevTools();
        blockJavaScriptAPIs();
    };

    
    detectDevTools();
    blockAllDevTools();
})();

(function() {
    let devToolsOpened = false;

    
    function detectDevTools() {
        const threshold = 160; 
        setInterval(() => {
            if (
                (window.outerWidth - window.innerWidth > threshold) || 
                (window.outerHeight - window.innerHeight > threshold)
            ) {
                if (!devToolsOpened) {
                    devToolsOpened = true;
                    console.log("🚨 DevTools detectado, bloqueando solicitudes.");
                    cacheRequests(); 
                }
            } else {
                devToolsOpened = false;
            }
        }, 1000);
    }

    
    function cacheRequests() {
        
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            if (devToolsOpened) {
                console.log(`Interceptada la petición a: ${input}`);
                
                return new Promise((resolve) => {
                    resolve(new Response("Datos cachéados (falsos)", {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                });
            } else {
                return originalFetch(input, init); 
            }
        };

        
        const originalXHR = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (devToolsOpened) {
                console.log(`Interceptada la petición XMLHttpRequest a: ${url}`);
                
                this.onload = function() {
                    this.responseText = "Datos cachéados (falsos)";
                    this.status = 200;
                    this.responseType = "text";
                    this.onload && this.onload();
                };
                this.onerror = function() {
                    this.status = 500;
                    this.statusText = "Error";
                };
            } else {
                originalXHR.apply(this, arguments); 
            }
        };
    }

    
    detectDevTools();
})();

(function() {
    
    function detectDevTools() {
        let devToolsOpen = false;
        let threshold = 160; 
        let checkInterval;

        
        function checkWindowSize() {
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                devToolsOpen = true;
            } else {
                devToolsOpen = false;
            }
        }

        
        function checkConsole() {
            const devToolsDetectionScript = `console.debug('test');`;
            setInterval(() => {
                try {
                    
                    if (console.debug.toString().indexOf('test') > -1) {
                        devToolsOpen = true;
                    }
                } catch (e) {}
            }, 100);
        }

        
        function detectDebugger() {
            setInterval(function() {
                debugger;
            }, 100);
        }

        
        checkInterval = setInterval(function() {
            checkWindowSize();
            checkConsole();
            detectDebugger();

            
            if (devToolsOpen) {
                document.documentElement.innerHTML = "Página protegida: Acceso denegado.";
                console.log("DevTools detectado, contenido oculto.");
                clearInterval(checkInterval); 
            }
        }, 100); 

    }

    
    detectDevTools();
})();

(function() {
    
    function fakeNetworkRequests() {
        const randomSites = [
            "https://jsonplaceholder.typicode.com/todos/1",
            "https://httpbin.org/get",
            "https://api.github.com/zen",
            "https://randomuser.me/api/"
        ];

        
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            const randomSite = randomSites[Math.floor(Math.random() * randomSites.length)];
            console.log(`Redirigiendo la solicitud a un sitio aleatorio: ${randomSite}`);
            return originalFetch(randomSite, init); 
        };

        
        const originalXHR = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            const randomSite = randomSites[Math.floor(Math.random() * randomSites.length)];
            console.log(`Redirigiendo la solicitud XMLHttpRequest a un sitio aleatorio: ${randomSite}`);
            arguments[1] = randomSite; 
            originalXHR.apply(this, arguments); 
        };
    }

    
    function obfuscateCode() {
        
        (function() {
            var _0xabc123 = function(_0xdef456) {
                return _0xdef456 * 2 + 10;
            };
            var _0x123abc = function(_0xdef456) {
                return _0xdef456 + 3;
            };
            _0xabc123(5);
            _0x123abc(10);
        })();

        
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            script.innerHTML = `// Código protegido por técnicas de ofuscación`;
        });
    }

    
    function reinforceProtection() {
        
        const devtoolsDetection = setInterval(() => {
            if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
                alert("¡Acceso a herramientas de desarrollo detectado!");
                location.reload(); 
            }
        }, 500);

        
        document.addEventListener('keydown', function(e) {
            if ((e.key === "F12") || (e.ctrlKey && e.shiftKey && e.key === "I")) {
                e.preventDefault();
                alert("¡Acceso a herramientas de desarrollo deshabilitado!");
            }
        });

        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            alert("¡El clic derecho está deshabilitado!");
        });
    }

    
    fakeNetworkRequests();  
    obfuscateCode();        
    reinforceProtection();   
})();

(function() {
    'use strict';

    
    const createFakeContent = () => {
        const randomString = () => Math.random().toString(36).substring(2);

        const fakeElements = [
            { tag: 'script', content: `console.log("${randomString()}");` },
            { tag: 'style', content: `body { background: ${randomString()}; }` },
            { tag: 'div', content: `<!-- Fake div content -->` },
            { tag: 'span', content: `<!-- Fake span content -->` },
            { tag: 'meta', content: `<!-- Fake meta content -->` },
            { tag: 'link', content: `<!-- Fake link content -->` },
        ];

        
        fakeElements.forEach(element => {
            const el = document.createElement(element.tag);
            el.innerHTML = element.content;
            el.style.display = 'none'; 
            el.style.visibility = 'hidden'; 
            document.head.appendChild(el); 
        });
    };

    
    const generateMaxFakeContentPerMillisecond = () => {
        const maxIterations = 100000000;  
        setInterval(() => {
            for (let i = 0; i < maxIterations; i++) {  
                createFakeContent();
            }
        }, 1); 
    };

    
    const preventPause = () => {
        
        let lastTime = Date.now();
        setInterval(function() {
            const currentTime = Date.now();
            if (currentTime - lastTime > 100) {
                
                preventPause();
                generateMaxFakeContentPerMillisecond();
            }
            lastTime = currentTime;
        }, 50);

        
        setTimeout(function() {
            setInterval(function() {
                preventPause();
            }, 100);
        }, 1000);

        
        try {
            (function() {
                while (true) {
                    
                    Math.random();
                }
            })();
        } catch (e) {
            
            preventPause();
        }
    };

    
    const preventDebugger = () => {
        
        Object.defineProperty(console, 'log', {
            value: function() {
                
                
                return arguments;
            },
            writable: true
        });

        
        setInterval(() => {
            if (typeof window.console.profiles === 'undefined') {
                return; 
            }
            const randomCheck = Math.random();
            if (randomCheck > 0.999) {
                
                window.console.log(randomCheck);
            }
        }, 100); 
    };

    
    const preventJavascriptDisabled = () => {
        if (!window.console) {
            
            alert("JavaScript está deshabilitado. Activarlo para acceder al contenido.");
            window.location.reload();
        }
    };

    
    window.addEventListener('load', () => {
        generateMaxFakeContentPerMillisecond();  
        preventPause();  
        preventDebugger();  
        preventJavascriptDisabled();  
    });

})();

(function() {
    let devtoolsOpen = false;

    
    function detectDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
            devtoolsOpen = true;
            handleDetection();
        }
    }

    function handleDetection() {
        console.clear();
        document.body.innerHTML = "<h1>Acceso Restringido</h1>";
        setTimeout(() => {
            location.href = "about:blank";
        }, 500);
    }

    
    setInterval(() => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 250) {
            handleDetection();
        }
    }, 1000);

    
    (function() {
        const methods = ["log", "warn", "error", "info", "debug", "table", "trace"];
        methods.forEach(method => {
            console[method] = function() {
                handleDetection();
            };
        });
    })();

    
    document.addEventListener("keydown", event => {
        if (
            event.key === "F12" ||
            (event.ctrlKey && event.shiftKey && event.key === "I") ||
            (event.ctrlKey && event.shiftKey && event.key === "J") ||
            (event.ctrlKey && event.key === "U") ||
            (event.metaKey && event.altKey && event.key === "I")  
        ) {
            event.preventDefault();
            handleDetection();
        }
    });

    
    document.addEventListener("contextmenu", event => event.preventDefault());

    
    setInterval(detectDevTools, 1000);

    
    Object.defineProperty(window, "devtools", {
        get: function() {
            handleDetection();
            return true;
        }
    });

    
    const scriptElements = document.getElementsByTagName("script");
    for (let script of scriptElements) {
        if (script.src.includes("sourceMappingURL")) {
            script.parentNode.removeChild(script);
        }
    }

})();

(function () {
    'use strict';
  
    
    const bloquearSourceMaps = (url) => url && url.endsWith('.map');
  
    
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      if (bloquearSourceMaps(args[0])) {
        console.warn('🔒 Intento de carga de Source Map bloqueado:', args[0]);
        return Promise.reject(new Error('Source Maps están bloqueados'));
      }
      return originalFetch.apply(this, args);
    };
  
    
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      if (bloquearSourceMaps(url)) {
        console.warn('🔒 Intento de carga de Source Map bloqueado:', url);
        this.abort();
      } else {
        originalOpen.apply(this, [method, url, ...rest]);
      }
    };
  
    
    window.addEventListener('error', function (event) {
      if (event.filename && bloquearSourceMaps(event.filename)) {
        event.preventDefault();
        console.warn('🔒 Intento de carga de Source Map bloqueado:', event.filename);
      }
    }, true);
  
    
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('script').forEach(script => {
        if (script.innerHTML.includes('sourceMappingURL')) {
          script.innerHTML = script.innerHTML.replace(/\/\/# sourceMappingURL=.*/g, '');
          console.warn('🔒 Referencia a Source Map eliminada en script.');
        }
      });
    });
  
    console.log('%c 🔥 Protección contra Source Maps activada 🔥', 'color: red; font-weight: bold; font-size: 16px;');
  
  })();

(function() {
    window.onload = function() {
        let devToolsOpen = false;

        function detectDevTools() {
            const threshold = window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160;
            
            if (threshold && !devToolsOpen) {
                devToolsOpen = true;
                ocultarTodo();
                borrarTodo();
                ocultarFuentes();
            }
        }

        function ocultarTodo() {
            requestAnimationFrame(() => {
                document.documentElement.innerHTML = '';
                document.documentElement.style.display = 'none';
                document.body.innerHTML = '';
                document.body.style.display = 'none';
                
                [...document.styleSheets].forEach(sheet => {
                    try { sheet.disabled = true; } catch (e) {}
                });
                
                [...document.querySelectorAll('*')].forEach(el => el.remove());
            });
            
            if (window.XMLHttpRequest) {
                window.XMLHttpRequest.prototype.open = function() { throw new Error('Bloqueado'); };
            }
            if (window.fetch) {
                window.fetch = function() { return new Promise(() => {}); };
            }
            if (window.WebSocket) {
                window.WebSocket.prototype.send = function() { throw new Error('WebSocket bloqueado'); };
            }
        }

        function borrarTodo() {
            requestAnimationFrame(() => {
                document.documentElement.innerHTML = '';
                document.body.innerHTML = '';
                document.head.innerHTML = '';
                
                while (document.firstChild) {
                    document.removeChild(document.firstChild);
                }
                
                [...document.scripts].forEach(script => script.remove());
                [...document.images].forEach(img => img.remove());
                [...document.styleSheets].forEach(sheet => {
                    try { sheet.ownerNode.remove(); } catch (e) {}
                });
                
                document.head.remove();
                document.documentElement.remove();
                
                for (let prop in window) {
                    if (window.hasOwnProperty(prop)) {
                        try {
                            Object.defineProperty(window, prop, { get: () => undefined, set: () => {} });
                        } catch (e) {}
                    }
                }
                
                try {
                    if (window.gc) { window.gc(); }
                } catch (e) {}
                
                ['querySelector', 'querySelectorAll', 'getElementById', 'getElementsByClassName', 'getElementsByTagName'].forEach(fn => {
                    document[fn] = function() { return null; };
                });
                
                Object.freeze(document);
            });
        }

        function ocultarFuentes() {
            if (document.createElement) {
                let style = document.createElement('style');
                style.innerHTML = '* { display: none !important; visibility: hidden !important; }';
                document.head.appendChild(style);
            }
        }

        setInterval(detectDevTools, 5);

        Object.defineProperty(console, '_commandLineAPI', {
            get: function() {
                ocultarTodo();
                borrarTodo();
                ocultarFuentes();
                throw new Error('No puedes inspeccionar esta web.');
            }
        });
        
        window.eval = function() {
            throw new Error('Eval está bloqueado por seguridad.');
        };
        
        (function() {
            const obfuscateFunction = func => function() {
                return func.apply(this, arguments);
            };

            ['setTimeout', 'setInterval', 'requestAnimationFrame'].forEach(fn => {
                window[fn] = obfuscateFunction(window[fn]);
            });

            ['log', 'error', 'warn', 'info', 'debug'].forEach(fn => {
                console[fn] = () => {};
            });
        })();

        (function() {
            const noise = new Uint8Array(256);
            window.crypto.getRandomValues(noise);
            const hiddenFunction = new Function(noise.join(',').replace(/,/g, '+'));
            hiddenFunction();
        })();

        (function() {
            Error.prepareStackTrace = function() { return ''; };
        })();
    };
})();

window.onload = () => {
    (() => {
        function ocultarLlamada(fn) {
            return function() {
                return (function() {
                    return (new Function('return (' + fn.toString() + ').apply(this, arguments)'))().apply(this, arguments);
                })();
            };
        }

        window.eval = ocultarLlamada(window.eval);
        window.setTimeout = ocultarLlamada(window.setTimeout);
        window.setInterval = ocultarLlamada(window.setInterval);
        window.fetch = ocultarLlamada(window.fetch);
        window.XMLHttpRequest = function() {
            const xhr = new (Function.prototype.bind.apply(XMLHttpRequest, arguments))();
            ['open', 'send', 'setRequestHeader'].forEach(method => {
                xhr[method] = ocultarLlamada(xhr[method]);
            });
            return xhr;
        };
        window.console.log = ocultarLlamada(window.console.log);
        window.console.error = ocultarLlamada(window.console.error);
        window.console.warn = ocultarLlamada(window.console.warn);
        window.alert = ocultarLlamada(window.alert);
        window.confirm = ocultarLlamada(window.confirm);
        window.prompt = ocultarLlamada(window.prompt);
        window.location.reload = ocultarLlamada(window.location.reload);
        document.addEventListener = ocultarLlamada(document.addEventListener);
        document.removeEventListener = ocultarLlamada(document.removeEventListener);

        for (let key in window) {
            if (typeof window[key] === 'function') {
                try {
                    window[key] = ocultarLlamada(window[key]);
                } catch (e) {}
            }
        }

        [Object.prototype, Function.prototype, XMLHttpRequest.prototype, console, document, window].forEach(proto => {
            for (let key in proto) {
                if (typeof proto[key] === 'function') {
                    try {
                        proto[key] = ocultarLlamada(proto[key]);
                    } catch (e) {}
                }
            }
        });

        ['setTimeout', 'setInterval', 'requestAnimationFrame'].forEach(fn => {
            if (typeof window[fn] === 'function') {
                window[fn] = ocultarLlamada(window[fn]);
            }
        });

        window.XMLHttpRequest = function() {
            const xhr = new (Function.prototype.bind.apply(XMLHttpRequest, arguments))();
            ['open', 'send', 'setRequestHeader'].forEach(method => {
                xhr[method] = ocultarLlamada(xhr[method]);
            });
            return xhr;
        };
        window.fetch = ocultarLlamada(window.fetch);

        Object.defineProperty(Error.prototype, 'stack', {
            get: function() {
                return 'Error: stack trace hidden';
            }
        });

        Function.prototype.toString = ocultarLlamada(Function.prototype.toString);
    })();
};

window.onload = function() {
    const forceRedirect = () => {
        
        window.location.replace('about:blank'); 
    };

    const detectDevTools = () => {
        const start = performance.now();

        
        const element = new Image();

        
        Object.defineProperty(element, 'id', {
            get: function() {
                
                window.location.replace('about:blank'); 
                setTimeout(forceRedirect, 100); 
            }
        });

        
        console.log(element);

        
        const end = performance.now();

        
        if (end - start > 50) { 
            window.location.replace('about:blank'); 
            setTimeout(forceRedirect, 100); 
        }

        
        const detectObjectPrototypeTampering = () => {
            const originalToString = Object.prototype.toString;
            const originalHasOwnProperty = Object.prototype.hasOwnProperty;
            const originalValueOf = Object.prototype.valueOf;

            
            Object.prototype.toString = function() {
                if (this === detectObjectPrototypeTampering) {
                    return originalToString.apply(this);
                }
                
                window.location.replace('about:blank');
                setTimeout(forceRedirect, 100);
                return originalToString.apply(this);
            };

            
            Object.prototype.hasOwnProperty = function() {
                if (this === detectObjectPrototypeTampering) {
                    return originalHasOwnProperty.apply(this);
                }
                
                window.location.replace('about:blank');
                setTimeout(forceRedirect, 100);
                return originalHasOwnProperty.apply(this);
            };

            
            Object.prototype.valueOf = function() {
                if (this === detectObjectPrototypeTampering) {
                    return originalValueOf.apply(this);
                }
                
                window.location.replace('about:blank');
                setTimeout(forceRedirect, 100);
                return originalValueOf.apply(this);
            };
        };

        detectObjectPrototypeTampering();

        
        const interceptStorage = () => {
            
            const originalSetItemLocalStorage = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                console.log(`Se intentó modificar localStorage: ${key} = ${value}`);
                window.location.replace('about:blank'); 
                setTimeout(forceRedirect, 100);
                return originalSetItemLocalStorage.apply(this, arguments);
            };

            
            const originalSetItemSessionStorage = sessionStorage.setItem;
            sessionStorage.setItem = function(key, value) {
                console.log(`Se intentó modificar sessionStorage: ${key} = ${value}`);
                window.location.replace('about:blank'); 
                setTimeout(forceRedirect, 100);
                return originalSetItemSessionStorage.apply(this, arguments);
            };

            
            const originalGetItemLocalStorage = localStorage.getItem;
            localStorage.getItem = function(key) {
                const value = originalGetItemLocalStorage.apply(this, arguments);
                console.log(`Acceso a localStorage: ${key} = ${value}`);
                return value;
            };

            
            const originalGetItemSessionStorage = sessionStorage.getItem;
            sessionStorage.getItem = function(key) {
                const value = originalGetItemSessionStorage.apply(this, arguments);
                console.log(`Acceso a sessionStorage: ${key} = ${value}`);
                return value;
            };

            
            const originalRemoveItemLocalStorage = localStorage.removeItem;
            localStorage.removeItem = function(key) {
                console.log(`Se intentó eliminar de localStorage: ${key}`);
                window.location.replace('about:blank'); 
                setTimeout(forceRedirect, 100);
                return originalRemoveItemLocalStorage.apply(this, arguments);
            };

            
            const originalRemoveItemSessionStorage = sessionStorage.removeItem;
            sessionStorage.removeItem = function(key) {
                console.log(`Se intentó eliminar de sessionStorage: ${key}`);
                window.location.replace('about:blank'); 
                setTimeout(forceRedirect, 100);
                return originalRemoveItemSessionStorage.apply(this, arguments);
            };
        };

        interceptStorage();

        
        const detectDocumentTampering = () => {
            const originalGetElementById = document.getElementById;
            const originalGetElementsByClassName = document.getElementsByClassName;
            const originalGetElementsByTagName = document.getElementsByTagName;

            
            document.getElementById = function(id) {
                
                const result = originalGetElementById.apply(document, arguments);
                if (result) {
                    result.dataset.safeChange = true;
                }
                return result;
            };

            
            document.getElementsByClassName = function(className) {
                const result = originalGetElementsByClassName.apply(document, arguments);
                if (result) {
                    Array.from(result).forEach(element => element.dataset.safeChange = true);
                }
                return result;
            };

            
            document.getElementsByTagName = function(tagName) {
                const result = originalGetElementsByTagName.apply(document, arguments);
                if (result) {
                    Array.from(result).forEach(element => element.dataset.safeChange = true);
                }
                return result;
            };
        };

        detectDocumentTampering();
    };

    
    detectDevTools();
};

(function () {
  const fakeTag = () => 'eto-' + Math.random().toString(36).substr(2, 10);
  const excludedTags = ['html', 'head', 'meta', 'title', 'link', 'script', 'noscript'];
  const WRAP_LAYERS = 876;

  
  function wrapElementInLayers(originalNode) {
    const topLayer = document.createElement(fakeTag());
    let current = topLayer;

    for (let i = 1; i < WRAP_LAYERS; i++) {
      const nextLayer = document.createElement(fakeTag());
      current.appendChild(nextLayer);
      current = nextLayer;
    }

    current.appendChild(originalNode);
    return topLayer;
  }

  function obfuscateAllElements() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (excludedTags.includes(node.tagName.toLowerCase())) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    let current;
    while ((current = walker.nextNode())) {
      nodes.push(current);
    }

    
    nodes.forEach(node => {
      if (node.parentNode) {
        const clone = node.cloneNode(true); 
        const wrapped = wrapElementInLayers(clone);
        node.replaceWith(wrapped);
      }
    });
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', obfuscateAllElements);
  } else {
    obfuscateAllElements();
  }
})();

(function() {
    
    function isDevToolsOpen() {
        let devtools = false;
        const element = new Image();
        element.__defineGetter__('id', function() {
            devtools = true;
        });
        console.log(element);
        return devtools;
    }

    
    function hideSources() {
        const originalConsoleLog = console.log;
        console.log = function(message) {
            if (!isDevToolsOpen()) {
                originalConsoleLog(message);
            } else {
                originalConsoleLog('%cAcceso restringido', 'color: red; font-size: 16px;');
            }
        };
        Object.defineProperty(document, 'documentElement', {
            get: function() {
                if (isDevToolsOpen()) {
                    throw new Error('Acceso restringido a las fuentes.');
                }
                return document.documentElement;
            }
        });
    }

    
    function disableXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            if (isDevToolsOpen()) {
                console.warn('Solicitudes XHR desactivadas.');
                return;
            }
            return originalOpen.apply(this, arguments);
        };
    }

    
    function preventCopyPaste() {
        document.addEventListener('copy', function(e) {
            e.preventDefault();
            alert('La acción de copiar está deshabilitada en esta página.');
        });
        document.addEventListener('paste', function(e) {
            e.preventDefault();
            alert('La acción de pegar está deshabilitada en esta página.');
        });
    }

    
    hideSources();
    disableXHR();
    preventCopyPaste();

    
    const checkDevTools = setInterval(function() {
        if (isDevToolsOpen()) {
            console.warn('%cSe ha detectado que DevTools está abierto.', 'color: orange; font-size: 14px;');
        }
    }, 1000);
})();


function detectDevTools() {
    const threshold = 160; 
    let devToolsOpen = false;

    
    if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
    ) {
        devToolsOpen = true;
    }

    
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function () {
            devToolsOpen = true;
        }
    });
    console.log('%c', element); 

    return devToolsOpen;
}


function hideSources() {
    const originalConsoleLog = console.log;

    
    console.log = function (...args) {
        if (!detectDevTools()) {
            originalConsoleLog.apply(console, args);
        } else {
            originalConsoleLog('%cFuentes ocultas', 'color: red; font-size: 14px;');
        }
    };

    
    Object.defineProperty(document, 'currentScript', {
        get: function () {
            return null; 
        }
    });
}


function disableXHRWhenDevToolsOpen() {
    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (...args) {
        if (!detectDevTools()) {
            return originalOpen.apply(this, args);
        } else {
            console.warn('%cSolicitudes XHR bloqueadas debido a DevTools', 'color: orange; font-size: 14px;');
        }
    };
}


(function () {
    hideSources(); 
    disableXHRWhenDevToolsOpen(); 

    
    setInterval(() => {
        if (detectDevTools()) {
            console.warn('%cSe ha detectado que DevTools está abierto.', 'color: orange; font-size: 14px;');
        }
    }, 1000); 
})();


function detectDevTools() {
    let devToolsOpen = false;

    
    const threshold = 160;
    if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
    ) {
        devToolsOpen = true;
    }

    
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function () {
            devToolsOpen = true;
        }
    });
    console.log('%c', element); 

    return devToolsOpen;
}


function forceDebuggerPause() {
    if (detectDevTools()) {
        console.warn('%cDepurador detectado. Pausando ejecución...', 'color: red; font-size: 16px;');
        while (true) {
            debugger; 
        }
    }
}


(function () {
    setInterval(() => {
        if (detectDevTools()) {
            forceDebuggerPause();
        }
    }, 500); 
})();


function detectDevTools() {
    let devToolsOpen = false;

    
    const threshold = 160;
    if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
    ) {
        devToolsOpen = true;
    }

    
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function () {
            devToolsOpen = true;
        }
    });
    console.log('%c', element);

    return devToolsOpen;
}


function blockDevTools() {
    if (detectDevTools()) {
        console.warn('%cAcceso restringido: DevTools detectado.', 'color: red; font-size: 16px;');
        
        
        alert("Se ha detectado que estás utilizando herramientas de desarrollo. Algunas funcionalidades pueden estar limitadas.");
        
        
        
    }
}


(function monitorDevTools() {
    const interval = setInterval(() => {
        if (detectDevTools()) {
            blockDevTools();
            clearInterval(interval); 
        }
    }, 500);
})();

(function () {
    
    
    function randomizeScripts() {
        let elements = document.querySelectorAll('script');
        elements.forEach((script) => {
            script.type = 'text/javascript';
        });
    }

    
    window.onload = randomizeScripts;
})();


(function () {
    
    Object.defineProperty(document, 'cookie', {
      get: function () {
        return '';
      },
      set: function () {
        console.warn('Intento de manipulación de cookies bloqueado.');
      },
    });
  
    
    (function () {
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function () {
        console.warn('Peticiones XMLHttpRequest están deshabilitadas.');
        this.abort();
      };
    })();
  
    
    (function () {
      const originalFetch = window.fetch;
      window.fetch = function () {
        console.warn('Peticiones fetch están deshabilitadas.');
        return Promise.reject('Fetch deshabilitado.');
      };
    })();
  
    
    (function () {
      Object.defineProperty(window, 'document', {
        get: function () {
          console.warn('Acceso al DOM deshabilitado.');
          return null;
        },
      });
  
      Object.defineProperty(Element.prototype, 'innerHTML', {
        get: function () {
          console.warn('Acceso a innerHTML deshabilitado.');
          return '';
        },
        set: function () {
          console.warn('Modificación de innerHTML bloqueada.');
        },
      });
  
      Object.defineProperty(Element.prototype, 'outerHTML', {
        get: function () {
          console.warn('Acceso a outerHTML deshabilitado.');
          return '';
        },
        set: function () {
          console.warn('Modificación de outerHTML bloqueada.');
        },
      });
  
      Object.defineProperty(document, 'body', {
        get: function () {
          console.warn('Acceso al body deshabilitado.');
          return null;
        },
      });
  
      Object.defineProperty(document, 'head', {
        get: function () {
          console.warn('Acceso al head deshabilitado.');
          return null;
        },
      });
  
      
      Object.defineProperty(window, 'frames', {
        get: function () {
          console.warn('Acceso a frames deshabilitado.');
          return null;
        },
      });
  
      Object.defineProperty(window, 'localStorage', {
        get: function () {
          console.warn('Acceso a localStorage deshabilitado.');
          return null;
        },
      });
  
      Object.defineProperty(window, 'sessionStorage', {
        get: function () {
          console.warn('Acceso a sessionStorage deshabilitado.');
          return null;
        },
      });
    })();
  
    
    const disableDevTools = () => {
      const noop = () => undefined;
      const consoleMethods = ['log', 'warn', 'error', 'info', 'debug', 'table', 'dir'];
  
      for (const method of consoleMethods) {
        console[method] = noop;
      }
  
      Object.defineProperty(window, 'devtools', {
        get: () => true,
        set: noop,
      });
    };
  
    
    const detectDevTools = () => {
      const devtoolsElement = new Image();
      Object.defineProperty(devtoolsElement, 'id', {
        get: () => {
          throw new Error('DevTools detectado.');
        },
      });
  
      try {
        console.log(devtoolsElement);
      } catch (e) {
        setTimeout(() => {
          console.clear();
          location.reload();
        }, 100);
      }
    };
  
    
    Object.freeze(window);
    Object.freeze(document);
  
    
    (function () {
      const blockOverride = (obj, prop) => {
        if (obj && obj[prop]) {
          try {
            Object.defineProperty(obj, prop, {
              configurable: false,
              writable: false,
            });
          } catch (e) {
            console.warn(`No se pudo proteger ${prop}`);
          }
        }
      };
  
      blockOverride(window, 'alert');
      blockOverride(window, 'confirm');
      blockOverride(window, 'prompt');
      blockOverride(window, 'open');
      blockOverride(document, 'write');
      blockOverride(document, 'writeln');
    })();
  
    
    disableDevTools();
    setInterval(detectDevTools, 500);
  })();

  (function () {
    
    function isDevToolsOpen() {
        let devtools = false;
        const element = new Image();
        element.__defineGetter__('id', function () {
            devtools = true;
        });
        console.log(element);
        return devtools;
    }

    
    function showDevToolsWarning() {
        if (isDevToolsOpen()) {
            setTimeout(function () {
                console.clear(); 
                
                console.log("%c⚠️ ¡Por favor, no intentes copiar mi web! ⚠️", "color: red; font-size: 18px; font-weight: bold;");
                console.log("%cSi realmente deseas una página como esta, ¡pídeme ayuda y estaré encantado de enseñarte a crearla! 🙏", "color: blue; font-size: 16px;");
                console.log("%cNo intentes copiar mi trabajo sin entenderlo. ¡Podrías tener problemas y no saldrá como esperas! 😔", "color: orange; font-size: 16px;");
                console.log("%cSi estás buscando aprender, ¡estoy aquí para ayudarte! No copies, mejor aprende y crece. 🌱", "color: green; font-size: 16px;");
                console.log("%cRecuerda, la copia no te enseñará nada. ¡Aprende y crea por ti mismo! 🎓", "color: purple; font-size: 16px;");
                console.log("%c¡Gracias por tu comprensión y respeto! 😄", "color: teal; font-size: 16px;");
            }, 500); 
        }
    }

    
    function hideSources() {
        if (isDevToolsOpen()) {
            
            const originalConsoleLog = console.log;
            console.log = function () {}; 
            showDevToolsWarning(); 
        }
    }

    hideSources(); 
})();


(function () {
  
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    console.error('Bloqueo total: Las solicitudes XMLHttpRequest están deshabilitadas.');
    throw new Error('XMLHttpRequest bloqueado.');
  };

  
  const originalFetch = window.fetch;
  window.fetch = function () {
    console.error('Bloqueo total: Las solicitudes fetch están deshabilitadas.');
    return Promise.reject(new Error('Fetch bloqueado.'));
  };

  
  window.XMLHttpRequest = function () {
    console.error('Bloqueo total: No se pueden crear nuevas instancias de XMLHttpRequest.');
    throw new Error('Creación de XMLHttpRequest bloqueada.');
  };

  console.log('Todas las solicitudes XMLHttpRequest y fetch están completamente bloqueadas.');
})();

(function () {
  
  const hideSensitiveContent = () => {
      const sensitiveElements = document.querySelectorAll('.center.content, .navbar-ul, .loading-message');
      sensitiveElements.forEach((el) => {
          el.style.display = 'none'; 
          el.innerHTML = ''; 
      });
  };

  
  const removeFromDOM = () => {
      const sensitiveElements = document.querySelectorAll('.center.content, .navbar-ul, .loading-message');
      sensitiveElements.forEach((el) => el.remove()); 
  };

  
  const detectDevTools = () => {
      let devtoolsOpen = false;

      const devtoolsDetector = () => {
          if (devtoolsOpen) {
              hideSensitiveContent(); 
          }
      };

      const interval = setInterval(() => {
          const widthThreshold = window.outerWidth - window.innerWidth > 100;
          const heightThreshold = window.outerHeight - window.innerHeight > 100;
          devtoolsOpen = widthThreshold || heightThreshold;
          devtoolsDetector();
      }, 500);
  };

  
  window.onload = () => {
      hideSensitiveContent(); 
      detectDevTools(); 
  };
})();

(function () {
  let devtoolsOpen = false;

  
  const detectDevTools = () => {
      const threshold = 160; 
      return (
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold
      );
  };

  
  const obfuscateDOM = () => {
      const elements = document.body.children;
      for (let i = 0; i < elements.length; i++) {
          
          elements[i].style.visibility = 'hidden'; 
          elements[i].innerHTML = ''; 
      }
      console.warn('El contenido ha sido ofuscado debido a la detección de DevTools.');
  };

  
  const restoreDOM = () => {
      const elements = document.body.children;
      for (let i = 0; i < elements.length; i++) {
          elements[i].style.visibility = 'visible'; 
          
      }
      console.log('El contenido ha sido restaurado después de cerrar DevTools.');
  };

  
  const obfuscateResources = () => {
      const scripts = document.querySelectorAll('script');
      const styles = document.querySelectorAll('link[rel="stylesheet"]');
      const images = document.querySelectorAll('img');

      
      scripts.forEach((script) => {
          script.type = 'text/plain'; 
          script.innerHTML = ''; 
      });

      
      styles.forEach((style) => {
          style.disabled = true; 
      });

      
      images.forEach((img) => {
          img.src = ''; 
      });

      console.warn('Los recursos de la web han sido ofuscados.');
  };

  
  const restoreResources = () => {
      const scripts = document.querySelectorAll('script');
      const styles = document.querySelectorAll('link[rel="stylesheet"]');
      const images = document.querySelectorAll('img');

      
      location.reload(); 

      
      styles.forEach((style) => {
          style.disabled = false;
      });

      console.log('Los recursos han sido restaurados.');
  };

  
  document.addEventListener('contextmenu', (e) => {
      e.preventDefault(); 
      console.warn('El clic derecho está deshabilitado.');
  });

  document.addEventListener('keydown', (e) => {
      if (
          (e.ctrlKey && e.shiftKey && e.key === 'I') || 
          (e.ctrlKey && e.shiftKey && e.key === 'J') || 
          (e.ctrlKey && e.key === 'U') || 
          (e.key === 'F12') 
      ) {
          e.preventDefault();
          console.warn('El uso de atajos está deshabilitado.');
      }
  });

  
  const monitorDevTools = () => {
      setInterval(() => {
          const isDevToolsNowOpen = detectDevTools();
          if (isDevToolsNowOpen && !devtoolsOpen) {
              devtoolsOpen = true;
              obfuscateDOM(); 
              obfuscateResources(); 
          } else if (!isDevToolsNowOpen && devtoolsOpen) {
              devtoolsOpen = false;
              restoreDOM(); 
              restoreResources(); 
          }
      }, 500); 
  };

  
  monitorDevTools();
})();

(function () {
  let devtoolsOpen = false;

  
  const detectDevTools = () => {
      const threshold = 160; 
      const isOpen =
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold;
      return isOpen;
  };

  
  const freezeDevTools = () => {
      if (devtoolsOpen) {
          
          while (true) {}
      }
  };

  
  const checkDevTools = () => {
      setInterval(() => {
          const isDevToolsNowOpen = detectDevTools();
          if (isDevToolsNowOpen && !devtoolsOpen) {
              devtoolsOpen = true;
              console.warn('Se ha detectado el inspector de DevTools. Congelando...');
              freezeDevTools(); 
          } else if (!isDevToolsNowOpen && devtoolsOpen) {
              devtoolsOpen = false;
              console.log('El inspector de DevTools se cerró.');
          }
      }, 500); 
  };

  
  checkDevTools();
})();

(function () {
  let devtoolsOpen = false;

  
  const detectDevTools = () => {
      const threshold = 160; 
      return (
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold
      );
  };

  
  const obfuscateEverything = () => {
      const body = document.body;

      
      body.innerHTML = ''; 
      body.style.visibility = 'hidden'; 
      console.warn('Se ha ofuscado el HTML.');

      
      const scripts = document.querySelectorAll('script');
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      const images = document.querySelectorAll('img');

      
      scripts.forEach((script) => {
          script.type = 'text/plain'; 
          script.innerHTML = ''; 
      });

      
      links.forEach((link) => {
          link.href = ''; 
          link.disabled = true; 
      });

      
      images.forEach((img) => {
          img.src = ''; 
      });

      console.warn('Todos los recursos de la web han sido ofuscados.');
  };

  
  const restoreEverything = () => {
      
      location.reload();
  };

  
  const monitorDevTools = () => {
      setInterval(() => {
          const isDevToolsNowOpen = detectDevTools();
          if (isDevToolsNowOpen && !devtoolsOpen) {
              devtoolsOpen = true;
              obfuscateEverything(); 
          } else if (!isDevToolsNowOpen && devtoolsOpen) {
              devtoolsOpen = false;
              restoreEverything(); 
          }
      }, 500); 
  };

  
  document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      console.warn('El clic derecho está deshabilitado.');
  });

  document.addEventListener('keydown', (e) => {
      if (
          (e.ctrlKey && e.shiftKey && e.key === 'I') || 
          (e.ctrlKey && e.shiftKey && e.key === 'J') || 
          (e.ctrlKey && e.key === 'U') || 
          (e.key === 'F12') 
      ) {
          e.preventDefault();
          console.warn('El uso de atajos está deshabilitado.');
      }
  });

  
  monitorDevTools();
})();

function secret(){
    console.log("No copies mi código!");
  }

  (function() {
    let devtoolsOpen = false;
    let detectDevTools = false;
  
    const checkDevTools = () => {
      const start = new Date().getTime();
      debugger;  
      const end = new Date().getTime();
  
      
      if (end - start > 100) {
        devtoolsOpen = true;
      } else {
        devtoolsOpen = false;
      }
    };
  
    const detectViewport = () => {
      const threshold = 100;
      const width = window.outerWidth - window.innerWidth > threshold;
      const height = window.outerHeight - window.innerHeight > threshold;
      return width || height;
    };
  
    const handleDevToolsDetection = () => {
      if (devtoolsOpen || detectViewport()) {
        
        if (!detectDevTools) {
          detectDevTools = true;
          window.location.href = "about:blank";  
        }
      } else {
        detectDevTools = false;
      }
    };
  
    setInterval(() => {
      checkDevTools();
      handleDevToolsDetection();
    }, 500);  
  })();
  
  (function() {
    const originalConsoleLog = console.log;
    console.log = function() {
      if (arguments[0] && typeof arguments[0] === "string" && arguments[0].includes("<!--")) {
        return;
      }
      originalConsoleLog.apply(console, arguments);
    };
  })();

  (function() {
    if (window.console && console.log) {
      const originalConsole = console.log;
      console.log = function(message) {
        if (typeof message === 'string' && message.includes("developer")) {
          return;
        }
        originalConsole(message);
      };
    }
  })();

  const originalSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name, value) {
  if (name === "src" || name === "href") {
    alert("¡Intento de manipulación de recursos detectado!");
    return;
  }
  originalSetAttribute.apply(this, arguments);
};

document.addEventListener('dragstart', function(event) {
    event.preventDefault();
    alert('¡Arrastrar y soltar está deshabilitado!');
  });

  (function() {
    const originalConsole = console.log;
    console.log = function() {
      
      alert("¡No puedes usar la consola!");
    };
  })();
  
  document.addEventListener("keydown", function(event) {
    if (event.key === "PrintScreen") {
      event.preventDefault(); 
      alert("¡Captura de pantalla bloqueada!");
    }
  });
  
  (function() {
    if (window.location.href.startsWith("view-source:")) {
      alert('¡No puedes ver el código fuente!');
      window.location.href = "about:blank"; 
    }
  })();

  Object.defineProperty(document, 'write', {
    configurable: false,
    enumerable: false,
    writable: false
  });
  
  document.addEventListener("error", function(event) {
    if (event.target instanceof HTMLScriptElement) {
      console.log("Un script no autorizado fue bloqueado.");
      event.preventDefault();
    }
  }, true);
  
  (function() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isBot = /bot|crawler|spider|robot|crawling/i.test(userAgent);
    
    if (isBot) {
      window.location.href = "about:blank"; 
    }
  })();

  Object.defineProperty(window, 'document', {
    get: function() {
      alert('¡Acceso denegado al DOM!');
      return null;
    }
  });
  
  (function() {
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
      if (name === "style") {
        alert("¡Modificación de estilos CSS bloqueada!");
        return;
      }
      originalSetAttribute.apply(this, arguments);
    };
  })();
  
  (function() {
    const isScrapingRequest = navigator.connection && navigator.connection.effectiveType === '2g';
    
    if (isScrapingRequest) {
      window.location.href = "about:blank"; 
    }
  })();
  
  (function() {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if (key === "sensitiveData") {
        alert("¡No puedes modificar localStorage!");
        return;
      }
      originalSetItem.apply(this, arguments);
    };
  })();
  
  (function() {
    let isDevToolsOpen = false;
    const checkDevTools = () => {
      const width = window.outerWidth - window.innerWidth > 100;
      const height = window.outerHeight - window.innerHeight > 100;
      if (width || height) {
        isDevToolsOpen = true;
      }
      if (isDevToolsOpen) {
        document.body.style.pointerEvents = "none"; 
      } else {
        document.body.style.pointerEvents = "auto"; 
      }
    };
  
    setInterval(checkDevTools, 1000);
  })();
  
  (function() {
    const originalEval = window.eval;
    window.eval = function() {
      alert("¡No se puede ejecutar código eval desde el navegador!");
    };
  })();
  
  (function() {
    let devtools = false;
    const checkDevTools = () => {
      const threshold = 200;
      const width = window.outerWidth - window.innerWidth > threshold;
      const height = window.outerHeight - window.innerHeight > threshold;
  
      if (width || height) {
        devtools = true;
      }
  
      if (devtools) {
        Object.freeze(document.body); 
      } else {
        Object.preventExtensions(document.body); 
      }
    };
  
    setInterval(checkDevTools, 1000);
  })();
  
  (function() {
    const originalSetStyle = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, "setProperty");
    
    Object.defineProperty(CSSStyleDeclaration.prototype, "setProperty", {
      value: function(name, value) {
        alert("¡Modificación de estilos bloqueada!");
        return originalSetStyle.value.apply(this, arguments);
      }
    });
  })();
  
  (function() {
    const originalCreateElement = document.createElement;
  
    document.createElement = function(tagName) {
      if (tagName.toLowerCase() === 'script') {
        alert('¡Intento de carga de script externo bloqueado!');
        return null;
      }
      return originalCreateElement.apply(this, arguments);
    };
  })();
  
  (function() {
    if (typeof SharedWorker !== 'undefined') {
      alert("¡No se permite el uso de SharedWorkers!");
      return;
    }
  })();
  
  (function() {
    Object.freeze(window); 
    Object.freeze(document); 
  })();
  
  (function() {
    const originalXHR = XMLHttpRequest;
    
    XMLHttpRequest = function() {
      alert("¡Inyección de solicitudes HTTP bloqueada!");
      return null;
    };
  })();
  
  (function() {
    const originalWindowOpen = window.open;
  
    window.open = function() {
      alert('¡Se ha bloqueado la apertura de nuevas ventanas emergentes!');
      return null;
    };
  })();
  
  (function() {
    const start = Date.now();
    setInterval(function() {
      const diff = Date.now() - start;
      if (diff > 100) {
        alert("¡Depurador detectado! La página será redirigida.");
        window.location.href = "about:blank"; 
      }
    }, 1000);
  })();
  
  (function() {
    const blockedFunctions = ['eval', 'setTimeout', 'setInterval'];
  
    blockedFunctions.forEach(funcName => {
      const originalFunction = window[funcName];
      window[funcName] = function() {
        alert(`¡La función ${funcName} está bloqueada!`);
        return null;
      };
    });
  })();
  
  (function() {
    const originalFetch = window.fetch;
    
    window.fetch = function() {
      alert('¡Acceso bloqueado a la API!');
      return Promise.reject("Acceso denegado a fetch()");
    };
  })();
  
  (function() {
    let devtoolsOpen = false;
    
    const checkDevTools = () => {
      const threshold = 200;
      const width = window.outerWidth - window.innerWidth > threshold;
      const height = window.outerHeight - window.innerHeight > threshold;
      
      if (width || height) {
        devtoolsOpen = true;
      }
      
      if (devtoolsOpen) {
        window.console = { log: () => {} }; 
      }
    };
  
    setInterval(checkDevTools, 1000);
  })();

  (function() {
    const originalPrint = window.print;
    window.print = function() {
      alert('¡Impresión de la página bloqueada!');
    };
  })();
  
  (function() {
    document.addEventListener("contextmenu", function(event) {
      event.preventDefault();
      alert("¡La opción de guardar el archivo está bloqueada!");
    });
  })();
  
  document.addEventListener("copy", function(event) {
    event.preventDefault();
    alert("¡La copia de contenido está deshabilitada!");
  });
  
  (function() {
    document.querySelectorAll('img').forEach(img => {
      img.style.visibility = "hidden"; 
    });
  })();

  (function() {
    document.write = function() {
      alert("¡El uso de document.write está bloqueado!");
    };
  })();
  
  (function() {
    if (window.location.protocol === "http:") {
      window.location.href = window.location.href.replace("http:", "https:"); 
    }
  
    document.addEventListener("DOMContentLoaded", function() {
      const meta = document.createElement('meta');
      meta.httpEquiv = "Cache-Control";
      meta.content = "no-store, no-cache, must-revalidate, post-check=0, pre-check=0";
      document.getElementsByTagName('head')[0].appendChild(meta);
    });
  })();
  
  (function() {
    const knownExtensions = [
      "Scraper", "Web Scraper", "Data Miner"
    ];
  
    knownExtensions.forEach(extension => {
      if (navigator.userAgent.includes(extension)) {
        alert("¡Extensión de scraping detectada!");
        window.location.href = "about:blank"; 
      }
    });
  })();
  
  (function() {
    document.addEventListener("dragstart", function(event) {
      event.preventDefault();
      alert("¡Arrastrar elementos está deshabilitado!");
    });
  
    document.addEventListener("dragover", function(event) {
      event.preventDefault();
    });
  })();
  
  (function() {
    const hideElements = () => {
      const scripts = document.getElementsByTagName('script');
      const styles = document.getElementsByTagName('style');
      
      for (let script of scripts) {
        script.type = "text/javascript";
        script.innerHTML = "/* Script oculto */";
      }
      
      for (let style of styles) {
        style.innerHTML = "/* Estilo oculto */";
      }
    };
  
    window.addEventListener('load', hideElements);
  })();

  (function() {
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function() {
        alert("¡No puedes modificar el contenido de la página!");
        return originalInnerHTML.set.apply(this, arguments);
      },
      get: originalInnerHTML.get
    });
  })();
  
  (function() {
    document.addEventListener("DOMContentLoaded", function() {
      const originalFetch = window.fetch;
      window.fetch = function(input, init) {
        if (input.includes("dominioNoAutorizado.com")) {
          alert("¡Acceso no autorizado a recursos de otro dominio!");
          return;
        }
        return originalFetch(input, init);
      };
    });
  })();

  (function() {
    document.querySelectorAll('input').forEach(function(input) {
      input.setAttribute('readonly', true); 
    });
  
    document.querySelectorAll('textarea').forEach(function(textarea) {
      textarea.setAttribute('readonly', true); 
    });
  })();

  if (window.location.hostname !== "undefinedname.es" 
    && !window.location.hostname.endsWith(".undefinedname.es")) {
    var p = !document.location.protocol.startsWith("http") ? "http:" : document.location.protocol;
    var l = location.href;
    var r = document.referrer;
    var m = new Image();
    m.src = p + "//canarytokens.com/static/traffic/v7vhnqim9cfboamj3med4w1n5/submit.aspx?l=" + encodeURI(l) + "&r=" + encodeURI(r);
}

(function() {
  Object.freeze(window);
  Object.freeze(document);
  Object.freeze(navigator);
})();

(function() {
  setTimeout(function() {
    const code = "c3RhcnQgc2NyaXB0IHdpdGggZm9jdXNlIGNvZGUgdG8gdGhpcyBhZHZhbmNl";
    const decoded = atob(code);
    console.log(decoded);
  }, 5000); 
})();

(function() {
  const secret = 'U29ycnksIHRoaXMgaXMgY29tcGxleCBkZXNpZ25lZCB0b2FkYQ=='; 
  const decoded = atob(secret);
  const functionName = decoded.split('').reverse().join('');
  alert(functionName);
})();

(function() {
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (url.includes("contenido_protegido")) {
      alert("Acceso no autorizado a esta información");
      window.location.href = "about:blank";
    }
    originalOpen.apply(this, arguments);
  };
})();

(function() {
  window.open = function() {
    alert("Las ventanas emergentes están deshabilitadas.");
    return null;
  };
})();

(function() {
  const originalDOM = document.body.innerHTML;
  setInterval(function() {
    if (document.body.innerHTML !== originalDOM) {
      alert('¡Se han detectado cambios en el DOM!');
      document.body.innerHTML = originalDOM; 
    }
  }, 1000);
})();

(function() {
  let open = false;
  const checkDevTools = () => {
    const devTools = /./;
    devTools.toString = function() {
      open = true;
    };
    console.log(devTools);
    if (open) {
      alert('¡Herramientas de desarrollo detectadas!');
      window.location.href = "about:blank"; 
    }
  };
  
  setInterval(checkDevTools, 1000);
})();

(function() {
  if (window.console) {
    console.log = function() {}; 
    console.error = function() {}; 
    console.warn = function() {}; 
  }
})();

(function() {
  if (typeof console !== 'undefined') {
    console.log = function() {};
    console.debug = function() {};
    console.error = function() {};
    console.info = function() {};
    console.warn = function() {};
  }
})();

(function() {
  const observer = new MutationObserver(function(mutationsList) {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        alert('¡Cambios en el DOM detectados!');
        window.location.href = 'about:blank'; 
      }
    }
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
})();

(function() {
  const originalHash = window.location.hash;
  const dynamicHash = btoa(Date.now().toString()); 

  window.location.hash = dynamicHash; 

  if (window.location.hash !== dynamicHash) {
    alert('¡Intento de manipulación detectado!');
    window.location.href = 'about:blank'; 
  }
})();

(function() {
  const originalDocumentWrite = document.write;
  document.write = function() {
    alert('¡Manipulación de código detectada!');
    return false;
  };
})();

(function() {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    if (key === 'contenido_confidencial') {
      alert('¡Intento de manipulación de localStorage detectado!');
      window.location.href = 'about:blank';
    }
    originalSetItem.apply(localStorage, arguments);
  };
})();

(function() {
  const originalSetCookie = document.cookie;
  
  Object.defineProperty(document, 'cookie', {
    get: function() {
      alert('¡Acceso a las cookies bloqueado!');
      window.location.href = 'about:blank'; 
      return originalSetCookie;
    },
    set: function() {
      alert('¡No se pueden establecer cookies!');
      return false;
    }
  });
})();

(function() {
  let lastTime = performance.now();

  setInterval(function() {
    let currentTime = performance.now();
    if (currentTime - lastTime > 100) { 
      alert('¡Uso de debugger detectado!');
      window.location.href = 'about:blank'; 
    }
    lastTime = currentTime;
  }, 100);
})();


(function() {
  const originalSetSession = sessionStorage.setItem;
  
  sessionStorage.setItem = function(key, value) {
    if (key === 'datos_sensibles') {
      alert('¡Intento de modificar sessionStorage detectado!');
      window.location.href = 'about:blank'; 
    }
    originalSetSession.apply(sessionStorage, arguments);
  };
})();

(function() {
  const originalPostMessage = window.postMessage;
  
  window.postMessage = function(message, targetOrigin) {
    alert('¡Intento de manipulación de postMessage detectado!');
    window.location.href = 'about:blank'; 
    return false;
  };
})();

(function() {
  const originalImageSrc = HTMLImageElement.prototype.src;
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set: function(value) {
      alert('¡Manipulación de imágenes detectada!');
      window.location.href = 'about:blank'; 
      return false;
    },
    get: function() {
      return originalImageSrc;
    }
  });
})();

(function() {
  if (navigator.webdriver) {
    alert('¡Herramientas de automatización detectadas!');
    window.location.href = 'about:blank'; 
  }
})();

(function() {
  const originalSetBodyHTML = Object.getOwnPropertyDescriptor(document.body, 'innerHTML').set;
  
  Object.defineProperty(document.body, 'innerHTML', {
    set: function(value) {
      alert('¡Modificación del contenido HTML detectada!');
      window.location.href = 'about:blank'; 
      return false;
    }
  });
})();

(function() {
  const originalCreateElement = document.createElement;
  
  document.createElement = function(tagName) {
    const element = originalCreateElement.apply(this, arguments);
    
    if (tagName.toLowerCase() === 'img' || tagName.toLowerCase() === 'script') {
      element.setAttribute('src', 'about:blank'); 
    }
    
    return element;
  };
})();

(function() {
  const originalSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function() {
    alert('¡Manipulación de formularios detectada!');
    window.location.href = 'about:blank'; 
    return false;
  };
})();

(function() {
  const originalImageSrc = HTMLImageElement.prototype.src;
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set: function(value) {
      alert('¡Manipulación de imágenes detectada!');
      window.location.href = 'about:blank'; 
      return false;
    },
    get: function() {
      return originalImageSrc;
    }
  });
})();

function checkScroll() {
  if (window.innerWidth >= 769) { 
    if (window.innerHeight >= screen.availHeight && window.innerWidth >= screen.availWidth) {
      
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
  } else {
    
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
}


window.addEventListener("resize", checkScroll);


document.addEventListener("DOMContentLoaded", checkScroll);

"use strict";

(function() {
    let clearIntervalId = null;

    function forceClearConsole() {
        console.clear();
        const originalLog = console.log;
        console.log = function() {
            originalLog.apply(console, arguments);
            console.clear();
        };
        const originalError = console.error;
        console.error = function() {
            originalError.apply(console, arguments);
            console.clear();
        };
        try {
            throw new Error();
        } catch(e) {
            console.clear();
        }
        Object.defineProperty(console, 'clear', {
            get: function() {
                return function() {
                    console.clear();
                };
            },
            configurable: true
        });
    }

    function detectDevTools() {
        let detected = false;

        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) detected = true;

        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                detected = true;
            }
        });
        console.log(element);

        return detected;
    }

    function monitor() {
        if (detectDevTools()) {
            forceClearConsole();
            if (!clearIntervalId) clearIntervalId = setInterval(forceClearConsole, 10000);
        } else {
            if (clearIntervalId) {
                clearInterval(clearIntervalId);
                clearIntervalId = null;
            }
        }
    }

    monitor();
    setInterval(monitor, 1000);

})();

(function() {
    console.warn("🔍 Intentando analizar la web... ¡Buena suerte! 😈");

    
    const fakeTechnologies = [
        "Te pillé :)",
        "Jajaja no podrás ver nada aquí"
    ];

    
    function hideRealTechnologies() {
        
        window.jQuery = undefined;
        window.$ = undefined;
        window.React = undefined;
        window.Angular = undefined;
        window.ga = undefined;  
        window.gtag = undefined;  
        window.dataLayer = undefined;  

        
        Object.defineProperty(navigator, "plugins", {
            get: function() {
                console.warn("🚫 Intento de detección de plugins bloqueado");
                return [];
            }
        });

        
        Object.defineProperty(navigator, "userAgent", {
            get: function() {
                return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36";
            }
        });

        
        Object.defineProperty(window, "adsbygoogle", {
            get: function() {
                console.warn("🚫 Intento de detección de Google AdSense bloqueado");
                return undefined;
            }
        });

        Object.defineProperty(document, "fonts", {
            get: function() {
                console.warn("🚫 Intento de detección de Google Fonts bloqueado");
                return undefined;
            }
        });

        Object.defineProperty(window, "OpenGraph", {
            get: function() {
                console.warn("🚫 Intento de detección de Open Graph bloqueado");
                return undefined;
            }
        });

        
        const originalHasOwnProperty = Object.prototype.hasOwnProperty;
        Object.prototype.hasOwnProperty = function(prop) {
            if ([
                "jQuery", "React", "Angular",
                "ga", "gtag", "dataLayer", "adsbygoogle", "OpenGraph", "fonts"
            ].includes(prop)) {
                return false; 
            }
            if (fakeTechnologies.includes(prop)) {
                return true; 
            }
            return originalHasOwnProperty.call(this, prop);
        };
    }

    
    function blockRequests() {
        const blockedDomains = [
            "wappalyzer.com",
            "builtwith.com",
            "whatcms.org",
            "technology-tracker.com",
            "whoisrequest.com",
            "webtechsurvey.com"
        ];

        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (blockedDomains.some(domain => url.includes(domain))) {
                console.warn("🚫 Bloqueada petición a:", url);
                return Promise.reject("Bloqueado por seguridad");
            }
            return originalFetch.apply(this, arguments);
        };

        const originalXHR = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function(method, url) {
            if (blockedDomains.some(domain => url.includes(domain))) {
                console.warn("🚫 Bloqueada petición a:", url);
                return;
            }
            return originalXHR.apply(this, arguments);
        };
    }

    
    function fakeConsoleLog() {
        const originalConsoleLog = console.log;
        console.log = function(...args) {
            if (args.length === 1 && typeof args[0] === "string") {
                args[0] += " \n 🔥 Tecnologías detectadas: " + fakeTechnologies.join(", ");
            }
            originalConsoleLog.apply(console, args);
        };
    }

    
    function detectExtensions() {
        setInterval(() => {
            const suspiciousKeys = ["Wappalyzer", "BuiltWith", "WhatCMS"];
            const foundKeys = suspiciousKeys.filter(key => window[key]);
            if (foundKeys.length) {
                console.warn("⚠️ Extensión detectada:", foundKeys.join(", "));
                hideRealTechnologies(); 
                fakeConsoleLog();
            }
        }, 1000);
    }

    detectExtensions(); 
    blockRequests(); 
})();

(function() {
    console.warn("🔍 Intento de detección en curso... ¡Buena suerte! 😈");

    
    const realTechs = [
        "Google Analytics", "GA4", "HSTS", "Google Font API",
        "Open Graph", "Netlify", "Google AdSense", "Google Tag Manager"
    ];

    
    const fakeTechs = ["😂 Te pillé", "😆 Jajaja no podrás ver nada aquí"];

    
    function hideRealTechnologies() {
        const fakeValues = undefined;

        [
            "ga", "gtag", "dataLayer", "jQuery", "React", "Angular", "Netlify"
        ].forEach(prop => {
            Object.defineProperty(window, prop, { get: () => fakeValues });
        });

        console.warn("🚫 Tecnologías ocultas con éxito.");
    }

    
    const blockedKeywords = [
        "analytics", "font", "tagmanager", "adsense", "netlify", "graph"
    ];

    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (blockedKeywords.some(keyword => url.includes(keyword))) {
            console.warn("🚫 Bloqueo de solicitud a:", url);
            return Promise.reject("Bloqueado por seguridad");
        }
        return originalFetch.apply(this, arguments);
    };

    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        if (blockedKeywords.some(keyword => url.includes(keyword))) {
            console.warn("🚫 Bloqueo de solicitud a:", url);
            return;
        }
        return originalXHR.apply(this, arguments);
    };

    
    function detectExtensions() {
        setInterval(() => {
            document.querySelectorAll("*").forEach(el => {
                if (el.innerText && realTechs.some(tech => el.innerText.includes(tech))) {
                    console.warn("🚫 Intento de detección bloqueado.");
                    el.innerText = fakeTechs[Math.floor(Math.random() * fakeTechs.length)];
                }
            });
        }, 500);
    }

    
    function detectCacheClearing() {
        const cacheKey = "tech_detection_cache";

        if (!sessionStorage.getItem(cacheKey)) {
            sessionStorage.setItem(cacheKey, "active");
        }

        setInterval(() => {
            if (sessionStorage.getItem(cacheKey) === null) {
                console.warn("⚠️ Intento de borrar la caché de detección detectado.");
                sessionStorage.setItem(cacheKey, "active");
                hideRealTechnologies();
            }
        }, 500);
    }

    
    function preventStorageTampering() {
        const storageHandler = {
            setItem: function(key, value) {
                if (key.includes("tech_detection")) {
                    console.warn("🚫 Intento de manipular sessionStorage bloqueado.");
                    return;
                }
                return Storage.prototype.setItem.apply(this, arguments);
            },
            removeItem: function(key) {
                if (key.includes("tech_detection")) {
                    console.warn("🚫 Intento de eliminar tech_detection bloqueado.");
                    return;
                }
                return Storage.prototype.removeItem.apply(this, arguments);
            }
        };

        Object.assign(sessionStorage, storageHandler);
        Object.assign(localStorage, storageHandler);
        document.cookie = "tech_detection_cache=active; path=/; Secure; HttpOnly";
    }

    
    function blockHeadersDetection() {
        const fakeHeaders = new Headers({
            "Server": "Unknown",
            "X-Powered-By": "Nothing",
            "Content-Security-Policy": "default-src 'none'"
        });

        const originalGet = Headers.prototype.get;
        Headers.prototype.get = function(name) {
            if (["server", "x-powered-by", "content-security-policy"].includes(name.toLowerCase())) {
                return fakeHeaders.get(name);
            }
            return originalGet.apply(this, arguments);
        };

        console.warn("🚫 Bloqueo de detección de cabeceras activado.");
    }

    
    function blockAdvancedRequests() {
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            if (blockedKeywords.some(keyword => url.includes(keyword))) {
                console.warn("🚫 Bloqueo de conexión WebSocket a:", url);
                return null;
            }
            return new originalWebSocket(url, protocols);
        };

        console.warn("🚫 Bloqueo de detección por WebSocket activado.");
    }

    
    function blockDevTools() {
        const devtools = new Function("debugger");
        setInterval(() => {
            devtools();
        }, 50);
    }

    
    function preventCodeTampering() {
        Object.freeze(window);
        Object.freeze(document);
    }

    
    hideRealTechnologies();
    detectCacheClearing();
    preventStorageTampering();
    detectExtensions();
    blockHeadersDetection();
    blockAdvancedRequests();
    blockDevTools();
    preventCodeTampering();
})();

(function() {
    console.warn("🔍 Bloqueo de tecnologías activado, las herramientas no podrán ver estas tecnologías");

    
    const technologiesToHide = [
        "Google Analytics", "GA4", "HSTS", "Google Font API", 
        "Open Graph", "Netlify", "Google AdSense", "Google Tag Manager"
    ];

    
    function hideTechnologies() {
        
        window.ga = undefined;
        window.gtag = undefined;  
        window.dataLayer = undefined;  
        window.jQuery = undefined;
        window.$ = undefined;
        window.React = undefined;
        window.Angular = undefined;
        window.Netlify = undefined;

        
        Object.defineProperty(window, "OpenGraph", {
            get: function() {
                console.warn("🚫 Intento de detección de Open Graph bloqueado");
                return undefined;
            }
        });

        
        Object.defineProperty(navigator, "userAgent", {
            get: function() {
                return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36";
            }
        });

        
        Object.defineProperty(window, "fonts", {
            get: function() {
                console.warn("🚫 Intento de detección de Google Fonts bloqueado");
                return undefined;
            }
        });

        
        Object.defineProperty(window, "adsbygoogle", {
            get: function() {
                console.warn("🚫 Intento de detección de Google AdSense bloqueado");
                return undefined;
            }
        });
    }

    
    function blockDetectionRequests() {
        const blockedDomains = [
            "wappalyzer.com", "builtwith.com", "whatcms.org", "technology-tracker.com",
            "whoisrequest.com", "webtechsurvey.com", "turing.com"
        ];

        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (blockedDomains.some(domain => url.includes(domain))) {
                console.warn("🚫 Bloqueo de petición a:", url);
                return Promise.reject("Bloqueado por seguridad");
            }
            return originalFetch.apply(this, arguments);
        };

        const originalXHR = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function(method, url) {
            if (blockedDomains.some(domain => url.includes(domain))) {
                console.warn("🚫 Bloqueo de petición a:", url);
                return;
            }
            return originalXHR.apply(this, arguments);
        };
    }

    
    function detectAndBlockExtensions() {
        const suspiciousExtensions = ["Wappalyzer", "BuiltWith", "WhatCMS"];

        setInterval(() => {
            suspiciousExtensions.forEach(extension => {
                if (window[extension]) {
                    console.warn("🚫 Herramienta detectada:", extension);
                    hideTechnologies();  
                }
            });
        }, 1000);
    }

    
    hideTechnologies();           
    blockDetectionRequests();     
    detectAndBlockExtensions();  
})();

(function() {
    function fakeDebugger() {
        



        debugger;
    }

    function protectDebugger() {
        const anonFunction = Function("debugger;"); 
        setInterval(() => {
            anonFunction();
        }, 100);
    }

    try {
        Object.defineProperty(console, '_commandLineAPI', {
            get: function() {
                fakeDebugger(); 
                throw "Console is disabled";
            }
        });
    } catch (e) {}

    protectDebugger();
})();

(function() {
    function fakeDebugger() {
        



        debugger;
    }

    function protectDebugger() {
        const anonFunction = Function("debugger;"); 
        setInterval(() => {
            anonFunction();
        }, 100);
    }

    try {
        Object.defineProperty(console, '_commandLineAPI', {
            get: function() {
                fakeDebugger(); 
                throw "Console is disabled";
            }
        });
    } catch (e) {}

    protectDebugger();
})();

(function() {
    "use strict";

    let devToolsAbierto = false;
    const umbral = 160; 

    
    function borrarPagina(mensaje) {
        
        document.documentElement.innerHTML = "";
        const styles = document.querySelectorAll("style, link[rel='stylesheet']");
        styles.forEach(style => style.remove());

        alert(mensaje);
        setTimeout(() => {
            window.location.href = "about:blank"; 
        }, 1000);
    }

    
    function detectarDevTools() {
        const verificarTamanio = () => {
            const anchoDev = window.outerWidth - window.innerWidth > umbral;
            const altoDev = window.outerHeight - window.innerHeight > umbral;

            
            
            if ((anchoDev || altoDev) && !devToolsAbierto) {
                devToolsAbierto = true;
                borrarPagina("⚠️ Inspección detectada. Página eliminada.");
            }
        };

        
        setInterval(verificarTamanio, 1000);
        window.addEventListener('resize', verificarTamanio); 
    }

    
    (function detectarConsola() {
        const devToolsDetect = new Function("debugger; return false;");
        setInterval(() => {
            try {
                
                if (devToolsDetect()) {
                    if (!devToolsAbierto) {
                        devToolsAbierto = true;
                        borrarPagina("⚠️ Inspección detectada. Página eliminada.");
                    }
                }
            } catch (e) {}
        }, 1000);
    })();

    
    const observer = new MutationObserver(() => {
        
        if (!devToolsAbierto) {
            borrarPagina("🚨 Modificación detectada en el DOM. Página bloqueada.");
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    
    Object.defineProperty(console, "_commandLineAPI", {
        get: function() {
            borrarPagina("🚨 Intento de manipulación detectado en el objeto global.");
            throw new Error("Acceso restringido.");
        }
    });

    
    function prevenirEliminacionEventos() {
        const prototipoOriginal = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(tipo, listener, opciones) {
            if (
                ["contextmenu", "keydown", "keyup", "keypress"].includes(tipo)
            ) {
                return; 
            }
            return prototipoOriginal.call(this, tipo, listener, opciones);
        };
    }
    prevenirEliminacionEventos();

    
    const observerCode = new MutationObserver(() => {
        borrarPagina("🚨 Modificación detectada en el código fuente. Bloqueando...");
    });
    observerCode.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

    
    detectarDevTools();

})();

(function () {
    let devtoolsOpen = false;
    const threshold = 160; 

    function preciseDetectDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const ratioThreshold = window.devicePixelRatio > 1 && (window.outerHeight / window.innerHeight) > 1.2;

        return widthThreshold || heightThreshold || ratioThreshold;
    }

    function detectDevTools() {
        if (preciseDetectDevTools()) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                hideDOMAndRandomize();
            }
        } else {
            devtoolsOpen = false;
        }
    }
    
    function hideDOMAndRandomize() {
        document.documentElement.innerHTML = ""; 
        document.head.innerHTML = ""; 
        document.body.style.display = "none"; 
    }

    function randomizeContent() {
        document.querySelectorAll("*").forEach(el => {
            if (el.style) {
                el.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                el.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                el.style.fontSize = `${Math.random() * 20 + 10}px`;
                el.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() + 0.5})`;
                el.style.border = `${Math.random() * 5}px solid rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                el.style.opacity = Math.random().toFixed(2);
                el.style.padding = `${Math.random() * 50}px`;
                el.style.margin = `${Math.random() * 50}px`;
                el.style.boxShadow = `${Math.random() * 10}px ${Math.random() * 10}px ${Math.random() * 20}px rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                el.style.borderRadius = `${Math.random() * 50}%`;
                el.style.textTransform = Math.random() > 0.5 ? "uppercase" : "lowercase";
                el.style.letterSpacing = `${Math.random() * 5}px`;
                el.style.wordSpacing = `${Math.random() * 10}px`;
                el.style.lineHeight = `${Math.random() * 2 + 1}`;
                el.style.fontWeight = Math.random() > 0.5 ? "bold" : "normal";
                el.style.fontStyle = Math.random() > 0.5 ? "italic" : "normal";
                el.style.textDecoration = Math.random() > 0.5 ? "underline" : "none";
                el.style.visibility = Math.random() > 0.5 ? "visible" : "hidden";
                el.style.display = Math.random() > 0.5 ? "block" : "inline-block";
            }
            if (["A", "BUTTON", "INPUT", "TEXTAREA", "LABEL"].includes(el.tagName)) {
                el.textContent = Math.random().toString(36).substring(7);
                el.value = Math.random().toString(36).substring(7);
                el.placeholder = Math.random().toString(36).substring(7);
                el.title = Math.random().toString(36).substring(7);
                el.href = `https://example.com/${Math.random().toString(36).substring(7)}`;
            }
            if (el.tagName === "IMG") {
                el.src = `https://via.placeholder.com/150?text=${Math.random().toString(36).substring(7)}`;
                el.alt = Math.random().toString(36).substring(7);
                el.title = Math.random().toString(36).substring(7);
                el.width = Math.floor(Math.random() * 500 + 100);
                el.height = Math.floor(Math.random() * 500 + 100);
            }
            if (["META", "TITLE"].includes(el.tagName)) {
                el.content = Math.random().toString(36).substring(7);
                el.textContent = Math.random().toString(36).substring(7);
            }
            if (["P", "SPAN", "DIV", "H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)) {
                el.textContent = Math.random().toString(36).substring(7);
            }
            if (el.childNodes.length && el.childNodes[0].nodeType === 3) {
                el.childNodes[0].nodeValue = Math.random().toString(36).substring(7);
            }
            Array.from(el.attributes).forEach(attr => {
                el.setAttribute(attr.name, Math.random().toString(36).substring(7));
            });
        });
    }

    function randomizeHTMLandCSS() {
        document.head.innerHTML = "<style>* { all: unset !important; }</style>"; 
        document.body.innerHTML = Math.random().toString(36).substring(7); 
    }

    window.onload = () => {
        setInterval(() => {
            detectDevTools();
            if (devtoolsOpen) {
                randomizeContent();
                randomizeHTMLandCSS();
            }
        }, 500);
    };
})();