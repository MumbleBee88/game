/// <reference path="../../_references.ts" />

import actionsM = module("./actions/_load");

export class QueryBasic implements IList.IQuery {

  private actions: IList.IQueryBasicAction[] = [];
  private query: string;
  private contr: IList.IController;

  constructor(private params: IList.IQueryParams) {
    var o = this;
    o.contr = params.controller;
    o.pushActions();
    o.assignOnQueryChange();
  }

  private pushActions() {
    var o = this;
    var params: IList.IQueryBasicActionParams = {
      inputParams: o.params
    };
    for (var prop in actionsM) {
      var constr: IList.IQueryBasicActionNew = actionsM[prop];
      o.actions.push(new constr(params));
    }
  }

  private assignOnQueryChange() {
    var o = this;
    ko.computed(function () {
      var query: string = o.contr.searchQuery();
      o.actions.forEach((action) => {
        var queryMatch = query.match(action.regexp);
        if (queryMatch && queryMatch.length > 0) {
          action.triggerAction(queryMatch);
        }
      });
    });
  }

}