// fix bug clone material and textures
(function (SerializationHelper) {
    SerializationHelper.Clone = function (creationFunction, source) {
        var destination = creationFunction();
        // Tags
        if (BABYLON.Tags) {
            BABYLON.Tags.AddTagsTo(destination, source.tags);
        }
        // Properties
        for (var property in destination.__serializableMembers) {
            var propertyDescriptor = destination.__serializableMembers[property];
            var sourceProperty = source[property];
            var propertyType = propertyDescriptor.type;
            if (sourceProperty !== undefined && sourceProperty !== null) {
                switch (propertyType) {
                    case 0: // Value
                    case 6:
                        destination[property] = sourceProperty;
                        break;
                    case 1: // Texture
                        //if (!propertyDescriptor.sourceName) {
                        //    destination[property] = sourceProperty.clone();  
                        //}
                        //break;

                    case 2: // Color3
                    case 3: // FresnelParameters
                    case 4: // Vector2
                    case 5: // Vector3
                    case 7:
                        destination[property] = sourceProperty.clone();
                        break;
                }
            }
        }
        return destination;
    };
})(BABYLON.SerializationHelper);