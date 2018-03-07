interface IRootObject extends ng.resource.IResource<IRootObject> {
    id: number;

    $update(config?): IRootObject;

    selected: boolean;

    $count(config?): any;

    fileName;
}

interface IRootResource<T extends IRootObject> extends ng.resource.IResourceClass<T> {
    update(config?): IRootObject;

    count: any;
    deleteAll: any;

    toggleActive(config?): any;

    details(params): any;

    approve(p: any): any;

    getApprovals(p: { stateId }): any;

    reject(approval): any;

    makePayment;
    downloadExcelSheet: any;

    downloadExcel(config?);

    getDetails: any;

    toggleApprove(p: any): any;
}

interface IRootScope extends ng.IScope {
    formTitle: any;
    userRoles:{
        Admin:1,
        SystemAdmin:2,
        SalesRep:3,
        SupportAdmin:4,
        Client:5
    }
    $state;
    $stateParams;
    errorHandleSvc: any;
    validationSvc: any;
    waiting: any;
    wait: any;
    item: any;
    items: any;
    dialogSvc: any;
    pageSize: any;
    paginationConfig: any;
    isEditMode: boolean;
    memoType: any;
    errorHandle;
    months: any[];
    days;
    getOrdinalFor;
    getMonthText;
    tinymceOptions;
    files: any[];
    file: any[];
    fileTypes: any;

}

interface IHeaderButton {
    type: string;
    title: string;
    link: string;
    icon: string;
}

interface IBackLink {
    state?: string;
    config?: {};
    forwardLink?: string
};

interface IListCtrlScope extends IRootScope {
    headerBottons: IHeaderButton[];
    items: IRootObject[];
    filter: any;
    waiting: number;
    item: IRootObject;
    page: number;
    itemsPerPage: number;
    selectedIdexes: number[];

    checkAll();

    selectedOption;

    goBack();

    backLink: IBackLink;

    setupPagination();

    getIndexSeed(index: number);

    getTotalPages;

    getPageInfoDescription();

    selectedAll;
    selectedIds;

    deleteObject(item: IRootObject);

    editObject(item: IRootObject);

    reloadPage();

    resetFiltering();

    getCheckedItems();

    openCalender(event: Event, name: string);

    pager;
    paginationConfig: { count: number; page: number; total: number };
    pageChanged: () => void;
    order: { column?; direction? };
    orderExpressionChanged: () => void;
    orderByExpression: {};
    whereCondition: string;
    filterIsClosed;
    opened;
    openDate;
    toggleActive;
    title: string;
    hideFilter;
    enableDownload;
    notificationSvc;
    errors;
    downloadAsExcel;
    listResp;

}


class RootListCtrl {
    createLink: string;
    editLink: string;

    constructor(public $scope: IListCtrlScope,
                public Resource: IRootResource<IRootObject>,
                public config?) {
        this.$scope.waiting = 0;
        this.$scope.orderByExpression = {column: 1, direction: 1};
        this.$scope.filter = {};
        this.$scope.toggleActive = (item) => this.toggleActive(item);
        this.$scope.goBack = () => this.goBack();
        this.$scope.backLink = {};
        this.$scope.enableDownload = false;
    }

    toggleActive(item) {
        this.$scope.notificationSvc.showConfirm("Are you sure ?",
            () => {
                this.$scope.waiting++;
                this.Resource.toggleActive(item).$promise.then((data) => {
                        this.$scope.waiting--;
                        this.$scope.setupPagination();
                        toastr.success("Information", "Operation was successful");
                    },
                    (response) => {
                        toastr.error("Error", "Error occured while performing the action");
                        this.$scope.waiting--;
                    });
            });
    }

    resetFiltering() {
        this.$scope.filter = {};
        this.setupPagination();
    }

    init(size?) {
        this.initScope(size);
        this.setupPagination();
        this.bindScopeMethods();
    }

    initScope(size?) {
        this.$scope.openDate = ($event, property: string) => {
            $event.preventDefault();
            $event.stopPropagation();
            this.$scope.opened[property] = true;
        };
        this.$scope.opened = {};

        this.$scope.filterIsClosed = true;

        this.$scope.page = 1;
        this.$scope.paginationConfig = {
            count: size || 50,
            page: 1,
            total: 0
        };

        this.$scope.openCalender = ($event: Event, openOption) => {
            $event.preventDefault();
            $event.stopPropagation();
            this.$scope[openOption] = true;
        };
        this.$scope.waiting = 0;

        this.$scope.pager = {page: 1};

        this.$scope.setupPagination = () => this.setupPagination();
        this.$scope.getTotalPages = () => this.getTotalPages();
        this.$scope.resetFiltering = () => this.resetFiltering();
        this.$scope.getPageInfoDescription = () => this.getPageInfoDescription();
        this.$scope.getCheckedItems = () => this.getCheckedItems();
        this.$scope.checkAll = () => this.checkAll();
        this.$scope.orderExpressionChanged = () => this.orderExpressionChanged();
        this.$scope.selectedIds = [];
    }


    getCheckedItems() {
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
    }

    checkAll() {
        angular.forEach(this.$scope.items,
            (item) => {
                item.selected = !this.$scope.selectedAll;
            });
    }

    toggleSelectItem(index?) {
        this.$scope.items[index].selected = !this.$scope.items[index].selected;
    }

    getIndexSeed($index: number) {
        return (this.$scope.pager.page - 1) * this.$scope.paginationConfig.count + $index + 1;
    }

    getPageInfoDescription() {
        if (this.$scope.items) {
            return "Showing " +
                (this.$scope.paginationConfig.count * (this.$scope.pager.page - 1) + 1) +
                " to " +
                (this.$scope.paginationConfig.count * (this.$scope.pager.page - 1) + this.$scope.items.length) +
                " of " +
                this.$scope.paginationConfig.total;
        }
        return "";
    }

    getTotalPages() {
        return Math.ceil(this.$scope.paginationConfig.total / this.$scope.paginationConfig.count);
    }

    bindScopeMethods() {

        this.$scope.pageChanged = () => this.pageChanged();
        this.$scope.deleteObject = (item) => this.deleteObject(item);
        this.$scope.reloadPage = () => this.reloadPage();
        this.$scope.getIndexSeed = (index) => this.getIndexSeed(index);
    }

    setupPagination() {
        this.$scope.waiting++;

        this.Resource.count($.extend({
                size: this.$scope.paginationConfig.count,
                page: this.$scope.paginationConfig.page,
                orderByExpression: this.$scope.orderByExpression,
                whereCondition: JSON.stringify(this.$scope.filter)
            },
            this.$scope.$stateParams,
            this.config,
            this.$scope.filter)).$promise.then((data) => {

            this.$scope.waiting--;
            this.$scope.paginationConfig.total = data.total;
            this.$scope.listResp = data;
            this.$scope.items = data.items;
            this.$scope.hideFilter = false;
            this.$scope.$broadcast('loadedItems');//please don't remove, it is for fullCalendar directive'

        });
    }

    pageChanged() {

        this.$scope.waiting++;

        this.Resource.query($.extend({
                size: this.$scope.paginationConfig.count,
                page: this.$scope.paginationConfig.page,
                orderByExpression: this.$scope.orderByExpression,
                whereCondition: JSON.stringify(this.$scope.filter)
            },
            this.$scope.$stateParams,
            this.config,
            this.$scope.filter)).$promise.then((data) => {

                this.$scope.items = data;
                this.$scope.pager.page = this.$scope.paginationConfig.page;
                this.$scope.waiting--;
                this.$scope.$broadcast('loadedItems');//please don't remove, it is for fullCalendar directive'
            },
            (data) => {
                this.$scope.waiting--;
            });
    }

    deleteObject(item: IRootObject) {

        this.$scope.notificationSvc.showConfirm("Are sure you ?",
            () => {
                this.$scope.waiting++;
                this.Resource.delete(item).$promise.then(() => {
                        this.$scope.waiting--;
                        this.$scope.notificationSvc.showSuccessToast("Item was successfully deleted");
                        this.setupPagination();
                    },
                    (response) => {
                        toastr.error(response.data.message, "Error");
                        this.$scope.waiting--;
                    });
            })
    }

    reloadPage() {
        this.$scope.$state.reload();
    }

    orderExpressionChanged() {
        if (this.$scope.order.column && this.$scope.order.direction) {
            this.$scope.orderByExpression = this.$scope.order.column + " " + this.$scope.order.direction;

            this.pageChanged();

        } else
            this.$scope.orderByExpression = null;
    }

    goBack(forward?: boolean, data?) {

        this.$scope.$state.go(this.$scope.backLink.forwardLink || this.$scope.backLink.state,
            $.extend({},
                this.$scope.$stateParams,
                this.config,
                this.$scope.item));
    }
}


interface ICreateEditCtrlScope extends IRootScope {
    title: string;

    reloadForm();

    goBack();

    submitForm(data?: any);

    errors: string[];
    item: IRootObject;
    waiting: number;
    validationRule: IValidationRule;
    modelState;
    backLink: IBackLink
    openDate;
    opened;
    processFile;
    formId;
    editMode;
    createMode;
    stepUpWait;
    stepDownWait;
    errorHandle;
    notificationSvc;
    demoOptions;
}

interface IValidationRule {
    rules: any;
    messages: any;
}


class RootCreateEditCtrl {

    config: any;

    constructor(public $scope: ICreateEditCtrlScope,
                public Resource: IRootResource<IRootObject>,
                public Item: ng.resource.IResourceClass<IRootObject>,
                config?: any) {
        this.config = $.extend($scope.$stateParams, config);
        $scope.backLink = {}
        this.$scope.openDate = ($event, property: string) => {
            $event.preventDefault();
            $event.stopPropagation();
            this.$scope.opened[property] = true;
        };
        this.$scope.processFile = false;
        this.$scope.formId = "";
        this.$scope.opened = {};
        $scope.goBack = () => this.goBack();
        $scope.submitForm = () => this.submitForm();
        $scope.reloadForm = () => this.reloadForm();
        $scope.item = <IRootObject>{};
        $scope.waiting = 1;
        if (this instanceof BaseEditCtrl) {
            this.$scope.item = Resource.get(this.config);
            this.$scope.item.$promise.then((data) => {
                this.$scope.item = data;
                this.$scope.waiting--;
            });
        } else {

            $scope.item = new Item((<any>this).config);
            $scope.waiting--;
        }
        $scope.stepUpWait = () => this.stepUpWait();
        $scope.stepDownWait = () => this.stepDownWait();
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

    stepUpWait() {
        this.$scope.waiting++;
    }

    stepDownWait() {
        this.$scope.waiting--;
    }

    submitForm() {
        this.$scope.notificationSvc.showConfirm("Are you sure?",
            () => {
                this.$scope.waiting++;
                if (this instanceof BaseEditCtrl) {
                    this.Resource.update(this.$scope.item).$promise.then((data) => {
                            toastr.success("Updated successfully");
                            this.$scope.waiting--;
                            this.goBack(true, data);

                        },
                        (response) => {
                            toastr.error("There was an error updating the information");
                            this.handleError(response);
                        });
                } else {
                    (<any>this).$scope.item.$save((data) => {
                            toastr.success("Saved successfully");
                            this.goBack(true, data);
                        },
                        (response) => {
                            toastr.error("There was an error saving the information");
                            this.handleError(response);
                        });
                }
            });
    }

    handleError(response) {
        this.$scope.errors = [];
        this.$scope.errors = this.$scope.errorHandle.handleError(response);
        this.$scope.waiting = 0;
    }

    reloadForm() {
        this.$scope.errors = [];
        this.$scope.waiting++;
        if (this instanceof BaseEditCtrl) {

            this.$scope.item = this.Resource.get(this.config);
            this.$scope.item.$promise.then(() => {
                this.$scope.waiting--;
            });
        } else {
            (<any>this).$scope.item = new (<any>this).Item((<any>this).config);
            (<any>this).$scope.waiting--;
        }
    }

    goBack(forward?: boolean, data?) {
        this.$scope.$state.go(forward ? this.$scope.backLink.forwardLink : this.$scope.backLink.state,
            $.extend({}, this.$scope.$stateParams, this.config, data));
    }
}

class BaseEditCtrl extends RootCreateEditCtrl {

    constructor($scope: ICreateEditCtrlScope,
                resource: IRootResource<IRootObject>,
                config?: any) {
        super($scope, resource, null, config);
        $scope.editMode = true;
    }
}

class BaseCreateCtrl extends RootCreateEditCtrl {
    constructor($scope: ICreateEditCtrlScope,
                Item: ng.resource.IResourceClass<IRootObject>,
                config?: any);
    constructor($scope: any,
                Item: ng.resource.IResourceClass<IRootObject>,
                config?: any) {
        super($scope, null, Item, config);
    }
}

interface IRootBaseDetailCtrlScope extends IRootScope {
    item;
    toggleActive;
    waiting;
    deleteObject;
    submitForm;
    validationRule;
    title;
    wizard;

    goBack();

    backLink: IBackLink;
    errors: any[];
    handleError: (response: any) => void;
    closeModal;
    notificationSvc;
    openDate;
    opened;
}

interface IRootBaseDetailCtrl {

}

class RootBaseDetailCtrl {

    constructor(public $scope: IRootBaseDetailCtrlScope,
                public resource: IRootResource<IRootObject>,
                private backLink,
                public config?,
                public $modalInstance?: any) {
        this.init();
        this.$scope.goBack = () => this.goBack();
        this.$scope.opened = {};
        this.$scope.backLink = {};
        this.$scope.closeModal = () => {
            $modalInstance.close();
        };
        this.$scope.openDate = ($event, property: string) => {
            $event.preventDefault();
            $event.stopPropagation();
            this.$scope.opened[property] = true;
        };
    }

    $promise;

    reload() {
        this.$scope.waiting = 1;

        this.$promise = null;
        if (this.resource.details)
            this.$promise = this.resource.details(this.$scope.$stateParams).$promise;
        else
            this.$promise = this.resource.get(this.$scope.$stateParams).$promise;
        this.$promise
            .then((data) => {
                    this.$scope.item = data;
                    this.$scope.waiting--;
                },
                (error) => {
                    toastr.error("Error ocured while fetching the details", "Error");
                });
    }

    init() {
        this.$scope.$stateParams = $.extend(this.$scope.$stateParams, this.config);
        this.$scope.toggleActive = () => this.toggleActive();
        this.$scope.deleteObject = () => this.deleteObject();
        this.reload();
        this.$scope.submitForm = () => this.submitForm();
        this.$scope.validationRule = {
            rules: {},
            messages: {}
        };
        this.$scope.handleError = (response) => this.handleError(response);
    }

    deleteObject() {
        this.$scope.notificationSvc.bootBoxConfirm("Are you sure?",
            () => {
                this.$scope.waiting++;
                this.resource.delete(this.$scope.item).$promise.then(() => {
                        this.$scope.waiting--;
                        toastr.success("Information", "Deleted successfully!");
                        this.$scope.$state.go(this.backLink.forwardLink, this.$scope.$stateParams);
                    },
                    (response) => {
                        this.$scope.waiting--;
                    });

            });
    }

    submitForm() {
        this.$scope.waiting++;
        var promise: ng.IPromise<Object>;
    }

    goBack(forward?: boolean, data?) {
        this.$scope.$state.go(this.$scope.backLink.forwardLink || this.$scope.backLink.state,
            $.extend({},
                this.$scope.$stateParams,
                this.config,
                this.$scope.item));
    }

    toggleActive() {
        this.$scope.waiting++;
        this.resource.toggleActive(this.$scope.item).$promise.then((data) => {
                this.$scope.item = data;
                this.$scope.waiting--;
                toastr.success("Success", "Action successful");
            },
            (response) => {
                this.$scope.waiting--;
                toastr.error("Error!", "Error occured");
            });
    }

    handleError(response) {
        this.$scope.errors = [];
        this.$scope.errors = this.$scope.errorHandle.handleError(response);
        this.$scope.waiting = 0;
    }
}

