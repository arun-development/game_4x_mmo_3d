//dat.Guid   plugin for babylon js 
Utils.DatGuid = {};
(function ($g) {
    var $GUID;
    $g.getGuid = function () {
        if ($GUID) {
            return $GUID;
        }
        if (!dat.GUI.prototype.removeFolder) {
            dat.GUI.prototype.removeFolder = function (name) {
                var folder = this.__folders[name];
                if (!folder) {
                    return;
                }
                folder.close();
                this.__ul.removeChild(folder.domElement.parentNode);
                delete this.__folders[name];
                this.onResize();
            };
            dat.GUI.prototype.getFolder = function (name) {
                return this.__folders[name];
            }
        }
        $GUID = new dat.GUI();
        $GUID.domElement.style.marginTop = "150px";
        $GUID.domElement.id = "datGUI";
        $GUID.width = 500;
        return $GUID;
    };
    $g.removeMainFolder = function (folderName) {
        var folder = $g.getMainFolder(folderName);
        if (folder) {
            $g.getGuid().removeFolder(folderName);
        }

    };
    $g.getMainFolder = function (folderName) {
        var guid = $g.getGuid();
        return guid.getFolder(folderName);
    };
    $g.addMainFolder = function (folderName) {
        var gui = $g.getGuid();
        var folder = $g.getMainFolder(folderName);
        if (!folder) {
            return gui.addFolder(folderName);
        }
        return folder;
    };

    $g.getFolderFromParent = function (parentFolder, childFolderName) {
        return parentFolder.getFolder(childFolderName);
    }

    $g.getOrAddMaterialFolder = function (materialIdOrMaterial, disposeIfExist) {
        if (!materialIdOrMaterial) {
            throw new Error("material id not exist");
        }
        var materialId;
        var material;
        if (typeof materialIdOrMaterial === "string") {
            materialId = materialIdOrMaterial;
        }
        else {
            material = materialIdOrMaterial;
            materialId = materialIdOrMaterial.id;
        }

        var folderName = "MATERIAL : " + materialId;
        var folder = $g.getMainFolder(folderName);
        if (disposeIfExist && folder) {
            folder.removeFolder();
        }
        if (!folder) {
            folder = $g.addMainFolder(folderName);
        }
        if (!folder.__material) {
            if (!material) {
                material = EM.GetMaterial(materialId);
            }
            if (!material) {
                throw new Error("material not exist");
            }
            folder.__material = material;
        }
        return folder;

    };
    $g.addChildMaterialFolder = function (materialIdOrMaterial, childMaterialPropertyName) {
        var main = $g.getOrAddMaterialFolder(materialIdOrMaterial);
        var child = main.getFolder(childMaterialPropertyName);
        if (child) return child;
        return main.addFolder(childMaterialPropertyName);
    };
    $g.getChildMaterialFolder = function (materialIdOrMaterial, childMaterialPropertyName) {
        var main = $g.getOrAddMaterialFolder(materialIdOrMaterial);
        var child = main.getFolder(childMaterialPropertyName);
        return child;
    };

    $g.createTextureView = function (materialFolder, textureOptions) {
        var props = textureOptions.getPropKeys();
        var textureFolder = $g.getFolderFromParent(materialFolder, textureOptions.propertyName);
        if (textureFolder) return textureFolder;
        var material = materialFolder.__material;
        textureFolder = $g.addChildMaterialFolder(material.id, textureOptions.propertyName);
        _.forEach(props, function (texturePropertyName) {
            if (texturePropertyName === "url") {
                function recreateTexture(value) {
                    if (material[textureOptions.propertyName][texturePropertyName] !== value && value) {
                        textureOptions[texturePropertyName] = value;
                        material[textureOptions.propertyName].dispose();
                        delete material[textureOptions.propertyName];
                        material[textureOptions.propertyName] = new BABYLON.Texture(value, EM.Scene);
                        _.forEach(props, function (propName) {
                            if (propName !== "url") {
                                material[textureOptions.propertyName][propName] = textureOptions[propName];
                            }
                        });
                    }
                }
                recreateTexture(textureOptions[texturePropertyName]);
                textureFolder.add(material[textureOptions.propertyName], texturePropertyName, textureOptions[texturePropertyName]).onChange(function (value) {
                    recreateTexture(value);
                });
            }
            else {
                if (material[textureOptions.propertyName][texturePropertyName] !== textureOptions[texturePropertyName]) {
                    material[textureOptions.propertyName][texturePropertyName] = textureOptions[texturePropertyName];
                }
                if (!textureOptions.min[texturePropertyName]) {
                    textureOptions.min[texturePropertyName] = 0.000;
                }
                if (!textureOptions.max[texturePropertyName]) {
                    var max = 1;
                    if (textureOptions[texturePropertyName] !== 0) {
                        max = textureOptions[texturePropertyName];
                    }
                    max *= 50;
                    textureOptions.max[texturePropertyName] = max;
                }
                textureFolder.add(material[textureOptions.propertyName], texturePropertyName, textureOptions.min[texturePropertyName], textureOptions.max[texturePropertyName]).onChange(function (value) {
                    material[textureOptions.propertyName][texturePropertyName] = value;
                });

            }



        });
        return textureFolder;
    };

    function IBaseOptions() {
        this.min = {};
        this.max = {};
        this.getPropKeys = function () {
            return Object.keys(this);

        };
    }


    $g.createTextureOptions = function (texturePropertyName, url, level) {
        function iTextureOptions() {
            this.url = url;
            this.level = level || 1;
            this.uAng = 0;
            this.vAng = 0;
            this.wAng = 0;
            this.vOffset = 0;
            this.uOffset = 0;
            this.uScale = 1;
            this.vScale = 1;
            this.wrapU = 1;
            this.wrapV = 1;



            this.min.level = 0.0;
            this.min.uAng = 0;
            this.min.vAng = 0;
            this.min.wAng = 0;
            this.min.vOffset = 0;
            this.min.uOffset = 0;
            this.min.uScale = 1;
            this.min.vScale = 1;
            this.min.wrapU = 1;
            this.min.wrapV = 1;

            this.max.level = 50;
            this.max.uAng = 3.14;
            this.max.vAng = 3.14;
            this.max.wAng = 3.14;
            this.max.vOffset = 1;
            this.max.uOffset = 1;
            this.max.uScale = 100;
            this.max.vScale = 100;
            this.max.wrapU = 100;
            this.max.wrapV = 100;
        }

        iTextureOptions.prototype = new IBaseOptions();
        iTextureOptions.prototype.constructor = iTextureOptions;
        iTextureOptions.prototype.propertyName = texturePropertyName;

        return new iTextureOptions();
    };

    $g.createParalaxOptions = function (bumpUrl, paralaxUrl) {
        function IParalaxOptions() {
            this.useParallax = false;
            this.useParallaxOcclusion = false;
            this.parallaxScaleBias = 0;

        }
        IParalaxOptions.prototype = new IBaseOptions();
        IParalaxOptions.prototype.constructor = IParalaxOptions;
        IParalaxOptions.prototype.bumpUrl = bumpUrl;
        IParalaxOptions.prototype.paralaxUrl = paralaxUrl;
        IParalaxOptions.prototype.min.parallaxScaleBias = 0.0001;
        IParalaxOptions.prototype.max.parallaxScaleBias = 0.2000;
        IParalaxOptions.prototype.renderMode = ["Parallax Occlusion", 'Parallax', 'Bump', 'None'];
        IParalaxOptions.prototype.bumpLevel = 1;
        IParalaxOptions.prototype.min.bumpLevel = 0.0;
        IParalaxOptions.prototype.max.bumpLevel = 10.0;

        return new IParalaxOptions();
    };
    $g.createParalaxView = function (materialFolder, paralaxOptions) {
        var props = paralaxOptions.getPropKeys();
        var folderName = "paralaxOptions";
        var paralaxFolder = $g.getFolderFromParent(materialFolder, folderName);
        if (paralaxFolder) return paralaxFolder;
        var material = materialFolder.__material;
        paralaxFolder = $g.addChildMaterialFolder(material, folderName);

        if (!material[$g.SUPORTED_TEXTURES.Bump]) {
            material[$g.SUPORTED_TEXTURES.Bump] = new BABYLON.Texture(paralaxOptions.bumpUrl, EM.Scene);
        }
        _.forEach(props, function (propName) {

            if (propName === "parallaxScaleBias") {
                paralaxFolder.add(material, propName, paralaxOptions.min[propName], paralaxOptions.max[propName]).onChange(function (value) {
                    material[propName] = value;
                });
            } else {
                paralaxFolder.add(material, propName, material[propName]).onChange(function (value) {
                    material[propName] = value;
                });
            }

        });
        paralaxFolder.add(paralaxOptions, "renderMode", paralaxOptions.renderMode).onChange(function (value) {
            function disposeOld(url) {
                if (material.bumpTexture && material.bumpTexture.url !== url) {
                    material.bumpTexture.dispose();
                    delete material.bumpTexture;
                    return true;
                } else if (!material.bumpTexture) {
                    return true;
                }
                return false;
            }
            switch (value) {
                case "Bump":
                    if (disposeOld(paralaxOptions.bumpUrl)) {
                        material.bumpTexture = new BABYLON.Texture(paralaxOptions.bumpUrl, EM.Scene);
                    }
                    material.useParallax = false;
                    material.useParallaxOcclusion = false;
                    break;
                case "Parallax":
                    if (disposeOld(paralaxOptions.paralaxUrl)) {
                        material.bumpTexture = new BABYLON.Texture(paralaxOptions.paralaxUrl, EM.Scene);
                    }
                    material.useParallax = true;
                    material.useParallaxOcclusion = false;
                    break;
                case "Parallax Occlusion":
                    if (disposeOld(paralaxOptions.paralaxUrl)) {
                        material.bumpTexture = new BABYLON.Texture(paralaxOptions.paralaxUrl, EM.Scene);
                    }
                    material.useParallax = true;
                    material.useParallaxOcclusion = true;
                    break;
                case "None":
                    disposeOld();
                    material.useParallax = false;
                    material.useParallaxOcclusion = false;
                    break;

            }
        });

        paralaxFolder.add(material[$g.SUPORTED_TEXTURES.Bump], "level", paralaxOptions.min.bumpLevel, paralaxOptions.max.bumpLevel).onChange(function (value, e) {

            var texture = material[$g.SUPORTED_TEXTURES.Bump];
            if (texture) {
                material[$g.SUPORTED_TEXTURES.Bump].level = value;
            } else {
                console.log("paralaxFolder bump texture not exist");
            }

        });
        console.log("material", material);
        return paralaxFolder;

    };


    $g.createColor3Options = function (currentColor3) {
        function iColor3Option() {
            this.r = currentColor3.r;
            this.g = currentColor3.g;
            this.b = currentColor3.b;

        }
        iColor3Option.prototype = new IBaseOptions();
        iColor3Option.prototype.constructor = iColor3Option;
        iColor3Option.prototype.min.r = 0.0;
        iColor3Option.prototype.min.g = 0.0;
        iColor3Option.prototype.min.b = 0.0;

        iColor3Option.prototype.max.r = 1.0;
        iColor3Option.prototype.max.g = 1.0;
        iColor3Option.prototype.max.b = 1.0;
        return new iColor3Option();

    };

    $g.createColor3View = function (materialFolder, colorPropName) {
        var colorFolder = $g.getFolderFromParent(materialFolder, colorPropName);
        if (colorFolder) return colorFolder;
        var material = materialFolder.__material;
        if (!material[colorPropName]) {
            material[colorPropName] = BABYLON.Color3.Black();
        }
        colorFolder = $g.addChildMaterialFolder(material.id, colorPropName);
        var colorOption = $g.createColor3Options(material[colorPropName]);
        var props = colorOption.getPropKeys();
        _.forEach(props, function (colorSegmentName) {
            colorFolder.add(material[colorPropName], colorSegmentName, colorOption.min[colorSegmentName], colorOption.max[colorSegmentName]).onChange(function (value) {
                material[colorPropName][colorSegmentName] = value;
            });
        });
        return colorFolder;

    };
    $g.createColor3Views = function (materialFolder) {
        _.forEach($g.SUPORTED_COLOR3, function (colorPropName, propKey) {
            $g.createColor3View(materialFolder, colorPropName);
        });
    };

    $g.createFresnelOption = function (leftColor3Option, rightColor3Option) {
        function iFresnelOption() {
            this.isEnabled = false;
            this.bias = 0.0;
            this.power = 0.0;
            this.leftColor = leftColor3Option;
            this.rightColor = rightColor3Option;
        }
        iFresnelOption.prototype = new IBaseOptions();
        iFresnelOption.prototype.constructor = iFresnelOption;

        iFresnelOption.prototype.min.power = 0.0;
        iFresnelOption.prototype.min.bias = 0.00;

        iFresnelOption.prototype.max.power = 100.0;
        iFresnelOption.prototype.max.bias = 10.00;

        return new iFresnelOption();
    };

    $g.createFresnelView = function (materialFolder, fresnelPropName) {
        var fresnelFolder = $g.getFolderFromParent(materialFolder, fresnelPropName);
        if (fresnelFolder) return fresnelFolder;
        var material = materialFolder.__material;
        fresnelFolder = $g.addChildMaterialFolder(material.id, fresnelPropName);

        if (!material[fresnelPropName]) {
            material[fresnelPropName] = new BABYLON.FresnelParameters();
            material[fresnelPropName].isEnabled = false;
        }

        var fresnelOption = $g.createFresnelOption($g.createColor3Options(material[fresnelPropName].leftColor), $g.createColor3Options(material[fresnelPropName].rightColor));
        var leftColorFolder = fresnelFolder.addFolder("leftColor");
        _.forEach(fresnelOption.leftColor.getPropKeys(), function (colorSegmentName) {
            leftColorFolder.add(material[fresnelPropName].leftColor, colorSegmentName, fresnelOption.leftColor.min[colorSegmentName], fresnelOption.leftColor.max[colorSegmentName]).onChange(function (value) {
                material[fresnelPropName].leftColor[colorSegmentName] = value;
            });
        });
        var rightColorFolder = fresnelFolder.addFolder("rightColor");
        _.forEach(fresnelOption.rightColor.getPropKeys(), function (colorSegmentName) {
            rightColorFolder.add(material[fresnelPropName].rightColor, colorSegmentName, fresnelOption.rightColor.min[colorSegmentName], fresnelOption.rightColor.max[colorSegmentName]).onChange(function (value) {
                material[fresnelPropName].rightColor[colorSegmentName] = value;
            });
        });
        fresnelFolder.add(material[fresnelPropName], "isEnabled", material[fresnelPropName].isEnabled).onChange(function (value) {
            material[fresnelPropName].isEnabled = value;
        });
        fresnelFolder.add(material[fresnelPropName], "bias", fresnelOption.min.bias, fresnelOption.max.bias).onChange(function (value) {
            material[fresnelPropName].bias = value;
        });
        fresnelFolder.add(material[fresnelPropName], "power", fresnelOption.min.power, fresnelOption.max.power).onChange(function (value) {
            material[fresnelPropName].power = value;
        });
        return fresnelFolder;

    };
    $g.createFresnelAllViews = function (materialFolder) {
        _.forEach($g.SUPORTED_FRESNEL_PARAMETERS, function (fresnelPropName) {
            $g.createFresnelView(materialFolder, fresnelPropName);
        });
    };

    $g.createAllMaterialViews = function (allMaterialOption) {
        var matFolder = $g.getOrAddMaterialFolder(allMaterialOption.materialIdOrMaterial, true);
        $g.cratePrimitiveMaterialViews(matFolder);
        $g.createColor3Views(matFolder);
        $g.createFresnelAllViews(matFolder);

        if (allMaterialOption.dffuseUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Dffuse, allMaterialOption.dffuseUrl, 1));
        }
        if (allMaterialOption.bumpUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Bump, allMaterialOption.bumpUrl, 1));
            if (allMaterialOption.paralaxUrl) {
                var paralaxOpts = $g.createParalaxOptions(allMaterialOption.bumpUrl, allMaterialOption.paralaxUrl);
                $g.createParalaxView(matFolder, paralaxOpts);
            }
        }
        if (allMaterialOption.specularUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Specular, allMaterialOption.Specular, 1));
        }
        if (allMaterialOption.ambientUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Ambient, allMaterialOption.ambientUrl, 1));
        }
        if (allMaterialOption.emissiveUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Emissive, allMaterialOption.emissiveUrl, 1));
        }
        if (allMaterialOption.opacityUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Opacity, allMaterialOption.emissiveUrl, 1));
        }
        if (allMaterialOption.reflectionUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Reflection, allMaterialOption.reflectionUrl, 1));
        }
        if (allMaterialOption.lightUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Light, allMaterialOption.lightUrl, 1));
        }
        if (allMaterialOption.heightUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Height, allMaterialOption.heightUrl, 1));
        }
        if (allMaterialOption.refractionUrl) {
            $g.createTextureView(matFolder, $g.createTextureOptions($g.SUPORTED_TEXTURES.Refraction, allMaterialOption.refractionUrl, 1));
        }

    };

    $g.cratePrimitiveMaterialViews = function (materialFolder) {
        var material = materialFolder.__material;
        var folderName = "Primetive";
        var primitiveFolder = $g.getFolderFromParent(materialFolder, folderName);
        if (primitiveFolder) {
            return primitiveFolder;
        }
        primitiveFolder = $g.addChildMaterialFolder(material.id, folderName);

        primitiveFolder.add(material, "alpha", 0, 1).onChange(function (value) {
            material.alpha = value;
        });
        primitiveFolder.add(material, "alphaMode", ["ALPHA_DISABLE",
                                                   "ALPHA_COMBINE",
                                                   "ALPHA_ONEONE",
                                                   "ALPHA_ADD",
                                                   "ALPHA_SUBTRACT",
                                                   "ALPHA_MULTIPLY",
                                                   "ALPHA_MAXIMIZED"]).onChange(function (value) {
                                                       switch (value) {
                                                           case "ALPHA_DISABLE":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_DISABLE;
                                                               break;
                                                           case "ALPHA_COMBINE":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
                                                               break;
                                                           case "ALPHA_ONEONE":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
                                                               break;
                                                           case "ALPHA_ADD":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_ADD;
                                                               break;
                                                           case "ALPHA_SUBTRACT":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_SUBTRACT;
                                                               break;
                                                           case "ALPHA_MULTIPLY":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;
                                                               break;
                                                           case "ALPHA_MAXIMIZED":
                                                               material.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;


                                                       }
                                                   });
        primitiveFolder.add(material, "backFaceCulling", material.backFaceCulling).onChange(function (value) {
            material.backFaceCulling = value;
        });
        primitiveFolder.add(material, "wireframe", material.wireframe).onChange(function (value) {
            material.wireframe = value;
        });
        primitiveFolder.add(material, "useAlphaFromDiffuseTexture", material.useAlphaFromDiffuseTexture).onChange(function (value) {
            material.useAlphaFromDiffuseTexture = value;
        });
        primitiveFolder.add(material, "useEmissiveAsIllumination", material.useEmissiveAsIllumination).onChange(function (value) {
            material.useEmissiveAsIllumination = value;
        });
        primitiveFolder.add(material, "useGlossinessFromSpecularMapAlpha", material.useGlossinessFromSpecularMapAlpha).onChange(function (value) {
            material.useGlossinessFromSpecularMapAlpha = value;
        });
        primitiveFolder.add(material, "useLightmapAsShadowmap", material.useLightmapAsShadowmap).onChange(function (value) {
            material.useLightmapAsShadowmap = value;
        });
        primitiveFolder.add(material, "invertNormalMapX", material.invertNormalMapX).onChange(function (value) {
            material.invertNormalMapX = value;
        });
        primitiveFolder.add(material, "invertNormalMapY", material.invertNormalMapY).onChange(function (value) {
            material.invertNormalMapY = value;
        });
        primitiveFolder.add(material, "disableLighting", material.disableLighting).onChange(function (value) {
            material.disableLighting = value;
        });
        primitiveFolder.add(material, "disableDepthWrite", material.disableDepthWrite).onChange(function (value) {
            material.disableDepthWrite = value;
        });
        primitiveFolder.add(material, "specularPower", 0, 1000).onChange(function (value) {
            material.specularPower = value;
        });
    };

    $g.createAllMaterialOption = function (materialIdOrMaterial) {
        return {
            materialIdOrMaterial: materialIdOrMaterial,
            dffuseUrl: null,
            bumpUrl: null,
            paralaxUrl: null,
            specularUrl: null,
            ambientUrl: null,
            emissiveUrl: null,
            opacityUrl: null,
            reflectionUrl: null,
            lightUrl: null,
            heightUrl: null,
            refractionUrl: null

        };
    };

    $g.createMaterialOptionsFromMaterial = function (materialIdOrMaterial, advancedOption) {
        var allMaterialOption = $g.createAllMaterialOption(materialIdOrMaterial);
        if (advancedOption) {
            if (advancedOption.paralaxUrl) {
                allMaterialOption.paralaxUrl = advancedOption.paralaxUrl;
            }
        }
        var material;
        if (typeof materialIdOrMaterial === "string") {
            material = EM.GetMaterial(materialIdOrMaterial);
        }
        else {
            material = materialIdOrMaterial;
        }

        if (!material) {
            console.log("createMaterialOptionsFromMaterial: material not exist", {
                material: material
            });
            return;
        }
        _.forEach($g.SUPORTED_TEXTURES, function (texturePropName, key) {
            if (material[texturePropName] && material[texturePropName].url) {
                var optionName = _.lowerFirst(key) + "Url";
                allMaterialOption[optionName] = material[texturePropName].url;
            }
        });
        $g.createAllMaterialViews(allMaterialOption);

    };



    $g.SUPORTED_TEXTURES = {
        Dffuse: "diffuseTexture",
        Bump: "bumpTexture",
        Specular: "specularTexture",
        Ambient: "ambientTexture",
        Emissive: "emissiveTexture",
        Opacity: "opacityTexture",
        Reflection: "reflectionTexture",
        Light: "lightTexture",
        Height: "heightTexture",
        Refraction: "refractionTexture"
    };
    Object.freeze($g.SUPORTED_TEXTURES);
    $g.SUPORTED_COLOR3 = {
        diffuseColor: "diffuseColor",
        emissiveColor: "emissiveColor",
        ambientColor: "ambientColor",
        specularColor: "specularColor"

        //cameraColorCurves: "cameraColorCurves"
    };
    Object.freeze($g.SUPORTED_COLOR3);
    $g.SUPORTED_FRESNEL_PARAMETERS = {
        diffuseFresnelParameters: "diffuseFresnelParameters",
        opacityFresnelParameters: "opacityFresnelParameters",
        reflectionFresnelParameters: "reflectionFresnelParameters",
        emissiveFresnelParameters: "emissiveFresnelParameters",
        refractionFresnelParameters: "refractionFresnelParameters"
    };
    Object.freeze($g.SUPORTED_FRESNEL_PARAMETERS);

})(Utils.DatGuid);