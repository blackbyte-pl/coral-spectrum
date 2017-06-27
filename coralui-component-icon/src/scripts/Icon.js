/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2017 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
import Component from 'coralui-mixin-component';
import {transform, validate} from 'coralui-util';

/**
 Regex used to remove the modifier classes. Size related classes are not matched this regex.
 
 @ignore
 */
const ICON_REGEX = /[\s?]coral-Icon--(?!size(XXS|XS|S|M|L))\w+/g;

/**
 Regex used to match URLs. Assume it's a URL if it has a slash, colon, or dot.
 
 @ignore
 */
const URL_REGEX = /\/|:|\./g;

/**
 Regex used to split camel case icon names into more screen-reader friendly alt text.
 
 @ignore
 */
const SPLIT_CAMELCASE_REGEX = /([a-z0-9])([A-Z])/g;

/**
 Icons can be rendered in different sizes. It follows the shirt sizing naming convention to help you remember them
 easily.
 
 @enum {String}
 @memberof Coral.Icon
 */
const size = {
  /** Extra extra small size icon, typically 9px size. */
  EXTRA_EXTRA_SMALL: 'XXS',
  /** Extra small size icon, typically 12px size. */
  EXTRA_SMALL: 'XS',
  /** Small size icon, typically 18px size. This is the default size. */
  SMALL: 'S',
  /** Medium size icon, typically 24px size. */
  MEDIUM: 'M',
  /** Large icon, typically 36px size. */
  LARGE: 'L',
  /** Extra large icon, typically 48px size. */
  EXTRA_LARGE: 'XL',
  /** Extra extra large icon, typically 72px size. */
  EXTRA_EXTRA_LARGE: 'XXL'
};

// icon's base classname
const CLASSNAME = 'coral-Icon';

// builds an array containing all possible size classnames. this will be used to remove classnames when the size
// changes
const ALL_SIZE_CLASSES = [];
for (let sizeValue in size) {
  ALL_SIZE_CLASSES.push(`${CLASSNAME}--size${size[sizeValue]}`);
}

/**
 @class Coral.Icon
 @classdesc An Icon component
 @extends Coral.Component
 @htmltag coral-icon
 */
class Icon extends HTMLElement {
  constructor() {
    super();
    
    this._elements = {};
  }
  
  /**
   Icon name accordion to the CloudUI Icon sheet.
   
   @type {String}
   @default ""
   @htmlattribute icon
   @htmlattributereflected
   @memberof Coral.Icon#
   */
  get icon() {
    return this._icon || '';
  }
  set icon(value) {
    this._icon = transform.string(value).trim();
    transform.reflect(this, 'icon', this._icon);
    
    // removes the old class.
    this.className = this.className.replace(ICON_REGEX, '').trim();
  
    // sets the desired icon
    if (this._icon) {
      // Detect if it's a URL
      if (this._icon.match(URL_REGEX)) {
        // Note that we're an image so we hide the font-related goodies
        this.classList.add('is-image');
        
        // Create an image and add it to the icon
        const img = this._elements.image = this._elements.image || document.createElement('img');
        img.className = `${CLASSNAME}-image`;
        img.src = this.icon;
        this.appendChild(img);
      }
      else {
        if (this._elements.image && this._elements.image.parentNode === this) {
          // Remove image related stuff
          this.removeChild(this._elements.image);
          this.classList.remove('is-image');
        }
        this.classList.add(`${CLASSNAME}--${this._icon}`);
      }
    }
    
    this._updateAltText();
  }
  
  /**
   Size of the icon. It accepts both lower and upper case sizes.
   
   @type {Coral.Icon.size}
   @default Coral.Icon.size.SMALL
   @htmlattribute size
   @htmlattributereflected
   @memberof Coral.Icon#
   */
  get size() {
    return this._size || size.SMALL;
  }
  set size(value) {
    value = transform.string(value).toUpperCase();
    
    if (validate.enumeration(size)(value)) {
      this._size = value;
      transform.reflect(this, 'size', this._size);
      
      // removes all the existing sizes
      this.classList.remove.apply(this.classList, ALL_SIZE_CLASSES);
      // adds the new size
      this.classList.add(`${CLASSNAME}--size${this._size}`);
      
      this._updateAltText();
    }
  }
  
  /**
   Alternative text to identify the icon for accessibility.
   When no <code>alt</code> attribute is provided, the icon will fallback to using either the <code>title</code>
   attribute or icon name as alternative text for accessibility. However, by explicitly setting the <code>alt</code>
   attribute to an empty string in markup or by using the <code>setAttribute</code> method, one can override the default
   behavior to avoid redundancy or to indicate that the icon is purely decorative in elements like labelled icon buttons.
   
   @type {String}
   @htmlattribute alt
   @htmlattributereflected
   @memberof Coral.Icon#
   */
  get alt() {
    return this._alt || '';
  }
  set alt(value) {
    this._alt = transform.string(value);
    transform.reflect(this, 'alt', this._alt);
  
    // By setting alt = '' explicitly, we override the default behavior and instead use an empty string for alt text.
    this._updateAltText(this._alt === '');
  }
  
  // @ignore
  get title() {
    return this._title || '';
  }
  set title(value) {
    this._title = transform.string(value);
    transform.reflect(this, 'title', this._title);
    
    this._updateAltText();
  }
  
  /**
   Updates the aria-label or img alt attribute depending on value of alt, title or icon.
   
   In cases where the alt attribute has been removed or set to an empty string,
   for example, when the alt property is undefined and we add the attribute alt=''
   to explicitly override the default behavior, or when we remove an alt attribute
   thus restoring the default behavior, we make sure to update the alt text.
   @private
   */
  _updateAltText(emptyAltText) {
    const isImage = this.classList.contains('is-image');
  
    // If alt has explicitly been set to empty string, remove all attributes
    if (emptyAltText) {
      this.removeAttribute('aria-label');
      if (isImage) {
        this._elements.image.setAttribute('alt', '');
      }
    }
    else {
      // Fall back to the title attribute, then the icon name
      const altText = this.alt ? this.alt : this.title || (isImage ? '' : this.icon.replace(SPLIT_CAMELCASE_REGEX, '$1 $2').toLowerCase());
  
      // If no other role has been set, provide the appropriate
      // role depending on whether or not the icon is an arbitrary image URL.
      const role = this.getAttribute('role');
      const roleOverride = (role && (role !== 'presentation' && role !== 'img'));
      if (!roleOverride) {
        this.setAttribute('role', isImage ? 'presentation' : 'img');
      }
  
      // Set accessibility attributes accordingly
      if (isImage) {
        this.removeAttribute('aria-label');
        this._elements.image.setAttribute('alt', altText);
      }
      else if (altText === '') {
        this.removeAttribute('aria-label');
        if (!roleOverride) {
          this.removeAttribute('role');
        }
      }
      else {
        this.setAttribute('aria-label', altText);
      }
    }
  }
  
  // expose enumerations
  static get size() {return size;}
  
  static get observedAttributes() {
    return ['icon', 'size', 'alt', 'title'];
  }
  
  attributeChangedCallback(name, oldValue, value) {
    this[name] = value;
  }
  
  connectedCallback() {
    this.classList.add(CLASSNAME);
    
    // Set default size
    if (!this._size) {
      this.size = size.SMALL;
    }
  }
}

// Add component common properties and methods
Component.mixin(Icon);

export default Icon;