(function (window, document) {
  'use strict';

  /*
   * ============================================================
   * FLEXI EDUCATIONAL CONSULT
   * Corrected Boxicons Web Component
   *
   * Local icon structure:
   *
   * ./boxicons/svg/regular/bx-icon-name.svg
   * ./boxicons/svg/solid/bxs-icon-name.svg
   * ./boxicons/svg/logos/bxl-icon-name.svg
   *
   * Preserved API:
   *   name
   *   type
   *   color
   *   size
   *   rotate
   *   flip
   *   animation
   *   border
   *   pull
   * ============================================================
   */

  var ICON_CACHE = Object.create(null);

  /*
   * ------------------------------------------------------------
   * Web Components compatibility
   * ------------------------------------------------------------
   */

  function waitForCustomElements(callback) {
    if (
      'customElements' in window &&
      typeof window.customElements.define === 'function'
    ) {
      callback();
      return;
    }

    /*
     * If a Web Components polyfill is already loading,
     * wait for it.
     */
    if (window.AWAITING_WEB_COMPONENTS_POLYFILL) {
      window.AWAITING_WEB_COMPONENTS_POLYFILL.then(callback);
      return;
    }

    /*
     * Basic fallback for older browsers.
     */
    var queue = [];

    queue.isDone = false;

    queue.exec = function () {
      var callbacks = queue.splice(0);

      callbacks.forEach(function (fn) {
        try {
          fn();
        } catch (error) {
          console.error(
            'Boxicons initialization error:',
            error
          );
        }
      });
    };

    queue.then = function (fn) {
      if (queue.isDone) {
        fn();
      } else {
        queue.push(fn);
      }

      return queue;
    };

    window.AWAITING_WEB_COMPONENTS_POLYFILL = queue;

    var polyfillUrl =
      window.WEB_COMPONENTS_POLYFILL ||
      'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.0.2/webcomponents-bundle.js';

    loadScript(polyfillUrl).then(function () {
      queue.isDone = true;
      queue.exec();
    });
  }


  function loadScript(src) {
    var queue = [];

    queue.isDone = false;

    queue.exec = function () {
      var callbacks = queue.splice(0);

      callbacks.forEach(function (fn) {
        try {
          fn();
        } catch (error) {
          console.error(
            'Boxicons script callback error:',
            error
          );
        }
      });
    };

    queue.then = function (fn) {
      if (queue.isDone) {
        fn();
      } else {
        queue.push(fn);
      }

      return queue;
    };

    var script =
      document.createElement('script');

    script.type = 'text/javascript';

    script.onload = function () {
      queue.isDone = true;
      queue.exec();
    };

    script.onerror = function () {
      console.error(
        'Failed to load Boxicons Web Components polyfill:',
        src
      );

      queue.isDone = true;
      queue.exec();
    };

    script.src = src;

    var head =
      document.getElementsByTagName('head')[0];

    if (head) {
      head.appendChild(script);
    }

    return queue;
  }


  /*
   * ------------------------------------------------------------
   * Main BoxIconElement
   * ------------------------------------------------------------
   */

  waitForCustomElements(function () {

    var template =
      document.createElement('template');


    /*
     * ----------------------------------------------------------
     * Shadow DOM styles
     * ----------------------------------------------------------
     */

    template.innerHTML = `
      <style>

        :host {
          display: inline-block;
          font-size: initial;
          box-sizing: border-box;
          width: 24px;
          height: 24px;
        }

        :host([size="xs"]) {
          width: 0.8rem;
          height: 0.8rem;
        }

        :host([size="sm"]) {
          width: 1.55rem;
          height: 1.55rem;
        }

        :host([size="md"]) {
          width: 2.25rem;
          height: 2.25rem;
        }

        :host([size="lg"]) {
          width: 3rem;
          height: 3rem;
        }

        :host([size]:not([size=""]):not([size="xs"]):not([size="sm"]):not([size="md"]):not([size="lg"])) {
          width: auto;
          height: auto;
        }

        :host([pull="left"]) #icon {
          float: left;
          margin-right: .3em !important;
        }

        :host([pull="right"]) #icon {
          float: right;
          margin-left: .3em !important;
        }

        :host([border="square"]) #icon {
          padding: .25em;
          border: .07em solid rgba(0, 0, 0, .1);
          border-radius: .25em;
        }

        :host([border="circle"]) #icon {
          padding: .25em;
          border: .07em solid rgba(0, 0, 0, .1);
          border-radius: 50%;
        }

        #icon,
        #icon svg {
          width: 100%;
          height: 100%;
        }

        #icon {
          box-sizing: border-box;
          display: block;
        }

        .bx-spin {
          animation: bx-spin 2s linear infinite;
        }

        .bx-tada {
          animation: bx-tada 1.5s ease infinite;
        }

        .bx-flashing {
          animation: bx-flashing 1.5s infinite linear;
        }

        .bx-burst {
          animation: bx-burst 1.5s infinite linear;
        }

        .bx-fade-up {
          animation: bx-fade-up 1.5s infinite linear;
        }

        .bx-fade-down {
          animation: bx-fade-down 1.5s infinite linear;
        }

        .bx-fade-left {
          animation: bx-fade-left 1.5s infinite linear;
        }

        .bx-fade-right {
          animation: bx-fade-right 1.5s infinite linear;
        }

        .bx-rotate-90 {
          transform: rotate(90deg);
        }

        .bx-rotate-180 {
          transform: rotate(180deg);
        }

        .bx-rotate-270 {
          transform: rotate(270deg);
        }

        .bx-flip-horizontal {
          transform: scaleX(-1);
        }

        .bx-flip-vertical {
          transform: scaleY(-1);
        }

        @keyframes bx-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(359deg);
          }
        }

        @keyframes bx-tada {
          0% {
            transform: scaleX(1);
          }

          10%,
          20% {
            transform: scale3d(.95, .95, .95) rotate(-10deg);
          }

          30%,
          50%,
          70%,
          90% {
            transform: scaleX(1) rotate(10deg);
          }

          40%,
          60%,
          80% {
            transform: scaleX(1) rotate(-10deg);
          }

          100% {
            transform: scaleX(1);
          }
        }

        @keyframes bx-flashing {
          0% {
            opacity: 1;
          }

          45% {
            opacity: 0;
          }

          90% {
            opacity: 1;
          }
        }

        @keyframes bx-burst {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          90% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bx-fade-up {
          0% {
            transform: translateY(0);
            opacity: 1;
          }

          75% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }

        @keyframes bx-fade-down {
          0% {
            transform: translateY(0);
            opacity: 1;
          }

          75% {
            transform: translateY(20px);
            opacity: 0;
          }
        }

        @keyframes bx-fade-left {
          0% {
            transform: translateX(0);
            opacity: 1;
          }

          75% {
            transform: translateX(-20px);
            opacity: 0;
          }
        }

        @keyframes bx-fade-right {
          0% {
            transform: translateX(0);
            opacity: 1;
          }

          75% {
            transform: translateX(20px);
            opacity: 0;
          }
        }

      </style>

      <div id="icon"></div>
    `;


    /*
     * ----------------------------------------------------------
     * BoxIconElement class
     * ----------------------------------------------------------
     */

    class BoxIconElement extends HTMLElement {

      constructor() {

        super();

        /*
         * Create Shadow DOM.
         */
        this.$ui =
          this.attachShadow({
            mode: 'open'
          });


        /*
         * Clone template.
         */
        this.$ui.appendChild(
          document.importNode(
            template.content,
            true
          )
        );


        /*
         * Internal state.
         */
        this._state = {

          $iconHolder:
            this.$ui.getElementById(
              'icon'
            ),

          type:
            this.getAttribute('type') ||
            'regular',

          currentName:
            this.getAttribute('name') ||
            null,

          size:
            this.getAttribute('size') ||
            null

        };


        /*
         * Apply initial properties.
         */
        this._applyAllAttributes();

      }


      /*
       * --------------------------------------------------------
       * Static API
       * --------------------------------------------------------
       */

      static get cdnUrl() {

        /*
         * IMPORTANT:
         *
         * Keep this local.
         *
         * Do NOT change to a remote Boxicons CDN.
         */
        return './boxicons/svg';

      }


      static get tagName() {

        return 'box-icon';

      }


      static get observedAttributes() {

        return [
          'type',
          'name',
          'color',
          'size',
          'rotate',
          'flip',
          'animation',
          'border',
          'pull'
        ];

      }


      /*
       * --------------------------------------------------------
       * Get SVG
       * --------------------------------------------------------
       */

      static getIconSvg(name, type) {

        if (!name) {
          return Promise.reject(
            new Error(
              'Boxicons icon name is missing.'
            )
          );
        }


        var iconType =
          type === 'solid'
            ? 'solid'
            : type === 'logo'
              ? 'logo'
              : 'regular';


        var url;


        if (iconType === 'solid') {

          url =
            this.cdnUrl +
            '/solid/bxs-' +
            name +
            '.svg';

        } else if (iconType === 'logo') {

          url =
            this.cdnUrl +
            '/logos/bxl-' +
            name +
            '.svg';

        } else {

          url =
            this.cdnUrl +
            '/regular/bx-' +
            name +
            '.svg';

        }


        /*
         * Return cached request when available.
         */
        if (ICON_CACHE[url]) {
          return ICON_CACHE[url];
        }


        /*
         * Fetch local SVG.
         */
        ICON_CACHE[url] =
          new Promise(function (
            resolve,
            reject
          ) {

            var xhr =
              new XMLHttpRequest();


            xhr.open(
              'GET',
              url,
              true
            );


            xhr.addEventListener(
              'load',
              function () {

                if (
                  xhr.status >= 200 &&
                  xhr.status < 300
                ) {

                  resolve(
                    xhr.responseText
                  );

                } else {

                  reject(
                    new Error(
                      xhr.status +
                      ' ' +
                      (
                        xhr.statusText ||
                        'Failed to load icon'
                      ) +
                      ': ' +
                      url
                    )
                  );

                }

              }
            );


            xhr.addEventListener(
              'error',
              function () {

                reject(
                  new Error(
                    'Network error while loading Boxicon: ' +
                    url
                  )
                );

              }
            );


            xhr.addEventListener(
              'abort',
              function () {

                reject(
                  new Error(
                    'Boxicon request aborted: ' +
                    url
                  )
                );

              }
            );


            xhr.send();

          });


        return ICON_CACHE[url];

      }


      /*
       * --------------------------------------------------------
       * Define custom element
       * --------------------------------------------------------
       */

      static define(tagName) {

        var name =
          tagName ||
          this.tagName;


        if (
          !customElements.get(name)
        ) {

          customElements.define(
            name,
            this
          );

        }

      }


      /*
       * --------------------------------------------------------
       * Attribute changes
       * --------------------------------------------------------
       */

      attributeChangedCallback(
        attributeName,
        oldValue,
        newValue
      ) {

        if (
          oldValue === newValue
        ) {
          return;
        }


        switch (
          attributeName
        ) {

          case 'type':

            this._updateType(
              newValue
            );

            break;


          case 'name':

            this._updateName(
              newValue
            );

            break;


          case 'color':

            this._updateColor(
              newValue
            );

            break;


          case 'size':

            this._updateSize(
              newValue
            );

            break;


          case 'rotate':

            this._updateRotate(
              oldValue,
              newValue
            );

            break;


          case 'flip':

            this._updateFlip(
              oldValue,
              newValue
            );

            break;


          case 'animation':

            this._updateAnimation(
              oldValue,
              newValue
            );

            break;


          case 'border':

            this._updateBorder(
              oldValue,
              newValue
            );

            break;


          case 'pull':

            this._updatePull(
              oldValue,
              newValue
            );

            break;

        }

      }


      /*
       * --------------------------------------------------------
       * Connected
       * --------------------------------------------------------
       */

      connectedCallback() {

        this._applyAllAttributes();

      }


      /*
       * --------------------------------------------------------
       * Apply everything
       * --------------------------------------------------------
       */

      _applyAllAttributes() {

        this._updateType(
          this.getAttribute('type')
        );


        this._updateName(
          this.getAttribute('name')
        );


        this._updateColor(
          this.getAttribute('color')
        );


        this._updateSize(
          this.getAttribute('size')
        );


        this._updateRotate(
          null,
          this.getAttribute('rotate')
        );


        this._updateFlip(
          null,
          this.getAttribute('flip')
        );


        this._updateAnimation(
          null,
          this.getAttribute('animation')
        );


        this._updateBorder(
          null,
          this.getAttribute('border')
        );


        this._updatePull(
          null,
          this.getAttribute('pull')
        );

      }


      /*
       * --------------------------------------------------------
       * Type
       * --------------------------------------------------------
       */

      _updateType(type) {

        var normalizedType =
          type === 'solid' ||
          type === 'logo'
            ? type
            : 'regular';


        this._state.type =
          normalizedType;


        if (
          this._state.currentName
        ) {

          this._loadIcon();

        }

      }


      /*
       * --------------------------------------------------------
       * Name
       * --------------------------------------------------------
       */

      _updateName(name) {

        this._state.currentName =
          name;


        if (!name) {

          this._state.$iconHolder
            .textContent = '';

          return;

        }


        this._loadIcon();

      }


      /*
       * --------------------------------------------------------
       * Load icon
       * --------------------------------------------------------
       */

      _loadIcon() {

        var name =
          this._state.currentName;

        var type =
          this._state.type;


        if (!name) {
          return;
        }


        var holder =
          this._state.$iconHolder;


        /*
         * Clear current icon while
         * loading the requested icon.
         */
        holder.textContent = '';


        var element =
          this;


        BoxIconElement
          .getIconSvg(
            name,
            type
          )
          .then(function (svg) {

            /*
             * Prevent an old asynchronous
             * request from replacing a
             * newer icon.
             */
            if (
              element._state.currentName !==
                name
            ) {

              return;

            }


            if (
              element._state.type !==
                type
            ) {

              return;

            }


            holder.innerHTML =
              svg;


            /*
             * Apply color to the
             * injected SVG.
             */
            element._applySvgColor();

          })
          .catch(function (error) {

            console.error(
              'Failed to load Boxicon: ' +
              name +
              '\n',
              error
            );

          });

      }


      /*
       * --------------------------------------------------------
       * Color
       * --------------------------------------------------------
       */

      _updateColor(color) {

        this.style.fill =
          color || '';


        this.style.color =
          color || '';


        this._applySvgColor();

      }


      _applySvgColor() {

        var color =
          this.getAttribute(
            'color'
          );


        if (!color) {
          return;
        }


        var svg =
          this._state
            .$iconHolder
            .querySelector('svg');


        if (!svg) {
          return;
        }


        /*
         * Preserve the Boxicons
         * color API.
         */
        svg.style.color =
          color;


        svg.style.fill =
          color;


        svg.setAttribute(
          'fill',
          'currentColor'
        );


        /*
         * Also apply currentColor
         * to paths where appropriate.
         */
        var paths =
          svg.querySelectorAll(
            '[fill]'
          );


        for (
          var i = 0;
          i < paths.length;
          i++
        ) {

          var fill =
            paths[i].getAttribute(
              'fill'
            );


          if (
            !fill ||
            fill === 'currentColor'
          ) {

            paths[i].setAttribute(
              'fill',
              'currentColor'
            );

          }

        }

      }


      /*
       * --------------------------------------------------------
       * Size
       * --------------------------------------------------------
       *
       * This is the section that was
       * corrupted in your original file.
       *
       * The malformed:
       *
       *     r.\( iconHolder.style.height=""
       *
       * is completely removed.
       * --------------------------------------------------------
       */

      _updateSize(size) {

        var holder =
          this._state.$iconHolder;


        /*
         * Clear previously applied
         * explicit dimensions.
         */
        holder.style.width = '';
        holder.style.height = '';


        this._state.size =
          size || null;


        /*
         * xs / sm / md / lg are
         * handled by :host CSS.
         *
         * Custom sizes such as:
         *
         *     size="32px"
         *     size="40"
         *     size="2rem"
         *
         * are applied directly.
         */
        if (!size) {
          return;
        }


        var normalized =
          String(size).trim();


        if (
          normalized === 'xs' ||
          normalized === 'sm' ||
          normalized === 'md' ||
          normalized === 'lg'
        ) {

          return;

        }


        /*
         * Support numeric values.
         *
         * size="32"
         *
         * becomes:
         *
         * 32px
         */
        if (
          /^[0-9]+(?:\.[0-9]+)?$/.test(
            normalized
          )
        ) {

          normalized += 'px';

        }


        holder.style.width =
          normalized;


        holder.style.height =
          normalized;

      }


      /*
       * --------------------------------------------------------
       * Rotation
       * --------------------------------------------------------
       */

      _updateRotate(
        oldValue,
        newValue
      ) {

        var holder =
          this._state.$iconHolder;


        if (oldValue) {

          holder.classList.remove(
            'bx-rotate-' +
            oldValue
          );

        }


        if (
          newValue === '90' ||
          newValue === '180' ||
          newValue === '270'
        ) {

          holder.classList.add(
            'bx-rotate-' +
            newValue
          );

        }

      }


      /*
       * --------------------------------------------------------
       * Flip
       * --------------------------------------------------------
       */

      _updateFlip(
        oldValue,
        newValue
      ) {

        var holder =
          this._state.$iconHolder;


        if (oldValue) {

          holder.classList.remove(
            'bx-flip-' +
            oldValue
          );

        }


        if (
          newValue ===
            'horizontal' ||
          newValue ===
            'vertical'
        ) {

          holder.classList.add(
            'bx-flip-' +
            newValue
          );

        }

      }


      /*
       * --------------------------------------------------------
       * Animation
       * --------------------------------------------------------
       */

      _updateAnimation(
        oldValue,
        newValue
      ) {

        var holder =
          this._state.$iconHolder;


        var animations = [
          'spin',
          'tada',
          'flashing',
          'burst',
          'fade-up',
          'fade-down',
          'fade-left',
          'fade-right'
        ];


        if (
          oldValue &&
          animations.indexOf(
            oldValue
          ) !== -1
        ) {

          holder.classList.remove(
            'bx-' +
            oldValue
          );

        }


        if (
          newValue &&
          animations.indexOf(
            newValue
          ) !== -1
        ) {

          holder.classList.add(
            'bx-' +
            newValue
          );

        }

      }


      /*
       * --------------------------------------------------------
       * Border
       * --------------------------------------------------------
       */

      _updateBorder(
        oldValue,
        newValue
      ) {

        var holder =
          this._state.$iconHolder;


        if (oldValue) {

          holder.classList.remove(
            'bx-border-' +
            oldValue
          );

        }


        /*
         * Border is primarily handled
         * through the host selector.
         *
         * No additional class is
         * required here.
         */

      }


      /*
       * --------------------------------------------------------
       * Pull
       * --------------------------------------------------------
       */

      _updatePull(
        oldValue,
        newValue
      ) {

        /*
         * Pull is handled by the
         * :host CSS selectors.
         *
         * This method exists to
         * preserve the original API.
         */

      }

    }


    /*
     * ----------------------------------------------------------
     * Expose globally
     * ----------------------------------------------------------
     */

    window.BoxIconElement =
      BoxIconElement;


    /*
     * ----------------------------------------------------------
     * Register <box-icon>
     * ----------------------------------------------------------
     */

    BoxIconElement.define(
      'box-icon'
    );


    /*
     * ----------------------------------------------------------
     * Optional compatibility export
     * ----------------------------------------------------------
     */

    if (
      typeof window.Boxicons ===
      'undefined'
    ) {

      window.Boxicons = {

        BoxIconElement:
          BoxIconElement,

        getIconSvg:
          function (
            name,
            type
          ) {

            return BoxIconElement
              .getIconSvg(
                name,
                type
              );

          }

      };

    }


    /*
     * ----------------------------------------------------------
     * Automatically refresh existing
     * <box-icon> elements.
     *
     * This is useful if boxicons.js
     * loads after some page markup.
     * ----------------------------------------------------------
     */

    function refreshIcons() {

      var icons =
        document.querySelectorAll(
          'box-icon'
        );


      for (
        var i = 0;
        i < icons.length;
        i++
      ) {

        try {

          if (
            typeof icons[i]._applyAllAttributes ===
            'function'
          ) {

            icons[i]._applyAllAttributes();

          }

        } catch (error) {

          console.error(
            'Boxicons refresh error:',
            error
          );

        }

      }

    }


    if (
      document.readyState ===
      'loading'
    ) {

      document.addEventListener(
        'DOMContentLoaded',
        refreshIcons
      );

    } else {

      refreshIcons();

    }

  });

})(window, document);
