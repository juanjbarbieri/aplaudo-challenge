@isTest
public with sharing class ExpenseController_test {

    @isTest
    static void ExpenseController_test() {

        Expense__c auxObj = new Expense__c();
        // Expense__c testRecord = new Expense__c(Category__c = availableValues[0].getValue());

        auxObj.Tittle__c = 'Test Tittle';
        auxObj.Amount__c = 100;
        auxObj.Category__c = Expense__c.Category__c.getDescribe().getPicklistValues()[0].getValue();
        auxObj.Expense_Date__c = Date.today();
        auxObj.Monthly__c = false;
        auxObj.Weekly__c = false;

        insert auxObj;

        List<Expense__c> expList = ExpenseController.getExpenses();

        System.Assert(expList.size() > 0);
    }
}