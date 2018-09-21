/*global MediumEditor */
angular.module('angular-medium-editor', []).directive('mediumEditor', function () {
      'use strict';

      function toInnerText(value) {
          var tempEl = document.createElement("div");
          tempEl.innerHTML = value;
          var text = tempEl.textContent || "";
          return text.trim();
      }

      function updateEditor(scope, iElement, iAttrs, ngModel) {
          angular.element(iElement).addClass("angular-medium-editor");
          // Global MediumEditor
          ngModel.editor = new MediumEditor(iElement, scope.bindOptions);
          ngModel.$render = function () {
              ngModel.editor.setContent(ngModel.$viewValue || "");
              var placeholder = ngModel.editor.getExtensionByName("placeholder");
              if (placeholder) {
                  placeholder.updatePlaceholder(iElement[0]);
              }
          };

          ngModel.editor.subscribe("editableInput", function (event, editable) {
              ngModel.$setViewValue(editable.innerHTML.trim());
          });
      }


      return {
          require: "ngModel",
          restrict: "AE",
          scope: { bindOptions: "=" },
          link: function (scope, iElement, iAttrs, ngModel) {
              updateEditor(scope, iElement, iAttrs, ngModel);

              ngModel.$isEmpty = function (value) {
                  if (/[<>]/.test(value)) {
                      return toInnerText(value).length === 0;
                  } else if (value) {
                      return value.length === 0;
                  } else {
                      return true;
                  }
              };
              scope.$on('mediumEditor:update-option', function (e, bindOptions) {
                  ngModel.editor.destroy();
                  scope.bindOptions = bindOptions;
                  updateEditor(scope, iElement, iAttrs, ngModel);
                 // console.log("mediumEditor:update-option", { ngModel: ngModel, bindOptions: bindOptions });
                  // ngModel.editor.init(iElement, bindOptions);
              });
     
              scope.$watch("bindOptions", function (bindOptions) {
                  ngModel.editor.init(iElement, bindOptions);
              });
              scope.$on("$destroy", function () {
                  ngModel.editor.destroy();
              });
          }
      };

  });