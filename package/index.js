import { MaterialPluginBase } from "@babylonjs/core";

export const FILL_STYLE = {
  COVER: 0,
  OBJECT_FIT: 1,
};

export class BackgroundStyleMaterialPlugin extends MaterialPluginBase {
  imageAspectRatio = 1;
  containerAspectRatio = 1;
  fillStyle = FILL_STYLE.COVER;

  get isEnabled() {
    return this._isEnabled;
  }

  set isEnabled(enabled) {
    if (this._isEnabled === enabled) {
      return;
    }
    this._isEnabled = enabled;
    this.markAllDefinesAsDirty();
    this._enable(this._isEnabled);
  }

  _isEnabled = false;

  constructor(material) {
    super(material, "BackgroundPlugin", 200, {});
  }

  getClassName() {
    return "BackgroundMaterialPluginName";
  }

  getUniforms() {
    return {
      ubo: [
        { name: "imageAspectRatio", size: 1, type: "float" },
        { name: "containerAspectRatio", size: 1, type: "float" },
        { name: "fillStyle", size: 1, type: "int" },
      ],
      fragment: `
              uniform float imageAspectRatio;
              uniform float containerAspectRatio;
              uniform int fillStyle;
        `,
    };
  }

  bindForSubMesh(uniformBuffer) {
    if (this._isEnabled) {
      uniformBuffer.updateFloat("imageAspectRatio", this.imageAspectRatio);
      uniformBuffer.updateFloat(
        "containerAspectRatio",
        this.containerAspectRatio,
      );
      uniformBuffer.updateInt("fillStyle", this.fillStyle);
    }
  }

  getCustomCode(shaderType) {
    if (shaderType === "fragment")
      return {
        "!baseColor\\=texture2D\\(diffuseSampler,vDiffuseUV\\+uvOffset\\);": `
              vec2 resizedUv = (vDiffuseUV * 2.0 - 1.0);

              float scaleFactorX = 1.0;
              float scaleFactorY = 1.0;

              float landscapeFactor = imageAspectRatio / containerAspectRatio;
              float portraitFactor = containerAspectRatio / imageAspectRatio;

              bool isLandscapeModeContainer = (containerAspectRatio >= 1.0);
              bool isImageLandscape = (imageAspectRatio >= 1.0);
              bool isContainerRatioStronger = (containerAspectRatio >= imageAspectRatio);

              bool backgroundStyleCover = fillStyle == 0 ? false : true;

              if(backgroundStyleCover){
                if(isContainerRatioStronger){
                  scaleFactorX = landscapeFactor;
                }else{
                  scaleFactorY = portraitFactor;
                }
              }else{
                if (isContainerRatioStronger) {
                  scaleFactorY = isLandscapeModeContainer ? landscapeFactor : portraitFactor;
                } else {
                  scaleFactorX = isLandscapeModeContainer ?portraitFactor: landscapeFactor ;
                }
              }


              if(backgroundStyleCover){
                if(isImageLandscape){
                  resizedUv.x /= scaleFactorX;
                  resizedUv.y /= scaleFactorY;
                }else{
                  resizedUv.x /= scaleFactorX;
                  resizedUv.y /= scaleFactorY;
                }
              }else{
                resizedUv.x *= scaleFactorX;
                resizedUv.y *= scaleFactorY;
              }

              resizedUv = resizedUv * 0.5 + 0.5;
              baseColor = texture2D(diffuseSampler, resizedUv + uvOffset);
              if(resizedUv.x < 0.0 || resizedUv.x > 1.0 || resizedUv.y < 0.0 || resizedUv.y > 1.0) {
                  baseColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color
              }
            `,
      };
    return null;
  }
}
