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

  is: 'google-map-advanced-marker',

  /**
   * Fired when the marker was clicked. Requires the clickEvents attribute to be true.
   * Note: the map must have a valid mapId for advanced markers to be displayed.
   *
   * @param {google.maps.MapMouseEvent} event The mouse event.
   * @event google-map-marker-click
   */

  /**
   * Fired when the marker was double clicked. Requires the clickEvents attribute to be true.
   *
   * @param {google.maps.MapMouseEvent} event The mouse event.
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
   * @param {google.maps.MapMouseEvent} event The mouse event.
   */

  /**
   * Fired when the DOM `mousemove` event is fired on the marker. Requires the mouseEvents
   * attribute to be true.
   *
   * @event google-map-marker-mousemove
   * @param {google.maps.MapMouseEvent} event The mouse event.
   */

  /**
   * Fired when the mouse leaves the area of the marker. Requires the mouseEvents attribute to be
   * true.
   *
   * @event google-map-marker-mouseout
   * @param {google.maps.MapMouseEvent} event The mouse event.
   */

  /**
   * Fired when the mouse enters the area of the marker. Requires the mouseEvents attribute to be
   * true.
   *
   * @event google-map-marker-mouseover
   * @param {google.maps.MapMouseEvent} event The mouse event.
   */

  /**
   * Fired for a mouseup on the marker. Requires the mouseEvents attribute to be true.
   *
   * @event google-map-marker-mouseup
   * @param {google.maps.MapMouseEvent} event The mouse event.
   */

  /**
   * Fired for a rightclick (contextmenu) on the marker. Requires the clickEvents attribute to be true.
   *
   * @event google-map-marker-rightclick
   * @param {google.maps.MapMouseEvent} event The mouse event.
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
     * When true, marker mouse* events are automatically registered.
     */
    mouseEvents: {
      type: Boolean,
      value: false,
      observer: '_mouseEventsChanged',
    },

    /**
     * Z-index for the marker.
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
     * Image URL used as the marker's content, replacing the default pin.
     * Roughly equivalent to the classic marker's icon URL.
     */
    iconUrl: {
      type: String,
      value: null,
      observer: '_contentPropertiesChanged',
    },

    /**
     * Background color of the default pin. See
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions
     */
    background: {
      type: String,
      value: null,
      observer: '_contentPropertiesChanged',
    },

    /**
     * Border color of the default pin.
     */
    borderColor: {
      type: String,
      value: null,
      observer: '_contentPropertiesChanged',
    },

    /**
     * Color of the glyph displayed inside the default pin.
     */
    glyphColor: {
      type: String,
      value: null,
      observer: '_contentPropertiesChanged',
    },

    /**
     * Text glyph displayed inside the default pin.
     */
    glyph: {
      type: String,
      value: null,
      observer: '_contentPropertiesChanged',
    },

    /**
     * URL of an image glyph displayed inside the default pin. Takes precedence over glyph.
     */
    glyphUrl: {
      type: String,
      value: null,
      observer: '_contentPropertiesChanged',
    },

    /**
     * Scale of the default pin (1 is the default size).
     */
    scale: {
      type: Number,
      value: null,
      observer: '_contentPropertiesChanged',
    },

    /**
     * Collision behavior of the marker: "REQUIRED", "REQUIRED_AND_HIDES_OPTIONAL"
     * or "OPTIONAL_AND_HIDES_LOWER_PRIORITY". See
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#CollisionBehavior
     */
    collisionBehavior: {
      type: String,
      value: null,
      observer: '_collisionBehaviorChanged',
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
  ],

  detached() {
    this._clearTouchTimer();
    // Remove the marker from the map even if it is still being built asynchronously:
    // setMap records the requested state and _mapReady applies it after construction.
    // Listener subscriptions are kept so everything keeps working if the element is
    // reattached; they are released together with the marker itself.
    this.setMap(null);
    if (this._contentObserver) { this._contentObserver.disconnect(); }
  },

  attached() {
    // If element is added back to DOM, put it back on the map (unless hidden).
    if (this.map) {
      this.setMap(this.hidden ? null : this.map);
    }
    if (this.marker) {
      // Reinstall the light DOM observer disconnected on detach
      this._contentChanged();
    }
  },

  _updatePosition() {
    if (this.marker) {
      const lat = parseFloat(this.latitude);
      const lng = parseFloat(this.longitude);
      // clear the position (hiding the pin) when the coordinates are missing or invalid
      this.marker.position = isFinite(lat) && isFinite(lng) ? { lat: lat, lng: lng } : null;
      // notify the parent map so clustering can be refreshed: the cluster list is
      // otherwise only recomputed on marker add/remove, not on position change
      this.dispatchEvent(new CustomEvent('google-map-marker-position-changed', {
        bubbles: true,
        composed: true,
      }));
    }
  },

  _clickEventsChanged() {
    if (this.marker) {
      this._updateClickable();
      if (this.clickEvents) {
        this._forwardDomEvent('dblclick');
        this._forwardDomEvent('contextmenu', 'rightclick');
        // Ensure long-press is set up if enabling at runtime
        if (!this._touchHoldInstalled) {
          this._setupTouchAndHold();
        }
      } else {
        // also cancel a long-press already in progress
        this._clearTouchTimer();
        this._clearDomListener('dblclick');
        this._clearDomListener('contextmenu');
      }
    }
  },

  /**
   * Single dispatcher for marker clicks: swallows the synthetic click following a
   * long-press, then opens the InfoWindow and/or forwards the click event.
   */
  _onMarkerClick(event) {
    if (this._suppressNextClick) {
      this._suppressNextClick = false;
      return;
    }
    if (this.info) {
      this.open = true;
    }
    if (this.clickEvents) {
      this.fire('google-map-marker-click', {
        latLng: this.getPosition(),
        domEvent: event,
      });
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
      this._updateClickable();
      if (this.mouseEvents) {
        this._forwardDomEvent('mousedown');
        this._forwardDomEvent('mousemove');
        this._forwardDomEvent('mouseout');
        this._forwardDomEvent('mouseover');
        this._forwardDomEvent('mouseup');
      } else {
        this._clearDomListener('mousedown');
        this._clearDomListener('mousemove');
        this._clearDomListener('mouseout');
        this._clearDomListener('mouseover');
        this._clearDomListener('mouseup');
      }
    }
  },

  _zIndexChanged() {
    if (this.marker) {
      this.marker.zIndex = this.zIndex;
    }
  },

  _collisionBehaviorChanged() {
    if (this.marker) {
      this.marker.collisionBehavior = this.collisionBehavior
          ? google.maps.CollisionBehavior[this.collisionBehavior]
          : undefined;
    }
  },

  _contentPropertiesChanged() {
    if (this.marker) {
      this.marker.content = this._buildContent();
    }
  },

  _mapChanged() {
    // Invalidate any marker construction still awaiting the marker library, and any
    // pending long-press timer targeting the previous marker.
    this._mapGeneration = (this._mapGeneration || 0) + 1;
    this._clearTouchTimer();

    // Marker will be rebuilt, so disconnect existing one from old map and listeners.
    if (this.marker) {
      this.setMap(null);
      google.maps.event.clearInstanceListeners(this.marker);
      this._removeDomListeners();
      // Reset the touch-and-hold installation flag so it can be set up again,
      // and drop suppression flags left behind by a long-press on the old marker
      this._touchHoldInstalled = false;
      this._suppressNextClick = false;
      this._suppressNextContextmenu = false;
    }

    if (this.map && this.map instanceof google.maps.Map) {
      this._mapReady(this._mapGeneration);
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

    // Resolve the custom content element: adopt a new or replaced one, or drop the
    // reference when the previously-used element was removed from the light DOM, so
    // pin properties (or an icon) can take over again.
    const light = this.querySelector('[slot="content"]');
    let desired = this._customContent;
    if (light) {
      desired = light;
    } else if (this._customContent
        && !(this.marker && this.marker.content === this._customContent)) {
      // no light-DOM content, and it is not the marker's currently-adopted content:
      // the custom content was removed
      desired = null;
    }
    if (desired !== this._customContent) {
      this._customContent = desired;
      if (this.marker) {
        this.marker.content = this._buildContent();
      }
    }

    const content = this._getInfoWindowContent();
    if (content) {
      // honor an already-true open property when content first creates the InfoWindow
      const shouldOpen = !this.info && this.open;
      if (!this.info) {
        // Create a new infowindow; opening on click is handled by _onMarkerClick
        this.info = new google.maps.InfoWindow();
        this._updateClickable();
        this.closeInfoHandler_ = google.maps.event.addListener(this.info, 'closeclick', () => {
          this.open = false;
        });
      }
      this.info.setContent(content);
      if (shouldOpen) {
        this._openChanged();
      }
    } else if (this.info) {
      // Destroy the existing infowindow.  It doesn't make sense to have an empty one.
      this.info.close();
      google.maps.event.removeListener(this.closeInfoHandler_);
      this.info = null;
      this.open = false;
      this._updateClickable();
    }
  },

  /**
   * Returns the InfoWindow content from the light DOM, excluding the element
   * (if any) that is used as the marker's custom content.
   */
  _getInfoWindowContent() {
    const container = document.createElement('div');
    Array.prototype.forEach.call(this.childNodes, (node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('slot') === 'content') {
        return;
      }
      container.appendChild(node.cloneNode(true));
    });
    return container.innerHTML.trim();
  },

  _openChanged() {
    if (this.info) {
      if (this.open) {
        this.info.open({ map: this.map, anchor: this.marker });
        this.fire('google-map-marker-open');
      } else {
        this.info.close();
        this.fire('google-map-marker-close');
      }
    }
  },

  async _mapReady(generation) {
    this._listeners = {};
    this._domListeners = {};
    if (!(google.maps.marker && google.maps.marker.AdvancedMarkerElement)) {
      await google.maps.importLibrary('marker');
    }
    // The map may have changed or been cleared while the library was loading; only
    // the construction attempt for the latest map change may proceed.
    if (generation !== this._mapGeneration || !this.map
        || !(this.map instanceof google.maps.Map)) {
      return;
    }
    if (!this.map.get('mapId')) {
      console.warn('google-map-advanced-marker: the map has no mapId set. '
        + 'Advanced markers require a valid mapId to be displayed. See '
        + 'https://developers.google.com/maps/documentation/get-map-id');
    }
    const options = {
      map: this.hidden ? null : this.map,
      title: this.title || '',
      gmpDraggable: this.draggable,
      zIndex: this.zIndex,
      content: this._buildContent(),
    };
    // position is optional: leave it unset until there are valid coordinates
    // (_updatePosition assigns it once latitude/longitude are set)
    const lat = parseFloat(this.latitude);
    const lng = parseFloat(this.longitude);
    if (isFinite(lat) && isFinite(lng)) {
      options.position = { lat: lat, lng: lng };
    }
    this.marker = new google.maps.marker.AdvancedMarkerElement(options);
    if (this._pendingMap !== undefined) {
      // apply the map state requested (e.g. by the marker clusterer) while building
      this.marker.map = this._pendingMap;
      this._pendingMap = undefined;
    }
    // Single click listener dispatching to the InfoWindow and click-event forwarding,
    // so the long-press suppression flag is consumed exactly once per click.
    // gmp-click is the DOM click event of advanced markers, recommended over the
    // legacy 'click' maps event.
    const clickHandler = (e) => this._onMarkerClick(e);
    this.marker.addEventListener('gmp-click', clickHandler);
    this._domListeners['gmp-click'] = clickHandler;
    this._collisionBehaviorChanged();
    // register the latitude/longitude sync first, so dragend forwarding observes
    // updated element coordinates
    setupDragHandler_.bind(this)();
    // an initially-open InfoWindow is handled by _contentChanged (shouldOpen)
    this._contentChanged();
    this._clickEventsChanged();
    this._dragEventsChanged();
    this._mouseEventsChanged();
    this._setupTouchAndHold();
  },

  /**
   * Builds the marker's content element: a slotted custom element (slot="content"),
   * an image (iconUrl), a customized PinElement, or null for the default pin.
   */
  _buildContent() {
    if (this._customContent === undefined) {
      // Initial resolution before the content observer runs. Afterwards _customContent
      // is managed by _contentChanged (an explicit element or null), so it is not
      // re-queried here — once the marker adopts the element it is moved out of the
      // light DOM and would no longer be found.
      this._customContent = this.querySelector('[slot="content"]') || null;
    }
    if (this._customContent
        && !this.contains(this._customContent)
        && !(this.marker && this.marker.contains(this._customContent))) {
      // the custom content element was removed: it is no longer in the light DOM, nor
      // adopted by the marker (marker.contains stays true while the marker is off the
      // map, e.g. clustered/hidden, so this does not misfire). Drop it so pin
      // properties or an icon can take over.
      this._customContent = null;
    }
    if (this._customContent) {
      return this._customContent;
    }
    if (this.iconUrl) {
      const img = document.createElement('img');
      img.src = this.iconUrl;
      return img;
    }
    if (this.background || this.borderColor || this.glyphColor || this.glyph
        || this.glyphUrl || this.scale != null) {
      const options = {};
      if (this.background) { options.background = this.background; }
      if (this.borderColor) { options.borderColor = this.borderColor; }
      if (this.glyphColor) { options.glyphColor = this.glyphColor; }
      if (this.scale != null) { options.scale = this.scale; }
      // glyphText/glyphSrc replace the deprecated glyph option; fall back to it on
      // API versions that predate them
      const supportsNewGlyph = 'glyphText' in google.maps.marker.PinElement.prototype;
      if (this.glyphUrl) {
        if (supportsNewGlyph) {
          options.glyphSrc = this.glyphUrl;
        } else {
          const glyphImg = document.createElement('img');
          glyphImg.src = this.glyphUrl;
          options.glyph = glyphImg;
        }
      } else if (this.glyph) {
        if (supportsNewGlyph) {
          options.glyphText = this.glyph;
        } else {
          options.glyph = this.glyph;
        }
      }
      const pin = new google.maps.marker.PinElement(options);
      // In newer API versions the PinElement is itself the content element; older
      // versions expose it through the deprecated element property
      return pin instanceof HTMLElement ? pin : pin.element;
    }
    return null;
  },

  /**
   * Advanced markers only receive click events when gmpClickable is true; mouse
   * events also require the marker to be interactive to be delivered.
   */
  _updateClickable() {
    if (this.marker) {
      this.marker.gmpClickable = this.clickEvents || this.mouseEvents || !!this.info;
    }
  },

  _clearListener(name) {
    if (this._listeners && this._listeners[name]) {
      google.maps.event.removeListener(this._listeners[name]);
      this._listeners[name] = null;
    }
  },

  _forwardEvent(name) {
    this._listeners[name] = google.maps.event.addListener(this.marker, name, (event) => {
      this.fire(`google-map-marker-${name}`, this._normalizeEvent(event));
    });
  },

  /**
   * Forwards a DOM event fired on the advanced marker element (which, unlike the
   * classic marker, lives in the map's DOM) as a google-map-marker-* event. Used
   * for events that AdvancedMarkerElement does not support natively.
   */
  _forwardDomEvent(domName, eventName) {
    this._clearDomListener(domName);
    const handler = (e) => {
      if (domName === 'contextmenu') {
        e.preventDefault();
        // A native contextmenu (fired by the browser on touch long-press) supersedes
        // a still-pending long-press timer, and is redundant after the timer already
        // fired the rightclick — either way, only one rightclick must be emitted.
        this._clearTouchTimer();
        if (this._suppressNextContextmenu) {
          this._suppressNextContextmenu = false;
          return;
        }
      }
      e.stopPropagation();
      this.fire(`google-map-marker-${eventName || domName}`, {
        latLng: this.getPosition(),
        domEvent: e,
      });
    };
    this.marker.addEventListener(domName, handler);
    this._domListeners[domName] = handler;
  },

  _clearDomListener(name) {
    if (this._domListeners && this._domListeners[name]) {
      this.marker.removeEventListener(name, this._domListeners[name]);
      this._domListeners[name] = null;
    }
  },

  _removeDomListeners() {
    if (this._domListeners && this.marker) {
      Object.keys(this._domListeners).forEach((name) => this._clearDomListener(name));
    }
    this._domListeners = {};
  },

  _normalizeEvent(event) {
    // Ensure the payload always carries a latLng, as classic marker events do.
    event = event || {};
    if (!event.latLng) {
      event.latLng = this.getPosition();
    }
    return event;
  },

  attributeChanged(attrName) {
    if (!this.marker) {
      return;
    }

    // Cannot use *Changed watchers for native properties.
    switch (attrName) {
      case 'hidden':
        this.marker.map = this.hidden ? null : this.map;
        break;
      case 'draggable':
        this.marker.gmpDraggable = this.draggable;
        setupDragHandler_.bind(this)();
        break;
      case 'title':
        this.marker.title = this.title;
        break;
    }
  },

  /* Override getPosition, setMap, getVisible to allow marker's clustering */
  getPosition() {
    const lat = parseFloat(this.latitude);
    const lng = parseFloat(this.longitude);
    // null when there are no valid coordinates, so unpositioned markers are filtered
    // out before clustering; the parent map refreshes the cluster when the position
    // changes, so a marker is never left in the clusterer with a null position
    return isFinite(lat) && isFinite(lng) ? new google.maps.LatLng(lat, lng) : null;
  },

  setMap(map) {
    if (this.marker) {
      this.marker.map = map;
    } else {
      // The advanced marker is built asynchronously (the marker library may still be
      // loading), so remember the last requested state (e.g. from the marker clusterer)
      // to apply it once the marker is built.
      this._pendingMap = map;
    }
  },

  getVisible() {
    return !this.hidden;
  },

  /**
   * Sets up touch-and-hold gesture detection to simulate a right-click on mobile devices.
   *
   * Mirrors the behavior of google-map-marker, but uses DOM pointer events on the
   * advanced marker element instead of google.maps.event mouse events (which advanced
   * markers do not support).
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
    const LONG_PRESS_DURATION = 800;

    // Internal state variables
    this._touchTimer = null; // A timer to track the duration of the press
    this._suppressNextClick = this._suppressNextClick || false; // Flag to suppress the next click event if it follows a long press

    this.marker.addEventListener('pointerdown', (e) => {

      // A new gesture starts (any pointer type): drop suppression flags a previous
      // long-press may have left behind (e.g. when the browser fired no click after it)
      this._suppressNextClick = false;
      this._suppressNextContextmenu = false;

      // Only handle touch-like primary pointers: a held mouse button must not
      // simulate a right-click on touch-capable laptops
      if (e.pointerType === 'mouse'
          || (typeof e.button === 'number' && e.button !== 0)) {
        return;
      }

      // Respect runtime toggling of clickEvents
      if (!this.clickEvents) {
        return;
      }

      if (this._touchTimer) clearTimeout(this._touchTimer);
      // Start the timer. If it completes, a long press has occurred.
      this._touchTimer = setTimeout(() => {
        // ensure the subsequent synthetic click and native contextmenu are swallowed
        this._suppressNextClick = true;
        this._suppressNextContextmenu = true;
        // Fire the custom event that simulates a right-click
        this.fire("google-map-marker-rightclick", {
          latLng: this.getPosition(),
          domEvent: e,
        });
        // timer consumed
        this._touchTimer = null;
      }, LONG_PRESS_DURATION);
    });

    // Cancel the timer if the user releases, drags, or moves off the marker
    const clearTimer = () => this._clearTouchTimer();
    this.marker.addEventListener('pointerup', clearTimer);
    this.marker.addEventListener('pointerleave', clearTimer);
    this.marker.addEventListener('pointercancel', clearTimer);
    google.maps.event.addListener(this.marker, 'dragstart', clearTimer);

    this._touchHoldInstalled = true;
  },

  /**
   * Cancels a pending long-press timer, so it cannot fire a rightclick for a marker
   * that was removed or rebuilt (nor suppress the next real click).
   */
  _clearTouchTimer() {
    if (this._touchTimer) {
      clearTimeout(this._touchTimer);
      this._touchTimer = null;
    }
  },

});
