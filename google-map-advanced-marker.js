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
     * When true, marker click events are automatically registered.
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
    '_updatePin(pinBackground, pinBorderColor, pinGlyphColor, pinScale)',
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

  _updatePin() {
    if (!this.marker) {
      return;
    }
    const options = {};
    if (this.pinBackground) { options.background = this.pinBackground; }
    if (this.pinBorderColor) { options.borderColor = this.pinBorderColor; }
    if (this.pinGlyphColor) { options.glyphColor = this.pinGlyphColor; }
    if (this.pinScale) { options.scale = this.pinScale; }
    // Without options, null content restores the default pin.
    this.marker.content = Object.keys(options).length
      ? new google.maps.marker.PinElement(options)
      : null;
  },

  _clickEventsChanged() {
    if (this.marker) {
      if (this.clickEvents) {
        this._forwardEvent('click');
      } else {
        this._clearListener('click');
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
    this._updatePin();
    this._applyNativeAttributes();
    this._observeNativeAttributes();
    this._contentChanged();
    this._clickEventsChanged();
    this._dragEventsChanged();
  },

  _clearListener(name) {
    if (this._listeners && this._listeners[name]) {
      google.maps.event.removeListener(this._listeners[name]);
      this._listeners[name] = null;
    }
  },

  // Uses addListener instead of the 'gmp-' DOM events recommended by the Maps API (which logs
  // a warning about it), because 'gmp-' events don't carry latLng and domEvent, and both are
  // part of the event detail fired by google-map-marker.
  _forwardEvent(name) {
    this._clearListener(name);
    this._listeners[name] = google.maps.event.addListener(this.marker, name, (event) => {
      this.fire(`google-map-marker-${name}`, event);
    });
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
