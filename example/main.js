import "./style.css";
import * as BABYLON from "@babylonjs/core";
import {
  BackgroundStyleMaterialPlugin,
  FILL_STYLE,
} from "backgroundstyle-material-plugin";

const canvas = document.getElementById("render-canvas");

const engine = new BABYLON.Engine(canvas);

window.addEventListener("resize", () => {
  engine.resize();
});

const scene = createScene(engine, canvas);

engine.runRenderLoop(() => {
  scene.render();
});

function createScene(engine, canvas) {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    0,
    10,
    new BABYLON.Vector3(0, 0, 0),
    scene,
  );

  // Positions the camera overwriting alpha, beta, radius
  camera.setPosition(new BABYLON.Vector3(0, 0, -10));

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene,
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 1.7;

  const plane = createAPlaneWithTexture(
    {
      size: { width: 1.9, height: 1.9 },
      texture: "/16-9-dummy-image4.jpg",
      fillStyle: FILL_STYLE.COVER,
    },
    scene,
  );

  plane.position.x = -1.9 / 2;

  const plane2 = createAPlaneWithTexture(
    {
      size: { width: 1.9, height: 1.9 / 1.77 },
      texture: "/16-9-dummy-image4.jpg",
      fillStyle: FILL_STYLE.COVER,
    },
    scene,
  );

  plane2.position.x = 1.9;

  const plane3 = createAPlaneWithTexture(
    {
      size: { width: 1.9 * 1.77, height: 0.4 },
      texture: "/16-9-dummy-image4.jpg",
      fillStyle: FILL_STYLE.COVER,
    },
    scene,
  );

  plane3.position.x = 1.9 * 1.77 + 1.5;

  const plane4 = createAPlaneWithTexture(
    {
      size: { width: 1.9, height: 1.9 },
      texture: "/16-9-dummy-image4.jpg",
      fillStyle: FILL_STYLE.CONTAIN,
    },
    scene,
  );

  plane4.position.x = -1.9 / 2;
  plane4.position.y = -3;

  const plane5 = createAPlaneWithTexture(
    {
      size: { width: 1.9, height: 1.9 / 1.77 },
      texture: "/16-9-dummy-image4.jpg",
      fillStyle: FILL_STYLE.CONTAIN,
    },
    scene,
  );

  plane5.position.x = 1.9;
  plane5.position.y = -3;

  const plane6 = createAPlaneWithTexture(
    {
      size: { width: 1.9 * 1.77, height: 0.4 },
      texture: "/16-9-dummy-image4.jpg",
      fillStyle: FILL_STYLE.CONTAIN,
    },
    scene,
  );

  plane6.position.x = 1.9 * 1.77 + 1.5;
  plane6.position.y = -3;

  const group = new BABYLON.TransformNode("group", scene);

  plane.setParent(group);
  plane2.setParent(group);
  plane3.setParent(group);
  plane4.setParent(group);
  plane5.setParent(group);
  plane6.setParent(group);

  group.position.x = -2.5;
  group.position.y = 1;

  return scene;
}

function createAPlaneWithTexture({ size, texture, fillStyle }, scene) {
  const screenWidth = size.width;
  const screenHeight = size.height;
  const plane = BABYLON.MeshBuilder.CreatePlane(
    "Plane",
    { width: screenWidth, height: screenHeight },
    scene,
  );
  const material = new BABYLON.StandardMaterial("material", scene);
  material.backFaceCulling = false;
  const tex =
    texture instanceof BABYLON.Texture
      ? texture
      : new BABYLON.Texture(texture, scene);
  const backgroundStylePlugin = new BackgroundStyleMaterialPlugin(material);
  tex.onLoadObservable.add(() => {
    material.backgroundStylePlugin = backgroundStylePlugin;
    const width = tex.getSize().width;
    const height = tex.getSize().height;
    backgroundStylePlugin.containerAspectRatio = screenWidth / screenHeight;
    backgroundStylePlugin.imageAspectRatio = width / height;
    backgroundStylePlugin.fillStyle = Number.isInteger(fillStyle)
      ? fillStyle
      : 0;
    backgroundStylePlugin.isEnabled = true;
  });
  material.diffuseTexture = tex;
  plane.material = material;

  return plane;
}
