(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-students-students-module"],{

/***/ "./src/app/modules/students/containers/index.ts":
/*!******************************************************!*\
  !*** ./src/app/modules/students/containers/index.ts ***!
  \******************************************************/
/*! exports provided: StudentDetailsPageComponent, StudentsPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_students_containers_student_details_page_student_details_page_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @modules/students/containers/student-details-page/student-details-page.component */ "./src/app/modules/students/containers/student-details-page/student-details-page.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StudentDetailsPageComponent", function() { return _modules_students_containers_student_details_page_student_details_page_component__WEBPACK_IMPORTED_MODULE_0__["StudentDetailsPageComponent"]; });

/* harmony import */ var _modules_students_containers_students_page_students_page_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @modules/students/containers/students-page/students-page.component */ "./src/app/modules/students/containers/students-page/students-page.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StudentsPageComponent", function() { return _modules_students_containers_students_page_students_page_component__WEBPACK_IMPORTED_MODULE_1__["StudentsPageComponent"]; });






/***/ }),

/***/ "./src/app/modules/students/containers/student-details-page/student-details-page.component.html":
/*!******************************************************************************************************!*\
  !*** ./src/app/modules/students/containers/student-details-page/student-details-page.component.html ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  student-details-page works!\n</p>\n"

/***/ }),

/***/ "./src/app/modules/students/containers/student-details-page/student-details-page.component.scss":
/*!******************************************************************************************************!*\
  !*** ./src/app/modules/students/containers/student-details-page/student-details-page.component.scss ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/modules/students/containers/student-details-page/student-details-page.component.ts":
/*!****************************************************************************************************!*\
  !*** ./src/app/modules/students/containers/student-details-page/student-details-page.component.ts ***!
  \****************************************************************************************************/
/*! exports provided: StudentDetailsPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StudentDetailsPageComponent", function() { return StudentDetailsPageComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var StudentDetailsPageComponent = /** @class */ (function () {
    function StudentDetailsPageComponent(route) {
        this.route = route;
    }
    StudentDetailsPageComponent.prototype.ngOnInit = function () {
        this.route.params.subscribe(function (params) {
            console.log(params);
        });
    };
    StudentDetailsPageComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-student-details-page',
            template: __webpack_require__(/*! ./student-details-page.component.html */ "./src/app/modules/students/containers/student-details-page/student-details-page.component.html"),
            styles: [__webpack_require__(/*! ./student-details-page.component.scss */ "./src/app/modules/students/containers/student-details-page/student-details-page.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], StudentDetailsPageComponent);
    return StudentDetailsPageComponent;
}());



/***/ }),

/***/ "./src/app/modules/students/containers/students-page/students-page.component.html":
/*!****************************************************************************************!*\
  !*** ./src/app/modules/students/containers/students-page/students-page.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  students-page works!\n</p>\n"

/***/ }),

/***/ "./src/app/modules/students/containers/students-page/students-page.component.scss":
/*!****************************************************************************************!*\
  !*** ./src/app/modules/students/containers/students-page/students-page.component.scss ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/modules/students/containers/students-page/students-page.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/modules/students/containers/students-page/students-page.component.ts ***!
  \**************************************************************************************/
/*! exports provided: StudentsPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StudentsPageComponent", function() { return StudentsPageComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StudentsPageComponent = /** @class */ (function () {
    function StudentsPageComponent() {
    }
    StudentsPageComponent.prototype.ngOnInit = function () {
    };
    StudentsPageComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-students-page',
            template: __webpack_require__(/*! ./students-page.component.html */ "./src/app/modules/students/containers/students-page/students-page.component.html"),
            styles: [__webpack_require__(/*! ./students-page.component.scss */ "./src/app/modules/students/containers/students-page/students-page.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], StudentsPageComponent);
    return StudentsPageComponent;
}());



/***/ }),

/***/ "./src/app/modules/students/students.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/modules/students/students.module.ts ***!
  \*****************************************************/
/*! exports provided: StudentsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StudentsModule", function() { return StudentsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _students_routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./students.routes */ "./src/app/modules/students/students.routes.ts");
/* harmony import */ var _modules_students_containers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @modules/students/containers */ "./src/app/modules/students/containers/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var StudentsModule = /** @class */ (function () {
    function StudentsModule() {
    }
    StudentsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _students_routes__WEBPACK_IMPORTED_MODULE_2__["studentsRoutes"]
            ],
            declarations: [_modules_students_containers__WEBPACK_IMPORTED_MODULE_3__["StudentDetailsPageComponent"], _modules_students_containers__WEBPACK_IMPORTED_MODULE_3__["StudentsPageComponent"]]
        })
    ], StudentsModule);
    return StudentsModule;
}());



/***/ }),

/***/ "./src/app/modules/students/students.routes.ts":
/*!*****************************************************!*\
  !*** ./src/app/modules/students/students.routes.ts ***!
  \*****************************************************/
/*! exports provided: studentsRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "studentsRoutes", function() { return studentsRoutes; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _modules_students_containers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @modules/students/containers/index */ "./src/app/modules/students/containers/index.ts");


var routes = [
    {
        path: '',
        component: _modules_students_containers_index__WEBPACK_IMPORTED_MODULE_1__["StudentsPageComponent"]
    },
    {
        path: ':id',
        component: _modules_students_containers_index__WEBPACK_IMPORTED_MODULE_1__["StudentDetailsPageComponent"]
    }
];
var studentsRoutes = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes);


/***/ })

}]);
//# sourceMappingURL=modules-students-students-module.js.map