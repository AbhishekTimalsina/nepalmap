class Marker {
  constructor(map, markerLocation, markerOptionObject, markerContainerId) {
    this.markedPlaces = [];

    this.nepalSvg = map.nepalSvg;
    this.svgContainer = map.svgContainer;
    this.svgElement = map.svgElement;
    this.markerLocation = markerLocation;
    this.markerOptionObject = markerOptionObject;
    this.allowedToMark = markerOptionObject.allowedToMark || [];
    this.markerContainerId = markerContainerId;

    markerOptionObject.addOnClick && this._addMarkerHandler();
    this.markerContainer = this._createMarkerContainer();
  }

  _createMarkerContainer() {
    let markerContainer = document.createElement("div");
    markerContainer.setAttribute("data-marker-id", this.markerContainerId);

    this.svgContainer.append(markerContainer);

    return markerContainer;
  }

  addMarkWithName(placeName) {
    if (!Array.isArray(placeName)) {
      console.error("Error: Target are expected to be Array");
      return;
    }
    placeName.forEach((place) => {
      let district = this.svgElement.querySelector(`[id='${place}']`);
      if (!district) {
        console.error(`Error: District ${place} doesn't exist`);
        return;
      }
      this._addMarker(district);
    });
  }
  _addMarker(targetPlace) {
    let disctrictProp = targetPlace.getBoundingClientRect();
    //  Keep track of marked places
    let districtName = targetPlace.getAttribute("id");
    if (
      this.allowedToMark.length > 0 &&
      !this.allowedToMark.includes(districtName)
    ) {
      return;
    }

    //  if the place is already marked, unmark it and remove it from this.markedPlaces

    if (this.markedPlaces.includes(districtName)) {
      this._removeMarker(districtName);

      return;
    }
    this.markedPlaces.push(districtName);

    //get the coordinates of container
    let containerElementProp = this.nepalSvg.getBoundingClientRect();
    //create a marker element

    let marker = document.createElement("img");
    marker.src = this.markerLocation;
    marker.style.position = "absolute";

    marker.style.height = this.markerOptionObject.height || "15px";
    marker.style.width = this.markerOptionObject.width || "15px";
    marker.style.pointerEvents = "none";

    marker.setAttribute("data-place", districtName);
    this.markerContainer.append(marker);

    // calculate the position of marker
    let [topPostion, leftPostion] = this._calculatePosition(
      containerElementProp,
      disctrictProp,
      marker
    );

    marker.style.top = topPostion + "px";
    marker.style.left = leftPostion + "px";
  }

  _removeMarker(targetName) {
    let newMarkedPlace = this.markedPlaces.filter((d) => {
      return d !== targetName;
    });

    this.markedPlaces = newMarkedPlace;
    let removableDistrict = this.markerContainer.querySelectorAll(
      `img[data-place=${targetName}]`
    );
    removableDistrict.forEach((disctrict) => {
      disctrict.remove();
    });
  }

  _addMarkerHandler() {
    this.svgElement.addEventListener("click", this._markerEvent.bind(this));
  }

  _markerEvent(e) {
    // the event object is the last argument when using bind

    //get the coordinates of Disctrict

    let disctrict = e.target.closest("path");
    if (!disctrict) return;
    this._addMarker(disctrict);
  }

  _calculatePosition(containerElementProp, disctrictProp, marker) {
    // Calcuate the position of marker.

    //* The coordinate value given by getBoundingClientRect() don't provide the absolute top and left value
    //* Because the svg Element have different path however the method calculate the coordinate as if it were a
    //* 4 sided diagram.(You can check it by giving an outline to the path element)
    //* We instead added the half of Width | Height of the district element. So that it stays in the center of that square
    let topValue =
      window.scrollY +
      containerElementProp.top +
      disctrictProp.top +
      disctrictProp.height / 2;

    let leftValue =
      window.scrollX +
      containerElementProp.left +
      disctrictProp.left +
      disctrictProp.width / 2;
    //* Acc0unting for the height and width of the marker element itself
    let topPostion = topValue - marker.height / 1.2;
    let leftPostion = leftValue - marker.width / 2;

    return [topPostion, leftPostion];
  }
}

export default Marker;
