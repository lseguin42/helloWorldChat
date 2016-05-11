angular.module('helloWorldChat')
   .directive('cropper', function () {
       return {
           restrict: 'E',
           templateUrl: 'directives/cropper/cropper.html',
           scope: {
               'base64': '=',
               'default': '@',
               'edit': '&'
           },
           link: function (scope, element, attrs) {
               var $ng = function (query) {
                   return angular.element(element[0].querySelector(query));
               }
               
               var imageSetByFile = false;
               var cropper = null;
               var $container = $ng('.cropper-container');
               var $file = $ng('.cropper-file');
               var $image = $ng('.cropper-image');
               
               scope.$watch('base64', function () {
                   $image.attr('src', scope.base64 || scope.default);
               });
               
               $container.bind('click', function (event) {
                   if (cropper)
                       return event.stopPropagation();
                   $file[0].click();
               });
               
               $image.bind('load', function () {
                   if (!imageSetByFile)
                       return ;
                   imageSetByFile = false;
                   $jQueryImg = $($image[0]);
                   
                   cropper = $jQueryImg.cropper({
                       aspectRatio: 1 / 1,
                        viewMode: 3,
                        dragMode: 'move',
                        autoCrop: true,
                        minContainerWidth: 20,
                        minContainerHeight: 20,
                        autoCropArea: 1,
                        toggleDragModeOnDblclick: false,
                        highlight: false,
                        cropBoxMovable: false,
                        cropBoxResizable: false,
                        built: function () {
                            cropper = this;
                            $('body').one('click', function () {
                                var dataContainer = $jQueryImg.cropper('getContainerData');
                                var canvas = $jQueryImg.cropper('getCroppedCanvas', dataContainer);
                                scope.base64 = canvas.toDataURL();
                                $jQueryImg.cropper('destroy');
                                scope.edit();
                                scope.$apply();
                                cropper = null;
                            });
                        }
                   });
               });
               
               $file.bind('change', function () {
                   var f = this.files[0];
                   if (!f)
                       return ;
                   $image.attr('src', URL.createObjectURL(f));
                   
                   imageSetByFile = true;
                   
               });
           }
       }
   })