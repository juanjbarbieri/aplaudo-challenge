public class helperExpenseTrigger {
    
    public static void createAnualExpense(List<Expense__c> newExp) {

        if (newExp[0].Monthly__c){
            Integer currentMonth = newExp[0].Expense_Date__c.month();
            Date auxDate = Date.newInstance(newExp[0].Expense_Date__c.year(), newExp[0].Expense_Date__c.month(), 15);
            List<Expense__c> expList = new List<Expense__c>();
    
            for (Integer i = 1; currentMonth + i < 13; i++) {
                Expense__c auxObj = new Expense__c(); 
                
                // auxObj = newExp[0];
                auxObj.Tittle__c = newExp[0].Tittle__c;
                auxObj.Amount__c = newExp[0].Amount__c;
                auxObj.Category__c = newExp[0].Category__c;
                auxObj.Expense_Date__c = auxDate.addMonths(i);
                auxObj.Monthly__c = false;
                auxObj.Weekly__c = false;
                system.debug(' auxObj ' + i + ' ' + auxObj);
                expList.add(auxObj);
            }
            if (expList.size() > 0){
                insert expList;
            }
        }
    }
}