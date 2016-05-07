var app = angular.module('app', ['ngSanitize', 'queryBuilder']);
app.controller('QueryBuilderCtrl', ['$scope', function ($scope) {
    var data = '{"group": {"operator": "AND","rules": []}}';

    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function computed(group) {
        if (!group) return "";
        for (var str = "(", i = 0; i < group.rules.length; i++) {
            i > 0 && (str += " <strong>" + group.operator + "</strong> ");
            str += group.rules[i].group ?
                computed(group.rules[i].group) :
                group.rules[i].field + " " +group.rules[i].field1 + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data1 + " " +
                 group.rules[i].field2 + htmlEntities(group.rules[i].condition) + " " +group.rules[i].data2 ;
        }

        return str + ")";
    }

    $scope.json = null;

    $scope.filter = JSON.parse(data);
   

    $scope.$watch('filter', function (newValue) {
        alert(JSON.stringify(newValue));
        alert("here");
        $scope.json = JSON.stringify(newValue, null, 2);
        $scope.output = computed(newValue.group);
    }, true);
}]);

var queryBuilder = angular.module('queryBuilder', []);
queryBuilder.directive('queryBuilder', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/queryBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {
                scope.operators = [
                    { name: 'AND' },
                    { name: 'OR' }
                ];

                scope.fields = [
                    { name: 'counterparty 1'},
                    { name: 'Security' },
                    { name: 'Birthdate' },
                    { name: 'City' },
                    { name: 'Country' }
                ];

                scope.field1 = [
                    { name: 'code type'},
                    { name: 'Security' },
                    { name: 'Birthdate' },
                    { name: 'City' },
                    { name: 'Country' }
                ];
                scope.field2 = [
                    { name: 'code'},
                    { name: 'Security' },
                    { name: 'Birthdate' },
                    { name: 'City' },
                    { name: 'Country' }
                ];

                scope.conditions = [
                    { name: '=' },
                    { name: '<>' },
                    { name: '<' },
                    { name: '<=' },
                    { name: '>' },
                    { name: '>=' }
                ];

                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: '=',
                        field: 'counterparty 1',
                        field1:'code type',
                        field2:'code',
                        data1: '',
                        data2:''
                    });
                };

                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
        /*! dynamic-form - v1.0.5 - 2016-04-07
* 2016 awk team;  */
(function(){
    
'use strict';

angular.module('awk-dynamic-form', ["ui.bootstrap"])

.controller('dateOptionsCtrl', function($scope) {
    
    /*date controller functions */
    
    $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.showWeeks = true;
      $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
      };

      $scope.clear = function () {
        $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event) {

          $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };

      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = $scope.formats[0];

    /*date functions end*/

    $scope.showAlert = function(val){
      alert("val is: " + val);
    };
})

.directive('formDirective', ['$compile', '$parse','$filter', function($compile, $parse,$filter) {
        
    var elemArr = {};
    
    elemArr['button'] = angular.element("<button ng-click=showAlert('hello')><p> This div was added at compile time</p></button>");
    
    elemArr['string'] = "<input class='filter-dropdown-input' type=\"text\">";
    
    /*elemArr['date'] = "<input style='background-color:#DEE8E9; color:#808285;left:15px; width:63%;border:2px solid #333333; border-radius:5px;'' type=\"date\">";*/
    
    elemArr['date'] = "<input type='text' data='date' datepicker-popup='{{format}}' min='minDate' show-weeks='false' date-disabled='disabled(date, mode)' show-button-bar='true' close-text='Close' />";
    elemArr['time'] = '<timepicker hour-step="1" minute-step="15" show-meridian="false"></timepicker>';
    elemArr['date_cover'] = "<p class='input-group'> \n\
                                <span class='input-group-addon'>\n\
                                  <i class='glyphicon glyphicon-calendar'></i>\n\
                                </span>\n\
                            </p>";

    elemArr['select'] = "<select data='dy-fm-select'></select>";
    
    elemArr['multi-line'] = "<textarea class='filter-dropdown-multi-line'></textarea>";
    
    elemArr['checkbox'] = "<input type='checkbox'></input>";

    elemArr['group'] = "<fieldset class='scheduler-border'></fieldset>";

    return {
        restrict: 'A',
        template: '<div class=\"row form-main-row\"></div>',
        replace: true,
        scope:{
            filterFields: '=',
            filterArrayName: '@',
            submitLabel: '@',
            clearLabel: '@',
            onSubmit: '@',
            onClear: '@',
            formErrorMsg: '=',
            formElements:'&'
        },

        
        controller: ['$scope', function($scope){
            $scope.showAlert = function(val) {
                alert("val is: " + val);
            };
            $scope.dt = new Date();
            $scope.dtFrom = new Date($scope.dt.getUTCFullYear(),$scope.dt.getUTCMonth(),$scope.dt.getUTCDate(), 0,0,0);
            $scope.dtTo = new Date($scope.dt.getUTCFullYear(),$scope.dt.getUTCMonth(),$scope.dt.getUTCDate(), 23,59,59);

        }],
                
        link: function postLink(scope, ele, attrs) {
            
            var fields = scope.filterFields;
            var fieldsArrName = scope.filterArrayName;
            var submitLbl = scope.submitLabel;
            var clearLbl = scope.clearLabel;
            var submitFunc = scope.onSubmit;
            var clearFunc = scope.onClear;
            var i = 0;
            
            var rowElem;
            var fieldsDiv = angular.element('<div class=\"col-md-10\"></div>');
            var controlsDiv = angular.element('<div class=\"col-md-1\"></div>');
            var dateTimePickerRef = [];
            var datePickerRef  = [];
            var firstDiv = angular.element('<input type="text" readonly class="alert alert-danger" style="width: 65%;float: left;padding: 6px;margin-bottom:10px" />');
            firstDiv.attr('ng-show', "searchInvalid");
            firstDiv.attr('ng-model', "searchInvalidMsg");
            ele.append(firstDiv);
            var formObj;
            scope.formElementsArray = [];
            
            function setNestedValue(parentObject, propertyString, value) {
                var props = propertyString.split('.');

                if(props.length == 1){
                    parentObject[propertyString] = params.newValue;
                }else{
                    var final = props.pop();
                    var p;
                    while(p = props.shift()) {
                        obj = parentObject[p]
                    } 
                    obj[final] = value;
                }
            }
            
            function dateTimeChangeHandler (e) {
                setModelValues(e, 'dd-MMM-yyyy HH:mm:ss' , dateTimePickerRef);
            }

            function dateChangeHandler (e){
                setModelValues(e, 'dd-MMM-yyyy' , datePickerRef);
            }

            function setModelValues(e, format, idsArrayRef){
                var dt;
                if(e.date){
                        //console.log(e.date.toString());
                        dt =  $filter('date')( e.date.toDate(), format);
                    }
                else
                    {
                        dt = undefined;
                    }
                    var model = _.findWhere(idsArrayRef, {id:e.currentTarget.id});
                    var props = model.model.split('.');
                    var filterDataProName = props[0];
                    var ctrlScope = scope.$parent
                    while(ctrlScope && !ctrlScope.hasOwnProperty(filterDataProName))
                        {
                            ctrlScope = ctrlScope.$parent;
                        }
                    scope.$apply(function(){
                        setNestedValue(ctrlScope, model.model, dt);
                    });
            }

            angular.forEach(fields, function(field){

                var newDiv = angular.element(elemArr[field.type]);
                var dateDiv;

                if(field.type == 'datetime')
                {
                    
                        var timestamp = new Date().getUTCMilliseconds();
                        newDiv = angular.element('<div class="input-group date" id="'+timestamp+'_'+field.name+'">\n\
                            <input type="text" class="form-control filter-dropdown-input" ng-model="'+field.model+'" style="font-size:12px"/>\n\
                            <span class="input-group-addon datetime-icon">\n\
                                <span class="glyphicon glyphicon-calendar"></span>\n\
                            </span>\n\
                        </div>');
                        dateTimePickerRef.push({id: timestamp+"_"+field.name, model:field.model,timeFormat:field.defaultTime});
                        formObj = new Object();
                        formObj.elementType = field.type;
                        formObj.html = newDiv;
                        formObj.name = field.name;
                        scope.formElementsArray.push(formObj);
                }

                if(newDiv){

                    if(i%2 == 0){
                        rowElem = angular.element('<div class="row"></div>');
                    }
                    
                    var captionElem;
                    if(field.mandatory)captionElem = angular.element('<div class="col-md-2 captionText"></div>');
                    else captionElem = angular.element('<div class="col-md-2"></div>');
                    
                    var bodyElem = angular.element('<div class="col-md-3" style=""></div>');

                   if(field.type != 'group' && field.type != 'datetime'){
                        newDiv.attr('id', field.caption);
                        newDiv.attr('ng-model', field.model);
                        newDiv.attr('placeholder', field.caption);
                   }

                   if(field.hasOwnProperty('textcase') && field.textcase != 'undefined') {
                        if(field.textcase == 'upper'){
                            var classValue = newDiv.attr('class') + " form-textUppercase";
                            newDiv.attr('class', classValue);
                        }
                        else if(field.textcase == 'lower') {
                            var classValue = newDiv.attr('class') + " form-textLowercase";
                            newDiv.attr('class', classValue);
                        } 
                   }
                    
                    if(field.type == 'select') {
                        
                        newDiv.attr('ng-options', 'item.value as item.caption for item in '+ fieldsArrName +'['+ i +'].options');
                        formObj = new Object();
                        formObj.elementType = field.type;
                        formObj.html = newDiv;
                        formObj.name = field.name;
                        scope.formElementsArray.push(formObj);
                    }
                    
                    if(field.type == 'group') {

                        var bodyElem = angular.element('<div class="col-md-5" style=""></div>');

                        if(field.disabled != undefined){
                            bodyElem.attr('ng-hide', field.disabled);
                          }

                        var captionElem = angular.element('<legend class="scheduler-border"></legend>');
                        captionElem.text(field.caption+":");
                        newDiv.append(captionElem);
                        var j =0;

                        angular.forEach(field.children, function(childField){

                            var childDiv = angular.element(elemArr[childField.type]);
                            childDiv.attr('id', childField.caption);
                            childDiv.attr('ng-model', childField.model);
                            childDiv.attr('placeholder', childField.caption);
                            //console.log("children array",childField.options);

                            if(childField.hasOwnProperty('textcase') && childField.textcase != 'undefined') {
                                if(childField.textcase == 'upper'){
                                    var classValue = childDiv.attr('class') + " form-textUppercase";
                                    childDiv.attr('class', classValue);
                                }
                                else if(childField.textcase == 'lower') {
                                    var classValue = childDiv.attr('class') + " form-textLowercase";
                                    childDiv.attr('class', classValue);
                                } 
                            }
                            
                            if(childField.type == 'select') {
                                 childDiv.attr('ng-options', 'item.value as item.caption for item in '+ fieldsArrName +'['+ i +'].children['+ j +'].options');
                            }
                            else if(childField.type == 'datetime')
                            {
                                   var timestamp = new Date().getUTCMilliseconds();
                                    childDiv = angular.element('<div class="input-group date" id="'+timestamp+'_'+childField.name+'" style="float: right;margin-right: 5px;width: 70%;top: -20px;" ng-disabled="'+childField.name+'">\n\
                                        <input type="text" class="form-control filter-dropdown-input" ng-model="'+childField.model+'" style="font-size:12px"/>\n\
                                        <span class="input-group-addon datetime-icon">\n\
                                            <span class="glyphicon glyphicon-calendar"></span>\n\
                                        </span>\n\
                                    </div>');
                                    dateTimePickerRef.push({id: timestamp+"_"+childField.name, model:childField.model,timeFormat:childField.defaultTime});
                             
                            }
                            else if(childField.type == 'date')
                            {
                                   var timestamp = new Date().getUTCMilliseconds();
                                    childDiv = angular.element('<div class="input-group date" id="'+timestamp+'_'+childField.name+'" style="float: right;margin-right: 5px;width: 70%;top: -20px;">\n\
                                        <input type="text" class="form-control filter-dropdown-input" ng-model="'+childField.model+'" style="font-size:12px"/>\n\
                                        <span class="input-group-addon datetime-icon">\n\
                                            <span class="glyphicon glyphicon-calendar"></span>\n\
                                        </span>\n\
                                    </div>');
                                    datePickerRef.push({id: timestamp+"_"+childField.name, model:childField.model});
                             
                            }

                            if(childField.mandatory)newDiv.append(angular.element("<label for='"+childField.caption+"' class='captionText'>"+childField.caption+":</label>"));
                            else newDiv.append(angular.element("<label for='"+childField.caption+"' style='width:134px;font-weight:normal'>"+childField.caption+":</label>"));

                            formObj = new Object();
                            formObj.elementType = childField.type;
                            formObj.html = childDiv;
                            formObj.name = childField.name;
                            scope.formElementsArray.push(formObj);

                            newDiv.append(childDiv);
                            newDiv.append(angular.element("<br><br>"));
                            j++;
                        });
                    }

                    captionElem.text(field.caption);
                    if(field.type != 'group')rowElem.append(captionElem);
                    rowElem.append(bodyElem);
                    bodyElem.append(newDiv);
                    fieldsDiv.append(rowElem);
                    i++;
                }
            });

            if(scope.formElementsArray && scope.formElementsArray.length > 0){
                scope.formElements({formElementsCollection:scope.formElementsArray});
            }
            
            if(submitLbl != undefined && clearLbl != undefined){
                var controlsElem = angular.element('<div class="row"></div>');
                
                var searchBtn = angular.element('<div><button type="button" class="btn btn-primary btn-sm btn-block form-dropdown-submit" ng-click="'+ submitFunc+ '">'+submitLbl+'</button></div>');
                var hBar = angular.element('<hr class="form-dropdown-hbar"></hr>');
                var resetBtn = angular.element('<div><button type="button" class="btn btn-primary btn-sm btn-block form-dropdown-clear" ng-click="'+ clearFunc + '">'+clearLbl+'</button></div> ');
                
                controlsElem.append(searchBtn);
                controlsElem.append(hBar);
                controlsElem.append(resetBtn);
                controlsDiv.append(controlsElem);
            }
            
            if(fieldsDiv.children() != undefined && controlsDiv.children() != undefined) {
                ele.append(fieldsDiv);
                ele.append(controlsDiv);
                $compile(ele.contents())(scope.$parent);
                
                for (var m = 0; m< datePickerRef.length; m++) {
                    var obj = datePickerRef[m];
                    $('#'+obj.id).datetimepicker({
                        showClose:true,
                        format:"DD-MMM-YYYY"
                    });
                    
                    $('#'+obj.id).on("dp.change", dateChangeHandler);
                }

                for (var k = 0; k< dateTimePickerRef.length; k++) {
                    var obj = dateTimePickerRef[k];
                    var format;

                    if(obj.timeFormat == "dayStart")
                    {
                        format = scope.dtFrom
                    }
                    else if(obj.timeFormat == "dayEnd")
                    {
                        format = scope.dtTo
                    }
                    else
                    {
                        format = scope.dt
                    }

                    $('#'+obj.id).datetimepicker({
                        showClose:true,
                        defaultDate: format,
                        format:"DD-MMM-YYYY HH:mm:ss"
                    });

                    $('#'+obj.id).on("dp.change", dateTimeChangeHandler);
                     
                };
                
               
            }
        }
    };
}]);


})();
    }
}]);
