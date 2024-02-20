# BackgroundStyle Material Plugin for Babylon.js

The BackgroundStyle Material Plugin is a custom extension for Babylon.js materials, allowing for advanced background image styling options similar to CSS `background-size` properties like `cover` and `object-fit`. This plugin can be used to dynamically adjust the aspect ratio and fill style of textures applied to materials, ensuring they fit their containers as desired.

![npm](https://img.shields.io/npm/v/backgroundstyle-material-plugin.svg?style=flat-square)

> [!NOTE]
> This only works for StandardMaterial as of now. Support for PBR materials will be added in the future.

## Installation

```bash
npm i backgroundstyle-material-plugin
```

## Usage

Below is a basic example of how to use the BackgroundStyle Material Plugin in a Babylon.js scene:

```javascript
import * as BABYLON from "@babylonjs/core";
import { BackgroundStyleMaterialPlugin, FILL_STYLE } from "backgroundstyle-material-plugin";

// Initialize BABYLON Engine and Scene
const canvas = document.getElementById("render-canvas");
const engine = new BABYLON.Engine(canvas);
const scene = new BABYLON.Scene(engine);

// Basic scene setup with camera and light
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
camera.attachControl(canvas, true);
new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

// Create a textured plane with BackgroundStyle Material Plugin
const plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: 2, height: 1 }, scene);
const material = new BABYLON.StandardMaterial("planeMaterial", scene);
const texture = new BABYLON.Texture("path/to/your/image.jpg", scene);
const backgroundStylePlugin = new BackgroundStyleMaterialPlugin(material);

texture.onLoadObservable.add(() => {
    // Setup plugin properties
    backgroundStylePlugin.imageAspectRatio = texture.getSize().width / texture.getSize().height;
    backgroundStylePlugin.containerAspectRatio = 2 / 1; // Example aspect ratio of the plane
    backgroundStylePlugin.fillStyle = FILL_STYLE.COVER; // or FILL_STYLE.CONTAIN
    backgroundStylePlugin.isEnabled = true; // Enable the plugin
})



// Apply the texture and plugin to the material
material.diffuseTexture = texture;
plane.material = material;

// Render loop
engine.runRenderLoop(() => scene.render());
```

## Properties
- **`imageAspectRatio`**: Aspect ratio of texture
- **`containerAspectRatio`**: Aspect ratio of Plane or any mesh you using it for
- **`fillStyle`**: Background style (`FILL_STYLE.COVER` or `FILL_STYLE.CONTAIN`)
- **`isEnabled`**: set it `true` to make the plugin work

## Style Options

The plugin provides the following options to customize the background style:

- **`FILL_STYLE.COVER`**: Scale the background image to be as large as possible so that the container's background area is completely covered by the background image. Some parts of the background image may not be in view within the container.
- **`FILL_STYLE.CONTAIN`**: Scale the image to maintain its aspect ratio while fitting within the container's content box.

## Contributing

Contributions to the BackgroundStyle Material Plugin are welcome. Please feel free to submit pull requests or open issues to discuss proposed changes or enhancements.
