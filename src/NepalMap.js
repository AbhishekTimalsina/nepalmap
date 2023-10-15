import District from "./data/District.js";
import Marker from "./Marker.js";

const MAP_MAX_TIME_TO_LOAD = 10000;

class NepalMap {
  constructor() {
    this.DistrictLists = [...District];
    this.targetProperty = [];
    this.markerContainerTracker = 0;
    this.mapProperty = {
      targetPlace: "Nepal",
      fill: "white",
      stroke: "black",
      hoverColor: null,
      clearProperty: false,
      cursor: "default",
      href: null,
      hoverEvent: null,
      clickEvent: null,
    };

    // the second argument in the new URL constructor is base url location. the import.meta.url provides the base url
    let svgPath = new URL("../assets/nepal.svg", import.meta.url);

    this.svgContainer = document.createElement("div");
    this.svgContainer.classList.add("nepal--map-container");
    this.nepalSvg = document.createElement("object");
    this.nepalSvg.setAttribute("class", "nepal-svg-element");
    this.nepalSvg.setAttribute("type", "image/svg+xml");
    this.nepalSvg.setAttribute("data", svgPath);
    this.svgContainer.append(this.nepalSvg);
  }

  // set's the root to embed the map
  setRoot(root) {
    this.svgRoot = document.getElementById(root);
    if (!this.svgRoot) throw "No root of such Id exists";
    this.svgRoot.append(this.svgContainer);
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        reject(new Error("Map took too much time to load "));
      }, MAP_MAX_TIME_TO_LOAD);
      this.nepalSvg.onload = () => {
        this.$ = this.nepalSvg.contentDocument;
        this.svgElement = this.$.querySelector("svg");

        this.style = this.svgElement.querySelector("style");

        this.isReady = true;
        resolve(this.isReady);
      };
    });
  }

  _clearStyle() {
    this.style.textContent = "";
  }

  // set's the size of map
  setSize(height, width) {
    if (!height || !width) {
      console.error("Please declare height and width");
      return;
    }

    this.svgElement.setAttribute("height", height);
    this.svgElement.setAttribute("width", width);
    return { height, width };
  }

  // set the property of the whole map
  setMapProperty(PropertyObject) {
    if (typeof PropertyObject !== "object") {
      console.error("Error: Property are expected to be Object");
    }
    for (let key in PropertyObject) {
      this.mapProperty[key] = PropertyObject[key];
    }

    this._assignStyle(this.mapProperty);
    if (this.mapProperty.href) this._href(this.mapProperty);
    if (this.mapProperty.hoverEvent) this._hoverEvent(this.mapProperty);
    if (this.mapProperty.clickEvent) this._clickEvent(this.mapProperty);
  }

  // set's the property of a single district
  setTarget(targetObject) {
    if (typeof targetObject !== "object") {
      console.error("Error: Target property is expected to be a Object");
      return;
    }
    let newTargetProperty = [...this.targetProperty];

    if (!targetObject.hasOwnProperty("targets")) {
      console.error("No targets set");
      return;
    }

    for (let place of targetObject.targets) {
      if (!this.DistrictLists.includes(place.toLowerCase())) {
        console.error("Error: The district " + place + " doesn't exist");
        continue;
      }
      let newObj = {
        targetPlace: place.toLowerCase(),
        fill: targetObject.fill || this.mapProperty.fill,
        stroke: targetObject.stroke || this.mapProperty.stroke,
        hoverColor: targetObject.hoverColor || undefined,
        cursor: targetObject.cursor || this.mapProperty.cursor,
        clickEvent: targetObject.clickEvent || undefined,
        hoverEvent: targetObject.hoverEvent || undefined,
        href: targetObject.href || undefined,
      };

      this._assignStyle(newObj);
      if (targetObject.clickEvent) this._clickEvent(newObj);
      targetObject.hoverEvent && this._hoverEvent(newObj);
      targetObject.href && this.href(newObj);

      newTargetProperty.push(newObj);
    }

    this.targetProperty = newTargetProperty;
  }

  // creates a hover event

  _hoverEvent(object) {
    if (typeof object.hoverEvent !== "function")
      throw "Hover event has be a 'function'";
    let element = this.$.getElementById(object.targetPlace);
    element.onmouseover = (event) =>
      object.hoverEvent(event, object.targetPlace);
  }

  _clickEvent(object) {
    if (typeof object.clickEvent !== "function")
      throw "Click Event can only be of type 'function'";
    let element = this.$.getElementById(object.targetPlace);

    element.onclick = (event) => object.clickEvent(event, object.targetPlace);
  }

  // create a href in map
  _href(object) {
    let element = this.$.getElementById(object.targetPlace);
    element.addEventListener("click", function () {
      window.open(object.href);
    });
  }
  // assign the property input by the user
  _assignStyle(place) {
    if (place.clearProperty) this._clearStyle();
    let newStyle;

    if (place.targetPlace == "Nepal") {
      newStyle = `
    .full-map,g{
    stroke: ${place.stroke};
    fill: ${place.fill};
    cursor: ${place.cursor};
    }
    ${place.hoverColor ? `path:hover{fill:${place.hoverColor}}` : ""}
 `;
    } else {
      newStyle = `
      #${place.targetPlace}{
      stroke: ${place.stroke};
      fill: ${place.fill};
      cursor: ${place.cursor};
      }
      ${place.hoverColor ? `path:hover{fill:${place.hoverColor}}` : ""}
      `;
    }

    this.style.textContent = this.style.textContent.concat(newStyle);
  }

  removeMap() {
    this.svgContainer.remove();
  }

  createMarker(location, markerOptionObject) {
    if (typeof "location" !== "string") {
      console.error("Error: Marker location is expected to be String");
      return;
    }
    if (typeof markerOptionObject !== "object") {
      console.error("Error: Options are expected to be Object");
    }

    /* getting the location of the script file that called this function to get the absolute position of marker image
    Using the Error stack trace
    */
    let stack = new Error().stack.split("\n");
    let callerLocation = stack[2].replace("at", "").trim();
    callerLocation = callerLocation.slice(
      0,
      callerLocation.lastIndexOf(".js") + 3
    );
    let locationURL = new URL(location, callerLocation);

    let markerObj = new Marker(
      this,
      locationURL,
      markerOptionObject,
      ++this.markerContainerTracker
    );

    // the markerContainerTracker starts with 0 and adds up as the user create new Markers. The container id of the
    //  marker container is then set according to which nth container it is.
    return markerObj;
  }
}

export default NepalMap;
