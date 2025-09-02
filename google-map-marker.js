import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

function setupDragHandler_() {
  if (this.draggable) {
    this.dragHandler_ = google.maps.event.addListener(this.marker, 'dragend', onDragEnd_.bind(this));
  } else {
    google.maps.event.removeListener(this.dragHandler_);
    this.dragHandler_ = null;
  }
}

function onDragEnd_(e, details, sender) {
  this.latitude = e.latLng.lat();
  this.longitude = e.latLng.lng();
}

Polymer({
  _template: html`
    <style>
      :host {
        display: none;
      }
    </style>

    <slot></slot>
`,

  is: 'google-map-marker',

  /**
   * Fired when the marker icon was clicked. Requires the clickEvents attribute to be true.
   *
   * @param {google.maps.MouseEvent} event The mouse event.
   * @event google-map-marker-click
   */

  /**
   * Fired when the marker icon was double clicked. Requires the clickEvents attribute to be true.
   *
   * @param {google.maps.MouseEvent} event The mouse event.
   * @event google-map-marker-dblclick
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
   * Fired for a mousedown on the marker. Requires the mouseEvents attribute to be true.
   *
   * @event google-map-marker-mousedown
   * @param {google.maps.MouseEvent} event The mouse event.
   */

  /**
   * Fired when the DOM `mousemove` event is fired on the marker. Requires the mouseEvents
   * attribute to be true.
   *
   * @event google-map-marker-mousemove
   * @param {google.maps.MouseEvent} event The mouse event.
   */

  /**
   * Fired when the mouse leaves the area of the marker icon. Requires the mouseEvents attribute to be
   * true.
   *
   * @event google-map-marker-mouseout
   * @param {google.maps.MouseEvent} event The mouse event.
   */

  /**
   * Fired when the mouse enters the area of the marker icon. Requires the mouseEvents attribute to be
   * true.
   *
   * @event google-map-marker-mouseover
   * @param {google.maps.MouseEvent} event The mouse event.
   */

  /**
   * Fired for a mouseup on the marker. Requires the mouseEvents attribute to be true.
   *
   * @event google-map-marker-mouseup
   * @param {google.maps.MouseEvent} event The mouse event.
   */

  /**
   * Fired for a rightclick on the marker. Requires the clickEvents attribute to be true.
   *
   * @event google-map-marker-rightclick
   * @param {google.maps.MouseEvent} event The mouse event.
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
     * A Google Maps marker object.
     *
     * @type google.maps.Marker
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
     * When true, marker *click events are automatically registered.
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
     * Image URL for the marker icon.
     *
     * @type string|google.maps.Icon|google.maps.Symbol
     */
    icon: {
      type: Object,
      value: null,
      observer: '_iconChanged',
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
     * Z-index for the marker icon.
     */
    zIndex: {
      type: Number,
      value: 0,
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
     * The marker's label.
     */
    label: {
      type: String,
      value: null,
      observer: '_labelChanged',
    },

    /**
     * A animation for the marker. "DROP" or "BOUNCE". See
     * https://developers.google.com/maps/documentation/javascript/examples/marker-animations.
     */
    animation: {
      type: String,
      value: null,
      observer: '_animationChanged',
    },

    /**
     * Specifies whether the InfoWindow is open or not
     */
    open: {
      type: Boolean,
      value: false,
      observer: '_openChanged',
    },

    /**
     * Enables/disables marker optimization. If enabled, many markers are rendered 
     * as a single static element. 
     * See https://developers.google.com/maps/documentation/javascript/markers?hl=en#optimize
     */
    optimized: {
      type: Boolean,
      value: false,
      notify: true,
    }
  },

  observers: [
    '_updatePosition(latitude, longitude)',
  ],

  detached() {
    if (this.marker) {
      this._listeners = {};
      this.setMap(null);
    }
    if (this._contentObserver) { this._contentObserver.disconnect(); }
  },

  attached() {
    // If element is added back to DOM, put it back on the map.
    if (this.marker) {
      this.setMap(this.map);
    }
  },

  _updatePosition() {
    if (this.marker && this.latitude != null && this.longitude != null) {
      this.marker.setPosition(new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude)));
    }
  },

  _clickEventsChanged() {
    if (this.marker) {
      if (this.clickEvents) {
        this._forwardEvent('click');
        this._forwardEvent('dblclick');
        this._forwardEvent('rightclick');
        // Ensure long-press is set up if enabling at runtime
        if (!this._touchHoldInstalled) {
          this._setupTouchAndHold();
        }
      } else {
        this._clearListener('click');
        this._clearListener('dblclick');
        this._clearListener('rightclick');
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

  _mouseEventsChanged() {
    if (this.marker) {
      if (this.mouseEvents) {
        this._forwardEvent('mousedown');
        this._forwardEvent('mousemove');
        this._forwardEvent('mouseout');
        this._forwardEvent('mouseover');
        this._forwardEvent('mouseup');
      } else {
        this._clearListener('mousedown');
        this._clearListener('mousemove');
        this._clearListener('mouseout');
        this._clearListener('mouseover');
        this._clearListener('mouseup');
      }
    }
  },

  _animationChanged() {
    if (this.marker) {
      this.marker.setAnimation(google.maps.Animation[this.animation]);
    }
  },

  _labelChanged() {
    if (this.marker) {
      this.marker.setLabel(this.label);
    }
  },

  _iconChanged() {
    if (this.marker) {
      this.marker.setIcon(this.icon);
    }
  },

  _zIndexChanged() {
    if (this.marker) {
      this.marker.setZIndex(this.zIndex);
    }
  },

  _mapChanged() {
    // Marker will be rebuilt, so disconnect existing one from old map and listeners.
    if (this.marker) {
      this.setMap(null);
      google.maps.event.clearInstanceListeners(this.marker);
      // Reset the touch-and-hold installation flag so it can be set up again
      this._touchHoldInstalled = false;
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
      if (!this.info) {
        // Create a new infowindow
        this.info = new google.maps.InfoWindow();
        this.openInfoHandler_ = google.maps.event.addListener(this.marker, 'click', () => {
          // Swallow the synthetic click following a long-press
          if (this._suppressNextClick) {
            this._suppressNextClick = false;
            return;
          }
          this.open = true;
        });

        this.closeInfoHandler_ = google.maps.event.addListener(this.info, 'closeclick', () => {
          this.open = false;
        });
      }
      this.info.setContent(content);
    } else if (this.info) {
      // Destroy the existing infowindow.  It doesn't make sense to have an empty one.
      google.maps.event.removeListener(this.openInfoHandler_);
      google.maps.event.removeListener(this.closeInfoHandler_);
      this.info = null;
    }
  },

  _openChanged() {
    if (this.info) {
      if (this.open) {
        this.info.open(this.map, this.marker);
        this.fire('google-map-marker-open');
      } else {
        this.info.close();
        this.fire('google-map-marker-close');
      }
    }
  },

  _mapReady() {
    this._listeners = {};
    this.marker = new google.maps.Marker({
      map: this.map,
      position: {
        lat: parseFloat(this.latitude),
        lng: parseFloat(this.longitude),
      },
      title: this.title,
      animation: google.maps.Animation[this.animation],
      draggable: this.draggable,
      visible: !this.hidden,
      icon: this.icon,
      label: this.label,
      zIndex: this.zIndex,
      optimized: this.optimized,
    });
    this._contentChanged();
    this._clickEventsChanged();
    this._dragEventsChanged();
    this._mouseEventsChanged();
    this._openChanged();
    this._setupTouchAndHold();
    setupDragHandler_.bind(this)();
  },

  _clearListener(name) {
    if (this._listeners && this._listeners[name]) {
      google.maps.event.removeListener(this._listeners[name]);
      this._listeners[name] = null;
    }
  },

  _forwardEvent(name) {
    this._listeners[name] = google.maps.event.addListener(this.marker, name, (event) => {
      if (name === 'click' && this._suppressNextClick) {
        this._suppressNextClick = false;
        return; // swallow the synthetic click caused by long-press
      }
      this.fire(`google-map-marker-${name}`, event);
    });
  },

  attributeChanged(attrName) {
    if (!this.marker) {
      return;
    }

    // Cannot use *Changed watchers for native properties.
    switch (attrName) {
      case 'hidden':
        this.marker.setVisible(!this.hidden);
        break;
      case 'draggable':
        this.marker.setDraggable(this.draggable);
        setupDragHandler_.bind(this)();
        break;
      case 'title':
        this.marker.setTitle(this.title);
        break;
    }
  },

  /* Override getPosition, setMap, getVisible to allow marker's clustering */
  getPosition() {
    return new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude));
  },

  setMap(map) {
    this.marker.setMap(map);
  },

  getVisible() {
    return this.marker.getVisible();
  },

  /**
   * Sets up touch-and-hold gesture detection to simulate a right-click on mobile devices.
   *
   * The implementation attaches the necessary event listeners to the marker to detect a long press (touch and hold).
   * When a long press is detected, it fires a 'google-map-marker-rightclick' custom event (which the server-side API can listen for).
   * It also handles the cancellation of the gesture if the user moves their finger, releases it too early, or starts dragging the marker.
   * Finally, it prevents a standard 'click' event from firing after a successful long press to avoid duplicate actions. 
   */
  _setupTouchAndHold() {
    // Only enable when clickEvents are on and device is touch/coarse pointer
    const isTouch =
      (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) ||
      (typeof matchMedia === "function" &&
        matchMedia("(pointer: coarse)").matches);
    if (!this.clickEvents || !isTouch) {
      return; // Skip setup in non-touch environments
    }

    // Avoid double-binding listeners
    if (this._touchHoldInstalled) {
      return;
    }

    // Duration in milliseconds to consider a press a "long press".
    // This value balances being quick enough to feel responsive while being long 
    // enough to prevent accidental triggers. 800ms is a common choice.
    const LONG_PRESS_DURATION = 800;

    // Internal state variables
    this._touchTimer = null; // A timer to track the duration of the press
    this._suppressNextClick = this._suppressNextClick || false; // Flag to suppress the next click event if it follows a long press

    // Listen for 'mousedown', which fires on both desktop clicks and mobile touch-starts
    google.maps.event.addListener(this.marker, "mousedown", (e) => {

      // Respect runtime toggling of clickEvents
      if (!this.clickEvents) {
        return;
      }

      // Ignore secondary button (desktop right-click)
      if (e && e.domEvent && typeof e.domEvent.button === 'number' && e.domEvent.button === 2) {
        return;
      }

      if (this._touchTimer) clearTimeout(this._touchTimer);
      // Start the timer. If it completes, a long press has occurred.
      this._touchTimer = setTimeout(() => {
        // ensure the subsequent synthetic click is swallowed
        this._suppressNextClick = true; 
        // Fire the custom event that simulates a right-click
        this.fire("google-map-marker-rightclick", e);
        // timer consumed
        this._touchTimer = null;
      }, LONG_PRESS_DURATION);
    });

    // Helper function to cancel timer
    const clearTimer = () => {
      if (this._touchTimer) {
        clearTimeout(this._touchTimer);
        this._touchTimer = null;
      }
    };

    // Cancel the timer if the user releases, drags, or moves off the marker
    google.maps.event.addListener(this.marker, "mouseup", clearTimer);
    google.maps.event.addListener(this.marker, "dragstart", clearTimer);
    google.maps.event.addListener(this.marker, "mouseout", clearTimer);

    this._touchHoldInstalled = true;
  },  

});
