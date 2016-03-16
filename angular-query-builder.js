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
    }
}]);