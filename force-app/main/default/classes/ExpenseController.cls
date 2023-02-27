public class ExpenseController {

    @AuraEnabled
    public static List<Expense__c> getExpenses(){
        try {

            List<Expense__c> lstExp = [SELECT Id, Tittle__c, Amount__c, Category__c, Expense_Date__c, Monthly__c, Weekly__c FROM Expense__c];

            return lstExp;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Expense__c createExpense(Expense__c expense){

        system.debug('@@@' + expense);

        try {
            insert expense;
system.debug('sale 1 ');
            return expense;
        } catch (Exception e) {
            system.debug('sale 2 ' + e);
            throw new AuraHandledException(e.getMessage());
        }
    }

}