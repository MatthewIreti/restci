var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
;
var RootListCtrl = (function () {
    function RootListCtrl($scope, Resource, config) {
        var _this = this;
        this.$scope = $scope;
        this.Resource = Resource;
        this.config = config;
        this.$scope.waiting = 0;
        this.$scope.orderByExpression = { column: 1, direction: 1 };
        this.$scope.filter = {};
        this.$scope.toggleActive = function (item) { return _this.toggleActive(item); };
        this.$scope.goBack = function () { return _this.goBack(); };
        this.$scope.backLink = {};
        this.$scope.enableDownload = false;
    }
    RootListCtrl.prototype.toggleActive = function (item) {
        var _this = this;
        this.$scope.notificationSvc.showConfirm("Are you sure ?", function () {
            _this.$scope.waiting++;
            _this.Resource.toggleActive(item).$promise.then(function (data) {
                _this.$scope.waiting--;
                _this.$scope.setupPagination();
                toastr.success("Information", "Operation was successful");
            }, function (response) {
                toastr.error("Error", "Error occured while performing the action");
                _this.$scope.waiting--;
            });
        });
    };
    RootListCtrl.prototype.resetFiltering = function () {
        this.$scope.filter = {};
        this.setupPagination();
    };
    RootListCtrl.prototype.init = function (size) {
        this.initScope(size);
        this.setupPagination();
        this.bindScopeMethods();
    };
    RootListCtrl.prototype.initScope = function (size) {
        var _this = this;
        this.$scope.openDate = function ($event, property) {
            $event.preventDefault();
            $event.stopPropagation();
            _this.$scope.opened[property] = true;
        };
        this.$scope.opened = {};
        this.$scope.filterIsClosed = true;
        this.$scope.page = 1;
        this.$scope.paginationConfig = {
            count: size || 50,
            page: 1,
            total: 0
        };
        this.$scope.openCalender = function ($event, openOption) {
            $event.preventDefault();
            $event.stopPropagation();
            _this.$scope[openOption] = true;
        };
        this.$scope.waiting = 0;
        this.$scope.pager = { page: 1 };
        this.$scope.setupPagination = function () { return _this.setupPagination(); };
        this.$scope.getTotalPages = function () { return _this.getTotalPages(); };
        this.$scope.resetFiltering = function () { return _this.resetFiltering(); };
        this.$scope.getPageInfoDescription = function () { return _this.getPageInfoDescription(); };
        this.$scope.getCheckedItems = function () { return _this.getCheckedItems(); };
        this.$scope.checkAll = function () { return _this.checkAll(); };
        this.$scope.orderExpressionChanged = function () { return _this.orderExpressionChanged(); };
        this.$scope.selectedIds = [];
    };
    RootListCtrl.prototype.getCheckedItems = function () {
        var checked = 0;
        this.$scope.selectedIds = [];
        if (this.$scope.items) {
            for (var i = 0; i < this.$scope.items.length; i++) {
                if (this.$scope.items[i].selected) {
                    checked++;
                    this.$scope.selectedIds.push(this.$scope.items[i].id);
                }
            }
        }
        return checked;
    };
    RootListCtrl.prototype.checkAll = function () {
        var _this = this;
        angular.forEach(this.$scope.items, function (item) {
            item.selected = !_this.$scope.selectedAll;
        });
    };
    RootListCtrl.prototype.toggleSelectItem = function (index) {
        this.$scope.items[index].selected = !this.$scope.items[index].selected;
    };
    RootListCtrl.prototype.getIndexSeed = function ($index) {
        return (this.$scope.pager.page - 1) * this.$scope.paginationConfig.count + $index + 1;
    };
    RootListCtrl.prototype.getPageInfoDescription = function () {
        if (this.$scope.items) {
            return "Showing " +
                (this.$scope.paginationConfig.count * (this.$scope.pager.page - 1) + 1) +
                " to " +
                (this.$scope.paginationConfig.count * (this.$scope.pager.page - 1) + this.$scope.items.length) +
                " of " +
                this.$scope.paginationConfig.total;
        }
        return "";
    };
    RootListCtrl.prototype.getTotalPages = function () {
        return Math.ceil(this.$scope.paginationConfig.total / this.$scope.paginationConfig.count);
    };
    RootListCtrl.prototype.bindScopeMethods = function () {
        var _this = this;
        this.$scope.pageChanged = function () { return _this.pageChanged(); };
        this.$scope.deleteObject = function (item) { return _this.deleteObject(item); };
        this.$scope.reloadPage = function () { return _this.reloadPage(); };
        this.$scope.getIndexSeed = function (index) { return _this.getIndexSeed(index); };
    };
    RootListCtrl.prototype.setupPagination = function () {
        var _this = this;
        this.$scope.waiting++;
        this.Resource.count($.extend({
            size: this.$scope.paginationConfig.count,
            page: this.$scope.paginationConfig.page,
            orderByExpression: this.$scope.orderByExpression,
            whereCondition: JSON.stringify(this.$scope.filter)
        }, this.$scope.$stateParams, this.config, this.$scope.filter)).$promise.then(function (data) {
            _this.$scope.waiting--;
            _this.$scope.paginationConfig.total = data.total;
            _this.$scope.listResp = data;
            _this.$scope.items = data.items;
            _this.$scope.hideFilter = false;
            _this.$scope.$broadcast('loadedItems'); //please don't remove, it is for fullCalendar directive'
        });
    };
    RootListCtrl.prototype.pageChanged = function () {
        var _this = this;
        this.$scope.waiting++;
        this.Resource.query($.extend({
            size: this.$scope.paginationConfig.count,
            page: this.$scope.paginationConfig.page,
            orderByExpression: this.$scope.orderByExpression,
            whereCondition: JSON.stringify(this.$scope.filter)
        }, this.$scope.$stateParams, this.config, this.$scope.filter)).$promise.then(function (data) {
            _this.$scope.items = data;
            _this.$scope.pager.page = _this.$scope.paginationConfig.page;
            _this.$scope.waiting--;
            _this.$scope.$broadcast('loadedItems'); //please don't remove, it is for fullCalendar directive'
        }, function (data) {
            _this.$scope.waiting--;
        });
    };
    RootListCtrl.prototype.deleteObject = function (item) {
        var _this = this;
        this.$scope.notificationSvc.showConfirm("Are sure you ?", function () {
            _this.$scope.waiting++;
            _this.Resource.delete(item).$promise.then(function () {
                _this.$scope.waiting--;
                _this.$scope.notificationSvc.showSuccessToast("Item was successfully deleted");
                _this.setupPagination();
            }, function (response) {
                toastr.error(response.data.message, "Error");
                _this.$scope.waiting--;
            });
        });
    };
    RootListCtrl.prototype.reloadPage = function () {
        this.$scope.$state.reload();
    };
    RootListCtrl.prototype.orderExpressionChanged = function () {
        if (this.$scope.order.column && this.$scope.order.direction) {
            this.$scope.orderByExpression = this.$scope.order.column + " " + this.$scope.order.direction;
            this.pageChanged();
        }
        else
            this.$scope.orderByExpression = null;
    };
    RootListCtrl.prototype.goBack = function (forward, data) {
        this.$scope.$state.go(this.$scope.backLink.forwardLink || this.$scope.backLink.state, $.extend({}, this.$scope.$stateParams, this.config, this.$scope.item));
    };
    return RootListCtrl;
}());
var RootCreateEditCtrl = (function () {
    function RootCreateEditCtrl($scope, Resource, Item, config) {
        var _this = this;
        this.$scope = $scope;
        this.Resource = Resource;
        this.Item = Item;
        this.config = $.extend($scope.$stateParams, config);
        $scope.backLink = {};
        this.$scope.openDate = function ($event, property) {
            $event.preventDefault();
            $event.stopPropagation();
            _this.$scope.opened[property] = true;
        };
        this.$scope.processFile = false;
        this.$scope.formId = "";
        this.$scope.opened = {};
        $scope.goBack = function () { return _this.goBack(); };
        $scope.submitForm = function () { return _this.submitForm(); };
        $scope.reloadForm = function () { return _this.reloadForm(); };
        $scope.item = {};
        $scope.waiting = 1;
        if (this instanceof BaseEditCtrl) {
            this.$scope.item = Resource.get(this.config);
            this.$scope.item.$promise.then(function (data) {
                _this.$scope.item = data;
                _this.$scope.waiting--;
            });
        }
        else {
            $scope.item = new Item(this.config);
            $scope.waiting--;
        }
        $scope.stepUpWait = function () { return _this.stepUpWait(); };
        $scope.stepDownWait = function () { return _this.stepDownWait(); };
        $scope.demoOptions = {
            title: 'Select',
            filterPlaceHolder: 'Start typing to filter the lists below.',
            labelAll: 'All',
            labelSelected: 'Selected',
            helpMessage: 'click user to transfer them between fields.',
            /* angular will use this to filter your lists */
            orderProperty: 'Name',
            /* this contains the initial list of all items (i.e. the left sIde) */
            items: [],
            /* this list should be initialized as empty or with any pre-selected items */
            selectedItems: []
        };
    }
    RootCreateEditCtrl.prototype.stepUpWait = function () {
        this.$scope.waiting++;
    };
    RootCreateEditCtrl.prototype.stepDownWait = function () {
        this.$scope.waiting--;
    };
    RootCreateEditCtrl.prototype.submitForm = function () {
        var _this = this;
        this.$scope.notificationSvc.showConfirm("Are you sure?", function () {
            _this.$scope.waiting++;
            if (_this instanceof BaseEditCtrl) {
                _this.Resource.update(_this.$scope.item).$promise.then(function (data) {
                    toastr.success("Updated successfully");
                    _this.$scope.waiting--;
                    _this.goBack(true, data);
                }, function (response) {
                    toastr.error("There was an error updating the information");
                    _this.handleError(response);
                });
            }
            else {
                _this.$scope.item.$save(function (data) {
                    toastr.success("Saved successfully");
                    _this.goBack(true, data);
                }, function (response) {
                    toastr.error("There was an error saving the information");
                    _this.handleError(response);
                });
            }
        });
    };
    RootCreateEditCtrl.prototype.handleError = function (response) {
        this.$scope.errors = [];
        this.$scope.errors = this.$scope.errorHandle.handleError(response);
        this.$scope.waiting = 0;
    };
    RootCreateEditCtrl.prototype.reloadForm = function () {
        var _this = this;
        this.$scope.errors = [];
        this.$scope.waiting++;
        if (this instanceof BaseEditCtrl) {
            this.$scope.item = this.Resource.get(this.config);
            this.$scope.item.$promise.then(function () {
                _this.$scope.waiting--;
            });
        }
        else {
            this.$scope.item = new this.Item(this.config);
            this.$scope.waiting--;
        }
    };
    RootCreateEditCtrl.prototype.goBack = function (forward, data) {
        this.$scope.$state.go(forward ? this.$scope.backLink.forwardLink : this.$scope.backLink.state, $.extend({}, this.$scope.$stateParams, this.config, data));
    };
    return RootCreateEditCtrl;
}());
var BaseEditCtrl = (function (_super) {
    __extends(BaseEditCtrl, _super);
    function BaseEditCtrl($scope, resource, config) {
        var _this = _super.call(this, $scope, resource, null, config) || this;
        $scope.editMode = true;
        return _this;
    }
    return BaseEditCtrl;
}(RootCreateEditCtrl));
var BaseCreateCtrl = (function (_super) {
    __extends(BaseCreateCtrl, _super);
    function BaseCreateCtrl($scope, Item, config) {
        return _super.call(this, $scope, null, Item, config) || this;
    }
    return BaseCreateCtrl;
}(RootCreateEditCtrl));
var RootBaseDetailCtrl = (function () {
    function RootBaseDetailCtrl($scope, resource, backLink, config, $modalInstance) {
        var _this = this;
        this.$scope = $scope;
        this.resource = resource;
        this.backLink = backLink;
        this.config = config;
        this.$modalInstance = $modalInstance;
        this.init();
        this.$scope.goBack = function () { return _this.goBack(); };
        this.$scope.opened = {};
        this.$scope.backLink = {};
        this.$scope.closeModal = function () {
            $modalInstance.close();
        };
        this.$scope.openDate = function ($event, property) {
            $event.preventDefault();
            $event.stopPropagation();
            _this.$scope.opened[property] = true;
        };
    }
    RootBaseDetailCtrl.prototype.reload = function () {
        var _this = this;
        this.$scope.waiting = 1;
        this.$promise = null;
        if (this.resource.details)
            this.$promise = this.resource.details(this.$scope.$stateParams).$promise;
        else
            this.$promise = this.resource.get(this.$scope.$stateParams).$promise;
        this.$promise
            .then(function (data) {
            _this.$scope.item = data;
            _this.$scope.waiting--;
        }, function (error) {
            toastr.error("Error ocured while fetching the details", "Error");
        });
    };
    RootBaseDetailCtrl.prototype.init = function () {
        var _this = this;
        this.$scope.$stateParams = $.extend(this.$scope.$stateParams, this.config);
        this.$scope.toggleActive = function () { return _this.toggleActive(); };
        this.$scope.deleteObject = function () { return _this.deleteObject(); };
        this.reload();
        this.$scope.submitForm = function () { return _this.submitForm(); };
        this.$scope.validationRule = {
            rules: {},
            messages: {}
        };
        this.$scope.handleError = function (response) { return _this.handleError(response); };
    };
    RootBaseDetailCtrl.prototype.deleteObject = function () {
        var _this = this;
        this.$scope.notificationSvc.bootBoxConfirm("Are you sure?", function () {
            _this.$scope.waiting++;
            _this.resource.delete(_this.$scope.item).$promise.then(function () {
                _this.$scope.waiting--;
                toastr.success("Information", "Deleted successfully!");
                _this.$scope.$state.go(_this.backLink.forwardLink, _this.$scope.$stateParams);
            }, function (response) {
                _this.$scope.waiting--;
            });
        });
    };
    RootBaseDetailCtrl.prototype.submitForm = function () {
        this.$scope.waiting++;
        var promise;
    };
    RootBaseDetailCtrl.prototype.goBack = function (forward, data) {
        this.$scope.$state.go(this.$scope.backLink.forwardLink || this.$scope.backLink.state, $.extend({}, this.$scope.$stateParams, this.config, this.$scope.item));
    };
    RootBaseDetailCtrl.prototype.toggleActive = function () {
        var _this = this;
        this.$scope.waiting++;
        this.resource.toggleActive(this.$scope.item).$promise.then(function (data) {
            _this.$scope.item = data;
            _this.$scope.waiting--;
            toastr.success("Success", "Action successful");
        }, function (response) {
            _this.$scope.waiting--;
            toastr.error("Error!", "Error occured");
        });
    };
    RootBaseDetailCtrl.prototype.handleError = function (response) {
        this.$scope.errors = [];
        this.$scope.errors = this.$scope.errorHandle.handleError(response);
        this.$scope.waiting = 0;
    };
    return RootBaseDetailCtrl;
}());
//# sourceMappingURL=RootClasses.js.map