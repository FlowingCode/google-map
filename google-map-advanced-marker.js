import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/**
`google-map-advanced-marker` is a marker backed by `google.maps.marker.AdvancedMarkerElement`,
the replacement for the deprecated `google.maps.Marker` used by `google-map-marker`.
Both elements can be used together on the same map.

The parent `google-map` must have a `map-id`, which Advanced Markers require.

<b>Example</b>:

    <google-map map-id="DEMO_MAP_ID" latitude="37.77493" longitude="-122.41942">
      <google-map-advanced-marker slot="markers" latitude="37.779" longitude="-122.3892"
          title="Go Giants!" pin-background="#FBBC04"></google-map-advanced-marker>
    </google-map>

As with `google-map-marker`, the element's content is shown in an InfoWindow when the marker is clicked,
and the native `title`, `hidden` and `draggable` (`draggable="true"`) attributes set the marker's title,
visibility and whether it can be dragged.

These `google-map-marker` features are not supported, as Advanced Markers have no equivalent:
`animation`, `optimized`, `icon` with a `google.maps.SymbolPath` constant, `icon` sprites (`size` and `origin`),
`label` together with `icon`, and the `fontFamily`, `fontSize`, `fontWeight` and `className` of a `label`.
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: none;
      }
    </style>

    <slot></slot>
`,

  is: 'google-map-advanced-marker',

  /**
   * Fired when the marker was clicked. Requires the clickEvents attribute to be true.
   *
   * @param {google.maps.MapMouseEvent} event The mouse event.
   * @event google-map-marker-click
   */

  /**
   * Fired when the marker was double clicked. Requires the clickEvents attribute to be true.
   *
   * @param {{latLng: google.maps.LatLng, domEvent: MouseEvent}} event The marker position and the DOM event.
   * @event google-map-marker-dblclick
   */

  /**
   * Fired for a rightclick on the marker, or a touch-and-hold on touch devices.
   * Requires the clickEvents attribute to be true.
   *
   * @param {{latLng: google.maps.LatLng, domEvent: MouseEvent}} event The marker position and the DOM event.
   * @event google-map-marker-rightclick
   */

  /**
   * Fired for a mousedown on the marker. Requires the mouseEvents attribute to be true.
   *
   * @param {{latLng: google.maps.LatLng, domEvent: MouseEvent}} event The marker position and the DOM event.
   * @event google-map-marker-mousedown
   */

  /**
   * Fired when the mouse moves over the marker. Requires the mouseEvents attribute to be true.
   *
   * @param {{latLng: google.maps.LatLng, domEvent: MouseEvent}} event The marker position and the DOM event.
   * @event google-map-marker-mousemove
   */

  /**
   * Fired when the mouse leaves the marker. Requires the mouseEvents attribute to be true.
   *
   * @param {{latLng: google.maps.LatLng, domEvent: MouseEvent}} event The marker position and the DOM event.
   * @event google-map-marker-mouseout
   */

  /**
   * Fired when the mouse enters the marker. Requires the mouseEvents attribute to be true.
   *
   * @param {{latLng: google.maps.LatLng, domEvent: MouseEvent}} event The marker position and the DOM event.
   * @event google-map-marker-mouseover
   */

  /**
   * Fired for a mouseup on the marker. Requires the mouseEvents attribute to be true.
   *
   * @param {{latLng: google.maps.LatLng, domEvent: MouseEvent}} event The marker position and the DOM event.
   * @event google-map-marker-mouseup
   */

  /**
   * Fired repeatedly while the user drags the marker. Requires the dragEvents attribute to be true.
   *
   * @event google-map-marker-drag
   */

  /**
   * Fired when the user stops dragging the marker. Requires the dragEvents attribute to be true.
   *
   * @event google-map-marker-dragend
   */

  /**
   * Fired when the user starts dragging the marker. Requires the dragEvents attribute to be true.
   *
   * @event google-map-marker-dragstart
   */

  /**
   * Fired when an infowindow is opened.
   *
   * @event google-map-marker-open
   */

  /**
   * Fired when the close button of the infowindow is pressed.
   *
   * @event google-map-marker-close
   */

  properties: {
    /**
     * A Google Maps advanced marker object.
     *
     * @type google.maps.marker.AdvancedMarkerElement
     */
    marker: {
      type: Object,
      notify: true,
    },

    /**
     * The Google map object.
     *
     * @type google.maps.Map
     */
    map: {
      type: Object,
      observer: '_mapChanged',
    },

    /**
     * A Google Map Infowindow object.
     *
     * @type {?Object}
     */
    info: {
      type: Object,
      value: null,
    },

    /**
     * When true, marker click, dblclick and rightclick events are automatically registered.
     * On touch devices, a touch-and-hold on the marker fires a rightclick event.
     */
    clickEvents: {
      type: Boolean,
      value: false,
      observer: '_clickEventsChanged',
    },

    /**
     * When true, marker drag* events are automatically registered.
     */
    dragEvents: {
      type: Boolean,
      value: false,
      observer: '_dragEventsChanged',
    },

    /**
     * When true, marker mouse* events are automatically registered.
     */
    mouseEvents: {
      type: Boolean,
      value: false,
      observer: '_mouseEventsChanged',
    },

    /**
     * Z-index for the marker. If not set, markers lower on the screen are shown in front.
     */
    zIndex: {
      type: Number,
      value: null,
      observer: '_zIndexChanged',
    },

    /**
     * The marker's longitude coordinate.
     */
    longitude: {
      type: Number,
      value: null,
      notify: true,
    },

    /**
     * The marker's latitude coordinate.
     */
    latitude: {
      type: Number,
      value: null,
      notify: true,
    },

    /**
     * Image for the marker, instead of the default pin. One of:
     * - an image URL;
     * - an Icon object: `{url, scaledSize: {width, height}, anchor: {x, y}}`. By default, the anchor
     *   is the center of the bottom of the image;
     * - a Symbol object with an SVG `path`: `{path, anchor, fillColor, fillOpacity, rotation, scale,
     *   strokeColor, strokeOpacity, strokeWeight}`, with the same defaults as in `google.maps.Symbol`.
     *
     * Not supported: `google.maps.SymbolPath` constants as `path`, and sprites (`size` and `origin`).
     *
     * @type string|google.maps.Icon|google.maps.Symbol
     */
    icon: {
      type: Object,
      value: null,
    },

    /**
     * Label shown in the default pin, instead of its glyph: a text, or a MarkerLabel object
     * `{text, color}`. Not shown when `icon` is set.
     *
     * Not supported, as the pin's glyph only takes a text and a color: `fontFamily`, `fontSize`,
     * `fontWeight` and `className`.
     *
     * @type string|google.maps.MarkerLabel
     */
    label: {
      type: Object,
      value: null,
    },

    /**
     * Background color of the default pin.
     */
    pinBackground: {
      type: String,
      value: null,
    },

    /**
     * Border color of the default pin.
     */
    pinBorderColor: {
      type: String,
      value: null,
    },

    /**
     * Color of the default pin's glyph (the circle in its center).
     */
    pinGlyphColor: {
      type: String,
      value: null,
    },

    /**
     * Scale of the default pin. Defaults to 1.
     */
    pinScale: {
      type: Number,
      value: null,
    },

    /**
     * Specifies whether the InfoWindow is open or not
     */
    open: {
      type: Boolean,
      value: false,
      observer: '_openChanged',
    },
  },

  observers: [
    '_updatePosition(latitude, longitude)',
    '_updateContent(icon, label, pinBackground, pinBorderColor, pinGlyphColor, pinScale)',
  ],

  detached() {
    if (this.marker) {
      this._setMarkerMap(null);
    }
    if (this._contentObserver) { this._contentObserver.disconnect(); }
  },

  attached() {
    // If element is added back to DOM, put it back on the map.
    if (this.marker) {
      this._setMarkerMap(this.map);
      this._contentChanged();
    }
  },

  // Removing the marker from the map makes the Maps API close its infowindow, and open it again
  // when the marker is back on the map (e.g. after being detached, or grouped in a cluster).
  // That close must not set `open` to false.
  _setMarkerMap(map) {
    this._settingMarkerMap = true;
    try {
      this.marker.map = map;
    } finally {
      this._settingMarkerMap = false;
    }
  },

  _getPosition() {
    if (this.latitude == null || this.longitude == null) {
      return null;
    }
    return { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
  },

  _updatePosition() {
    if (this.marker) {
      this.marker.position = this._getPosition();
    }
  },

  _updateContent() {
    if (!this.marker) {
      return;
    }
    // Null content restores the default pin.
    this.marker.content = this.icon ? this._buildIcon(this.icon) : this._buildPin();
  },

  _buildPin() {
    const options = {};
    if (this.pinBackground) { options.background = this.pinBackground; }
    if (this.pinBorderColor) { options.borderColor = this.pinBorderColor; }
    if (this.pinGlyphColor) { options.glyphColor = this.pinGlyphColor; }
    if (this.pinScale) { options.scale = this.pinScale; }
    const label = this._getLabel();
    if (label) {
      options.glyphText = String(label.text);
      // Same default color as google.maps.MarkerLabel
      options.glyphColor = label.color || 'black';
    }
    return Object.keys(options).length ? new google.maps.marker.PinElement(options) : null;
  },

  _getLabel() {
    // Any value that is not an object is the label's text: the attribute is parsed as JSON,
    // so e.g. label="1" is a number.
    const label = this.label !== null && typeof this.label === 'object' ? this.label : { text: this.label };
    return label.text == null || label.text === '' ? null : label;
  },

  // The content is a zero-size element at the marker's position, and the icon is drawn around it,
  // so that the icon's anchor is placed at the marker's position.
  _buildIcon(icon) {
    if (typeof icon === 'string') {
      icon = { url: icon };
    }
    let image;
    if (typeof icon.path === 'string') {
      image = this._buildSymbol(icon);
    } else if (icon.url) {
      image = this._buildImage(icon);
    } else {
      // google.maps.SymbolPath constants have no equivalent in Advanced Markers: the default pin is shown.
      return null;
    }
    const content = document.createElement('div');
    content.style.position = 'relative';
    content.style.width = '0';
    content.style.height = '0';
    content.appendChild(image);
    return content;
  },

  _buildImage(icon) {
    const image = document.createElement('img');
    image.src = icon.url;
    image.style.position = 'absolute';
    if (icon.scaledSize) {
      image.style.width = `${icon.scaledSize.width}px`;
      image.style.height = `${icon.scaledSize.height}px`;
    }
    // By default, the anchor is the center of the bottom of the image, as in google.maps.Icon
    image.style.transform = icon.anchor
      ? `translate(${-icon.anchor.x}px, ${-icon.anchor.y}px)`
      : 'translate(-50%, -100%)';
    return image;
  },

  // Same defaults as google.maps.Symbol in markers
  _buildSymbol(symbol) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const scale = symbol.scale != null ? symbol.scale : 1;
    const anchor = symbol.anchor || { x: 0, y: 0 };
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '1');
    svg.setAttribute('height', '1');
    svg.style.position = 'absolute';
    svg.style.overflow = 'visible';
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', symbol.path);
    path.setAttribute('fill', symbol.fillColor || 'black');
    path.setAttribute('fill-opacity', symbol.fillOpacity != null ? symbol.fillOpacity : 0);
    path.setAttribute('stroke', symbol.strokeColor || 'black');
    path.setAttribute('stroke-opacity', symbol.strokeOpacity != null ? symbol.strokeOpacity : 1);
    path.setAttribute('stroke-width', symbol.strokeWeight != null ? symbol.strokeWeight : scale);
    // The stroke weight is in pixels, so it isn't scaled with the path
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('transform',
      `rotate(${symbol.rotation || 0}) scale(${scale}) translate(${-anchor.x}, ${-anchor.y})`);
    svg.appendChild(path);
    return svg;
  },

  _clickEventsChanged() {
    if (this.marker) {
      if (this.clickEvents) {
        this._forwardEvent('click');
        this._forwardDomEvent('dblclick', 'dblclick');
        this._forwardDomEvent('contextmenu', 'rightclick');
        this._setupTouchAndHold();
      } else {
        this._clearListener('click');
        this._clearListener('dblclick');
        this._clearListener('rightclick');
      }
    }
  },

  _mouseEventsChanged() {
    if (this.marker) {
      if (this.mouseEvents) {
        this._forwardDomEvent('mousedown', 'mousedown');
        this._forwardDomEvent('mousemove', 'mousemove');
        // mouseenter/mouseleave, so that moving over the parts of the marker's content
        // fires once, as google.maps.Marker's mouseover/mouseout do.
        this._forwardDomEvent('mouseleave', 'mouseout');
        this._forwardDomEvent('mouseenter', 'mouseover');
        this._forwardDomEvent('mouseup', 'mouseup');
      } else {
        this._clearListener('mousedown');
        this._clearListener('mousemove');
        this._clearListener('mouseout');
        this._clearListener('mouseover');
        this._clearListener('mouseup');
      }
    }
  },

  _dragEventsChanged() {
    if (this.marker) {
      if (this.dragEvents) {
        this._forwardEvent('drag');
        this._forwardEvent('dragend');
        this._forwardEvent('dragstart');
      } else {
        this._clearListener('drag');
        this._clearListener('dragend');
        this._clearListener('dragstart');
      }
    }
  },

  // title, hidden and draggable are native attributes, as in google-map-marker.
  // They are observed so that changes made after the marker is created are applied too.
  _observeNativeAttributes() {
    if (this._attributeObserver) {
      return;
    }
    this._attributeObserver = new MutationObserver(this._applyNativeAttributes.bind(this));
    this._attributeObserver.observe(this, {
      attributes: true,
      attributeFilter: ['title', 'hidden', 'draggable'],
    });
  },

  _applyNativeAttributes() {
    if (this.marker) {
      this.marker.title = this.title;
      this.marker.gmpDraggable = this.draggable;
      // Visibility is set through CSS and not through `marker.map`, because MarkerClusterer
      // uses `map` to hide the markers grouped in a cluster.
      // `marker.hidden` is not used either: the marker's own styles keep it displayed.
      this.marker.style.display = this.hidden ? 'none' : '';
      // The infowindow would remain open without the marker
      if (this.hidden) {
        this.open = false;
      }
    }
  },

  _zIndexChanged() {
    if (this.marker) {
      this.marker.zIndex = this.zIndex;
    }
  },

  _mapChanged() {
    // Marker will be rebuilt, so disconnect existing one from old map and listeners.
    if (this.marker) {
      // Before removing the marker from the map, so that the infowindow is reopened on the new marker.
      this._destroyInfoWindow();
      this._clearTouchTimer();
      this._touchHoldMarker = null;
      this.marker.map = null;
      google.maps.event.clearInstanceListeners(this.marker);
    }

    if (this.map && this.map instanceof google.maps.Map) {
      this._mapReady();
    }
  },

  _contentChanged() {
    if (this._contentObserver) { this._contentObserver.disconnect(); }
    // Watch for future updates.
    this._contentObserver = new MutationObserver(this._contentChanged.bind(this));
    this._contentObserver.observe(this, {
      childList: true,
      subtree: true,
    });

    const content = this.innerHTML.trim();
    if (content) {
      const created = !this.info;
      if (created) {
        // Create a new infowindow
        this.info = new google.maps.InfoWindow();
        this.openInfoHandler_ = google.maps.event.addListener(this.marker, 'click', () => {
          // Swallow the click following a touch-and-hold
          if (this._suppressNextClick) {
            return;
          }
          this.open = true;
        });

        // 'close' instead of 'closeclick', so that `open` is also updated when the infowindow
        // is closed in other ways than its close button.
        this.closeInfoHandler_ = google.maps.event.addListener(this.info, 'close', () => {
          if (!this._settingMarkerMap) {
            this.open = false;
          }
        });
      }
      this.info.setContent(content);
      if (created) {
        // Honor an `open` set before the content was available.
        this._openChanged();
      }
    } else if (this.info) {
      // It doesn't make sense to have an empty infowindow.
      this.open = false;
      this._destroyInfoWindow();
    }
  },

  // Closes the infowindow without changing `open`, so that it is opened again when the marker is rebuilt.
  _destroyInfoWindow() {
    if (this.info) {
      // Listeners are removed first, so that closing the infowindow doesn't set `open` to false.
      google.maps.event.removeListener(this.openInfoHandler_);
      google.maps.event.removeListener(this.closeInfoHandler_);
      this.info.close();
      this.info = null;
    }
  },

  // Open and close events are only fired when the infowindow's state actually changes,
  // not when it is opened again after the marker is rebuilt.
  _openChanged() {
    if (!this.info) {
      return;
    }
    if (this.open) {
      this.info.open(this.map, this.marker);
      if (!this._infoOpen) {
        this._infoOpen = true;
        this.fire('google-map-marker-open');
      }
    } else if (this._infoOpen) {
      this.info.close();
      this._infoOpen = false;
      this.fire('google-map-marker-close');
    }
  },

  _mapReady() {
    this._listeners = {};
    // The 'marker' library is loaded together with the Maps API (see @flowingcode/google-apis).
    this.marker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      position: this._getPosition(),
      zIndex: this.zIndex,
      // Same default as google.maps.Marker: shows a pointer cursor and makes the marker focusable.
      gmpClickable: true,
    });
    google.maps.event.addListener(this.marker, 'dragend', (e) => {
      this.latitude = e.latLng.lat();
      this.longitude = e.latLng.lng();
    });
    this._updateContent();
    this._applyNativeAttributes();
    this._observeNativeAttributes();
    this._contentChanged();
    this._clickEventsChanged();
    this._dragEventsChanged();
    this._mouseEventsChanged();
  },

  // Both Maps API listeners and the DOM listeners added by _forwardDomEvent have a remove() method.
  _clearListener(name) {
    if (this._listeners && this._listeners[name]) {
      this._listeners[name].remove();
      this._listeners[name] = null;
    }
  },

  // Uses addListener instead of the 'gmp-' DOM events recommended by the Maps API (which logs
  // a warning about it), because 'gmp-' events don't carry latLng and domEvent, and both are
  // part of the event detail fired by google-map-marker.
  _forwardEvent(name) {
    this._clearListener(name);
    this._listeners[name] = google.maps.event.addListener(this.marker, name, (event) => {
      // Swallow the click following a touch-and-hold
      if (name === 'click' && this._suppressNextClick) {
        return;
      }
      this.fire(`google-map-marker-${name}`, event);
    });
  },

  // AdvancedMarkerElement only fires 'click' as a Maps API event, so the other mouse events are
  // taken from the DOM. The event detail has the same latLng and domEvent as google-map-marker's
  // events, where latLng is the marker's position.
  _forwardDomEvent(domName, name) {
    this._clearListener(name);
    const marker = this.marker;
    const handler = (domEvent) => {
      if (name === 'rightclick') {
        // The platform already fired a right click, so a pending touch-and-hold must not fire another one.
        this._clearTouchTimer();
        if (this._suppressNextClick) {
          return; // a touch-and-hold already fired it
        }
      }
      this.fire(`google-map-marker-${name}`, { latLng: this.getPosition(), domEvent });
    };
    marker.addEventListener(domName, handler);
    this._listeners[name] = { remove: () => marker.removeEventListener(domName, handler) };
  },

  _clearTouchTimer() {
    if (this._touchTimer) {
      clearTimeout(this._touchTimer);
      this._touchTimer = null;
    }
  },

  /**
   * Sets up touch-and-hold gesture detection to simulate a right-click on touch devices,
   * as google-map-marker does.
   *
   * A long press fires a 'google-map-marker-rightclick' event, and the click that follows it is
   * swallowed. The gesture is cancelled if the user releases too early, moves off the marker or
   * starts dragging it.
   */
  _setupTouchAndHold() {
    // Only enable when clickEvents are on and device is touch/coarse pointer
    const isTouch =
      (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) ||
      (typeof matchMedia === "function" &&
        matchMedia("(pointer: coarse)").matches);
    // Installed once per marker, which is rebuilt when the map changes.
    if (!this.clickEvents || !isTouch || this._touchHoldMarker === this.marker) {
      return;
    }
    this._touchHoldMarker = this.marker;

    // Duration in milliseconds to consider a press a "long press".
    const LONG_PRESS_DURATION = 800;

    const marker = this.marker;
    marker.addEventListener('pointerdown', (domEvent) => {
      // A new gesture starts: a swallowed click of a previous touch-and-hold no longer applies.
      // The flag is cleared here, and not by the click handlers, so that all of them swallow the same click.
      this._suppressNextClick = false;

      // Respect runtime toggling of clickEvents, ignore mouse pointers (touchscreen laptops),
      // and ignore the secondary button (e.g. of a pen)
      if (!this.clickEvents || domEvent.pointerType === 'mouse' || domEvent.button === 2) {
        return;
      }

      this._clearTouchTimer();
      this._touchTimer = setTimeout(() => {
        this._touchTimer = null;
        this._suppressNextClick = true;
        this.fire('google-map-marker-rightclick', { latLng: this.getPosition(), domEvent });
      }, LONG_PRESS_DURATION);
    });

    // Cancel the timer if the user releases, drags, or moves off the marker
    const clearTimer = () => this._clearTouchTimer();
    marker.addEventListener('pointerup', clearTimer);
    marker.addEventListener('pointercancel', clearTimer);
    marker.addEventListener('pointerleave', clearTimer);
    google.maps.event.addListener(marker, 'dragstart', clearTimer);
  },

  /* Same API as google-map-marker, used by google-map and for marker clustering */
  getPosition() {
    return new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude));
  },

  setMap(map) {
    this._setMarkerMap(map);
  },

  getVisible() {
    return !this.hidden;
  },

});
