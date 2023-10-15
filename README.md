# NepalMap

**nepalmap.js** allows you to embed a clickable svg map of Nepal.

## Installing

```bash
npm i nepalmap
```

#### Add script

```javascript
import NepalMap from "nepalmap";
```

## How to use it?

**HTML**

```html
<div id="root"></div>
```

**Javascript**

```javascript
const Map = new NepalMap();
```

Now inorder to paint the Map in the website use the setRoot method. It expects the id of the element that you want to set as root as an argument. The setRoot method returns a promsie so you must use await or .then/catch.

```javascript
await Map.setRoot("root");
```

**Set size of Map**

You can use setSize method to set the size of the Map.

```javascript
Map.setSize("500px", "500px");
```

**Get lists of districts**

```javascript
let districts = Map.DistrictLists;
```

**Set map property**

Set property of the map using the setMapProperty

```javascript
Map.setMapProperty({
  fill: "green",
});
```

**Options**

| Attribute    | Description                                  | Example Value |
| ------------ | -------------------------------------------- | ------------- |
| `fill`       | Set fill(color) of the svg map               | "green"       |
| `stroke`     | Set stroke(border color) of map              | "black"       |
| `cursor`     | Set cursor                                   | "pointer"     |
| `hoverColor` | Set hover color                              | "blue"        |
| `clickEvent` | Provide a callback function to fire on click | function(){}  |

#### Set Property of an individual district

```javascript
Map.setTarget({
  targets: ["dhading", "kathmandu"],
  fill: "blue",
});
```

**Options**

| Attribute    | Description                                                                                                | Example Value               |
| ------------ | ---------------------------------------------------------------------------------------------------------- | --------------------------- |
| `targets`    | Provide the target districts to set the property                                                           | ["kavre","kathmandu"]       |
| `fill`       | Set fill (color)                                                                                           | "red"                       |
| `stroke`     | Set stroke (border color)                                                                                  | "black"                     |
| `cursor`     | Set cursor                                                                                                 | "pointer"                   |
| `hoverColor` | Set hover color                                                                                            | "blue"                      |
| `clickEvent` | Provide a callback function to fire on click(has event as first argument and placename as second argument) | function(event,placename){} |

**Remove Map**

You can remove the map from the dom using the removeMap() method

```javascript
Map.removeMap();
```

## Markers

Add markers in the Map.

You can add marker with createMarker method. It expects the marker location as first argument and options as second argument.

```javascript
let marker = Map.createMarker("assets/marker.svg", {
  addOnClick: true,
});
```

| Attribute       | Description                                           | Example Value         |
| --------------- | ----------------------------------------------------- | --------------------- |
| `addOnClick`    | Accepts boolean. Add marker when clicked on districts | true                  |
| `width`         | width of marker                                       | "15px"                |
| `height`        | height of marker                                      | "15px"                |
| `allowedToMark` | Specifies which districts are allowed to mark         | ["kavre","kathmandu"] |

**Add mark by place name**

```javascript
marker.addMarkWithName(["kavre", "kathmandu"]);
```
